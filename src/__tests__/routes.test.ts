import request from 'supertest';
import { app } from '../app';
import { db } from '../db';

// Mock do banco de dados
jest.mock('../db', () => ({
  db: {
    get: jest.fn()
  }
}));

describe('Rotas de Autenticação', () => {
  describe('POST /login', () => {
    it('deve retornar erro 400 para credenciais inválidas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: '',
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar erro 401 para credenciais incorretas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'usuario',
          password: 'senha_incorreta'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /logout', () => {
    it('deve redirecionar para /login após logout', async () => {
      const response = await request(app)
        .get('/logout');

      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/login');
    });
  });
});

describe('Rotas de Mesas', () => {
  beforeEach(() => {
    // Mock da coleção de mesas
    (db.get as jest.Mock).mockReturnValue({
      findOne: jest.fn(),
      update: jest.fn()
    });
  });

  describe('GET /mesas', () => {
    it('deve retornar erro 500 se o banco de dados não estiver disponível', async () => {
      (db.get as jest.Mock).mockReturnValue(undefined);

      const response = await request(app)
        .get('/mesas');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar lista de mesas', async () => {
      const mockMesas = [
        { numero: 1, estado: 'Libre' },
        { numero: 2, estado: 'Ocupado' }
      ];

      (db.get as jest.Mock).mockReturnValue({
        find: jest.fn().mockResolvedValue(mockMesas)
      });

      const response = await request(app)
        .get('/mesas');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMesas);
    });
  });

  describe('POST /mesas/:id/pedidos', () => {
    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/mesas/1/pedidos')
        .send({
          productos: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve criar pedido com sucesso', async () => {
      const mockMesa = {
        numero: 1,
        estado: 'Libre',
        pedidos: []
      };

      (db.get as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockMesa),
        update: jest.fn().mockResolvedValue({})
      });

      const response = await request(app)
        .post('/mesas/1/pedidos')
        .send({
          productos: [
            {
              nombre: 'Produto 1',
              cantidad: 2,
              precio: 10.99
            }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });
  });
});

describe('Rotas de Admin', () => {
  beforeEach(() => {
    // Mock das coleções do admin
    (db.get as jest.Mock).mockReturnValue({
      find: jest.fn(),
      insert: jest.fn(),
      remove: jest.fn()
    });
  });

  describe('GET /admin/productos', () => {
    it('deve retornar lista de produtos', async () => {
      const mockProductos = [
        { nombre: 'Produto 1', precio: 10.99 },
        { nombre: 'Produto 2', precio: 15.99 }
      ];

      (db.get as jest.Mock).mockReturnValue({
        find: jest.fn().mockResolvedValue(mockProductos)
      });

      const response = await request(app)
        .get('/admin/productos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProductos);
    });
  });

  describe('POST /admin/productos', () => {
    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/admin/productos')
        .send({
          nombre: '',
          precio: -1
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve criar produto com sucesso', async () => {
      (db.get as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue({})
      });

      const response = await request(app)
        .post('/admin/productos')
        .send({
          nombre: 'Novo Produto',
          precio: 20.99,
          codigo: 'ABC123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });
  });
});

describe('Rotas de Vendas', () => {
  beforeEach(() => {
    // Mock das coleções de vendas
    (db.get as jest.Mock).mockReturnValue({
      find: jest.fn(),
      insert: jest.fn()
    });
  });

  describe('GET /ventas/mensual/principal', () => {
    it('deve retornar vendas do mês', async () => {
      const mockVendas = [
        { total: 100.50, metodoPago: 'Efectivo' },
        { total: 200.75, metodoPago: 'Tarjeta' }
      ];

      (db.get as jest.Mock).mockReturnValue({
        find: jest.fn().mockResolvedValue(mockVendas)
      });

      const response = await request(app)
        .get('/ventas/mensual/principal');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVendas);
    });
  });

  describe('POST /ventas', () => {
    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/ventas')
        .send({
          total: -1,
          metodoPago: 'Invalido'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve registrar venda com sucesso', async () => {
      (db.get as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue({})
      });

      const response = await request(app)
        .post('/ventas')
        .send({
          total: 100.50,
          metodoPago: 'Efectivo'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });
  });
}); 