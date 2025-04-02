import express, { Response, NextFunction, Router } from 'express';
import { IUserRequest } from '../types';

const router: Router = express.Router();

router.get('/', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const pollos = db?.get('ordenespollos');

  if (!pollos) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  pollos.find({}, (err: Error | null, doc: any) => {
    res.json(doc);
  });
});

router.post('/save', (req: IUserRequest, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const db = req.db;
  
  const collection = db?.get('ordenespollos');
  
  const mesa = req.body.mesa;
  const precio = req.body.precio;
  const pedido = req.body.pedido;

  /*Data*/
  const fecha = new Date();
  const hora = fecha.getHours();
  const minutes = fecha.getMinutes();
  const resultadoHora = hora + ":" + minutes;

  let mes: string | number = fecha.getMonth();
  const ano = fecha.getFullYear();
  const dia = fecha.getDate();

  if (mes === 0) {
    mes = "Enero";
  }
  else if (mes === 1) {
    mes = "Febrero";
  }
  else if (mes === 2) {
    mes = "Marzo";
  }
  else if (mes === 3) {
    mes = "Abril";
  }
  else if (mes === 4) {
    mes = "Mayo";
  }
  else if (mes === 5) {
    mes = "Junio";
  }
  else if (mes === 6) {
    mes = "Julio";
  }
  else if (mes === 7) {
    mes = "Agosto";
  }
  else if (mes === 8) {
    mes = "Septiembre";
  }
  else if (mes === 9) {
    mes = "Octubre";
  }
  else if (mes === 10) {
    mes = "Noviembre";
  }
  else if (mes === 11) {
    mes = "Diciembre";
  }
  else {
    mes = "Ningun mes se encontro";
  }
  const resultadoFecha = "El " + dia + " de " + mes + " del " + ano;

  if (!collection) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  collection.insert({
    'Pedido': pedido,
    'Precio': precio,
    'Mesa': mesa,
    'Fecha': resultadoFecha,
    'Hora': resultadoHora
  }).success((doc: any) => {
    res.json({ inserted: true });
  }).error((err: Error) => {
    res.json({ error: 'Ocurrio un error' });
    console.log(err);
  });
});

router.get('/:fecha', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const save = db?.get('ordenespollos');
  const fecha = req.params.fecha;

  if (!save) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  save.find({ 'Fecha': fecha }, (err: Error | null, doc: any) => {
    res.send(doc);
  });
});

router.get('/borrar/:id', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const pollos = db?.get('ordenespollos');
  const id = req.params.id;

  if (!pollos) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  pollos.remove({
    '_id': id
  }, (err: Error | null, doc: any) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error al borrar' });
    }
    else {
      console.log('enviado');
      res.json({ success: true });
    }
  });
});

export default router; 