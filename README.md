# T3 Skeleton — Full Stack Starter Template

A modern full-stack starter template using:

- **Node.js + Express + Prisma** (Backend)
- **Vite + TypeScript + React** (Frontend)
- **PostgreSQL** (Database)
- **Docker Compose** (Dev Environment)
- **JWT Auth** Ready

---

## Project Structure

```md
t3-skeleton/
│
├── frontend/        # React + Vite frontend
├── backend/         # Express + Prisma backend
└── docker-compose.yml
````

---

## Getting Started (Local Dev with Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/thapelomagqazana/t3-skeleton.git
cd t3-skeleton
```

---

### 2. Set Up Environment Variables

Create `.env` files in `backend/` and `frontend/`:

#### `backend/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/t3_skeleton
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=development
```

#### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=T3 Skeleton Frontend
VITE_PORT=8080
```

---

### 3. Run the Project

```bash
docker-compose up --build
```

This will:

* Start **PostgreSQL**, **backend**, and **frontend** containers
* Use **volume mounts** for live-reload
* Open the frontend at [http://localhost:8080](http://localhost:8080)

---

### 4. Initialize the Database (Only Once)

In a separate terminal:

```bash
docker-compose exec backend npx prisma migrate dev --name init
```

---

### 5. Access URLs

| Service     | URL                                                          |
| ----------- | ------------------------------------------------------------ |
| Frontend    | [http://localhost:8080](http://localhost:8080)               |
| Backend API | [http://localhost:5000/api/v1](http://localhost:5000/api/v1) |
| Database    | `localhost:5434` (outside Docker)                            |

---

## Run Tests (Backend)

```bash
docker-compose exec backend npm run test
```

---

## Available Scripts

### Backend

```bash
npm run dev      # Start backend with Nodemon
npm run build    # Build backend
npm run test     # Run tests
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production bundle
```

---

## API Endpoints

### Auth Routes

| Method | Endpoint   | Description              | Auth Required |
| ------ | ---------- | ------------------------ | ------------- |
| POST   | `/api/v1/auth/signup`  | Register a new user      | ❌ No          |
| POST   | `/api/v1/auth/signin`  | Sign in an existing user | ❌ No          |
| POST   | `/api/v1/auth/signout` | Sign out a user          | ✅ Yes         |

---

### User Routes (Protected)

| Method | Endpoint            | Description       | Auth Required |
| ------ | ------------------- | ----------------- | ------------- |
| GET    | `/api/v1/users`     | Get all users     | ✅ Yes         |
| GET    | `/api/v1/users/:id` | Get user by ID    | ✅ Yes         |
| PUT    | `/api/v1/users/:id` | Update user by ID | ✅ Yes         |
| DELETE | `/api/v1/users/:id` | Delete user by ID | ✅ Yes         |

> All protected routes use **JWT Bearer Auth** in the Authorization header.

---

## Docker Overview

* Uses **bind mounts** for live reload (frontend & backend)
* Prisma and PostgreSQL preconfigured
* Easily swappable for **Render**, **Fly.io**, or **Railway** deployment

---

## Notes

* Ensure Docker is running
* Avoid port conflicts (5000 = API, 5434 = DB, 8080 = frontend)
* `.env` secrets **must not** be committed

---

## Future Plans

* CI/CD via GitHub Actions
* Optional Redis for caching
* Deploy-ready Dockerfiles for Fly.io / Render / Railway

---

## Author

Built by [Thapelo Magqazana](https://www.linkedin.com/in/thapelo-magqazana-90632a174)

---

## License

MIT



