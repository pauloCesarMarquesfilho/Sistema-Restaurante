import express, { Response, NextFunction, Router } from 'express';
import { ObjectID } from 'mongodb';
import { IUserRequest } from '../types';
import { getFormattedDateTime } from '../utils/dateFormatter';
import { validateCollection } from '../utils/dbHelpers';

const router: Router = express.Router();

router.get('/', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('mesas', {
    title: 'Mesas - Lacatedraldelpisco',
    username: req.user?.username
  });
});

router.post('/edit/:id', (req: IUserRequest, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const db = req.db;
  
  const collection = db?.get('pedidos');
  const mesa = req.body.mesa;
  const personas = req.body.personas;
  const pedido = req.body.pedido;
  const mozo = req.body.mozo;
  const comentarios = req.body.comentarios;
  console.log(comentarios);

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

  // A partir daqui, sabemos que collection não é undefined
  const safeCollection = collection!;

  safeCollection.findOne({ '_id': id }, (err: Error | null, doc: any) => {
    
    if (pedidosCant === undefined) {
      console.log('error');
    }
    else {
      safeCollection.update(
        { _id: new ObjectID(id) },
        {
          '$push': {
            'Adicionales': {
              'Precio': pedidosCant,
              'Pedido': pedidosPrecio
            }
          }
        }
      ).success((doc: any) => {
        res.json({ inserted: true });
      }).error((err: Error) => {
        console.log('hubo error' + err);
      });
    }
      
    if (descuento > 0) {
      safeCollection.update(
        { _id: new ObjectID(id) },
        {
          $set: { 'Descuento': descuento }
        }
      )
      .success((doc: any) => {
        res.end(JSON.stringify({ inserted: true }));
      });
    }
    else {
      console.log('error');
    }

    if (metodoPago === "Efectivo" || metodoPago === "Tarjeta") {
      safeCollection.update(
        { _id: new ObjectID(id) },
        {
          $set: { 'MetodoPago': metodoPago }
        }
      )
      .success((doc: any) => {
        res.end(JSON.stringify({ inserted: true }));
      });
    }

    safeCollection.update(
      { _id: new ObjectID(id) },
      {
        $set: { 'Comentarios': comentarios }
      }
    )
    .success((doc: any) => {
      res.end(JSON.stringify({ inserted: true }));
    });
  });
});

export default router; 