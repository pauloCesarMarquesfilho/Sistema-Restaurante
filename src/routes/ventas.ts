import express, { Response, NextFunction, Router } from 'express';
import mongoose from 'mongoose';
import { IUserRequest } from '../types';

const router: Router = express.Router();

router.get('/', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('ventas', {
    title: 'Ventas Reportes - Lacatedraldelpisco',
    username: req.user?.username
  });
});

router.get('/totales', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('ventastotales', {
    title: 'Ventas Totales - Lacatedraldelpisco',
    username: req.user?.username
  });
});

router.get('/tarjetas', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('ventastarjetas', {
    title: 'Ventas Totales - Lacatedraldelpisco',
    username: req.user?.username
  });
});

router.get('/efectivo', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('ventasefectivo', {
    title: 'Ventas Totales - Lacatedraldelpisco',
    username: req.user?.username
  });
});

router.get('/mensual', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('mensual', {
    title: 'Ventas Mensuales - Lacatedraldelpisco',
    username: req.user?.username
  });
});

router.get('/mensual/principal', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const total = db?.get('total');
  const fechaPrincipal = req.params.principal;
  const fechaFinal = req.params.fin;

  if (!total) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  total.find({
    'Fecha': {
      '$gte': '2016-02-01T05:54:20.743Z',
      '$lt': '2016-02-02T06:13:16.074Z'
    }
  }, (err: Error | null, doc: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.send(doc);
  });
});

router.post('/save', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const collection = db?.get('ventas');
  const pagosTarjetas = db?.get('ventasTarjeta');
  const pagosTarjetasUno = db?.get('ventasEfectivo');

  const codigo = req.body.codigo;
  const mesa = req.body.mesa;
  const hora = req.body.hora;
  const fecha = req.body.fecha;
  const total = req.body.total;
  const metodoPago = req.body.metodoPago;
  const descuento = req.body.descuento;
  const descuentoTotal = req.body.descuentoTotal;

  if (!collection || !pagosTarjetas || !pagosTarjetasUno) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  if (metodoPago === "Efectivo") {
    pagosTarjetasUno.insert({
      'Mesa': mesa,
      'Total': total,
      'Codigo': codigo,
      'Hora': hora,
      'Fecha': fecha,
      'Metodopago': metodoPago,
      'Descuento': descuento,
      'DescuentoTotal': descuentoTotal
    }).success((doc: any) => {
      res.end(JSON.stringify({ inserted: true }));
    }).error((err: Error) => {
      console.log('error');
      res.status(500).json({ error: 'Error al guardar' });
    });
  }
  else if (metodoPago === "Tarjeta") {
    pagosTarjetas.insert({
      'Mesa': mesa,
      'Total': total,
      'Codigo': codigo,
      'Hora': hora,
      'Fecha': fecha,
      'Metodopago': metodoPago,
      'Descuento': descuento,
      'DescuentoTotal': descuentoTotal
    }).success((doc: any) => {
      res.end(JSON.stringify({ inserted: true }));
    }).error((err: Error) => {
      console.log('error');
      res.status(500).json({ error: 'Error al guardar' });
    });
  }
  else {
    console.log('error');
    return res.status(400).json({ error: 'Método de pago inválido' });
  }

  collection.insert({
    'Mesa': mesa,
    'Total': total,
    'Codigo': codigo,
    'Hora': hora,
    'Fecha': fecha,
    'Metodopago': metodoPago,
    'Descuento': descuento,
    'DescuentoTotal': descuentoTotal
  }).success((doc: any) => {
    res.end(JSON.stringify({ inserted: true }));
  }).error((err: Error) => {
    console.log('error');
    res.status(500).json({ error: 'Error al guardar' });
  });
});

router.get('/list/:fecha', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const save = db?.get('ventas');
  const fecha = req.params.fecha;

  if (!save) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  save.find({ 'Fecha': fecha }, (err: Error | null, doc: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.send(doc);
  });
});

router.get('/list/tarjetas/:fecha', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const save = db?.get('ventasTarjeta');
  const fecha = req.params.fecha;

  if (!save) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  save.find({ 'Fecha': fecha }, (err: Error | null, doc: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.send(doc);
  });
});

router.get('/list/efectivo/:fecha', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const save = db?.get('ventasEfectivo');
  const fecha = req.params.fecha;

  if (!save) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  save.find({ 'Fecha': fecha }, (err: Error | null, doc: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.send(doc);
  });
});

router.post('/savetotal', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const totalBD = db?.get('total');
  const fecha = req.body.fecha;
  const total = req.body.total;

  if (!totalBD) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  totalBD.insert({
    'Total': total,
    'Fecha': new Date()
  }).success((doc: any) => {
    res.json({ inserted: true });
  }).error((err: Error) => {
    console.log('error');
    res.status(500).json({ error: 'Error al guardar' });
  });
});

router.post('/savetotaltarjeta', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const totalBD = db?.get('totaltarjeta');
  const fecha = req.body.fecha;
  const total = req.body.total;

  if (!totalBD) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  totalBD.insert({
    'Total': total,
    'Fecha': new Date()
  }).success((doc: any) => {
    res.json({ inserted: true });
  }).error((err: Error) => {
    console.log('error');
    res.status(500).json({ error: 'Error al guardar' });
  });
});

router.post('/savetotalefectivo', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const totalBD = db?.get('totaltarjeta');
  const fecha = req.body.fecha;
  const total = req.body.total;

  if (!totalBD) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  totalBD.insert({
    'Total': total,
    'Fecha': new Date()
  }).success((doc: any) => {
    res.json({ inserted: true });
  }).error((err: Error) => {
    console.log('error');
    res.status(500).json({ error: 'Error al guardar' });
  });
});

export default router; 