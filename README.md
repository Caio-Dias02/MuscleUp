# 💪 MuscleUp

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

> **Plataforma web para criação de planos de treino, registro de exercícios e acompanhamento de progresso físico.**

MuscleUp é uma API REST construída em NestJS que permite aos usuários criar planos de treino personalizados, organizá-los por dia da semana e acompanhar seu progresso físico ao longo do tempo.

## 🎯 Funcionalidades

- ✅ **Autenticação JWT** - Sistema completo de registro e login
- ✅ **Gestão de Usuários** - Perfil com dados físicos e objetivos
- ✅ **Planos de Treino** - Criação e organização de treinos
- ✅ **Dias de Treino** - Organização por dia da semana
- ✅ **Exercícios** - Registro detalhado (séries, repetições, carga)
- ✅ **Relacionamentos** - Estrutura hierárquica completa
- 🔄 **Dashboard** - Estatísticas e progresso (em desenvolvimento)
- 🔄 **Frontend React** - Interface web (planejado)

## 🛠️ Tecnologias

### Backend
- **[NestJS](https://nestjs.com/)** - Framework Node.js robusto e escalável
- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript com tipagem estática
- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação stateless
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Criptografia de senhas
- **[class-validator](https://www.npmjs.com/package/class-validator)** - Validação de dados
- **[Docker](https://www.docker.com/)** - Containerização

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- Docker e Docker Compose
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/Caio-Dias02/MuscleUp.git
cd MuscleUp
```

### 2. Instale as dependências
```bash
cd muscleup-backend
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` baseado no `.env.example`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/muscleup"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
```

### 4. Inicie o banco de dados
```bash
docker-compose up -d
```

### 5. Execute as migrações
```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Inicie o servidor
```bash
npm run start:dev
```

🎉 **Pronto!** A API estará disponível em `http://localhost:3000`

## 📚 Documentação da API

### Autenticação

#### Registro de usuário
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

### Planos de Treino

#### Criar plano
```http
POST /workout-plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Treino Push Pull Legs",
  "userId": "user-uuid"
}
```

#### Listar planos do usuário
```http
GET /workout-plans
Authorization: Bearer <token>
```

### Dias de Treino

#### Criar dia de treino
```http
POST /workout-days
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Push - Peito, Ombro, Tríceps",
  "dayOfWeek": "MONDAY",
  "workoutPlanId": "workout-plan-uuid"
}
```

### Exercícios

#### Criar exercício
```http
POST /workout-exercises
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Supino Reto",
  "sets": 4,
  "reps": 12,
  "weight": 80,
  "workoutDayId": "workout-day-uuid"
}
```

## 🗄️ Estrutura do Banco de Dados

```mermaid
erDiagram
    User ||--o{ WorkoutPlan : has
    WorkoutPlan ||--o{ WorkoutDay : contains
    WorkoutDay ||--o{ WorkoutExercise : includes
    
    User {
        string id PK
        string name
        string email
        string passwordHash
        datetime birthDate
        enum gender
        int height
        int weight
        enum activityLevel
        enum goal
        enum role
    }
    
    WorkoutPlan {
        string id PK
        string name
        string userId FK
    }
    
    WorkoutDay {
        string id PK
        string name
        enum dayOfWeek
        string workoutPlanId FK
    }
    
    WorkoutExercise {
        string id PK
        string name
        int sets
        int reps
        int weight
        string workoutDayId FK
    }
```

## 📁 Estrutura do Projeto

```
MuscleUp/
├── muscleup-backend/
│   ├── src/
│   │   ├── auth/                 # Autenticação JWT
│   │   ├── users/                # Gestão de usuários
│   │   ├── workout-plans/        # Planos de treino
│   │   ├── workout-days/         # Dias de treino
│   │   ├── workout-exercises/    # Exercícios
│   │   ├── prisma/              # Configuração Prisma
│   │   └── main.ts              # Entrada da aplicação
│   ├── prisma/
│   │   ├── schema.prisma        # Esquema do banco
│   │   └── migrations/          # Migrações
│   ├── docker-compose.yml       # PostgreSQL
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Inicia em modo watch
npm run start:debug      # Inicia com debug

# Produção
npm run build           # Compila o projeto
npm run start:prod      # Inicia em produção

# Testes
npm run test            # Executa testes unitários
npm run test:e2e        # Executa testes end-to-end
npm run test:cov        # Coverage de testes

# Prisma
npx prisma studio       # Interface visual do banco
npx prisma migrate dev  # Executa migrações
npx prisma generate     # Gera client do Prisma
```

## 🧪 Testando a API

Você pode testar a API usando:

- **Postman** - Importe a collection (em breve)
- **Insomnia** - Importe o workspace (em breve)
- **cURL** - Exemplos nos endpoints acima

### Exemplo de fluxo completo:
1. Registre um usuário
2. Faça login e obtenha o token
3. Crie um plano de treino
4. Adicione dias de treino
5. Adicione exercícios aos dias

## 📈 Progresso do Projeto

### ✅ Implementado
- [x] Configuração inicial NestJS
- [x] Banco PostgreSQL com Docker
- [x] Autenticação JWT completa
- [x] CRUD de usuários
- [x] CRUD de planos de treino
- [x] CRUD de dias de treino (com dia da semana)
- [x] CRUD de exercícios
- [x] Validação de dados
- [x] Proteção de rotas
- [x] Relacionamentos entre entidades

### 🔄 Em desenvolvimento
- [ ] Registros de execução de treino
- [ ] Acompanhamento de progresso corporal
- [ ] Dashboard com estatísticas
- [ ] Frontend React

### 📋 Próximos passos
- [ ] Modelo de ProgressRecord
- [ ] Sistema de WorkoutSession
- [ ] Relatórios de desempenho
- [ ] Interface web React
- [ ] Gráficos e análises

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**Caio Dias**

- GitHub: [@Caio-Dias02](https://github.com/Caio-Dias02)
- LinkedIn: [Caio Dias](https://linkedin.com/in/caio-dias)

## 🎯 Roadmap

- 🔄 **v1.0** - Backend completo com autenticação
- 📝 **v1.1** - Sistema de progresso corporal
- 📝 **v1.2** - Dashboard e relatórios
- 📝 **v2.0** - Frontend React completo
- 📝 **v2.1** - Aplicativo mobile

---

<div align="center">

**Desenvolvido com 💪 para entusiastas de musculação**

⭐ **Se este projeto te ajudou, dê uma estrela!** ⭐

</div> 