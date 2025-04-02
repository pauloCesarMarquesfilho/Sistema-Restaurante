import express, { Response, NextFunction, Router } from 'express';
import { IUserRequest } from '../types';

const router: Router = express.Router();

router.get('/', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('admin', {
    title: 'Administracion',
    username: req.user?.username
  });
});

router.get('/mozos', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('mozos', {
    title: 'Mozos - Administracion',
    username: req.user?.username
  });
});

router.post('/addmozos', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  
  const nombre = req.body.nombre;
  const email = req.body.email;
  const celular = req.body.celular;
  
  const collection = db?.get('mozos');
  
  if (!collection) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  collection.insert({
    'Nombre': nombre,
    'Email': email,
    'Celular': celular
  }).success((doc: any) => {
    res.json({ inserted: true });
  }).error((err: Error) => {
    res.json({ error: 'Ocurrio un error' });
    console.log(err);
  });
});

router.get('/mozoslist', (req: IUserRequest, res: Response, next: NextFunction) => {
  const db = req.db;
  const collection = db?.get('mozos');
  
  if (!collection) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  collection.find({}, { sort: { points: 1 } }, (err: Error | null, doc: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(doc);
  });
});

router.get('/mozoslist/:id', (req: IUserRequest, res: Response, next: NextFunction) => {
  const to = req.params.id;
  const db = req.db;
  const collection = db?.get('mozos');
  
  if (!collection) {
    return res.status(500).json({ error: 'Database collection not available' });
  }

  collection.remove({ 'Nombre': to }, (err: Error | null, doc: any) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error al eliminar' });
    }
    else {
      console.log('Borrado');
      res.json({ success: true });
    }
  });
});

// ... continue com o resto das rotas ...

// Exporta o router
export default router; 