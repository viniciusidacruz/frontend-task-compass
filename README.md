# Frontend Task Compass

**Uma bússola de decisão para desenvolvedores front-end antes de iniciar uma tarefa**

---

## 📋 Visão Geral

O **Frontend Task Compass** é uma aplicação Next.js que funciona como uma bússola de decisão e mapa mental para desenvolvedores front-end antes de começar uma tarefa. A aplicação ajuda a esclarecer o tipo de tarefa, requisitos, escopo, riscos, dependências e critérios de aceitação antes da implementação.

Muitas vezes, desenvolvedores começam a trabalhar em uma tarefa sem ter todas as informações necessárias, o que pode levar a retrabalho, bugs e atrasos. Esta ferramenta guia você através de um questionário dinâmico e interativo que revela as perguntas certas baseadas nas suas respostas anteriores.

---

## ✨ Funcionalidades Principais

- **Autenticação de Usuários**: Sistema de cadastro e login para acesso à plataforma
- **Sessões Personalizadas**: Cada usuário pode criar e gerenciar suas próprias sessões de questionário
- **Questionário Dinâmico Multi-etapas**: Cada resposta revela a próxima pergunta, baseada nas escolhas anteriores
- **Perguntas Condicionais**: O fluxo de perguntas se adapta ao tipo de tarefa selecionado
- **Tipos de Tarefa**: Suporte para Features, Bugs e Refactors
- **Clareza de Escopo**: Ajuda a identificar requisitos, dependências e riscos antes da implementação
- **Critérios de Aceitação**: Guia para definir o que precisa ser feito para considerar a tarefa completa

---

## 🎯 Como Funciona

A aplicação utiliza uma estrutura de árvore de decisão onde:

1. **Autenticação**: O usuário precisa se cadastrar e fazer login para acessar a plataforma
2. **Criação de Sessão**: Após o login, o usuário pode criar uma nova sessão de questionário
3. **Primeira Pergunta**: O usuário seleciona o tipo de tarefa (Feature, Bug ou Refactor)
4. **Perguntas Condicionais**: Baseado na seleção, novas perguntas aparecem dinamicamente
   - Para **Feature**: "A UX/UI já está definida?", "Existem dependências de backend?", "Há casos extremos ou estados de erro identificados?"
   - Para **Bug**: Perguntas sobre reprodução, ambiente, impacto, etc.
   - Para **Refactor**: Perguntas sobre escopo, testes, documentação, etc.
5. **Resultado Final**: Um resumo das respostas que ajuda a clarificar a tarefa antes de começar a codificar
6. **Histórico**: O usuário pode visualizar e gerenciar todas as suas sessões anteriores

---

## 🚀 Começando

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **pnpm** (recomendado) ou npm/yarn
- **Git**

### Instalação

1. **Clone o repositório**:

   ```bash
   git clone git@github.com:viniciusidacruz/frontend-task-compass.git
   cd frontend-task-compass
   ```

2. **Instale as dependências**:

   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure as variáveis de ambiente**:

   Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias (consulte a documentação de autenticação para mais detalhes).

4. **Execute o servidor de desenvolvimento**:

   ```bash
   pnpm dev
   # ou
   npm run dev
   ```

5. **Abra no navegador**:
   Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação em execução.

6. **Cadastre-se e faça login**:
   Na primeira visita, você precisará criar uma conta. Após o cadastro e login, você terá acesso às suas sessões de questionário.

### Build para Produção

Para criar uma build de produção:

```bash
pnpm build
pnpm start
```

---

## 🛠️ Stack Tecnológica

- **Next.js 16** (App Router) - Framework React para produção
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Prisma** - ORM para acesso ao banco de dados
- **ESLint** - Linter para qualidade de código

### Autenticação

A aplicação utiliza autenticação para garantir que cada usuário tenha acesso apenas às suas próprias sessões de questionário. O sistema de autenticação permite:

- Cadastro de novos usuários
- Login seguro
- Gerenciamento de sessões de usuário
- Proteção de rotas e dados

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork o projeto**
2. **Crie uma branch para sua feature** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** usando conventional commits (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### Tipos de Commits (Conventional Commits)

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula faltando, etc.
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Mudanças em build, dependências, etc.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Vinicius da Cruz**

- GitHub: [@viniciusidacruz](https://github.com/viniciusidacruz)

---

## 🙏 Agradecimentos

Este projeto foi criado para ajudar desenvolvedores front-end a terem mais clareza e confiança antes de começar uma tarefa. Se você encontrar útil, considere dar uma ⭐ no repositório!
