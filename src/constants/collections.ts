/**
 * Nomes das coleções do banco de dados
 */
export const COLLECTIONS = {
  MOZOS: 'mozos',
  PLATOS: 'platos',
  BEBIDAS: 'bebidas',
  STOCK: 'stock',
  VENTAS: 'ventas',
  VENTAS_TARJETA: 'ventasTarjeta',
  VENTAS_EFECTIVO: 'ventasEfectivo',
  TOTAL: 'total',
  TOTAL_TARJETA: 'totaltarjeta',
  TOTAL_EFECTIVO: 'totalefectivo',
  PEDIDOS: 'pedidos',
  PEDIDOS_CERRADOS: 'pedidoscerrados',
  MESAS: 'mesas',
  ORDENES_POLLOS: 'ordenespollos',
  // Categorias de pratos
  CEVICHES: 'ceviches',
  ENTRADAS: 'entradas',
  TIRADITOS: 'tiraditos',
  LECHETIGRE: 'lechetigre',
  SUDADOS_CHUPES: 'sudadosChupes',
  SEGUNDOS_MARINOS: 'segundosMarinos',
  CHICHARONES_MARINOS: 'chicharonesMarinos',
  TRILOGIAS: 'trilogias',
  TACU: 'tacu',
  CHICHA: 'chicha',
  GUARNICIONES: 'guarniciones',
  SOPAS_CRIOLLAS: 'sopasCriollas',
  CHIFAS: 'chifas',
  POLLO_BRASA: 'pollobrasa',
  PESCADOS_MARISCOS: 'pescadosmariscos'
} as const;

/**
 * Tipos de pagamento aceitos
 */
export const PAYMENT_METHODS = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta'
} as const;

/**
 * Estados possíveis para mesas e pedidos
 */
export const STATES = {
  OCUPADO: 'Ocupado',
  CERRADO: 'Cerrado',
  LIBRE: 'Libre'
} as const; 