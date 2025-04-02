import { Request } from 'express';
import { Monk } from 'monk';

// Interface para estender o objeto Request do Express
export interface IUserRequest extends Request {
  db?: Monk;
  user?: IUser;
  isAuthenticated(): boolean;
  params: any;
  body: any;
}

// Interface para o modelo de usuário
export interface IUser {
  username: string;
  password: string;
}

// Interface para o modelo de mesa
export interface IMesa {
  numero: number;
  estado: 'libre' | 'ocupado';
  pedidos?: IPedido[];
}

// Interface para o modelo de pedido
export interface IPedido {
  mesa: number;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado';
  productos: IPedidoProducto[];
  fecha: Date;
  total: number;
}

// Interface para produtos em um pedido
export interface IPedidoProducto {
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  opciones?: string[];
}

// Interface para produto do menu
export interface IProducto {
  nombre: string;
  precio: number;
  categoria: string;
  descripcion?: string;
  opciones?: string[];
  disponible: boolean;
}

// Enumeração para as categorias de pratos
export enum CategoriaPlato {
  CEVICHES = 'Ceviches',
  ENTRADAS = 'Entradas',
  TIRADITOS = 'Tiraditos',
  LECHE_TIGRE = 'Leche de Tigre',
  SUDADOS_CHUPES = 'Sudados y Chupes',
  SEGUNDOS_MARINOS = 'Segundos Marinos',
  CHICHARONES_MARINOS = 'Chicharones Marinos',
  TRILOGIAS = 'Trilogias',
  TACUTACU = 'Tacutacu',
  CHICHA = 'Chicha',
  GUARNICIONES = 'Guarniciones',
  SOPAS_CRIOLLAS = 'Sopas Criollas',
  CHIFA = 'Chifa',
  POLLO_BRASA = 'Pollo a la Brasa',
  PESCADOS_MARISCOS = 'Pescados y Mariscos',
  BEBIDAS = 'Bebidas'
}

// Interface para prato do cardápio
export interface IPlato {
  Nombre: string;
  Precio: number | string;
  Categoria: string;
  Codigo: string;
}

// Interface para pratos categorizados
export interface IPlatoCategoria {
  [categoria: string]: IPlato;
}

// Interface para registro de venda
export interface IVenta {
  mesa: number;
  productos: IPedidoProducto[];
  fecha: Date;
  total: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'otro';
}

// Interface para o garçom (mozo)
export interface IMozo {
  Nombre: string;
  Email: string;
  Celular: string;
  points?: number;
}

// Interface para produto de estoque
export interface IStockItem {
  Nombre: string;
  Precio: number | string;
  Codigo: string;
  Stock: number;
  CostoUnitario?: number | string;
} 