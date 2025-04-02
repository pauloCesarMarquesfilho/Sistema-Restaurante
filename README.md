
![alt tag](https://i.ibb.co/gWYF4nQ/erestaurant-new-1024x517.png)

**English:**
Hello community, thanks for visiting this project that was created 4 years ago. Everything was born from a need and learning new technologies. Today I am developing a very complete CMS with many things which need collaboration from you. I count on your support

**Spanish:**
Hola comunidad, gracias por visitar este proyecto que fue creado hace 4 años. todo nacio por una necesidad y aprendizaje de nuevas tecnologias. hoy en la actualidad estoy desarrollando un CMS muy completo con muchas cosas la cual se necesita colaboración de parte de ustedes. espero contar con su apoyo

**French:**
Bonjour la communauté, merci de visiter ce projet qui a été créé il y a 4 ans. Tout est né d'un besoin et de l'apprentissage de nouvelles technologies. Aujourd'hui, je développe un CMS très complet avec beaucoup de choses qui nécessitent une collaboration de votre part. J'espère compter sur votre soutien

**Germany:**
Hallo Community, vielen Dank für den Besuch dieses Projekts, das vor 4 Jahren erstellt wurde. Alles wurde aus einem Bedürfnis geboren und lernte neue Technologien. Heute entwickle ich ein sehr vollständiges CMS mit vielen Dingen, die eine Zusammenarbeit von Ihnen erfordern. Ich hoffe auf Ihre Unterstützung zählen zu können.

**Russia:**
Здравствуйте, сообщество, спасибо за посещение этого проекта, который был создан 4 года назад. Все рождено от потребности и изучения новых технологий. Сегодня я разрабатываю очень полную CMS со многими вещами, которые требуют совместной работы от вас. Я надеюсь рассчитывать на вашу поддержку.


Sistema para restaurante creado en nodejs(Versión temporal)
Primera versión:

![alt tag](https://i.ibb.co/dWLHbJ6/screencapture-localhost-8080-panel-2020-05-03-14-38-23-1203x1536.png)



Desarrollado por www.edinsoncs.com

## Migração para TypeScript

Este projeto está sendo migrado de JavaScript para TypeScript para melhorar a segurança, escalabilidade e legibilidade do código.

### Estrutura do Projeto em TypeScript

A estrutura do projeto TypeScript está organizada da seguinte forma:

```
/src              - Código fonte TypeScript
  /bin            - Scripts de inicialização
  /models         - Modelos de dados
  /routes         - Rotas da aplicação
  /types          - Definições de tipos e interfaces
/dist             - Código compilado (gerado pelo TypeScript)
/views            - Templates Jade/Pug
/public           - Arquivos estáticos
```

### Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Iniciar o servidor
npm start

# Iniciar em modo de desenvolvimento
npm run dev
```

### Principais Melhorias com TypeScript

1. **Tipagem Estática**: Todos os modelos, rotas e funções agora têm tipos explícitos.
2. **Interfaces**: Uso de interfaces para definir estruturas de dados reutilizáveis.
3. **Melhor Segurança**: Redução do uso de `any` e maior segurança no código.
4. **Melhor IDE Support**: Autocompletar e detecção de erros durante o desenvolvimento.

