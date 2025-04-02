import express, { Response, NextFunction, Router } from 'express';
import { IUserRequest } from '../types';
import { getFormattedDateTime, formatFullDate } from '../utils/dateFormatter';
import { validateCollection, insertDocument, findDocuments, findOneDocument, updateDocument, executeDbAction } from '../utils/dbHelpers';

const router: Router = express.Router();

router.get('/', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('pedidos', {
    title: 'Pedidos',
    username: req.user?.username
  });
});

router.post('/save', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const mesa = req.body.mesa;
    //const personas = req.body.personas;
    const pedido = req.body.pedido;
    const precio = req.body.precio;
    const mozo = req.body.mozo;
    const codigo = req.body.codigo;

    const collection = db.get('pedidos');
    const pedidoscerrados = db.get('pedidoscerrados');

    // Verificar se as coleções estão disponíveis
    if (!validateCollection(collection, res) || !validateCollection(pedidoscerrados, res)) {
      return;
    }

    // Utilizar o utilitário para formatar data e hora
    const { resultadoHora, resultadoFecha } = getFormattedDateTime();

    // Documento de pedido
    const pedidoDoc = {
      'Mesa': mesa,
      //'Pedido': pedido,
      //'Precio': precio,
      'Mozo': mozo,
      'Estado': 'Ocupado',
      'Hora': resultadoHora,
      'Fecha': resultadoFecha,
      'Codigo': codigo,
    };

    // Documento de pedido fechado
    const pedidoCerradoDoc = {
      'Mesa': mesa,
      //'Pedido': pedido,
      //'Precio': precio,
      'Mozo': mozo,
      'Estado': 'Cerrado',
      'Hora': resultadoHora,
      'Fecha': resultadoFecha,
      'Codigo': codigo
    };

    // Inserir os documentos usando executeDbAction
    await executeDbAction(
      async () => {
        // Inserir pedido
        await insertDocument(collection, pedidoDoc);
        // Inserir pedido fechado
        await insertDocument(pedidoscerrados, pedidoCerradoDoc);
      },
      res,
      'Pedido salvo com sucesso',
      'Erro ao salvar pedido'
    );
  } catch (error) {
    console.error('Erro na rota /save:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao salvar o pedido' });
  }
});

router.get('/show', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('pedidos');

    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Buscar todos os pedidos
    await executeDbAction(
      async () => {
        const pedidos = await findDocuments(collection, {});
        res.json(pedidos);
      },
      res,
      undefined,
      'Erro ao buscar pedidos'
    );
  } catch (error) {
    console.error('Erro na rota /show:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os pedidos' });
  }
});

router.get('/pedidounico/:id', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const pedido = db.get('pedidos');

    // Verificar se a coleção está disponível
    if (!validateCollection(pedido, res)) {
      return;
    }

    // Buscar pedido pelo ID
    await executeDbAction(
      async () => {
        const foundPedido = await findDocuments(pedido, { '_id': id });
        res.json(foundPedido);
      },
      res,
      undefined,
      'Erro ao buscar pedido'
    );
  } catch (error) {
    console.error('Erro na rota /pedidounico/:id:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar o pedido' });
  }
});

//aqui me de borrando el pedido de las mesas
router.post('/show/pedido/:id/', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const pedidoBorrar = req.body.borrar;
    const id = req.params.id;
    const pedido = db.get('pedidos');

    // Verificar se a coleção está disponível
    if (!validateCollection(pedido, res)) {
      return;
    }

    // Verificar se o pedido existe
    const foundPedido = await findOneDocument(pedido, { '_id': id });
    if (!foundPedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Atualizar removendo o item do pedido
    await executeDbAction(
      async () => {
        await updateDocument(
          pedido,
          { '_id': id },
          {
            $pull: {
              'Pedido': pedidoBorrar
            }
          }
        );
      },
      res,
      'Item removido do pedido com sucesso',
      'Erro ao remover item do pedido'
    );
  } catch (error) {
    console.error('Erro na rota /show/pedido/:id/:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar a solicitação' });
  }
});

router.post('/mesas', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const mesa = req.body.mesa;
    const mozo = req.body.mozo;
    const codigo = req.body.codigo;
    const collection = db.get('mesas');

    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Utilizar o utilitário para formatar data e hora
    const { resultadoHora, resultadoFecha } = getFormattedDateTime();

    // Documento da mesa
    const mesaDoc = {
      'Mesa': mesa,
      'Mozo': mozo,
      'Estado': 'Ocupado',
      'Hora': resultadoHora,
      'Fecha': resultadoFecha,
      'Codigo': codigo
    };

    // Inserir documento usando executeDbAction
    await executeDbAction(
      async () => {
        await insertDocument(collection, mesaDoc);
      },
      res,
      'Mesa registrada com sucesso',
      'Erro ao registrar mesa'
    );
  } catch (error) {
    console.error('Erro na rota /mesas:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar a solicitação' });
  }
});

export default router; 