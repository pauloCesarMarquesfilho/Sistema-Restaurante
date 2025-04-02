import express, { Response, NextFunction, Router } from 'express';
import { IUserRequest } from '../types';

const router: Router = express.Router();

router.get('/', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('pedidos', {
    title: 'Pedidos',
    username: req.user?.username
  });
});

router.post('/save', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  
  const mesa = req.body.mesa;
  //const personas = req.body.personas;
  const pedido = req.body.pedido;
  const precio = req.body.precio;
  const mozo = req.body.mozo;
  const codigo = req.body.codigo;

  const collection = db?.get('pedidos');
  const pedidoscerrados = db?.get('pedidoscerrados');

  if (!collection || !pedidoscerrados) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

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

  /*End Data*/

  collection.insert({
    'Mesa': mesa,
    //'Pedido': pedido,
    //'Precio': precio,
    'Mozo': mozo,
    'Estado': 'Ocupado',
    'Hora': resultadoHora,
    'Fecha': resultadoFecha,
    'Codigo': codigo,
  }).success((doc: any) => {
    res.json({ inserted: true });
  }).error((err: Error) => {
    console.log('error');
    res.status(500).json({ error: 'Error al guardar' });
  });

  pedidoscerrados.insert({
    'Mesa': mesa,
    //'Pedido': pedido,
    //'Precio': precio,
    'Mozo': mozo,
    'Estado': 'Cerrado',
    'Hora': resultadoHora,
    'Fecha': resultadoFecha,
    'Codigo': codigo
  });
});

router.get('/show', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const collection = db?.get('pedidos');

  if (!collection) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  collection.find({}, (err: Error | null, doc: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(doc);
  });
});

router.get('/pedidounico/:id', (req: IUserRequest, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const db = req.db;
  const pedido = db?.get('pedidos');

  if (!pedido) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  pedido.find({ '_id': id }, (err: Error | null, doc: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(doc);
  });
});

//aqui me de borrando el pedido de las mesas
router.post('/show/pedido/:id/', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const pedido = db?.get('pedidos');
  //const borrar = req.params.borrar;
  const pedidoBorrar = req.body.borrar;
  const id = req.params.id;

  if (!pedido) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  pedido.findOne({ '_id': id }, (err: Error | null, doc: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    pedido.update(
      { '_id': id },
      {
        $pull: {
          'Pedido': pedidoBorrar
        }
      }
    );
  }).success((doc: any) => {
    console.log('se borro');
    res.json({ success: true });
  }).error((err: Error) => {
    console.log(err);
    res.status(500).json({ error: 'Error al borrar pedido' });
  });
});

router.post('/mesas', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const mesa = req.body.mesa;
  const mozo = req.body.mozo;
  const codigo = req.body.codigo;
  const collection = db?.get('mesas');

  if (!collection) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

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

  collection.insert({
    'Mesa': mesa,
    'Mozo': mozo,
    'Estado': 'Ocupado',
    'Hora': resultadoHora,
    'Fecha': resultadoFecha,
    'Codigo': codigo
  }).success((doc: any) => {
    res.json({ inserted: true });
  }).error((err: Error) => {
    console.log('error');
    res.status(500).json({ error: 'Error al guardar' });
  });
});

export default router; 