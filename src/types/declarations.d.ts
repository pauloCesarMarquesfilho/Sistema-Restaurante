// Declarações de tipos para módulos sem definições de tipos

declare module 'express' {
  import { EventEmitter } from 'events';
  export interface Request {
    db?: any;
    user?: any;
    isAuthenticated(): boolean;
    params: any;
    body: any;
  }
  export interface Response {
    render(view: string, options?: any): void;
    send(body: any): Response;
    status(code: number): Response;
    json(body: any): Response;
    end(data?: string): void;
    header(field: string, value: string): Response;
    redirect(url: string): void;
  }
  export interface NextFunction {
    (err?: any): void;
  }
  export interface Router {
    get(path: string, ...handlers: any[]): Router;
    post(path: string, ...handlers: any[]): Router;
    put(path: string, ...handlers: any[]): Router;
    delete(path: string, ...handlers: any[]): Router;
    use(...handlers: any[]): Router;
  }
  export interface Application extends EventEmitter {
    set(name: string, value: any): Application;
    get(name: string): any;
    use(...handlers: any[]): Application;
    post(path: string, ...handlers: any[]): Application;
  }
  export function Router(): Router;
  export function static(root: string, options?: any): any;
  const express: {
    (): Application;
    Router(): Router;
    static: typeof static;
  };
  export default express;
}

declare module 'mongoose' {
  export interface Schema {
    new (definition: any, options?: any): Schema;
  }
  export interface Model<T> {
    new (data: any): T;
    findOne(conditions: any, callback?: (err: Error | null, doc: T | null) => void): any;
    find(conditions: any, callback?: (err: Error | null, docs: T[]) => void): any;
    model(name: string): Model<any>;
  }
  export interface Document {
    _id: any;
  }
  const mongoose: {
    connect(url: string, options?: any): Promise<any>;
    model<T>(name: string, schema?: any): Model<T>;
    Schema: Schema;
  };
  export default mongoose;
}

declare module 'mongodb' {
  export class ObjectID {
    constructor(id: string);
  }
}

declare module 'monk' {
  export interface Monk {
    get(collection: string): Collection;
  }

  export interface Collection {
    find(query: any, callback?: (err: Error | null, docs: any[]) => void): any;
    findOne(query: any, callback?: (err: Error | null, doc: any) => void): any;
    insert(document: any): { success: (callback: (doc: any) => void) => { error: (callback: (err: Error) => void) => void } };
    update(query: any, update: any): { success: (callback: (doc: any) => void) => any };
    remove(query: any, callback?: (err: Error | null, doc: any) => void): any;
  }

  function monk(url: string): Monk;
  export default monk;
}

declare module 'passport' {
  export interface PassportStatic {
    initialize(): any;
    session(): any;
    authenticate(strategy: string, options: any): any;
    use(strategy: any): PassportStatic;
    serializeUser<T, D>(fn: (user: T, done: (err: any, id?: D) => void) => void): void;
    deserializeUser<T, D>(fn: (id: T, done: (err: any, user?: D) => void) => void): void;
  }
  const passport: PassportStatic;
  export default passport;
}

declare module 'passport-local' {
  export class Strategy {
    constructor(
      options: { usernameField?: string; passwordField?: string } | any,
      verify: (username: string, password: string, done: (error: any, user?: any, options?: { message: string }) => void) => void
    );
  }
}

declare module 'express-session' {
  function session(options?: any): any;
  export default session;
}

declare module 'serve-favicon' {
  function favicon(path: string): any;
  export default favicon;
}

declare module 'morgan' {
  function logger(format: string): any;
  export default logger;
}

declare module 'cookie-parser' {
  function cookieParser(): any;
  export default cookieParser;
}

declare module 'body-parser' {
  function json(options?: any): any;
  function urlencoded(options?: any): any;
  export { json, urlencoded };
}

declare module 'debug' {
  function debug(namespace: string): any;
  export default debug;
}

declare module 'node-thermal-printer' {
  const printer: any;
  export default printer;
}

// Declaração para o módulo path
declare module 'path' {
  function join(...paths: string[]): string;
  export { join };
}

// Declarações para módulos internos
declare module './routes/index' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/validate' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/users' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/panel' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/admin' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/pedidos' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/mesas' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/ventas' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './routes/apipollos' {
  import { Router } from 'express';
  const router: Router;
  export default router;
}

declare module './passport' {
  import passport from 'passport';
  export default function(passportInstance: passport.PassportStatic): void;
}

// Adicionar suporte ao Node.js
declare namespace NodeJS {
  interface Global {
    [key: string]: any;
  }
  
  interface Process {
    env: {
      [key: string]: string | undefined;
      NODE_ENV?: string;
      PORT?: string;
    };
    nextTick(callback: (...args: any[]) => void, ...args: any[]): void;
    exit(code?: number): never;
  }

  interface ErrnoException extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
  }
}

declare var process: NodeJS.Process;
declare var require: NodeRequire;
declare var global: NodeJS.Global;

interface NodeRequire {
  (id: string): any;
}

// Variáveis globais do Node.js
declare var __dirname: string;
declare var __filename: string;
declare var module: NodeModule;

interface NodeModule {
  exports: any;
  require: NodeRequire;
  id: string;
  filename: string;
  loaded: boolean;
  parent: NodeModule | null;
  children: NodeModule[];
  paths: string[];
} 