import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { IUser } from './types';

// Obtém o modelo de usuário
const UserDetails = mongoose.model<IUser>('model');

// Exporta as funções de passport como um módulo
export default function configurePassport(passportInstance: passport.PassportStatic): void {
  // Serializa o usuário para armazená-lo na sessão
  passportInstance.serializeUser<IUser, any>((user, done) => {
    done(null, user);
  });

  // Deserializa o objeto usuário armazenado na sessão
  passportInstance.deserializeUser<any, IUser>((obj, done) => {
    done(null, obj);
  });

  // Configuração de autenticação local
  passportInstance.use(new LocalStrategy((username, password, done) => {
    process.nextTick(() => {
      UserDetails.findOne({
        'username': username
      }, (err: Error | null, user: IUser | null) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          console.log('ocurrio un error');
          return done(null, false);
        }

        if (user.password !== password) {
          console.log('hubo un error en la cuenta');
          return done(null, false);
        }

        return done(null, user);
      });
    });
  }));
} 