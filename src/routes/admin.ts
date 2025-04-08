import express, { Response, NextFunction, Router } from 'express';
import { ObjectID } from 'mongodb';
import { IUserRequest, IPlato, CategoriaPlato, IMozo, IStockItem, IVenta } from '../types';
import { getFormattedDateTime, formatFullDate } from '../utils/dateFormatter';
import { validateCollection, insertDocument, removeDocument, executeDbAction, findDocuments, updateDocument, findOneDocument } from '../utils/dbHelpers';
import { COLLECTIONS, PAYMENT_METHODS, STATES } from '../constants/collections';
import { validateMozoData, validateProductData, validateSaleData } from '../utils/validators';

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

router.post('/addmozos', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get(COLLECTIONS.MOZOS);
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Validar dados de entrada
    const validation = validateMozoData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Dados inválidos', details: validation.errors });
    }

    const { nombre, email, celular } = req.body;

    // Criar documento para inserção
    const mozoDocument: IMozo = {
      'Nombre': nombre,
      'Email': email,
      'Celular': celular
    };

    // Usar o utilitário executeDbAction para inserir o garçom
    const success = await executeDbAction(
      async () => await insertDocument(collection, mozoDocument),
      res,
      undefined,
      'Erro ao inserir garçom'
    );

    // Se a operação foi bem-sucedida, enviar resposta personalizada
    if (success) {
      res.json({ 
        inserted: true,
        message: `Garçom '${nombre}' adicionado com sucesso`
      });
    }
  } catch (error) {
    console.error('Erro na rota /addmozos:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao salvar o garçom' });
  }
});

router.get('/mozoslist', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('mozos');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Usar o utilitário findDocuments para buscar todos os garçons
    const success = await executeDbAction(
      async () => {
        const mozos = await findDocuments(collection, {}, { sort: { points: 1 } });
        res.json(mozos);
      },
      res,
      undefined,
      'Erro ao buscar lista de garçons'
    );
  } catch (error) {
    console.error('Erro na rota /mozoslist:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os garçons' });
  }
});

router.get('/mozoslist/:id', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const to = req.params.id;
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('mozos');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Usar o utilitário removeDocument para remover o garçom pelo nome
    await executeDbAction(
      async () => await removeDocument(collection, { 'Nombre': to }),
      res,
      `Garçom '${to}' removido com sucesso`,
      'Erro ao remover garçom'
    );
  } catch (error) {
    console.error('Erro na rota /mozoslist/:id:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao remover o garçom' });
  }
});

router.get('/productosdelete/:id', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('stock');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Usar o utilitário executeDbAction para remover o produto
    await executeDbAction(
      async () => await removeDocument(collection, { 'Codigo': id }),
      res,
      `Produto com código ${id} removido com sucesso`,
      'Erro ao remover o produto'
    );

  } catch (error) {
    console.error('Erro na rota /productosdelete/:id:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar a solicitação' });
  }
});

router.get('/platos', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('platos', {
    title: 'Platos - Administracion',
    username: req.user?.username
  });
});

router.get('/bebidas', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('bebidas', {
    title: 'Bebidas - Administracion',
    username: req.user?.username
  });
});

router.post('/addplatos', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }

    // Validar dados de entrada
    const validation = validateProductData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Dados inválidos', details: validation.errors });
    }

    const { nombre, precio, codigo, categoria } = req.body;

    // Obter as coleções necessárias
    const collection = db.get(COLLECTIONS.PLATOS);
    const targetCollection = db.get(categoria);

    // Verificar se as coleções estão disponíveis
    if (!validateCollection(collection, res) || !validateCollection(targetCollection, res)) {
      return;
    }

    // Criar documentos para inserção
    const platoMainDoc: IPlato = {
      'Nombre': nombre,
      'Precio': precio,
      'Codigo': codigo,
      'Categoria': categoria
    };

    const platoCategoryDoc = {
      'Nombre': nombre,
      'Precio': precio,
      'Codigo': codigo
    };

    // Inserir em ambas as coleções
    await executeDbAction(
      async () => {
        await insertDocument(collection, platoMainDoc);
        await insertDocument(targetCollection, platoCategoryDoc);
      },
      res,
      `Prato '${nombre}' adicionado com sucesso`,
      'Erro ao adicionar prato'
    );
  } catch (error) {
    console.error('Erro na rota /addplatos:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao adicionar o prato' });
  }
});

