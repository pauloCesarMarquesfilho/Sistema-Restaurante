import express, { Response, NextFunction, Router } from 'express';
import { IUserRequest, IMesa, IPedido } from '../types';
import { getFormattedDateTime } from '../utils/dateFormatter';
import { validateCollection, insertDocument, updateDocument, findOneDocument, executeDbAction } from '../utils/dbHelpers';
import { COLLECTIONS, STATES } from '../constants/collections';
import { validateMesaData, validatePedidoData } from '../utils/validators';

const router: Router = express.Router();

router.get('/', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }

    const collection = db.get(COLLECTIONS.MESAS);
    
    if (!validateCollection(collection, res)) {
      return;
    }

    await executeDbAction(
      async () => {
        const mesas = await collection.find({});
        res.json(mesas);
      },
      res,
      undefined,
      'Erro ao buscar mesas'
    );
  } catch (error) {
    console.error('Erro na rota /:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar as mesas' });
  }
});

router.post('/add', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }

    // Validar dados de entrada
    const validation = validateMesaData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Dados inválidos', details: validation.errors });
    }

    const { numero, estado } = req.body;
    const collection = db.get(COLLECTIONS.MESAS);
    
    if (!validateCollection(collection, res)) {
      return;
    }

    const mesaDoc: IMesa = {
      numero,
      estado: estado || STATES.LIBRE,
      pedidos: []
    };

    await executeDbAction(
      async () => await insertDocument(collection, mesaDoc),
      res,
      `Mesa ${numero} adicionada com sucesso`,
      'Erro ao adicionar mesa'
    );
  } catch (error) {
    console.error('Erro na rota /add:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao adicionar a mesa' });
  }
});

router.post('/:numero/pedido', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }

    const numeroMesa = parseInt(req.params.numero);
    if (isNaN(numeroMesa)) {
      return res.status(400).json({ error: 'Número da mesa inválido' });
    }

    // Validar dados de entrada
    const validation = validatePedidoData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Dados inválidos', details: validation.errors });
    }

    const { productos, total } = req.body;
    const collection = db.get(COLLECTIONS.MESAS);
    const pedidosCollection = db.get(COLLECTIONS.PEDIDOS);
    
    if (!validateCollection(collection, res) || !validateCollection(pedidosCollection, res)) {
      return;
    }

    const { resultadoHora, resultadoFecha } = getFormattedDateTime();

    const pedidoDoc: IPedido = {
      mesa: numeroMesa,
      productos,
      total,
      estado: STATES.OCUPADO,
      hora: resultadoHora,
      fecha: resultadoFecha
    };

    await executeDbAction(
      async () => {
        // Inserir o pedido
        await insertDocument(pedidosCollection, pedidoDoc);
        
        // Atualizar a mesa
        await updateDocument(
          collection,
          { numero: numeroMesa },
          { 
            $set: { estado: STATES.OCUPADO },
            $push: { pedidos: pedidoDoc }
          }
        );
      },
      res,
      `Pedido adicionado à mesa ${numeroMesa} com sucesso`,
      'Erro ao adicionar pedido'
    );
  } catch (error) {
    console.error('Erro na rota /:numero/pedido:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao adicionar o pedido' });
  }
});

router.post('/:numero/cerrar', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }

    const numeroMesa = parseInt(req.params.numero);
    if (isNaN(numeroMesa)) {
      return res.status(400).json({ error: 'Número da mesa inválido' });
    }

    const collection = db.get(COLLECTIONS.MESAS);
    const pedidosCollection = db.get(COLLECTIONS.PEDIDOS);
    const pedidosCerradosCollection = db.get(COLLECTIONS.PEDIDOS_CERRADOS);
    
    if (!validateCollection(collection, res) || 
        !validateCollection(pedidosCollection, res) || 
        !validateCollection(pedidosCerradosCollection, res)) {
      return;
    }

    await executeDbAction(
      async () => {
        // Buscar a mesa
        const mesa = await findOneDocument(collection, { numero: numeroMesa });
        if (!mesa) {
          throw new Error('Mesa não encontrada');
        }

        // Mover pedidos para coleção de pedidos fechados
        if (mesa.pedidos && mesa.pedidos.length > 0) {
          await pedidosCerradosCollection.insert(mesa.pedidos);
        }

        // Limpar pedidos da mesa e atualizar estado
        await updateDocument(
          collection,
          { numero: numeroMesa },
          { 
            $set: { 
              estado: STATES.LIBRE,
              pedidos: []
            }
          }
        );
      },
      res,
      `Mesa ${numeroMesa} fechada com sucesso`,
      'Erro ao fechar mesa'
    );
  } catch (error) {
    console.error('Erro na rota /:numero/cerrar:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao fechar a mesa' });
  }
});

export default router; 