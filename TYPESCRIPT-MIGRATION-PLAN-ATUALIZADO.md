# Plano de Migração para TypeScript (Atualizado)

## Progresso Atual

1. **Configuração do Ambiente**
   - ✅ Criado arquivo tsconfig.json com as configurações apropriadas
   - ✅ Atualizado package.json com scripts e dependências TypeScript
   - ✅ Estruturado diretório src/ para arquivos TypeScript

2. **Definição de Tipos**
   - ✅ Criado arquivo de declarações (declarations.d.ts) para módulos externos
   - ✅ Criadas interfaces para os modelos de dados (usuário, mesa, pedido, etc.)
   - ✅ Criadas interfaces para estender objetos do Express (IUserRequest)
   - ✅ Declarados tipos para variáveis globais do Node.js (__dirname, require, etc.)

3. **Migração de Arquivos Principais**
   - ✅ Convertido arquivo app.js principal para TypeScript (app.ts)
   - ✅ Convertido arquivo passport.js para TypeScript (passport.ts)
   - ✅ Convertido modelo local.js para TypeScript (models/local.ts)
   - ✅ Convertido bin/www para TypeScript (bin/www.ts)
   - ✅ Criados utilitários para operações comuns:
     - utils/dateFormatter.ts: funções para formatação de datas
     - utils/dbHelpers.ts: funções para operações de banco de dados

4. **Migração de Rotas**
   - ✅ index.js → src/routes/index.ts
   - ✅ validate.js → src/routes/validate.ts
   - ✅ users.js → src/routes/users.ts
   - ✅ panel.js → src/routes/panel.ts
   - ✅ mesas.js → src/routes/mesas.ts (atualizado para usar utils)
   - ✅ apipollos.js → src/routes/apipollos.ts
   - ✅ ventas.js → src/routes/ventas.ts
   - ✅ pedidos.js → src/routes/pedidos.ts
   - ⚠️ admin.js → src/routes/admin.ts (parcialmente convertido)

## Tarefas Pendentes

1. **Migração de Arquivos Pendentes**
   - ⚠️ Completar a conversão do arquivo admin.js (arquivo grande com +1400 linhas)
     - Sugestão: Dividir em módulos menores para melhor manutenção
   - Verificar se há outros arquivos JavaScript que precisam ser convertidos

2. **Refatoração e Melhorias de Código**
   - ✅ Extrair funções utilitárias para código repetitivo (ex: formatação de datas)
   - ✅ Adicionado utilitários para operações de banco de dados
   - ⚠️ Substituir callbacks por Promises ou async/await onde apropriado
   - ⚠️ Melhorar o tratamento de erros com tipos mais específicos
   - ⚠️ Eliminar usos de 'any' restantes no código

3. **Compilação e Validação**
   - Compilar o projeto com TypeScript para verificar erros de tipo
   - Validar se as declarações de tipo estão funcionando corretamente
   - Testar a aplicação migrada para garantir que as funcionalidades estão preservadas

## Estratégia para o Arquivo admin.js

Devido ao tamanho do arquivo admin.js (aproximadamente 1400 linhas), recomenda-se:

1. **Dividir em módulos menores**:
   - admin/index.ts (rota principal)
   - admin/mozos.ts (rotas relacionadas a funcionários)
   - admin/platos.ts (rotas relacionadas a pratos)
   - admin/bebidas.ts (rotas relacionadas a bebidas)
   - admin/inventario.ts (rotas relacionadas a inventário)

2. **Converter por partes**:
   - Primeiro converter as funções mais importantes/críticas
   - Usar a abordagem consistente que já foi aplicada nos outros arquivos
   - Aplicar verificações de null/undefined
   - Usar operador opcional para acessos a propriedades que podem ser nulos

## Correções e Ajustes

1. **Tipos para Monk/MongoDB**:
   - ✅ Ajustado a interface Collection para dar suporte adequado para sort e outros parâmetros
   - Pode ser necessário adicionar mais métodos/parâmetros conforme o uso do projeto

2. **Verificações de Banco de Dados**:
   - ✅ Adicionadas verificações de collection não-nula antes de acessar métodos
   - ✅ Melhorado tratamento de erros em operações de banco de dados
   
3. **Sintaxe ES6+**:
   - ✅ Substituído var por const/let
   - ✅ Substituído comparações == por ===
   - ✅ Usado operador de acesso seguro (?.) para propriedades potencialmente nulas

## Próximos Passos Imediatos

1. Completar a conversão do arquivo admin.js para TypeScript
2. Identificar código repetitivo para refatoração (ex: formatação de data/hora)
3. Compilar o projeto e corrigir quaisquer erros de tipo restantes
4. Testar a aplicação para garantir que todas as rotas estão funcionando corretamente 