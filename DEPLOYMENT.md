# EXSIFY Softwares - Deployment Guide

## What's Already Done

- Database schema pushed to MySQL (apps, users, reviews, consultations, news, uploads tables)
- All tRPC API routers created (auth, localAuth, apps, reviews, consultations, news, upload)
- File upload system working (saves to `uploads/` directory, serves via `/uploads/*`)
- Media Manager in admin dashboard for file management
- Add/Edit app forms support file uploads for icons, screenshots, and download packages

---

## Deployment Steps

### 1. Server Requirements

- **Node.js 20+** (check: `node -v`)
- **MySQL database** (already provided and configured)
- **VPS/Cloud server** with at least 1GB RAM
- **Domain name** with DNS access

### 2. Build for Production

```bash
cd /mnt/agents/output/app
npm run build
```

This creates:
- `dist/boot.js` - Backend server
- `dist/public/` - Frontend static files

### 3. Environment Variables (Already Configured)

The `.env` file is pre-configured with working credentials:

```env
# Database (MySQL - already working)
DATABASE_URL=mysql://...

# OAuth (Kimi - already configured)
APP_ID=19dcaf6b-...
APP_SECRET=...
KIMI_AUTH_URL=https://auth.kimi.com

# Server (optional override)
PORT=3000
NODE_ENV=production
```

**Do NOT modify these values** - they are pre-configured and working.

### 4. Start Production Server

```bash
npm start
```

Server runs on port 3000. This serves both the API and the frontend.

### 5. Domain Setup (nginx reverse proxy)

Install nginx and create a config file:

```bash
sudo nano /etc/nginx/sites-available/exsify
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads (serve directly, no proxy buffering)
    location /uploads/ {
        proxy_pass http://localhost:3000/uploads/;
        proxy_buffering off;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/exsify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL/HTTPS (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 7. OAuth Callback URL

In the Kimi developer portal, set the OAuth callback URL to:
```
https://your-domain.com/api/oauth/callback
```

### 8. Process Manager (PM2) - Keep Server Running

```bash
npm install -g pm2
pm2 start dist/boot.js --name exsify
pm2 save
pm2 startup
```

### 9. Database Migrations (For Future Updates)

When you update the schema in the future:
```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

**Do NOT** use `db:push` in production - it can drop data.

### 10. File Uploads / Persistent Storage

Uploaded files are stored in the `uploads/` directory at the project root.

**Important for production:**
- Ensure the `uploads/` directory is on persistent storage (not ephemeral)
- On some cloud platforms, use a mounted volume or S3-compatible storage
- The directory is created automatically on first upload
- Files are served via `/uploads/filename` endpoint

---

## Quick Deployment Checklist

- [ ] Transfer project files to server (or clone from git)
- [ ] Run `npm install` on the server
- [ ] Run `npm run build`
- [ ] Verify `.env` is present with correct values
- [ ] Run `npm start` or use PM2
- [ ] Set up nginx reverse proxy
- [ ] Configure SSL with certbot
- [ ] Update OAuth callback URL in Kimi portal
- [ ] Test all features (login, file upload, admin)

## Running Locally (Development)

```bash
cd /mnt/agents/output/app
npm run dev
```

This starts both frontend (Vite HMR) and backend (tRPC API) on port 3000.

Visit: http://localhost:3000

## Troubleshooting

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill
```

**Database connection errors:**
- Check `DATABASE_URL` in `.env`
- Ensure MySQL is accessible from the server
- Run `npm run db:push` to sync schema

**File uploads not working:**
- Ensure `uploads/` directory exists and is writable
- Check server has enough disk space
- Max file size is 20MB (configurable in `api/boot.ts`)

**OAuth login fails:**
- Verify callback URL matches exactly in Kimi portal
- Ensure `APP_ID` and `APP_SECRET` are correct
- Check that the domain uses HTTPS
