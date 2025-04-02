import express, { Response, NextFunction, Router } from 'express';
import { ObjectID } from 'mongodb';
import { IUserRequest } from '../types';
import { getFormattedDateTime } from '../utils/dateFormatter';
import { validateCollection, updateDocument, findOneDocument, executeDbAction } from '../utils/dbHelpers';

const router: Router = express.Router();

router.get('/', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('mesas', {
    title: 'Mesas - Lacatedraldelpisco',
    username: req.user?.username
  });
});

router.post('/edit/:id', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('pedidos');
    const mesa = req.body.mesa;
    const personas = req.body.personas;
    const pedido = req.body.pedido;
    const mozo = req.body.mozo;
    const comentarios = req.body.comentarios;
    const descuento = req.body.descuento;
    const metodoPago = req.body.metodoPago;
    const pedidosCant = req.body.pedidosCant;
    const pedidosPrecio = req.body.precio;

    // Usar utilitário para formatar data e hora
    const { resultadoHora, resultadoFecha } = getFormattedDateTime();

    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Verificar se o pedido existe
    const existingPedido = await findOneDocument(collection, { '_id': new ObjectID(id) });
    if (!existingPedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Atualizar pedidos adicionais se fornecidos
    if (pedidosCant !== undefined) {
      await executeDbAction(
        async () => {
          await updateDocument(
            collection,
            { _id: new ObjectID(id) },
            {
              '$push': {
                'Adicionales': {
                  'Precio': pedidosCant,
                  'Pedido': pedidosPrecio
                }
              }
            }
          );
        },
        res,
        undefined,
        'Erro ao atualizar pedidos adicionais'
      );
    }
    
    // Atualizar desconto se fornecido
    if (descuento > 0) {
      await executeDbAction(
        async () => {
          await updateDocument(
            collection,
            { _id: new ObjectID(id) },
            { $set: { 'Descuento': descuento } }
          );
        },
        res,
        undefined,
        'Erro ao atualizar desconto'
      );
    }

    // Atualizar método de pagamento se fornecido
    if (metodoPago === "Efectivo" || metodoPago === "Tarjeta") {
      await executeDbAction(
        async () => {
          await updateDocument(
            collection,
            { _id: new ObjectID(id) },
            { $set: { 'MetodoPago': metodoPago } }
          );
        },
        res,
        undefined,
        'Erro ao atualizar método de pagamento'
      );
    }

    // Atualizar comentários
    await executeDbAction(
      async () => {
        await updateDocument(
          collection,
          { _id: new ObjectID(id) },
          { $set: { 'Comentarios': comentarios } }
        );
      },
      res,
      'Pedido atualizado com sucesso',
      'Erro ao atualizar comentários'
    );
  } catch (error) {
    console.error('Erro na rota /edit/:id:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar a solicitação' });
  }
});

export default router; 