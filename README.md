# HivePulse CRM

TypeScript monorepo foundation for a CRM product. Includes a React frontend, Express API, shared types, Docker Compose, and environment-driven configuration—no business features yet.

## Tech stack

| Layer    | Stack                          |
| -------- | ------------------------------ |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend  | Node.js, Express 5, TypeScript, Mongoose |
| Shared   | `@hivepulse/shared`            |
| Tooling  | ESLint 9 (flat config), Prettier |

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or via Docker Compose)

## Setup

```bash
npm install
cp .env.example .env
```

Set every variable in `.env` (no defaults for URLs, ports, or secrets). Example for local development:

```env
MONGO_URI=mongodb://127.0.0.1:27017/hivepulse
MONGO_PORT=27017
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://127.0.0.1:5173
API_PREFIX=/api
VITE_API_URL=http://127.0.0.1:4000/api
VITE_API_BASE_PATH=/api
VITE_DEV_PROXY_TARGET=http://127.0.0.1:4000
FRONTEND_PORT=5173
```

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start API and frontend concurrently  |
| `npm run build`    | Build shared, backend, and frontend  |
| `npm run lint`     | Lint all workspaces                  |
| `npm run format`   | Format with Prettier                 |
| `npm run typecheck`| Typecheck without emitting           |

## Docker

```bash
docker compose --env-file .env up --build
```

All services read from `.env` via `env_file` and variable substitution.

## Project structure

```
hivepulse-crm/
├── backend/
│   └── src/
│       ├── config/          # env, database
│       ├── middleware/      # errors, validation
│       ├── modules/         # feature modules (health starter)
│       ├── routes/          # route registration
│       └── utils/           # API helpers
├── frontend/
│   └── src/
│       ├── components/layout/
│       ├── lib/             # env, api client
│       ├── pages/
│       └── routes/
├── packages/shared/         # shared types & constants
├── docker-compose.yml
├── eslint.config.mjs        # shared ESLint base
└── tsconfig.base.json
```

## Extending

**Backend:** add a module under `backend/src/modules/<name>/`, export routes, register in `backend/src/routes/index.ts`.

**Frontend:** add pages under `frontend/src/pages/`, register routes in `frontend/src/routes/index.tsx`.

**Shared:** add types and constants to `packages/shared/src/`, run `npm run build -w @hivepulse/shared`.

## License

MIT
