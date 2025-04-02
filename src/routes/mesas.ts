import express, { Response, NextFunction, Router } from 'express';
import { ObjectID } from 'mongodb';
import { IUserRequest } from '../types';

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

  /*Data*/
  const fecha = new Date();
  const hora = fecha.getHours();
  const minutes = fecha.getMinutes();
  const resultadoHora = hora + ":" + minutes;

  let mes: string | number = fecha.getMonth();
  const ano = fecha.getFullYear();
  const dia = fecha.getDate();

  if(mes === 0) {
    mes = "Enero";
  }
  else if(mes === 1) {
    mes = "Febrero";
  }
  else if(mes === 2) {
    mes = "Marzo";
  }
  else if(mes === 3){
    mes = "Abril";
  }
  else if(mes === 4) {
    mes = "Mayo";
  }
  else if(mes === 5) {
    mes = "Junio";
  }
  else if(mes === 6) {
    mes = "Julio";
  }
  else if(mes === 7) {
    mes = "Agosto";
  }
  else if(mes === 8) {
    mes = "Septiembre";
  }
  else if(mes === 9) {
    mes = "Octubre";
  }
  else if(mes === 10) {
    mes = "Noviembre";
  }
  else if(mes === 11){
    mes = "Diciembre";
  }
  else {
    mes = "Ningun mes se encontro";
  }
  const resultadoFecha = "El " + dia + " de " + mes + " del " + ano;

  if (!collection) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  collection.findOne({ '_id': id }, (err: Error | null, doc: any) => {
    
    if (pedidosCant === undefined) {
      console.log('error');
    }
    else {
      collection.update(
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
      collection.update(
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
      collection.update(
        { _id: new ObjectID(id) },
        {
          $set: { 'MetodoPago': metodoPago }
        }
      )
      .success((doc: any) => {
        res.end(JSON.stringify({ inserted: true }));
      });
    }

    collection.update(
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