// Rota para buscar todos os pratos
router.get('/platoslist', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('platos');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Usar o utilitário findDocuments para buscar todos os pratos
    const success = await executeDbAction(
      async () => {
        const platos = await findDocuments(collection, {}, { sort: { Nombre: 1 } });
        res.json(platos);
      },
      res,
      undefined,
      'Erro ao buscar lista de pratos'
    );
  } catch (error) {
    console.error('Erro na rota /platoslist:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os pratos' });
  }
});

// Rota para buscar pratos por categoria
router.get('/platoslist/:categoria', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const categoria = req.params.categoria;
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('platos');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Verificar se a categoria é válida
    const categoriaValida = Object.values(CategoriaPlato).includes(categoria as CategoriaPlato);
    if (!categoriaValida) {
      return res.status(400).json({ error: 'Categoria inválida' });
    }

    // Usar o utilitário findDocuments para buscar pratos da categoria
    const success = await executeDbAction(
      async () => {
        const platos = await findDocuments(collection, { 'Categoria': categoria }, { sort: { Nombre: 1 } });
        res.json(platos);
      },
      res,
      undefined,
      `Erro ao buscar pratos da categoria ${categoria}`
    );
  } catch (error) {
    console.error('Erro na rota /platoslist/:categoria:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os pratos por categoria' });
  }
});

// Rota para adicionar bebidas
router.post('/addbebidas', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const codigo = req.body.codigo;
    
    // Coleções para bebidas
    const collection = db.get('platos');
    const bebidasCollection = db.get('bebidas');
    
    // Verificar se as coleções estão disponíveis
    if (!validateCollection(collection, res) || !validateCollection(bebidasCollection, res)) {
      return;
    }

    // Objeto base para inserção usando a interface IPlato
    const baseItem: IPlato = {
      'Nombre': nombre,
      'Precio': precio,
      'Categoria': CategoriaPlato.BEBIDAS,
      'Codigo': codigo
    };

    // Objeto para a coleção específica de bebidas
    const categoriaItem = {
      [CategoriaPlato.BEBIDAS]: baseItem
    };

    // Usar o utilitário executeDbAction para inserir a bebida
    const success = await executeDbAction(
      async () => {
        // Inserir na coleção específica de bebidas
        await insertDocument(bebidasCollection, categoriaItem);
        // Inserir na coleção principal de platos
        await insertDocument(collection, baseItem);
      },
      res,
      undefined,
      'Erro ao inserir bebida'
    );

    // Se a operação foi bem-sucedida, enviar resposta personalizada
    if (success) {
      res.json({
        inserted: true,
        message: `Bebida '${nombre}' adicionada com sucesso`
      });
    }
  } catch (error) {
    console.error('Erro na rota /addbebidas:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao inserir a bebida' });
  }
});

// Rota para a página de inventário
router.get('/inventario', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('inventario', {
    title: 'Inventario - Administracion',
    username: req.user?.username
  });
});

// Rota para adicionar produto ao estoque
router.post('/addstock', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const codigo = req.body.codigo;
    const stock = parseInt(req.body.stock) || 0;
    const costoUnitario = req.body.costo || 0;
    
    const collection = db.get('stock');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Verificar se já existe um produto com o mesmo código
    const existingProduct = await findDocuments(collection, { 'Codigo': codigo });
    if (existingProduct && existingProduct.length > 0) {
      return res.status(400).json({ error: 'Já existe um produto com este código' });
    }

    // Criar documento para inserção
    const stockItem: IStockItem = {
      'Nombre': nombre,
      'Precio': precio,
      'Codigo': codigo,
      'Stock': stock,
      'CostoUnitario': costoUnitario
    };

    // Usar o utilitário executeDbAction para inserir o produto
    const success = await executeDbAction(
      async () => await insertDocument(collection, stockItem),
      res,
      undefined,
      'Erro ao inserir produto no estoque'
    );

    // Se a operação foi bem-sucedida, enviar resposta personalizada
    if (success) {
      res.json({ 
        inserted: true,
        message: `Produto '${nombre}' adicionado ao estoque com sucesso`
      });
    }
  } catch (error) {
    console.error('Erro na rota /addstock:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao salvar o produto no estoque' });
  }
});

// Rota para listar produtos do estoque
router.get('/stocklist', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const collection = db.get('stock');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Usar o utilitário findDocuments para buscar todos os produtos do estoque
    const success = await executeDbAction(
      async () => {
        const stockItems = await findDocuments(collection, {}, { sort: { Nombre: 1 } });
        res.json(stockItems);
      },
      res,
      undefined,
      'Erro ao buscar lista de produtos no estoque'
    );
  } catch (error) {
    console.error('Erro na rota /stocklist:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os produtos do estoque' });
  }
});

