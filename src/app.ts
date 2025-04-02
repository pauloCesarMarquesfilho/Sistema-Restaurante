import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import monk from 'monk';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import printer from 'node-thermal-printer';

import { IUserRequest } from './types';
import configurePassport from './passport';

// Importar rotas
import routes from './routes/index';
import verify from './routes/validate';
import users from './routes/users';
import panel from './routes/panel';
import admin from './routes/admin';
import pedidos from './routes/pedidos';
import mesas from './routes/mesas';
import ventas from './routes/ventas';
import apipollos from './routes/apipollos';

// Conexão com o banco de dados
const db = monk("localhost:27017/rest");

mongoose.connect('mongodb://localhost:27017/rest', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Genial me conecte a la bd'))
  .catch((err) => {
    console.error('Error de conexión:', err);
    throw err;
  });

// Carregar modelos
// Usando require diretamente, que funciona com TypeScript quando declarado
require('./models/local');

// Configurar passport
configurePassport(passport);

// Inicializar app Express
const app = express();

// Middleware para disponibilizar conexão com banco de dados
app.use((req: IUserRequest, res: Response, next: NextFunction) => {
  req.db = db;
  next();
});

// Configuração de CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

// Configuração de sessões
app.use(session({ 
  secret: 'ilovescotchscotchyscotchscotch',  
  resave: false, 
  saveUninitialized: true, 
  cookie: {
    maxAge: 360000000000 // uma hora em milissegundos
  }
}));

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de autenticação
function ensureAuthenticated(req: IUserRequest, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
    console.log(req.isAuthenticated());
  }
}

// Configuração de views
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// Configuração de middlewares
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use('/', routes);
app.use('/incorrecto', verify);
app.use('/users', ensureAuthenticated, users);
app.use('/panel', ensureAuthenticated, panel);
app.use('/administracion', ensureAuthenticated, admin);
app.use('/pedidos', ensureAuthenticated, pedidos);
app.use('/mesas', ensureAuthenticated, mesas);
app.use('/ventas', ensureAuthenticated, ventas);
app.use('/apipollos', apipollos);

// Rota de autenticação
app.post('/login', passport.authenticate('local', {
  successRedirect: '/panel',
  failureRedirect: '/incorrecto'
}));

// Capturar erro 404
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Tratamento de erros em ambiente de desenvolvimento
if (app.get('env') === 'development') {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Tratamento de erros em ambiente de produção
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app; 