# Plano de Migração para TypeScript (Atualizado)

## Progresso Atual

1. **Configuração do Ambiente**
   - ✅ Criado arquivo tsconfig.json com as configurações apropriadas
   - ✅ Atualizado package.json com scripts e dependências TypeScript
   - ✅ Estruturado diretório src/ para arquivos TypeScript
   - ✅ Atualizado tsconfig.json para suportar recursos do ES2018 (Object.values, Array.includes)

2. **Definição de Tipos**
   - ✅ Criado arquivo de declarações (declarations.d.ts) para módulos externos
   - ✅ Criadas interfaces para os modelos de dados (usuário, mesa, pedido, etc.)
   - ✅ Criadas interfaces para estender objetos do Express (IUserRequest)
   - ✅ Declarados tipos para variáveis globais do Node.js (__dirname, require, etc.)
   - ✅ Criado enum para categorias de pratos (CategoriaPlato) e outras interfaces relacionadas (IPlato, IMozo, IStockItem)

3. **Migração de Arquivos Principais**
   - ✅ Convertido arquivo app.js principal para TypeScript (app.ts)
   - ✅ Convertido arquivo passport.js para TypeScript (passport.ts)
   - ✅ Convertido modelo local.js para TypeScript (models/local.ts)
   - ✅ Convertido bin/www para TypeScript (bin/www.ts)
   - ✅ Criados utilitários para operações comuns:
     - utils/dateFormatter.ts: funções para formatação de datas
     - utils/dbHelpers.ts: funções para operações de banco de dados (insert, update, remove, find)

4. **Migração de Rotas**
   - ✅ index.js → src/routes/index.ts
   - ✅ validate.js → src/routes/validate.ts
   - ✅ users.js → src/routes/users.ts
   - ✅ panel.js → src/routes/panel.ts
   - ✅ mesas.js → src/routes/mesas.ts (atualizado para usar utils)
   - ✅ apipollos.js → src/routes/apipollos.ts
   - ✅ ventas.js → src/routes/ventas.ts
   - ✅ pedidos.js → src/routes/pedidos.ts
   - ✅ admin.js → src/routes/admin.ts (significativamente melhorado)
     - ✅ Rotas de gestão de funcionários:
       - ✅ /addmozos: adicionar garçons
       - ✅ /mozoslist: listar garçons
       - ✅ /mozoslist/:id: remover garçon
     - ✅ Rotas de gestão de produtos:
       - ✅ /addplatos: adicionar pratos
       - ✅ /addbebidas: adicionar bebidas
       - ✅ /platoslist: listar pratos
       - ✅ /platoslist/:categoria: listar pratos por categoria
       - ✅ /productosdelete/:id: remover produto
     - ✅ Rotas de gestão de inventário:
       - ✅ /addstock: adicionar item ao estoque
       - ✅ /stocklist: listar produtos em estoque
       - ✅ /updatestock: atualizar estoque
     - ✅ Rotas de relatórios e vendas:
       - ✅ /reporte-ventas: relatório de vendas por período
       - ✅ /ventasmesa/:mesa: vendas por mesa
       - ✅ /venta/:id: detalhes de uma venda
     - ✅ Rotas de sistema:
       - ✅ /backup: exportar backup do banco de dados
       - ✅ /restore: restaurar backup
       - ✅ /configuracion: configurações do sistema
     - ✅ Rotas de renderização:
       - ✅ /platos, /bebidas, /inventario, /reportes

## Tarefas Pendentes

1. **Migração de Arquivos Pendentes**
   - ✅ Completada a conversão do arquivo admin.js para TypeScript
   - Verificar se há outros arquivos JavaScript que precisam ser convertidos

2. **Refatoração e Melhorias de Código**
   - ✅ Extrair funções utilitárias para código repetitivo (ex: formatação de datas)
   - ✅ Adicionado utilitários para operações de banco de dados, incluindo:
     - ✅ insertDocument: para inserir documentos
     - ✅ updateDocument: para atualizar documentos
     - ✅ removeDocument: para remover documentos
     - ✅ findDocuments/findOneDocument: para buscar documentos
     - ✅ executeDbAction: para encapsular operações de banco com tratamento de erros
   - ⚠️ Refatorar outras rotas para usar os novos utilitários
   - ⚠️ Melhorar o tratamento de erros com tipos mais específicos
   - ⚠️ Eliminar usos de 'any' restantes no código
   - ⚠️ Implementar validação de dados de entrada

3. **Compilação e Validação**
   - Compilar o projeto com TypeScript para verificar erros de tipo
   - Validar se as declarações de tipo estão funcionando corretamente
   - Testar a aplicação migrada para garantir que as funcionalidades estão preservadas

## Estratégia para o Arquivo admin.js

A conversão inicial de admin.js para admin.ts foi concluída, mas ainda pode ser melhorada através da modularização:

1. **Possível divisão em módulos menores no futuro**:
   - admin/index.ts (rota principal)
   - admin/mozos.ts (rotas relacionadas a funcionários)
   - admin/platos.ts (rotas relacionadas a pratos)
   - admin/bebidas.ts (rotas relacionadas a bebidas)
   - admin/inventario.ts (rotas relacionadas a inventário)
   - admin/reportes.ts (rotas relacionadas a relatórios)
   - admin/system.ts (rotas relacionadas ao sistema e configurações)

2. **Melhorias implementadas**:
   - ✅ Todas as rotas principais convertidas para usar async/await
   - ✅ Uso consistente de utilitários para operações de banco de dados
   - ✅ Tratamento de erros com try/catch em todas as rotas
   - ✅ Verificação de null/undefined implementada
   - ✅ Uso de interfaces específicas para tipagem de dados

## Correções e Ajustes

1. **Tipos para Monk/MongoDB**:
   - ✅ Ajustado a interface Collection para dar suporte adequado para sort e outros parâmetros
   - ✅ Adicionado tipagem forte para operações de banco de dados
   - ✅ Usado interfaces específicas para documentos (IMozo, IPlato, IStockItem)
   - Pode ser necessário adicionar mais métodos/parâmetros conforme o uso do projeto

2. **Verificações de Banco de Dados**:
   - ✅ Adicionadas verificações de collection não-nula antes de acessar métodos
   - ✅ Melhorado tratamento de erros em operações de banco de dados
   - ✅ Criada função validateCollection para verificar disponibilidade da coleção
   - ✅ Implementado executeDbAction para encapsular operações com tratamento de erros
   
3. **Sintaxe ES6+**:
   - ✅ Substituído var por const/let
   - ✅ Substituído comparações == por ===
   - ✅ Usado operador de acesso seguro (?.) para propriedades potencialmente nulas
   - ✅ Usado async/await para operações assíncronas ao invés de callbacks

## Próximos Passos Imediatos

1. Refatorar as demais rotas em outros arquivos para usar os novos utilitários de banco de dados e data
2. Considerar implementar um sistema de validação para os dados de entrada
3. Avaliar dividir o arquivo admin.ts em módulos separados por função para melhor manutenção
4. Compilar o projeto e corrigir quaisquer erros de tipo restantes
5. Testar a aplicação para garantir que todas as rotas estão funcionando corretamente 