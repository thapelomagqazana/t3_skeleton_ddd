# 🧱 T3 Skeleton — DDD Full Stack Starter Template

A modern, scalable full-stack starter built using **Domain-Driven Design (DDD)** principles, designed to help you launch TypeScript-based applications with clear separation of concerns and long-term maintainability.

---

## 🚀 Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma
- **Tooling**: TurboRepo + tsup + Docker + ESLint + Prettier + dotenv
- **Testing**: Jest (unit), Cypress (e2e)

---

## 📁 Project Structure

```

t3-skeleton/
├── apps/
│   ├── api/                      # Express API layer
│   └── web/                      # React web frontend
│
├── packages/
│   ├── domain/                   # Domain layer: Entities, VOs, Domain Events
│   ├── application/             # Application layer: UseCases, DTOs, Ports
│   ├── interfaces/              # Interface layer: Controllers, Routes, Schemas
│   ├── infrastructure/          # Infrastructure layer: Repositories, Adapters
│   ├── services/                # Shared services like auth, mailing, etc.
│   ├── shared/                  # Utilities, types, cross-cutting concerns
│   └── config/                  # Shared tsconfig, eslint, env, etc. with (tsconfig.base.json and tsconfig.json)
│
├── .github/                     # GitHub Actions / CI
├── .env                         # (Optional) global dotenv
├── docker-compose.yml           # Local dev containers
└── tsconfig.json                # Extension of Base TypeScript configuration from config/tsconfig.base.json
````

## 🧩 Getting Started

### 1. Clone Template

```bash
npx degit thapelomagqazana/t3-skeleton your-app
cd your-app
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` files in the following locations:

#### 🛠️ Backend – `apps/api/.env`

```env
# Docker-based PostgreSQL connection (use service name `postgres` as host)
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/t3_skeleton_db

# Frontend URL for CORS
FRONTEND_URL=http://localhost:8080

# JWT Secret for signing tokens
JWT_SECRET=super_secret_jwt_key

# Port the backend will run on
PORT=5000

# Node environment
NODE_ENV=development

# Bcrypt salt rounds
BCRYPT_SALT=10
```

#### 🎨 Frontend – `apps/web/.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=T3 Skeleton Frontend
VITE_PORT=8080
```

---

## ⚙️ Scripts

| Command              | Description                           |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Run both frontend and backend locally |
| `npm run dev --workspace=apps/api` | Run only the Express backend          |
| `npm run dev --workspace=apps/api` | Run only the React frontend           |
| `npm run build`      | Build all apps and packages           |
| `npm run lint`       | Run ESLint                            |
| `npm run test:api`       | Run Jest against API tests                   |
| `npm run test:web`       | Run Jest against Web tests                   |
| `npm run format`     | Format code with Prettier             |
| `npm run db:studio`  | Open Prisma Studio                    |
| `npm run db:migrate` | Run Prisma migration                  |

---

## ✅ Testing

### End-to-End Tests

```bash
cd apps/web
npx cypress open
```

> 💡 On Ubuntu? If Cypress crashes with `SIGSEGV`, install the following:

```bash
sudo apt install -y libgtk-3-0 libnss3 libasound2t64 libxss1 \
libatk-bridge2.0-0 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
libgbm1 libpangocairo-1.0-0 libcairo2 libpango-1.0-0
```

---

## 🧼 Clean Up Build Artifacts

```bash
npx tsc --build --clean
```

> ✅ Do **not** push `.js` or `.d.ts` files to Git. They are ignored via `.gitignore`.

---

## 🧠 Philosophy

* **DDD**: Clear boundaries between domain, application, infrastructure, and interface layers.
* **Scalability**: Each package is independently composable and testable.
* **Modularity**: Add new domains or bounded contexts confidently.
* **Consistency**: Shared types and configurations reduce bugs and friction.

---

## 📄 License

MIT — free to use, modify, and build on.

---

## 👤 Maintainer

**Thapelo Magqazana**
GitHub: [@thapelomagqazana](https://github.com/thapelomagqazana)

