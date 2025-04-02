import express, { Request, Response, NextFunction, Router } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('verify', { title: 'Incorrecto - Lacatedraldelpisco' });
});

export default router; 