// Rota para atualizar estoque de um produto
router.post('/updatestock', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const codigo = req.body.codigo;
    const newStock = parseInt(req.body.stock) || 0;
    
    const collection = db.get('stock');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Verificar se o produto existe
    const existingProduct = await findDocuments(collection, { 'Codigo': codigo });
    if (!existingProduct || existingProduct.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Usar o utilitário executeDbAction para atualizar o estoque
    const success = await executeDbAction(
      async () => {
        await updateDocument(collection, 
          { 'Codigo': codigo },
          { $set: { 'Stock': newStock } }
        );
      },
      res,
      `Estoque do produto atualizado para ${newStock} unidades`,
      'Erro ao atualizar estoque do produto'
    );
  } catch (error) {
    console.error('Erro na rota /updatestock:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar o estoque' });
  }
});

// Rota para a página de relatórios
router.get('/reportes', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('reportes', {
    title: 'Reportes - Administracion',
    username: req.user?.username
  });
});

// Rota para gerar relatório de vendas por período
router.post('/reporte-ventas', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const fechaInicio = new Date(req.body.fechaInicio);
    const fechaFin = new Date(req.body.fechaFin);
    
    // Adicionar um dia à data final para incluir todo o dia
    fechaFin.setDate(fechaFin.getDate() + 1);
    
    // Validar datas
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      return res.status(400).json({ error: 'Datas inválidas' });
    }
    
    const collection = db.get('ventas');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Buscar vendas no período especificado
    await executeDbAction(
      async () => {
        const ventas = await findDocuments(
          collection, 
          { 
            fecha: { 
              $gte: fechaInicio, 
              $lt: fechaFin 
            } 
          },
          { sort: { fecha: 1 } }
        );
        
        // Calcular o total de vendas
        let totalVentas = 0;
        ventas.forEach((venta: IVenta) => {
          totalVentas += venta.total;
        });
        
        // Formatação para exibir relatório
        const reporte = {
          periodoInicio: formatFullDate(fechaInicio),
          periodoFin: formatFullDate(new Date(fechaFin.getTime() - 86400000)), // Subtrair um dia para exibição
          totalVentas: totalVentas.toFixed(2),
          cantidadVentas: ventas.length,
          detalle: ventas
        };
        
        res.json(reporte);
      },
      res,
      undefined,
      'Erro ao gerar relatório de vendas'
    );
  } catch (error) {
    console.error('Erro na rota /reporte-ventas:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao gerar o relatório de vendas' });
  }
});

// Rota para buscar vendas por mesa
router.get('/ventasmesa/:mesa', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const mesaId = parseInt(req.params.mesa);
    
    // Validar número da mesa
    if (isNaN(mesaId)) {
      return res.status(400).json({ error: 'Número de mesa inválido' });
    }
    
    const collection = db.get('ventas');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Buscar vendas da mesa especificada
    await executeDbAction(
      async () => {
        const ventasMesa = await findDocuments(
          collection,
          { mesa: mesaId },
          { sort: { fecha: -1 }, limit: 50 } // Limitar a 50 resultados mais recentes
        );
        
        res.json(ventasMesa);
      },
      res,
      undefined,
      'Erro ao buscar vendas da mesa'
    );
  } catch (error) {
    console.error('Erro na rota /ventasmesa/:mesa:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar vendas da mesa' });
  }
});

// Rota para detalhes de uma venda específica
router.get('/venta/:id', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const ventaId = req.params.id;
    
    // Validar ID de venda usando try/catch para verificar se é um ID válido
    try {
      // Tentativa de criar um ObjectID com o ID fornecido
      new ObjectID(ventaId);
    } catch (err) {
      return res.status(400).json({ error: 'ID de venda inválido' });
    }
    
    const collection = db.get('ventas');
    
    // Verificar se a coleção está disponível
    if (!validateCollection(collection, res)) {
      return;
    }

    // Buscar venda pelo ID
    await executeDbAction(
      async () => {
        const venta = await findOneDocument(
          collection,
          { _id: new ObjectID(ventaId) }
        );
        
        if (!venta) {
          return res.status(404).json({ error: 'Venda não encontrada' });
        }
        
        res.json(venta);
      },
      res,
      undefined,
      'Erro ao buscar detalhes da venda'
    );
  } catch (error) {
    console.error('Erro na rota /venta/:id:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os detalhes da venda' });
  }
});

