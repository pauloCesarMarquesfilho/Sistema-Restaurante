import {
  isValidString,
  isValidNumber,
  isValidEmail,
  isValidPhone,
  isValidProductCode,
  validateMozoData,
  validateProductData,
  validateSaleData,
  validateMesaData,
  validatePedidoData
} from '../utils/validators';

describe('Validadores Básicos', () => {
  describe('isValidString', () => {
    it('deve retornar true para strings não vazias', () => {
      expect(isValidString('teste')).toBe(true);
      expect(isValidString(' ')).toBe(true);
    });

    it('deve retornar false para valores inválidos', () => {
      expect(isValidString('')).toBe(false);
      expect(isValidString(null)).toBe(false);
      expect(isValidString(undefined)).toBe(false);
      expect(isValidString(123)).toBe(false);
    });
  });

  describe('isValidNumber', () => {
    it('deve retornar true para números positivos', () => {
      expect(isValidNumber(123)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(1.5)).toBe(true);
    });

    it('deve retornar false para valores inválidos', () => {
      expect(isValidNumber(-1)).toBe(false);
      expect(isValidNumber('123')).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('deve retornar true para emails válidos', () => {
      expect(isValidEmail('teste@exemplo.com')).toBe(true);
      expect(isValidEmail('teste.nome@exemplo.com.br')).toBe(true);
    });

    it('deve retornar false para emails inválidos', () => {
      expect(isValidEmail('teste')).toBe(false);
      expect(isValidEmail('teste@')).toBe(false);
      expect(isValidEmail('@exemplo.com')).toBe(false);
      expect(isValidEmail('teste@exemplo')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('deve retornar true para números de telefone válidos', () => {
      expect(isValidPhone('12345678')).toBe(true);
      expect(isValidPhone('+55 11 1234-5678')).toBe(true);
      expect(isValidPhone('(11) 1234-5678')).toBe(true);
    });

    it('deve retornar false para números inválidos', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('isValidProductCode', () => {
    it('deve retornar true para códigos válidos', () => {
      expect(isValidProductCode('ABC123')).toBe(true);
      expect(isValidProductCode('123-ABC')).toBe(true);
      expect(isValidProductCode('A1-B2-C3')).toBe(true);
    });

    it('deve retornar false para códigos inválidos', () => {
      expect(isValidProductCode('abc123')).toBe(false);
      expect(isValidProductCode('123_abc')).toBe(false);
      expect(isValidProductCode('')).toBe(false);
    });
  });
});

describe('Validadores de Dados', () => {
  describe('validateMozoData', () => {
    it('deve validar dados corretos de garçom', () => {
      const data = {
        nombre: 'João Silva',
        email: 'joao@exemplo.com',
        celular: '11987654321'
      };
      const result = validateMozoData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve retornar erros para dados inválidos', () => {
      const data = {
        nombre: '',
        email: 'email-invalido',
        celular: '123'
      };
      const result = validateMozoData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome é obrigatório');
      expect(result.errors).toContain('Email inválido');
      expect(result.errors).toContain('Número de celular inválido');
    });
  });

  describe('validateProductData', () => {
    it('deve validar dados corretos de produto', () => {
      const data = {
        nombre: 'Produto Teste',
        precio: 10.99,
        codigo: 'ABC123'
      };
      const result = validateProductData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve retornar erros para dados inválidos', () => {
      const data = {
        nombre: '',
        precio: -1,
        codigo: 'abc123'
      };
      const result = validateProductData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome é obrigatório');
      expect(result.errors).toContain('Preço inválido');
      expect(result.errors).toContain('Código do produto inválido');
    });
  });

  describe('validateSaleData', () => {
    it('deve validar dados corretos de venda', () => {
      const data = {
        total: 100.50,
        metodoPago: 'Efectivo'
      };
      const result = validateSaleData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve retornar erros para dados inválidos', () => {
      const data = {
        total: -1,
        metodoPago: 'Invalido'
      };
      const result = validateSaleData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Total inválido');
      expect(result.errors).toContain('Método de pagamento inválido');
    });
  });

  describe('validateMesaData', () => {
    it('deve validar dados corretos de mesa', () => {
      const data = {
        numero: 1,
        estado: 'Libre',
        pedidos: []
      };
      const result = validateMesaData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve retornar erros para dados inválidos', () => {
      const data = {
        numero: -1,
        estado: 'Invalido',
        pedidos: 'não é array'
      };
      const result = validateMesaData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Número da mesa é obrigatório');
      expect(result.errors).toContain('Estado inválido');
      expect(result.errors).toContain('Pedidos deve ser um array');
    });
  });

  describe('validatePedidoData', () => {
    it('deve validar dados corretos de pedido', () => {
      const data = {
        mesa: 1,
        productos: [
          {
            nombre: 'Produto 1',
            cantidad: 2,
            precio: 10.99
          }
        ],
        estado: 'Ocupado',
        total: 21.98
      };
      const result = validatePedidoData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve retornar erros para dados inválidos', () => {
      const data = {
        mesa: -1,
        productos: 'não é array',
        estado: 'Invalido',
        total: -1
      };
      const result = validatePedidoData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Número da mesa é obrigatório');
      expect(result.errors).toContain('Produtos deve ser um array');
      expect(result.errors).toContain('Estado inválido');
      expect(result.errors).toContain('Total inválido');
    });

    it('deve validar produtos dentro do pedido', () => {
      const data = {
        mesa: 1,
        productos: [
          {
            nombre: '',
            cantidad: -1,
            precio: -1
          }
        ],
        estado: 'Ocupado',
        total: 21.98
      };
      const result = validatePedidoData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do produto é obrigatório');
      expect(result.errors).toContain('Quantidade do produto é obrigatória');
      expect(result.errors).toContain('Preço do produto é obrigatório');
    });
  });
}); 