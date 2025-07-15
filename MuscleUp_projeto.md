# 💪 MuscleUp

**MuscleUp** é uma plataforma web para criação e acompanhamento de treinos físicos.  
Com ela, você monta seus próprios planos de treino, registra o que foi feito e acompanha seu progresso corporal com dados e gráficos.

---

## 🎯 Objetivo

Ajudar praticantes de musculação a:

- ✅ Organizar seus treinos de forma personalizada
- ✅ Registrar a execução real dos exercícios
- ✅ Acompanhar sua evolução física com dados precisos
- ✅ Planejar treinos por dia da semana
- 🔄 Visualizar progresso com gráficos
- 🔄 Gerar relatórios de desempenho

---

## ⚙️ Como o sistema funciona

1. **Cadastro/Login:** o usuário cria uma conta segura com JWT.
2. **Plano de treino:** o usuário monta sua ficha com dias e exercícios.
3. **Organização semanal:** define que exercícios fazer em cada dia da semana.
4. **Execução:** ao treinar, registra o que fez de fato (reps, carga, observações).
5. **Progresso corporal:** registra peso e medidas ao longo do tempo.
6. **Dashboard:** vê o progresso e os treinos recentes.

---

## 🛠 Tecnologias Utilizadas

### 🔙 Backend
- [NestJS](https://nestjs.com/) - Framework Node.js
- [Prisma ORM](https://www.prisma.io/) - ORM para banco de dados
- PostgreSQL - Banco de dados relacional
- JWT Authentication - Autenticação segura
- bcrypt - Criptografia de senhas
- class-validator - Validação de dados
- Docker - Containerização do PostgreSQL

### 💻 Frontend (Planejado)
- [React](https://reactjs.org/) - Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [TanStack Query](https://tanstack.com/query/latest) - State management
- React Hook Form + Zod - Formulários e validação
- TailwindCSS ou Shadcn/UI - Estilização

---

## 📦 Estrutura do Projeto

```
MuscleUp/
├── muscleup-backend/               # API NestJS + Prisma
│   ├── src/
│   │   ├── auth/                   # Autenticação JWT
│   │   │   ├── dto/               # DTOs de auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── users/                  # Gestão de usuários
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── workout-plans/          # Planos de treino
│   │   │   ├── dto/
│   │   │   ├── workout-plans.controller.ts
│   │   │   ├── workout-plans.service.ts
│   │   │   └── workout-plans.module.ts
│   │   ├── workout-days/           # Dias de treino
│   │   │   ├── dto/
│   │   │   ├── workout-days.controller.ts
│   │   │   ├── workout-days.service.ts
│   │   │   └── workout-days.module.ts
│   │   ├── workout-exercises/      # Exercícios
│   │   │   ├── dto/
│   │   │   ├── workout-exercises.controller.ts
│   │   │   ├── workout-exercises.service.ts
│   │   │   └── workout-exercises.module.ts
│   │   ├── prisma/                # Configuração Prisma
│   │   │   ├── prisma.service.ts
│   │   │   └── prisma.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma          # Esquema do banco
│   │   └── migrations/            # Migrações
│   ├── docker-compose.yml         # PostgreSQL Docker
│   ├── .env                       # Variáveis de ambiente
│   └── package.json
├── frontend/                       # React + TypeScript (Planejado)
└── MuscleUp_projeto.md            # Este arquivo
```

---

## 🗄️ Estrutura de Dados

### **Modelos Principais:**

#### **User** (Usuário)
```typescript
{
  id: string
  name: string
  email: string (único)
  passwordHash: string
  birthDate: DateTime
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  height: number
  weight: number
  activityLevel?: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'
  goal?: 'LOSE_WEIGHT' | 'GAIN_WEIGHT' | 'MAINTAIN_WEIGHT' | 'GAIN_MUSCLE' | 'STRENGTH_GAIN'
  role: 'USER' | 'ADMIN'
  workoutPlans: WorkoutPlan[]
}
```

#### **WorkoutPlan** (Plano de Treino)
```typescript
{
  id: string
  name: string
  userId: string
  user: User
  workoutDays: WorkoutDay[]
}
```

#### **WorkoutDay** (Dia de Treino)
```typescript
{
  id: string
  name: string
  dayOfWeek?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  workoutPlanId: string
  workoutPlan: WorkoutPlan
  workoutExercises: WorkoutExercise[]
}
```

#### **WorkoutExercise** (Exercício)
```typescript
{
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  workoutDayId: string
  workoutDay: WorkoutDay
}
```

---

## 🔌 APIs Implementadas

### **Autenticação:**
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Fazer login

### **Usuários:**
- `GET /users/me` - Dados do usuário logado (🔒 Protegido)

### **Planos de Treino:**
- `POST /workout-plans` - Criar plano (🔒 Protegido)
- `GET /workout-plans` - Listar planos do usuário (🔒 Protegido)
- `GET /workout-plans/:id` - Buscar plano específico (🔒 Protegido)
- `PATCH /workout-plans/:id` - Atualizar plano (🔒 Protegido)
- `DELETE /workout-plans/:id` - Deletar plano (🔒 Protegido)

### **Dias de Treino:**
- `POST /workout-days` - Criar dia de treino (🔒 Protegido)
- `GET /workout-days` - Listar dias (🔒 Protegido)
- `GET /workout-days/:id` - Buscar dia específico (🔒 Protegido)
- `PATCH /workout-days/:id` - Atualizar dia (🔒 Protegido)
- `DELETE /workout-days/:id` - Deletar dia (🔒 Protegido)

### **Exercícios:**
- `POST /workout-exercises` - Criar exercício (🔒 Protegido)
- `GET /workout-exercises` - Listar exercícios (🔒 Protegido)
- `GET /workout-exercises/:id` - Buscar exercício específico (🔒 Protegido)
- `PATCH /workout-exercises/:id` - Atualizar exercício (🔒 Protegido)
- `DELETE /workout-exercises/:id` - Deletar exercício (🔒 Protegido)

---

## 🚀 Como executar o projeto

### **Pré-requisitos:**
- Node.js 18+
- Docker e Docker Compose
- PostgreSQL (via Docker)

### **Backend:**

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd MuscleUp/muscleup-backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente (.env):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/muscleup"
JWT_SECRET="seu-jwt-secret-aqui"
```

4. **Inicie o PostgreSQL com Docker:**
```bash
docker-compose up -d
```

5. **Execute as migrações:**
```bash
npx prisma migrate dev
npx prisma generate
```

6. **Inicie o servidor:**
```bash
npm run start:dev
```

O servidor estará disponível em `http://localhost:3000`

### **Teste das APIs:**
Use ferramentas como Postman ou Insomnia para testar os endpoints.

---

## ✅ Progresso atual

### **Implementado:**
- ✅ Configuração inicial NestJS
- ✅ Banco PostgreSQL com Docker
- ✅ Autenticação JWT completa
- ✅ CRUD de usuários
- ✅ CRUD de planos de treino
- ✅ CRUD de dias de treino (com dia da semana)
- ✅ CRUD de exercícios
- ✅ Validação de dados com class-validator
- ✅ Proteção de rotas com JWT Guards
- ✅ Relacionamentos entre entidades
- ✅ Migrações do Prisma

### **Em desenvolvimento:**
- 🔄 Frontend React
- 🔄 Registros de execução de treino
- 🔄 Acompanhamento de progresso corporal
- 🔄 Dashboard com gráficos
- 🔄 Relatórios de desempenho

### **Próximos passos:**
- 📝 Criar modelo de ProgressRecord (peso, medidas)
- 📝 Implementar WorkoutSession (registro de treino executado)
- 📝 Criar sistema de metas e objetivos
- 📝 Implementar dashboard com estatísticas
- 📝 Desenvolver frontend React
- 📝 Implementar gráficos e relatórios
- 📝 Adicionar notificações e lembretes

---

## 🎯 Funcionalidades futuras

- 📱 Aplicativo mobile (React Native)
- 🤖 Sugestões automáticas de treino
- 👥 Sistema de personal trainers
- 📊 Analytics avançados
- 🏆 Sistema de conquistas/badges
- 📈 Previsão de resultados com IA
- 🔄 Sincronização com wearables
- 💬 Chat/comunidade de usuários

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commitar suas mudanças
4. Fazer push para a branch
5. Abrir um Pull Request

---

**Desenvolvido com 💪 para entusiastas de musculação**