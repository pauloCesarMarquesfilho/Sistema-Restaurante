import { PAYMENT_METHODS, STATES } from '../constants/collections';

/**
 * Valida se um valor é uma string não vazia
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Valida se um valor é um número positivo
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && value >= 0;
}

/**
 * Valida se um valor é um método de pagamento válido
 */
export function isValidPaymentMethod(value: unknown): value is keyof typeof PAYMENT_METHODS {
  return typeof value === 'string' && Object.values(PAYMENT_METHODS).includes(value as any);
}

/**
 * Valida se um valor é um estado válido
 */
export function isValidState(value: unknown): value is keyof typeof STATES {
  return typeof value === 'string' && Object.values(STATES).includes(value as any);
}

/**
 * Valida se um valor é um email válido
 */
export function isValidEmail(value: unknown): value is string {
  if (!isValidString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Valida se um valor é um número de telefone válido
 */
export function isValidPhone(value: unknown): value is string {
  if (!isValidString(value)) return false;
  const phoneRegex = /^\+?[\d\s-]{8,}$/;
  return phoneRegex.test(value);
}

/**
 * Valida se um valor é um código de produto válido
 */
export function isValidProductCode(value: unknown): value is string {
  if (!isValidString(value)) return false;
  const codeRegex = /^[A-Z0-9-]+$/;
  return codeRegex.test(value);
}

/**
 * Valida os dados de entrada para um garçom
 */
export function validateMozoData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: ['Dados inválidos'] };
  }

  const { nombre, email, celular } = data as Record<string, unknown>;

  if (!isValidString(nombre)) {
    errors.push('Nome é obrigatório');
  }

  if (!isValidEmail(email)) {
    errors.push('Email inválido');
  }

  if (!isValidPhone(celular)) {
    errors.push('Número de celular inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida os dados de entrada para um produto
 */
export function validateProductData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: ['Dados inválidos'] };
  }

  const { nombre, precio, codigo } = data as Record<string, unknown>;

  if (!isValidString(nombre)) {
    errors.push('Nome é obrigatório');
  }

  if (!isValidNumber(precio)) {
    errors.push('Preço inválido');
  }

  if (!isValidProductCode(codigo)) {
    errors.push('Código do produto inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida os dados de entrada para uma venda
 */
export function validateSaleData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: ['Dados inválidos'] };
  }

  const { total, metodoPago } = data as Record<string, unknown>;

  if (!isValidNumber(total)) {
    errors.push('Total inválido');
  }

  if (!isValidPaymentMethod(metodoPago)) {
    errors.push('Método de pagamento inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida os dados de entrada para uma mesa
 */
export function validateMesaData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: ['Dados inválidos'] };
  }

  const { numero, estado, pedidos } = data as Record<string, unknown>;

  if (!isValidNumber(numero)) {
    errors.push('Número da mesa é obrigatório');
  }

  if (!isValidState(estado)) {
    errors.push('Estado inválido');
  }

  if (pedidos !== undefined && !Array.isArray(pedidos)) {
    errors.push('Pedidos deve ser um array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida os dados de entrada para um pedido
 */
export function validatePedidoData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: ['Dados inválidos'] };
  }

  const { mesa, productos, estado, total } = data as Record<string, unknown>;

  if (!isValidNumber(mesa)) {
    errors.push('Número da mesa é obrigatório');
  }

  if (!Array.isArray(productos)) {
    errors.push('Produtos deve ser um array');
  } else {
    for (const producto of productos) {
      if (!isValidString(producto.nombre)) {
        errors.push('Nome do produto é obrigatório');
      }
      if (!isValidNumber(producto.cantidad)) {
        errors.push('Quantidade do produto é obrigatória');
      }
      if (!isValidNumber(producto.precio)) {
        errors.push('Preço do produto é obrigatório');
      }
    }
  }

  if (!isValidState(estado)) {
    errors.push('Estado inválido');
  }

  if (!isValidNumber(total)) {
    errors.push('Total inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
} 