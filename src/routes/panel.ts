import express, { Response, NextFunction, Router } from 'express';
import { IUserRequest } from '../types';

const router: Router = express.Router();

router.get('/', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('panel', {
    title: 'Panel - Lacatedraldelpisco',
    username: req.user?.username
  });
});

export default router; 