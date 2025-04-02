# Sistema de Gestão para Restaurantes

Sistema completo de gestão para restaurantes, com funcionalidades de:
- Gestão de pedidos e mesas
- Controle de estoques e inventário
- Cadastro de produtos (pratos e bebidas)
- Gestão de funcionários
- Relatórios de vendas e faturamento
- Backup e restauração de dados

## Migração para TypeScript

Este projeto passou por uma migração completa de JavaScript para TypeScript para melhorar a qualidade do código, segurança de tipos e manutenibilidade.

### Principais Melhorias

1. **Configuração do Ambiente TypeScript**
   - Configuração do `tsconfig.json` otimizada para o projeto
   - Estruturação do código-fonte em diretório `src/`
   - Adição de scripts para compilação e execução no `package.json`

2. **Definição de Tipos e Interfaces**
   - Criação de interfaces para modelos de dados (usuários, mesas, pedidos, etc.)
   - Extensão de tipos do Express para suportar autenticação e acesso ao banco de dados
   - Declarações para módulos externos não tipados
   - Tipagem forte para operações de banco de dados com MongoDB/Monk

3. **Refatoração e Modularização**
   - Extração de código repetitivo para utilitários reutilizáveis:
     - `dateFormatter.ts`: funções para formatação de datas e horas
     - `dbHelpers.ts`: funções para operações de banco de dados
   - Conversão de callbacks para async/await
   - Tratamento de erros consistente em todas as rotas
   - Verificações de nulidade para evitar erros em tempo de execução

4. **Melhorias de Segurança e Desempenho**
   - Validação de coleções de banco de dados antes de operações
   - Tratamento de erros abrangente com respostas HTTP apropriadas
   - Uso de padrões modernos de JavaScript (ES6+)
   - Eliminação de código redundante

### Utilitários Criados

1. **Formatação de Datas (`dateFormatter.ts`)**
   - `getMonthName()`: Converte número do mês para nome em espanhol
   - `formatHour()`: Formata horas no formato "HH:MM"
   - `formatFullDate()`: Formata datas no formato "El DD de MES del YYYY"
   - `getFormattedDateTime()`: Retorna objeto com data e hora formatadas

2. **Operações de Banco de Dados (`dbHelpers.ts`)**
   - `validateCollection()`: Verifica se uma coleção é válida antes de operações
   - `executeDbAction()`: Encapsula operações de banco de dados com tratamento de erros
   - `insertDocument()`: Insere documentos em uma coleção
   - `updateDocument()`: Atualiza documentos em uma coleção
   - `removeDocument()`: Remove documentos de uma coleção
   - `findDocuments()` / `findOneDocument()`: Busca documentos em uma coleção

## Estrutura do Projeto

```
src/
├── bin/
│   └── www.ts         # Ponto de entrada da aplicação
├── models/
│   └── local.ts       # Configuração da autenticação local
├── public/            # Arquivos estáticos (CSS, JS, imagens)
├── routes/
│   ├── admin.ts       # Rotas administrativas
│   ├── apipollos.ts   # API para pedidos de frango
│   ├── index.ts       # Rota principal
│   ├── mesas.ts       # Gestão de mesas
│   ├── panel.ts       # Painel de controle
│   ├── pedidos.ts     # Gestão de pedidos
│   ├── users.ts       # Gestão de usuários
│   ├── validate.ts    # Validação de autenticação
│   └── ventas.ts      # Gestão de vendas
├── types/
│   └── index.ts       # Definições de tipos e interfaces
├── utils/
│   ├── dateFormatter.ts # Utilitários para formatação de datas
│   └── dbHelpers.ts     # Utilitários para operações de banco de dados
├── views/             # Templates EJS para renderização
├── app.ts             # Configuração da aplicação Express
├── declarations.d.ts  # Declarações de tipos para módulos externos
└── passport.ts        # Configuração de autenticação
```

## Próximos Passos

- Implementação de um sistema de validação de dados de entrada
- Divisão do arquivo admin.ts em módulos menores por funcionalidade
- Testes automatizados para garantir a funcionalidade da aplicação
- Possível adição de documentação de API com Swagger/OpenAPI

## Requisitos

- Node.js (v12+)
- MongoDB
- NPM ou Yarn

## Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar em produção
npm start
```

