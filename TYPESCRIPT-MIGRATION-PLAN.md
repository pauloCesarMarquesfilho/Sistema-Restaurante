# Plano de Migração para TypeScript

## Tarefas Concluídas

1. **Configuração do Ambiente**
   - Criado arquivo tsconfig.json com as configurações apropriadas
   - Atualizado package.json com scripts e dependências TypeScript
   - Estruturado diretório src/ para arquivos TypeScript

2. **Definição de Tipos**
   - Criadas interfaces para os modelos de dados (usuário, mesa, pedido, etc.)
   - Criadas interfaces para estender objetos do Express (IUserRequest)
   - Usados tipos explícitos para parâmetros de funções e retornos

3. **Conversões Iniciais**
   - Convertido modelo local.js para TypeScript
   - Convertido arquivo passport.js para TypeScript
   - Convertido app.js principal para TypeScript
   - Convertido bin/www para TypeScript
   - Convertidos arquivos de rotas para TypeScript:
     - routes/index.js → src/routes/index.ts
     - routes/validate.js → src/routes/validate.ts
     - routes/users.js → src/routes/users.ts
     - routes/panel.js → src/routes/panel.ts
     - routes/mesas.js → src/routes/mesas.ts
     - routes/apipollos.js → src/routes/apipollos.ts
     - routes/ventas.js → src/routes/ventas.ts
     - routes/pedidos.js → src/routes/pedidos.ts

## Tarefas Pendentes

1. **Conversão de Arquivos**
   - Converter rotas restantes para TypeScript:
     - routes/admin.js → src/routes/admin.ts (grande arquivo, pode precisar de atenção especial)
   - Verificar e converter quaisquer outros arquivos JavaScript

2. **Melhorias de Código**
   - Substituir callbacks por Promises ou async/await onde apropriado
   - Melhorar o tratamento de erros com tipos mais específicos
   - Eliminar usos de 'any' restantes no código
   - Extrair lógica de manipulação de datas para funções utilitárias

3. **Problemas a Resolver**
   - Resolver alertas de linter para imports de módulos
   - Instalar definições de tipos para dependências que ainda não foram instaladas
   - Garantir compatibilidade com MongoDB/Mongoose/Monk em TypeScript
   - Criar tipos mais específicos para os documentos do banco de dados

4. **Testes e Validação**
   - Testar a compilação completa do projeto
   - Validar funcionamento da aplicação após conversão
   - Adicionar testes unitários e de integração (opcional)

## Diretrizes para Conversão

### 1. Importações
```typescript
// De:
var express = require('express');

// Para:
import express from 'express';
```

### 2. Exportações
```typescript
// De:
module.exports = router;

// Para:
export default router;
```

### 3. Funções
```typescript
// De:
function ensureAuthenticated(req, res, next) {
  // ...
}

// Para:
function ensureAuthenticated(req: IUserRequest, res: Response, next: NextFunction): void {
  // ...
}
```

### 4. Definição de Modelos
```typescript
// De:
var usuario = new Schema({
  username: String,
  password: String
});

// Para:
const usuarioSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

const UsuarioModel: Model<IUser> = mongoose.model<IUser>('model', usuarioSchema);
```

### 5. Tratamento de Erros e Nulls
```typescript
// De:
collection.findOne({'_id': id}, function(err, doc) {
  // ...
});

// Para:
collection.findOne({'_id': id}, (err: Error | null, doc: any) => {
  if (err) {
    return res.status(500).json({ error: 'Database error' });
  }
  // ...
});
```

### 6. Verificações de Tipo
```typescript
// De:
if(mes == 0) {
  // ...
}

// Para:
if(mes === 0) {
  // ...
}
```

## Próximos Passos

1. Instalar as definições de tipos restantes:
```bash
npm install --save-dev @types/monk @types/mongodb-core
```

2. Converter o arquivo admin.js para TypeScript (sugestão: devido ao tamanho, pode ser dividido em módulos menores)

3. Compilar o projeto com `tsc` e verificar erros

4. Refatorar código repetitivo, como a lógica de manipulação de datas que se repete em vários arquivos

5. Testar a aplicação após a conversão completa 