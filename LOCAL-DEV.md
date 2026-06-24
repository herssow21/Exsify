# Run EXSIFY Locally - Exact Steps

## The Directory

ALL commands are run from this folder:

```
/mnt/agents/output/app/
```

This is the project root. It contains `package.json`, `src/`, `api/`, `db/`, etc.

---

## Quick Start (One Command)

Open your terminal and run:

```bash
cd /mnt/agents/output/app
npm run dev
```

Wait for this output:
```
Server running on http://localhost:3000/
```

Then open your browser to:
```
http://localhost:3000
```

That's it. Both frontend AND backend run on port 3000.

---

## What Happens When You Run `npm run dev`

The `npm run dev` command starts TWO things at once:

1. **Backend server** (Hono + tRPC) on port 3000
   - Handles `/api/upload` (file uploads)
   - Handles `/api/trpc/*` (database API)
   - Handles `/api/oauth/callback` (login)
   - Serves uploaded files at `/uploads/*`

2. **Frontend dev server** (Vite) also on port 3000
   - Serves your React app
   - Auto-reloads when you change files
   - Hot Module Replacement (changes appear instantly)

Both share the same port because the backend proxies frontend requests to Vite.

---

## Available Local URLs

| URL | What it shows |
|-----|---------------|
| `http://localhost:3000` | Your EXSIFY app (frontend) |
| `http://localhost:3000/admin` | Admin dashboard |
| `http://localhost:3000/auth?mode=login` | Login page |
| `http://localhost:3000/api/upload` | File upload endpoint (POST) |
| `http://localhost:3000/uploads/filename.jpg` | View uploaded file |

---

## Test File Uploads Locally

With the dev server running (`npm run dev`):

1. Open `http://localhost:3000`
2. Login as admin: `admin@exsify.com` / `Admin123!`
3. Go to Admin Dashboard
4. Click **"Media"** in the sidebar
5. Click **"Upload File"** and select an image
6. You'll see it appear in the grid - file saved to `uploads/` folder
7. Go to **"Apps"** → **"Add App"**
8. Use the **"Upload"** tab on Icon, Screenshots, or Package fields
9. The URL auto-saves to the form

---

## Test the API Directly

You can also test the backend API with curl:

```bash
# Test if server is running
curl http://localhost:3000/api/trpc/ping

# List all apps
curl http://localhost:3000/api/trpc/apps.list

# List all reviews
curl http://localhost:3000/api/trpc/review.list

# List all uploads
curl http://localhost:3000/api/trpc/upload.list
```

---

## Local Files Location

| What | Where it is |
|------|-------------|
| Source code (frontend) | `/mnt/agents/output/app/src/` |
| Source code (backend) | `/mnt/agents/output/app/api/` |
| Database schema | `/mnt/agents/output/app/db/schema.ts` |
| Environment secrets | `/mnt/agents/output/app/.env` |
| Uploaded files | `/mnt/agents/output/app/uploads/` |
| Built frontend | `/mnt/agents/output/app/dist/public/` |
| Built backend | `/mnt/agents/output/app/dist/boot.js` |
| Dependencies | `/mnt/agents/output/app/node_modules/` |

---

## All Available Commands

Run these from `/mnt/agents/output/app/`:

```bash
# Development (starts both frontend + backend)
npm run dev

# Build for production (creates dist/ folder)
npm run build

# Start production server (runs dist/boot.js)
npm start

# Check TypeScript errors
npm run check

# Sync database schema (development)
npm run db:push

# Generate database migration
npm run db:generate

# Apply database migration
npm run db:migrate
```

---

## Stopping the Server

Press `Ctrl + C` in the terminal to stop.

If something is still using port 3000:
```bash
# Find what's using port 3000
lsof -ti:3000

# Kill it
lsof -ti:3000 | xargs kill -9
```

---

## Troubleshooting

**"npm run dev" gives error:**
```bash
# Make sure you're in the right directory
pwd
# Should show: /mnt/agents/output/app

# Make sure node_modules exists
ls node_modules/.package-lock.json 2>/dev/null || npm install

# Then try again
npm run dev
```

**"Port 3000 already in use":**
```bash
# Kill whatever is on port 3000
lsof -ti:3000 | xargs kill -9

# Then start again
npm run dev
```

**"Cannot find module" errors:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run build
npm run dev
```

---

## Summary

| You Want To... | Run This | From Where |
|----------------|----------|------------|
| Start developing | `npm run dev` | `/mnt/agents/output/app/` |
| Build for production | `npm run build` | `/mnt/agents/output/app/` |
| Start production server | `npm start` | `/mnt/agents/output/app/` |
| View the app | Browser → `http://localhost:3000` | - |
| Stop everything | `Ctrl + C` | Terminal where you ran dev |
