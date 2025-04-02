import express, { Response, NextFunction, Router } from 'express';
import { IUserRequest } from '../types';
import { getFormattedDateTime } from '../utils/dateFormatter';
import { validateCollection, insertDocument, findDocuments, removeDocument, executeDbAction } from '../utils/dbHelpers';

const router: Router = express.Router();

router.get('/', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const pollos = db.get('ordenespollos');

    // Verificar se a coleção está disponível
    if (!validateCollection(pollos, res)) {
      return;
    }

    // Buscar todas as ordens
    await executeDbAction(
      async () => {
        const ordenes = await findDocuments(pollos, {});
        res.json(ordenes);
      },
      res,
      undefined,
      'Erro ao buscar ordens de pollos'
    );
  } catch (error) {
    console.error('Erro na rota /:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar as ordens' });
  }
});

router.post('/save', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('ordenespollos');
    
    const mesa = req.body.mesa;
    const precio = req.body.precio;
    const pedido = req.body.pedido;

    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Utilizar o utilitário para formatar data e hora
    const { resultadoHora, resultadoFecha } = getFormattedDateTime();

    // Documento da ordem
    const ordenDoc = {
      'Pedido': pedido,
      'Precio': precio,
      'Mesa': mesa,
      'Fecha': resultadoFecha,
      'Hora': resultadoHora
    };

    // Inserir documento usando executeDbAction
    await executeDbAction(
      async () => {
        await insertDocument(collection, ordenDoc);
        res.json({ inserted: true });
      },
      res,
      undefined,
      'Erro ao salvar ordem de pollos'
    );
  } catch (error) {
    console.error('Erro na rota /save:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao salvar a ordem' });
  }
});

router.get('/:fecha', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const save = db.get('ordenespollos');
    const fecha = req.params.fecha;

    // Verificar se a coleção está disponível
    if (!validateCollection(save, res)) {
      return;
    }

    // Buscar ordens pela data
    await executeDbAction(
      async () => {
        const ordenes = await findDocuments(save, { 'Fecha': fecha });
        res.json(ordenes);
      },
      res,
      undefined,
      'Erro ao buscar ordens por data'
    );
  } catch (error) {
    console.error('Erro na rota /:fecha:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar ordens por data' });
  }
});

router.get('/borrar/:id', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const pollos = db.get('ordenespollos');
    const id = req.params.id;

    // Verificar se a coleção está disponível
    if (!validateCollection(pollos, res)) {
      return;
    }

    // Remover documento usando executeDbAction
    await executeDbAction(
      async () => {
        await removeDocument(pollos, { '_id': id });
        res.json({ success: true });
      },
      res,
      undefined,
      'Erro ao remover ordem'
    );
  } catch (error) {
    console.error('Erro na rota /borrar/:id:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao remover a ordem' });
  }
});

export default router; 