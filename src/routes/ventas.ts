import express, { Response, NextFunction, Router } from 'express';
import { IUserRequest, IVenta } from '../types';
import { validateCollection, insertDocument, findDocuments, executeDbAction } from '../utils/dbHelpers';

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

router.get('/mensual/principal', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const total = db.get('total');
    const fechaPrincipal = req.params.principal;
    const fechaFinal = req.params.fin;

    // Verificar se a coleção está disponível
    if (!validateCollection(total, res)) {
      return;
    }

    // Consultar vendas no período especificado
    await executeDbAction(
      async () => {
        const ventas = await findDocuments(
          total,
          {
            'Fecha': {
              '$gte': '2016-02-01T05:54:20.743Z',
              '$lt': '2016-02-02T06:13:16.074Z'
            }
          }
        );
        res.json(ventas);
      },
      res,
      undefined,
      'Erro ao buscar vendas do período'
    );
  } catch (error) {
    console.error('Erro na rota /mensual/principal:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar vendas mensais' });
  }
});

router.post('/save', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('ventas');
    const pagosTarjetas = db.get('ventasTarjeta');
    const pagosEfectivo = db.get('ventasEfectivo');

    // Verificar se as coleções estão disponíveis
    if (!validateCollection(collection, res) || 
        !validateCollection(pagosTarjetas, res) || 
        !validateCollection(pagosEfectivo, res)) {
      return;
    }

    const codigo = req.body.codigo;
    const mesa = req.body.mesa;
    const hora = req.body.hora;
    const fecha = req.body.fecha;
    const total = req.body.total;
    const metodoPago = req.body.metodoPago;
    const descuento = req.body.descuento;
    const descuentoTotal = req.body.descuentoTotal;

    // Documento de venda
    const ventaDoc = {
      'Mesa': mesa,
      'Total': total,
      'Codigo': codigo,
      'Hora': hora,
      'Fecha': fecha,
      'Metodopago': metodoPago,
      'Descuento': descuento,
      'DescuentoTotal': descuentoTotal
    };

    // Verificar método de pagamento
    if (metodoPago !== "Efectivo" && metodoPago !== "Tarjeta") {
      return res.status(400).json({ error: 'Método de pago inválido' });
    }

    // Executar as operações de banco de dados
    await executeDbAction(
      async () => {
        // Inserir no registro específico pelo método de pagamento
        if (metodoPago === "Efectivo") {
          await insertDocument(pagosEfectivo, ventaDoc);
        } else {
          await insertDocument(pagosTarjetas, ventaDoc);
        }
        
        // Inserir no registro geral de vendas
        await insertDocument(collection, ventaDoc);
      },
      res,
      'Venda registrada com sucesso',
      'Erro ao registrar venda'
    );
  } catch (error) {
    console.error('Erro na rota /save:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao salvar a venda' });
  }
});

router.get('/list/:fecha', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const save = db.get('ventas');
    const fecha = req.params.fecha;

    // Verificar se a coleção está disponível
    if (!validateCollection(save, res)) {
      return;
    }

    // Buscar vendas pela data
    await executeDbAction(
      async () => {
        const ventas = await findDocuments(save, { 'Fecha': fecha });
        res.json(ventas);
      },
      res,
      undefined,
      'Erro ao buscar vendas pela data'
    );
  } catch (error) {
    console.error('Erro na rota /list/:fecha:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar vendas pela data' });
  }
});

router.get('/list/tarjetas/:fecha', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const save = db.get('ventasTarjeta');
    const fecha = req.params.fecha;

    // Verificar se a coleção está disponível
    if (!validateCollection(save, res)) {
      return;
    }

    // Buscar vendas com cartão pela data
    await executeDbAction(
      async () => {
        const ventas = await findDocuments(save, { 'Fecha': fecha });
        res.json(ventas);
      },
      res,
      undefined,
      'Erro ao buscar vendas com cartão pela data'
    );
  } catch (error) {
    console.error('Erro na rota /list/tarjetas/:fecha:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar vendas com cartão' });
  }
});

router.get('/list/efectivo/:fecha', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const save = db.get('ventasEfectivo');
    const fecha = req.params.fecha;

    // Verificar se a coleção está disponível
    if (!validateCollection(save, res)) {
      return;
    }

    // Buscar vendas em dinheiro pela data
    await executeDbAction(
      async () => {
        const ventas = await findDocuments(save, { 'Fecha': fecha });
        res.json(ventas);
      },
      res,
      undefined,
      'Erro ao buscar vendas em dinheiro pela data'
    );
  } catch (error) {
    console.error('Erro na rota /list/efectivo/:fecha:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar vendas em dinheiro' });
  }
});

router.post('/savetotal', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const totalBD = db.get('total');
    const fecha = req.body.fecha;
    const total = req.body.total;

    // Verificar se a coleção está disponível
    if (!validateCollection(totalBD, res)) {
      return;
    }

    // Documento de total de vendas
    const totalDoc = {
      'Total': total,
      'Fecha': new Date()
    };

    // Inserir total
    await executeDbAction(
      async () => {
        await insertDocument(totalBD, totalDoc);
      },
      res,
      'Total registrado com sucesso',
      'Erro ao registrar total'
    );
  } catch (error) {
    console.error('Erro na rota /savetotal:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao salvar o total' });
  }
});

router.post('/savetotaltarjeta', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const totalBD = db.get('totaltarjeta');
    const fecha = req.body.fecha;
    const total = req.body.total;

    // Verificar se a coleção está disponível
    if (!validateCollection(totalBD, res)) {
      return;
    }

    // Documento de total de vendas com cartão
    const totalDoc = {
      'Total': total,
      'Fecha': new Date()
    };

    // Inserir total de cartão
    await executeDbAction(
      async () => {
        await insertDocument(totalBD, totalDoc);
      },
      res,
      'Total de vendas com cartão registrado com sucesso',
      'Erro ao registrar total de vendas com cartão'
    );
  } catch (error) {
    console.error('Erro na rota /savetotaltarjeta:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao salvar o total de vendas com cartão' });
  }
});

router.post('/savetotalefectivo', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const totalBD = db.get('totalefectivo');
    const fecha = req.body.fecha;
    const total = req.body.total;

    // Verificar se a coleção está disponível
    if (!validateCollection(totalBD, res)) {
      return;
    }

    // Documento de total de vendas em dinheiro
    const totalDoc = {
      'Total': total,
      'Fecha': new Date()
    };

    // Inserir total em dinheiro
    await executeDbAction(
      async () => {
        await insertDocument(totalBD, totalDoc);
      },
      res,
      'Total de vendas em dinheiro registrado com sucesso',
      'Erro ao registrar total de vendas em dinheiro'
    );
  } catch (error) {
    console.error('Erro na rota /savetotalefectivo:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao salvar o total de vendas em dinheiro' });
  }
});

export default router; 