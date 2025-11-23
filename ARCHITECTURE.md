# Documentação de Arquitetura

Este documento descreve a arquitetura geral do projeto **Frontend Task Compass** e define convenções rigorosas que **DEVEM** ser seguidas ao gerar ou modificar código neste repositório.

---

## Índice

1. [Camadas e Filosofia Geral](#camadas-e-filosofia-geral)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Detalhes das Camadas DDD](#detalhes-das-camadas-ddd)
4. [Acesso a Dados e Server Actions](#acesso-a-dados-e-server-actions)
5. [Formulários e Validação](#formulários-e-validação)
6. [Client vs Server (Next.js)](#client-vs-server-nextjs)
7. [Requisições Client-side com TanStack Query](#requisições-client-side-com-tanstack-query)
8. [Lógica de Negócio e Hooks Customizados](#lógica-de-negócio-e-hooks-customizados)
9. [Convenções de Tipagem e Estilo de Código](#convenções-de-tipagem-e-estilo-de-código)
10. [Pasta Shared](#pasta-shared)
11. [Índices / Barrel Files](#índices--barrel-files)

---

## Camadas e Filosofia Geral

Este projeto segue uma abordagem **"DDD Light"** (Domain-Driven Design), organizando o código em **módulos** que representam contextos delimitados ou funcionalidades distintas.

### Princípios Fundamentais

- **Arquitetura Modular**: Cada módulo encapsula sua própria lógica de domínio, serviços de aplicação, infraestrutura e preocupações de UI.
- **Separação de Responsabilidades**: Limites claros entre as camadas de domínio, aplicação, infraestrutura e apresentação.
- **Inversão de Dependências**: As camadas de domínio e aplicação não dependem de infraestrutura ou UI. As dependências fluem para dentro.

### Estrutura do Módulo

Cada módulo contém quatro camadas principais:

1. **`domain/`** - Lógica de negócio central, entidades, objetos de valor, serviços de domínio e interfaces de repositório
2. **`application/`** - Casos de uso, DTOs e serviços de aplicação que orquestram a lógica de domínio
3. **`infra/`** - Implementações de infraestrutura (Prisma, APIs externas, mappers)
4. **`ui/`** - Componentes React, hooks, server actions e serviços client-side

Além disso, existe uma pasta **`shared/`** para utilitários entre módulos, componentes genéricos e tipos compartilhados que não pertencem a nenhum domínio específico.

---

## Estrutura de Diretórios

O projeto segue esta estrutura de diretórios:

```
frontend-task-compass/
├── src/
│   ├── app/                    # Rotas do Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (routes)/
│   │   └── globals.css
│   │
│   ├── modules/                # Módulos de funcionalidades (contextos delimitados DDD)
│   │   ├── questionnaire/     # Exemplo de módulo
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── value-objects/
│   │   │   │   ├── services/
│   │   │   │   └── repositories/
│   │   │   ├── application/
│   │   │   │   ├── use-cases/
│   │   │   │   ├── dtos/
│   │   │   │   └── errors/
│   │   │   ├── infra/
│   │   │   │   ├── prisma/
│   │   │   │   ├── mappers/
│   │   │   │   └── external/
│   │   │   └── ui/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── actions/    # Server Actions
│   │   │       ├── services/   # Serviços de API client-side
│   │   │       └── validation/
│   │   │
│   │   └── (outros módulos)/
│   │
│   ├── shared/                 # Utilitários entre módulos
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── types/
│   │   └── errors/
│   │
│   └── lib/
│       └── prisma/             # Configuração do cliente Prisma
│           └── client.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
├── package.json
└── tsconfig.json
```

### Pontos Principais

- **`src/app/`**: Rotas do Next.js App Router. Prefira **Server Components** por padrão.
- **`src/modules/`**: Uma pasta por módulo/funcionalidade. Cada módulo é autocontido.
- **`src/shared/`**: Apenas preocupações genéricas e transversais. Sem lógica específica de domínio.
- **`src/lib/prisma/`**: Singleton do cliente Prisma e utilitários de banco de dados.

### Requisito de Barrel Files

Toda pasta contendo múltiplos arquivos (componentes, hooks, serviços, etc.) **DEVE** exportá-los via um arquivo barrel `index.ts` que exporta todos os itens públicos naquele nível.

Exemplo:

- `src/modules/questionnaire/ui/components/index.ts`
- `src/modules/questionnaire/ui/hooks/index.ts`
- `src/shared/hooks/index.ts`

---

## Detalhes das Camadas DDD

### Camada de Domínio (`domain/`)

A camada de domínio contém a lógica de negócio central e as regras.

#### Estrutura

```
domain/
├── entities/           # Entidades de domínio (ex: TaskSession, Question)
├── value-objects/      # Objetos de valor imutáveis (ex: TaskType, Answer)
├── services/           # Serviços de domínio (lógica de negócio que não cabe em entidades)
└── repositories/       # Interfaces de repositório (não implementações)
```

#### Regras

- **Entidades** devem sempre começar com **letra maiúscula** (ex: `TaskSession`, `Question`).
- Entidades são modelos de domínio ricos com comportamento, não apenas contêineres de dados.
- **Objetos de Valor** são imutáveis e representam conceitos sem identidade.
- **Interfaces de repositório** são definidas aqui, mas as implementações ficam em `infra/`.
- A camada de domínio **não tem dependências** de infraestrutura, UI ou bibliotecas externas (exceto tipos TypeScript).

#### Exemplo

```typescript
// domain/entities/TaskSession.ts
export class TaskSession {
  constructor(
    public readonly id: string,
    public readonly taskType: TaskType,
    private answers: Map<string, Answer>
  ) {}

  addAnswer(questionId: string, answer: Answer): void {
    // Lógica de domínio aqui
  }
}

// domain/repositories/TaskSessionRepository.ts
export interface TaskSessionRepository {
  save(session: TaskSession): Promise<void>;
  findById(id: string): Promise<TaskSession | null>;
}
```

### Camada de Aplicação (`application/`)

A camada de aplicação orquestra a lógica de domínio e coordena entre domínio e infraestrutura.

#### Estrutura

```
application/
├── use-cases/          # Casos de uso de aplicação (ex: AnswerQuestionUseCase)
├── dtos/               # Data Transfer Objects para entradas/saídas de casos de uso
└── errors/             # Erros de nível de aplicação
```

#### Regras

- **Casos de uso** representam operações de nível de aplicação (ex: `AnswerQuestionUseCase`, `CreateTaskSessionUseCase`).
- Casos de uso chamam serviços de domínio e interfaces de repositório (injeção de dependência).
- **DTOs** são usados para transferência de dados entre camadas. São objetos simples, não entidades de domínio.
- A camada de aplicação depende de `domain/` mas não de `infra/` ou `ui/`.

#### Exemplo

```typescript
// application/use-cases/AnswerQuestionUseCase.ts
export class AnswerQuestionUseCase {
  constructor(
    private taskSessionRepository: TaskSessionRepository,
    private questionRepository: QuestionRepository
  ) {}

  async execute(input: AnswerQuestionDTO): Promise<AnswerQuestionResultDTO> {
    // Orquestrar lógica de domínio
  }
}
```

### Camada de Infraestrutura (`infra/`)

A camada de infraestrutura implementa interfaces de repositório e lida com integrações externas.

#### Estrutura

```
infra/
├── prisma/             # Implementações de repositório Prisma
├── mappers/            # Mappers entre modelos Prisma e entidades de domínio
└── external/           # Integrações com APIs externas
```

#### Regras

- **Implementações de repositório** usam Prisma para interagir com o banco de dados.
- **Mappers** convertem entre modelos Prisma e entidades de domínio (ex: `TaskSessionMapper`).
- A camada de infraestrutura depende de `domain/` e `application/` (implementa suas interfaces).

#### Exemplo

```typescript
// infra/prisma/PrismaTaskSessionRepository.ts
export class PrismaTaskSessionRepository implements TaskSessionRepository {
  constructor(private prisma: PrismaClient) {}

  async save(session: TaskSession): Promise<void> {
    const data = TaskSessionMapper.toPersistence(session);
    await this.prisma.taskSession.upsert({
      /* ... */
    });
  }
}

// infra/mappers/TaskSessionMapper.ts
export class TaskSessionMapper {
  static toDomain(prismaModel: PrismaTaskSession): TaskSession {
    // Converter modelo Prisma para entidade de domínio
  }

  static toPersistence(entity: TaskSession): PrismaTaskSessionCreateInput {
    // Converter entidade de domínio para input Prisma
  }
}
```

### Camada de UI (`ui/`)

A camada de UI contém componentes React, hooks, server actions e serviços client-side.

#### Estrutura

```
ui/
├── components/         # Componentes React
├── hooks/              # Hooks React customizados
├── actions/            # Server Actions
├── services/           # Serviços de API client-side (para TanStack Query)
└── validation/         # Schemas Zod para formulários
```

#### Regras

- **Server Actions** ficam em `ui/actions/` e conectam UI às camadas de aplicação/infraestrutura.
- **Componentes** devem ser o mais "burros" possível (apresentacionais).
- **Hooks customizados** encapsulam lógica de negócio, gerenciamento de estado e efeitos colaterais.
- A camada de UI pode depender de `application/` e `infra/` (via injeção de dependência em Server Actions).

---

## Acesso a Dados e Server Actions

### Regra Fundamental

**Todo acesso ao banco de dados DEVE passar por Server Actions.** Nunca acesse o banco de dados diretamente dentro de componentes React ou código client-side.

### Padrão de Server Actions

1. **Localização**: Server Actions ficam em `ui/actions/` dentro de cada módulo.
2. **Fluxo**: Server Actions → Casos de Uso de Aplicação → Serviços de Domínio → Repositórios de Infraestrutura
3. **Nomenclatura**: Server Actions devem ser nomeados de forma descritiva (ex: `createTaskSession`, `answerQuestion`).

### Exemplo

```typescript
// ui/actions/taskSessionActions.ts
"use server";

import { CreateTaskSessionUseCase } from "../../application/use-cases/CreateTaskSessionUseCase";
import { PrismaTaskSessionRepository } from "../../infra/prisma/PrismaTaskSessionRepository";
import { prisma } from "@/lib/prisma/client";

export async function createTaskSession(input: CreateTaskSessionDTO) {
  const repository = new PrismaTaskSessionRepository(prisma);
  const useCase = new CreateTaskSessionUseCase(repository);
  return await useCase.execute(input);
}
```

### Quando Usar Server Actions vs Rotas de API

- **Prefira Server Actions** para fluxos full-stack (formulários, mutações, busca de dados de server components).
- **Use Rotas de API** (`app/api/`) apenas quando:
  - Sistemas externos precisam chamar sua API
  - Você precisa de webhooks
  - Você precisa de endpoints REST para integrações de terceiros

---

## Formulários e Validação

### Convenções

1. **React Hook Form** + **Zod** para todos os formulários
2. **Schemas de validação** ficam em `ui/validation/` dentro de cada módulo
3. **Lógica de formulário** deve ser abstraída em **hooks customizados**, não dentro do corpo de componentes

### Exemplo

```typescript
// ui/validation/questionnaireSchemas.ts
import { z } from "zod";

export const answerQuestionSchema = z.object({
  questionId: z.string().min(1),
  answer: z.string().min(1),
});

// ui/hooks/useAnswerQuestion.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { answerQuestionSchema } from "../validation/questionnaireSchemas";
import { answerQuestion } from "../actions/questionnaireActions";

export function useAnswerQuestion() {
  const form = useForm({
    resolver: zodResolver(answerQuestionSchema),
  });

  const onSubmit = async (data: z.infer<typeof answerQuestionSchema>) => {
    await answerQuestion(data);
  };

  return { form, onSubmit };
}

// ui/components/AnswerQuestionForm.tsx
export function AnswerQuestionForm({ questionId }: AnswerQuestionFormProps) {
  const { form, onSubmit } = useAnswerQuestion();
  // Renderizar UI do formulário
}
```

---

## Client vs Server (Next.js)

### Princípio Fundamental

**Prefira Server Components sempre que possível.** Use `'use client'` apenas quando interatividade client-side for estritamente necessária.

### Quando Usar Server Components

- Conteúdo estático
- Busca de dados (via Server Actions ou acesso direto ao banco em Server Components)
- Renderizações iniciais de página
- Conteúdo crítico para SEO

### Quando Usar Client Components

- Elementos interativos (botões, formulários com feedback de validação client-side)
- APIs do navegador (localStorage, window, etc.)
- Hooks React que requerem client-side (useState, useEffect, etc.)
- Bibliotecas de terceiros que requerem renderização client-side

### Exemplo

```typescript
// ✅ Server Component (padrão)
// app/questionnaire/page.tsx
export default async function QuestionnairePage() {
  const session = await getTaskSession();
  return <QuestionnaireView session={session} />;
}

// ✅ Client Component (apenas quando necessário)
// ui/components/InteractiveQuestion.tsx
("use client");

export function InteractiveQuestion({ question }: InteractiveQuestionProps) {
  const [selected, setSelected] = useState<string>();
  // Lógica interativa aqui
}
```

---

## Requisições Client-side com TanStack Query

### Padrão

Quando um componente client precisa buscar dados do servidor (além de Server Actions usados em formulários):

1. Crie uma **função de serviço** em `ui/services/` que chama o endpoint/Server Action
2. Crie um **hook customizado** que usa **TanStack Query** para consumir esse serviço
3. Componentes usam o hook customizado, nunca chamando fetch ou serviços diretamente

### Exemplo

```typescript
// ui/services/taskSessionService.ts
export async function fetchTaskSession(id: string) {
  const response = await fetch(`/api/task-sessions/${id}`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}

// ui/hooks/useTaskSession.ts
import { useQuery } from "@tanstack/react-query";
import { fetchTaskSession } from "../services/taskSessionService";

export function useTaskSession(id: string) {
  return useQuery({
    queryKey: ["taskSession", id],
    queryFn: () => fetchTaskSession(id),
  });
}

// ui/components/TaskSessionView.tsx
("use client");

export function TaskSessionView({ sessionId }: TaskSessionViewProps) {
  const { data, isLoading } = useTaskSession(sessionId);
  // Renderizar UI
}
```

---

## Lógica de Negócio e Hooks Customizados

### Regra Rigorosa

**Nenhuma lógica de negócio é permitida diretamente dentro de componentes React ou páginas Next.js.**

Toda lógica deve ser abstraída em:

- **Hooks customizados** (para lógica relacionada a UI, estado, efeitos colaterais)
- **Casos de uso de aplicação** (para lógica de negócio)
- **Serviços de domínio** (para regras centrais de domínio)

### Filosofia de Componentes

Componentes devem ser o mais "burros" possível:

- Recebem props
- Renderizam UI
- Delegam toda lógica para hooks ou casos de uso

### Forma Abreviada de Componente

Se um componente não tem lógica acima da declaração de return, use a forma abreviada:

```typescript
// ✅ Bom
export const WelcomeMessage = ({ name }: WelcomeMessageProps) => (
  <h1>Welcome, {name}!</h1>
);

// ❌ Desnecessário
export function WelcomeMessage({ name }: WelcomeMessageProps) {
  return <h1>Welcome, {name}!</h1>;
}
```

### Exemplo

```typescript
// ❌ Ruim: Lógica no componente
export function QuestionCard({ question }: QuestionCardProps) {
  const [selected, setSelected] = useState();
  const [error, setError] = useState();

  const handleSubmit = async () => {
    if (!selected) {
      setError('Please select an answer');
      return;
    }
    await answerQuestion({ questionId: question.id, answer: selected });
  };

  return (/* JSX */);
}

// ✅ Bom: Lógica em hook customizado
export function QuestionCard({ question }: QuestionCardProps) {
  const { selected, error, handleSelect, handleSubmit } = useAnswerQuestion(question.id);
  return (/* JSX */);
}

// ui/hooks/useAnswerQuestion.ts
export function useAnswerQuestion(questionId: string) {
  const [selected, setSelected] = useState<string>();
  const [error, setError] = useState<string>();

  const handleSubmit = async () => {
    if (!selected) {
      setError('Please select an answer');
      return;
    }
    await answerQuestion({ questionId, answer: selected });
  };

  return { selected, error, handleSelect: setSelected, handleSubmit };
}
```

---

## Convenções de Tipagem e Estilo de Código

### Regras TypeScript

1. **Use TypeScript em todos os lugares** - busque código altamente tipado
2. **Evite `any`** - use `unknown` se o tipo for verdadeiramente desconhecido, então faça narrowing
3. **Sem tipos/interfaces inline** - todos os tipos de props e dados devem viver em arquivos de tipo separados

### Organização de Arquivos de Tipo

Tipos devem ficar em:

- Pasta `types/` dentro de cada módulo (ex: `ui/types/`)
- Ou perto do arquivo que os usa, mas em um arquivo separado (ex: `QuestionCard.types.ts`)

### Convenções de Nomenclatura

1. **Props de Componente**: Devem terminar com sufixo `Props`

   - ✅ `QuestionCardProps`, `QuestionnairePageProps`
   - ❌ `QuestionCard`, `QuestionnairePage`

2. **Enums**: Devem terminar com sufixo `Enum`

   - ✅ `TaskTypeEnum`, `QuestionTypeEnum`
   - ❌ `TaskType`, `QuestionType`

3. **Entidades**: Devem começar com letra maiúscula
   - ✅ `TaskSession`, `Question`, `Answer`
   - ❌ `taskSession`, `question`, `answer`

### Constantes e Valores Mágicos

**Não codifique strings ou números usados em lógica.**

Use constantes para:

- Valores de configuração
- Listas de opções
- Labels
- Números mágicos

```typescript
// ✅ Bom
// shared/constants/taskTypes.ts
export const TASK_TYPES = {
  FEATURE: "feature",
  BUG: "bug",
  REFACTOR: "refactor",
} as const;

// ❌ Ruim
if (task.type === "feature") {
  /* ... */
}
```

### Convenções de Idioma

1. **Idioma do Código**: Todo código (identificadores, variáveis, nomes de funções, comentários) deve estar em **Inglês**
2. **Exceção de Texto de UI**: Textos voltados ao usuário (labels, mensagens, títulos) devem estar em **Português**

```typescript
// ✅ Bom
export function TaskSessionCard({ session }: TaskSessionCardProps) {
  return (
    <div>
      <h2>{session.title}</h2>
      <p>Tipo de tarefa: {session.taskType}</p> {/* Português para usuários */}
    </div>
  );
}
```

### Comentários

**Não adicione comentários ao código.** A arquitetura e nomenclatura devem ser autoexplicativas.

Se o código requer explicação, considere:

- Refatorar para clareza
- Melhor nomenclatura
- Extrair para uma função bem nomeada
- Atualizar este documento de arquitetura se for um padrão

---

## Pasta Shared

A pasta `shared/` contém **preocupações genéricas e transversais** que são reutilizadas em múltiplos módulos.

### O que Pertence a `shared/`

- ✅ Helpers e utilitários genéricos (ex: `formatDate`, `debounce`)
- ✅ Hooks genéricos (ex: `useDebounce`, `useLocalStorage`)
- ✅ Componentes genéricos (ex: `Button`, `Input`, `Modal`)
- ✅ Constantes compartilhadas que são verdadeiramente entre domínios (ex: `API_BASE_URL`)
- ✅ Utilitários genéricos de tratamento de erros
- ✅ Tipos TypeScript compartilhados que não pertencem a um domínio específico

### O que NÃO Pertence a `shared/`

- ❌ Lógica específica de domínio (pertence aos módulos)
- ❌ Regras de negócio (pertence à camada de domínio)
- ❌ Componentes específicos de funcionalidade (pertence ao `ui/` do módulo)
- ❌ Tipos específicos de módulo (pertence ao módulo)

### Exemplo de Estrutura

```
shared/
├── components/
│   ├── Button/
│   ├── Input/
│   └── index.ts
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── utils/
│   ├── formatDate.ts
│   ├── debounce.ts
│   └── index.ts
├── constants/
│   ├── api.ts
│   └── index.ts
└── types/
    ├── common.ts
    └── index.ts
```

---

## Índices / Barrel Files

### Requisito

Toda pasta contendo múltiplos arquivos (componentes, hooks, serviços, etc.) **DEVE** exportá-los via um arquivo barrel `index.ts`.

### Propósito

- Imports mais limpos
- Limites claros de API pública
- Refatoração mais fácil

### Exemplo

```typescript
// ui/components/QuestionCard.tsx
export function QuestionCard({ question }: QuestionCardProps) {
  /* ... */
}

// ui/components/AnswerButton.tsx
export function AnswerButton({ onClick }: AnswerButtonProps) {
  /* ... */
}

// ui/components/index.ts
export { QuestionCard } from "./QuestionCard";
export { AnswerButton } from "./AnswerButton";

// Uso em outros arquivos
import { QuestionCard, AnswerButton } from "../components";
// Ao invés de:
// import { QuestionCard } from '../components/QuestionCard';
// import { AnswerButton } from '../components/AnswerButton';
```

### Regras de Barrel Files

1. **Exporte apenas APIs públicas** - não exporte detalhes de implementação interna
2. **Re-exporte explicitamente** - use named exports, não `export *`
3. **Mantenha simples** - se uma pasta tem apenas um arquivo, um barrel file é opcional mas recomendado para consistência

---

## Resumo: Checklist de Convenções Rigorosas

Ao gerar ou modificar código neste repositório, garanta:

- ✅ Código segue a estrutura modular DDD (domain, application, infra, ui)
- ✅ Todo acesso ao banco de dados passa por Server Actions
- ✅ Formulários usam React Hook Form + Zod, com lógica em hooks customizados
- ✅ Prefira Server Components; use Client Components apenas quando necessário
- ✅ Busca client-side usa TanStack Query via hooks customizados
- ✅ Nenhuma lógica de negócio em componentes; use hooks customizados ou casos de uso
- ✅ Todos os tipos/interfaces estão em arquivos separados, não inline
- ✅ Tipos de props terminam com `Props`, enums terminam com `Enum`
- ✅ Sem valores mágicos codificados; use constantes
- ✅ Código está em Inglês; texto de UI está em Português
- ✅ Sem comentários no código
- ✅ Barrel files (`index.ts`) para pastas com múltiplos arquivos
- ✅ Lógica específica de domínio fica em módulos; código genérico vai em `shared/`

---

**Este documento é a fonte da verdade para arquitetura e convenções. Todo código deve aderir a estas regras.**
