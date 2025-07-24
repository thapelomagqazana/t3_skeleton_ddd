# 🧱 T3 Skeleton — DDD Full Stack Starter Template

A modern, scalable full-stack starter built using **Domain-Driven Design (DDD)** principles, designed to help you launch TypeScript-based applications with **clear separation of concerns** and **long-term maintainability**.

---

## 🚀 Tech Stack

* **Frontend**: React + Vite + TypeScript + Tailwind CSS
* **Backend**: Node.js + Express + TypeScript
* **Database**: PostgreSQL + Prisma
* **Tooling**: Docker + ESLint + Prettier + dotenv
* **Testing**: Jest (unit), Cypress (e2e)

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
│   └── config/                  # Shared tsconfig, eslint, env, etc.
│
├── .github/                     # GitHub Actions / CI
├── .env                         # (Optional) global dotenv
├── docker-compose.yml           # Local dev containers
└── tsconfig.json                # Extends packages/config/tsconfig.base.json
```

---

## 🧩 Getting Started

### 1. Clone Template

```bash
npx degit thapelomagqazana/t3_skeleton_ddd your-app
cd your-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

#### 🛠️ Backend – `apps/api/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/t3_skeleton_db
FRONTEND_URL=http://localhost:8080
JWT_SECRET=super_secret_jwt_key
PORT=5000
NODE_ENV=development
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

| Command                            | Description                           |
| ---------------------------------- | ------------------------------------- |
| `npm run dev`                      | Run both frontend and backend locally |
| `npm run dev --workspace=apps/api` | Run only the Express backend          |
| `npm run dev --workspace=apps/web` | Run only the React frontend           |
| `npm run build`                    | Build all apps and packages           |
| `npm run lint`                     | Run ESLint                            |
| `npm run test:api`                 | Run Jest for API tests                |
| `npm run test:web`                 | Run Jest for frontend tests           |
| `npm run format`                   | Format code using Prettier            |
| `npm run db:studio`                | Launch Prisma Studio                  |
| `npm run db:migrate`               | Run Prisma migrations                 |

---

## ✅ Testing

### End-to-End Tests (Cypress)

```bash
cd apps/web
npx cypress open
```

**💡 Ubuntu Fix:** If Cypress crashes with SIGSEGV:

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

**Note**: `.js` and `.d.ts` files are ignored via `.gitignore`.

---

## 🔐 API Endpoints

### 🔑 Auth Routes

| Method | Endpoint               | Description              | Auth Required |
| ------ | ---------------------- | ------------------------ | ------------- |
| POST   | `/api/v1/auth/signup`  | Register a new user      | ❌ No          |
| POST   | `/api/v1/auth/signin`  | Sign in an existing user | ❌ No          |
| POST   | `/api/v1/auth/signout` | Sign out a user          | ✅ Yes         |

### 👤 User Routes (Protected)

| Method | Endpoint            | Description       | Auth Required |
| ------ | ------------------- | ----------------- | ------------- |
| GET    | `/api/v1/users`     | Get all users     | ✅ Yes         |
| GET    | `/api/v1/users/:id` | Get user by ID    | ✅ Yes         |
| PUT    | `/api/v1/users/:id` | Update user by ID | ✅ Yes         |
| DELETE | `/api/v1/users/:id` | Delete user by ID | ✅ Yes         |

---

## 🧠 Philosophy

* **DDD**: Clear separation between `domain`, `application`, `infrastructure`, and `interface` layers
* **Scalability**: Each package is modular and testable
* **Modularity**: Add bounded contexts with confidence
* **Consistency**: Shared types and configurations reduce bugs

---

## 📄 License

**MIT** — free to use, modify, and build on.

---

## 👤 Maintainer

**Thapelo Magqazana**
GitHub: [@thapelomagqazana](https://github.com/thapelomagqazana)


