import { Request } from 'express';
import { Monk } from 'monk';
import mongoose from 'mongoose';

// Interface para estender o objeto Request do Express
export interface IUserRequest extends Request {
  db?: Monk;
  user?: IUser;
  isAuthenticated(): boolean;
  params: any;
  body: any;
}

// Interface para o modelo de usuário
export interface IUser extends mongoose.Document {
  username: string;
  password: string;
}

// Interface para o modelo de mesa
export interface IMesa extends mongoose.Document {
  numero: number;
  estado: 'libre' | 'ocupado';
  pedidos?: IPedido[];
}

// Interface para o modelo de pedido
export interface IPedido extends mongoose.Document {
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
export interface IProducto extends mongoose.Document {
  nombre: string;
  precio: number;
  categoria: string;
  descripcion?: string;
  opciones?: string[];
  disponible: boolean;
}

// Interface para registro de venda
export interface IVenta extends mongoose.Document {
  mesa: number;
  productos: IPedidoProducto[];
  fecha: Date;
  total: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'otro';
} 