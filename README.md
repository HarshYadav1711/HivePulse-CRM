# HivePulse CRM

Internal sales lead management platform for sales teams. Built with a TypeScript monorepo, Express API, React dashboard, and MongoDB.

## Features

- JWT authentication (register, login, protected routes, bcrypt hashing)
- Role-based access: **Admin** and **Sales User** (only admins can delete leads)
- Lead CRUD with status (`New`, `Contacted`, `Qualified`, `Lost`) and source (`Website`, `Instagram`, `Referral`)
- Combined server-side filtering: status, source, name/email search, sort (latest/oldest)
- Pagination (10 per page) with response metadata
- Debounced search on the dashboard
- CSV export respecting active filters
- Responsive UI with loading skeletons, empty states, validation, and dark mode

## Tech stack

| Layer    | Stack                                      |
| -------- | ------------------------------------------ |
| Frontend | React 19, TypeScript, TailwindCSS, Vite  |
| Backend  | Node.js, Express 5, TypeScript, Mongoose   |
| Database | MongoDB                                    |
| Shared   | `@hivepulse/shared` types & validation     |

## Quick start (local)

### Prerequisites

- Node.js 20+
- MongoDB running locally (or use Docker for Mongo only)

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` if needed. Default API: `http://localhost:4000`, frontend: `http://localhost:5173`.

### 3. Seed sample data (optional)

```bash
npm run seed -w backend
```

Demo accounts:

| Role  | Email                 | Password    |
| ----- | --------------------- | ----------- |
| Admin | admin@hivepulse.io    | Admin123!   |
| Sales | sales@hivepulse.io    | Sales123!   |

### 4. Run development

```bash
npm run dev
```

- API: http://localhost:4000/api/health
- App: http://localhost:5173

## Docker

Run the full stack:

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api

Set `JWT_SECRET` in your environment before production use.

## Project structure

```
├── backend/           # Express API
│   └── src/modules/   # auth, leads
├── frontend/          # React dashboard
├── packages/shared/   # shared types & constants
├── docker-compose.yml
└── .env.example
```

## API overview

Base URL: `/api`

| Method | Endpoint           | Auth | Description              |
| ------ | ------------------ | ---- | ------------------------ |
| POST   | `/auth/register`   | —    | Create account           |
| POST   | `/auth/login`      | —    | Sign in                  |
| GET    | `/auth/me`         | ✓    | Current user             |
| GET    | `/leads`           | ✓    | List (filter/paginate)   |
| GET    | `/leads/export`    | ✓    | CSV export               |
| GET    | `/leads/:id`       | ✓    | Get one lead             |
| POST   | `/leads`           | ✓    | Create lead              |
| PATCH  | `/leads/:id`       | ✓    | Update lead              |
| DELETE | `/leads/:id`       | Admin| Delete lead              |

Query params for `GET /leads` and export: `page`, `limit` (default 10), `status`, `source`, `search`, `sort` (`latest` | `oldest`).

See [docs/API.md](docs/API.md) for request/response examples.

## Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start API + frontend           |
| `npm run build`      | Build all workspaces           |
| `npm run seed -w backend` | Seed database           |
| `npm run lint`       | Lint backend and frontend      |

## License

MIT