// Rota para a página de configurações
router.get('/configuracion', (req: IUserRequest, res: Response, next: NextFunction) => {
  res.render('configuracion', {
    title: 'Configuración - Administracion',
    username: req.user?.username
  });
});

// Rota para criar backup do banco de dados
router.post('/backup', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    // Obter as coleções principais
    const collections = [
      'platos', 'stock', 'mozos', 'ventas', 'mesas', 'pedidos',
      'bebidas', 'ceviches', 'entradas', 'tiraditos', 'lechetigre',
      'sudadosChupes', 'segundosMarinos', 'chicharonesMarinos',
      'trilogias', 'tacu', 'chicha', 'guarniciones', 'sopasCriollas',
      'chifas', 'pollobrasa', 'pescadosmariscos'
    ];
    
    const backup: Record<string, any[]> = {};
    
    // Buscar dados de cada coleção
    for (const collectionName of collections) {
      const collection = db.get(collectionName);
      
      if (!collection) {
        console.warn(`Collection ${collectionName} not found for backup`);
        continue;
      }
      
      try {
        const data = await findDocuments(collection, {});
        backup[collectionName] = data;
      } catch (err) {
        console.error(`Error backing up collection ${collectionName}:`, err);
      }
    }
    
    // Data atual para nome do arquivo
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const timeStr = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Responder com o JSON para download
    res.header('Content-Disposition', `attachment; filename=backup-${dateStr}-${timeStr}.json`);
    res.header('Content-Type', 'application/json');
    res.json(backup);
  } catch (error) {
    console.error('Erro na rota /backup:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar o backup do banco de dados' });
  }
});

// Rota para restaurar backup do banco de dados
router.post('/restore', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }
    
    const backupData = req.body;
    
    // Validar dados de backup
    if (!backupData || typeof backupData !== 'object' || Object.keys(backupData).length === 0) {
      return res.status(400).json({ error: 'Arquivo de backup inválido' });
    }
    
    let restoredCollections = 0;
    const errors: string[] = [];
    
    // Restaurar cada coleção
    for (const [collectionName, data] of Object.entries(backupData)) {
      if (!Array.isArray(data)) {
        errors.push(`Dados inválidos para coleção ${collectionName}`);
        continue;
      }
      
      const collection = db.get(collectionName);
      
      if (!collection) {
        errors.push(`Coleção ${collectionName} não encontrada`);
        continue;
      }
      
      try {
        // Limpar coleção existente
        await collection.remove({});
        
        // Inserir dados de backup se houver
        if (data.length > 0) {
          // Remover _id para evitar conflitos
          const cleanData = data.map((item: any) => {
            const { _id, ...rest } = item;
            return rest;
          });
          
          await collection.insert(cleanData);
        }
        
        restoredCollections++;
      } catch (err) {
        console.error(`Error restoring collection ${collectionName}:`, err);
        errors.push(`Erro ao restaurar coleção ${collectionName}`);
      }
    }
    
    res.json({
      success: true,
      message: `Restauração concluída: ${restoredCollections} coleções restauradas`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Erro na rota /restore:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao restaurar o backup' });
  }
});

router.post('/save', async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not accessible' });
    }

    // Validar dados de entrada
    const validation = validateSaleData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Dados inválidos', details: validation.errors });
    }

    const { total, metodoPago } = req.body;

    // Obter as coleções necessárias
    const collection = db.get(COLLECTIONS.VENTAS);
    const pagosTarjetas = db.get(COLLECTIONS.VENTAS_TARJETA);
    const pagosEfectivo = db.get(COLLECTIONS.VENTAS_EFECTIVO);

    // Verificar se as coleções estão disponíveis
    if (!validateCollection(collection, res) || 
        !validateCollection(pagosTarjetas, res) || 
        !validateCollection(pagosEfectivo, res)) {
      return;
    }

    // Criar documento de venda
    const ventaDoc: IVenta = {
      'Total': total,
      'Metodopago': metodoPago,
      'Fecha': new Date(),
      'Hora': new Date().toLocaleTimeString()
    };

    // Inserir na coleção apropriada
    const targetCollection = metodoPago === PAYMENT_METHODS.TARJETA ? pagosTarjetas : pagosEfectivo;
    
    await executeDbAction(
      async () => {
        await insertDocument(collection, ventaDoc);
        await insertDocument(targetCollection, ventaDoc);
      },
      res,
      'Venda registrada com sucesso',
      'Erro ao registrar venda'
    );
  } catch (error) {
    console.error('Erro na rota /save:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao registrar a venda' });
  }
});

// Export the router
export default router; 