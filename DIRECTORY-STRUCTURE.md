# EXSIFY Project Structure

## How It's Organized

The project uses a "monorepo" pattern - frontend and backend are in **separate folders** but share one build system. Here's the breakdown:

```
/mnt/agents/output/app/          <-- Project root (shared config)
|
|-- src/                         <-- FRONTEND (React UI - ALL your pages, components, styles)
|   |-- App.tsx                  Main router
|   |-- pages/                   Home, Services, Admin, etc.
|   |-- components/              Buttons, modals, forms, etc.
|   |-- context/                 Auth, Theme, Settings, Toast
|   |-- hooks/                   Custom data hooks
|   |-- types/                   TypeScript types
|   |-- index.css                Global styles + theme variables
|   |-- main.tsx                 Entry point
|
|-- api/                         <-- BACKEND (Node.js server - NEVER touches frontend code)
|   |-- boot.ts                  Server startup (Hono framework)
|   |-- router.ts                All API routes registration
|   |-- app-router.ts            Apps CRUD API
|   |-- review-router.ts         Reviews CRUD API
|   |-- consultation-router.ts   Consultations API
|   |-- news-router.ts           News API
|   |-- local-auth-router.ts     Email/password auth API
|   |-- upload-router.ts         File management API
|   |-- middleware.ts            Auth guards (admin/user)
|   |-- context.ts               Request context builder
|   |-- queries/                 Database connection
|   |-- lib/                     Server utilities
|   |-- kimi/                    OAuth SDK
|
|-- db/                          <-- DATABASE (Drizzle ORM schema)
|   |-- schema.ts                All table definitions
|   |-- relations.ts             Table relationships
|   |-- migrations/              Schema change history
|
|-- contracts/                   <-- SHARED (types used by both frontend + backend)
|   |-- constants.ts
|   |-- types.ts
|   |-- errors.ts
|
|-- dist/                        <-- BUILT FILES (generated after `npm run build`)
|   |-- public/                  Compiled frontend (HTML, CSS, JS)
|   |   |-- index.html
|   |   |-- assets/
|   |-- boot.js                  Compiled backend server
|
|-- uploads/                     <-- Uploaded files (images, installers, etc.)
|
|-- .env                         Secrets (database URL, OAuth keys)
|-- package.json                 Dependencies for BOTH frontend + backend
|-- vite.config.ts               Frontend build config
|-- tsconfig.json                TypeScript config
```

## Why This Structure?

**Frontend** (`src/`) = Everything the user sees and interacts with in the browser.
- Built by Vite into static HTML/CSS/JS in `dist/public/`
- Deployed to any static host (or served by the backend)

**Backend** (`api/`) = The server that handles:
- File uploads (`/api/upload`)
- Database queries (tRPC routers)
- User authentication (OAuth + email/password)
- Admin permission checks
- Serves uploaded files (`/uploads/*`)
- Serves the frontend in production

**Database** (`db/`) = Schema definitions that both sides use.

**Contracts** (`contracts/`) = Shared types so frontend and backend stay in sync.

## What Gets Deployed Where

When you run `npm run build`:

1. Vite compiles `src/` (frontend) → `dist/public/` (static files)
2. TypeScript compiles `api/` + `db/` (backend) → `dist/boot.js` (Node.js server)

The backend (`dist/boot.js`):
- Runs the API at `/api/*` and `/api/trpc/*`
- Serves uploaded files at `/uploads/*`
- Serves the frontend at `/` (everything else)

So you only need to run ONE process (`node dist/boot.js`) and it handles both frontend and backend.
