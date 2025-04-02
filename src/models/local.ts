import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types';

const usuarioSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
}, {
  collection: 'usuarios'
});

const UsuarioModel: Model<IUser> = mongoose.model<IUser>('model', usuarioSchema);

export default UsuarioModel; 