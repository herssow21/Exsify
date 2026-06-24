# EXSIFY - Local Development & Deployment Guide

## Part 1: Running Locally (Fullstack - Frontend + Backend)

### Prerequisites
- Node.js 20+ (`node -v` to check)
- The project files in `/mnt/agents/output/app/`

### Step 1: Install Dependencies

```bash
cd /mnt/agents/output/app
npm install
```

### Step 2: Database (Already Configured)

The database is already set up and working. The `.env` file contains a working MySQL connection string. You do NOT need to install MySQL locally - it connects to a cloud database.

To verify the database connection:
```bash
npm run db:push
```

### Step 3: Start Development Server

```bash
npm run dev
```

This starts **both** frontend and backend on:
- **App URL**: http://localhost:3000
- **API endpoint**: http://localhost:3000/api/trpc
- **File uploads**: http://localhost:3000/api/upload
- **OAuth callback**: http://localhost:3000/api/oauth/callback

The server handles everything - frontend files, API routes, and file uploads.

### Step 4: Test File Uploads (with backend running)

1. Open http://localhost:3000
2. Log in as admin (admin@exsify.com / Admin123!)
3. Go to Admin Dashboard → Media
4. Upload a file - it will save to the `uploads/` folder and show in the grid
5. Go to Admin Dashboard → Apps → Add App
6. Use the "Upload" tab to upload an icon, screenshots, or package
7. The URL is automatically saved to the form
8. Save the app - the file URL is persisted

### Step 5: Build for Production

```bash
npm run build
```

This creates:
- `dist/boot.js` - The backend server
- `dist/public/` - Frontend static files

### Step 6: Start Production Server

```bash
npm start
```

Runs on port 3000. Use a process manager like PM2 to keep it running:

```bash
npm install -g pm2
pm2 start dist/boot.js --name exsify
pm2 save
pm2 startup
```

---

## Part 2: Why Static Deployment Doesn't Support Uploads

The preview URL (https://ueojlo3z4zv4y.kimi.page) is a **static deployment** - it only serves the frontend HTML/CSS/JS files. It does NOT run the Node.js backend.

**What works on static deployment:**
- All frontend pages, navigation, animations
- Login/logout with localStorage
- Admin dashboard UI
- Theme color changes
- CRUD operations using localStorage

**What DOESN'T work on static deployment:**
- File uploads (no `/api/upload` endpoint)
- OAuth login (no `/api/oauth/callback` endpoint)
- Database operations via tRPC (no `/api/trpc` endpoint)

**The solution:** The FileUpload component now has two tabs:
- **"Upload"** - Works when the backend server is running (localhost or your domain)
- **"URL"** - Always works. Paste a direct link to any file (CDN, Imgur, Dropbox, etc.)

---

## Part 3: Deploying to Your WordPress Domain

### Important: This is NOT a WordPress Plugin

EXSIFY is a **standalone fullstack application** (React frontend + Node.js backend + MySQL database). It cannot be installed as a WordPress plugin or theme.

### Option A: Deploy to a Subdomain (Recommended)

If your WordPress site runs on `yourdomain.com`, deploy EXSIFY to a subdomain:

```
WordPress site: https://yourdomain.com
EXSIFY app:     https://app.yourdomain.com  (or portal.yourdomain.com)
```

**Requirements for your hosting:**
- Node.js 20+ support (check with your host)
- Or a VPS/cloud server (DigitalOcean, Linode, AWS, etc.)

**Step-by-step:**

1. **Get a server with Node.js support**
   - VPS: DigitalOcean Droplet, Linode, Vultr (cheapest options, ~$5/month)
   - Or use your existing host if they support Node.js

2. **Upload project files to the server**
   ```bash
   # On your local machine, create a zip
   cd /mnt/agents/output/app
   zip -r exsify-deploy.zip . -x "node_modules/*" ".git/*"
   
   # Upload to server and extract
   scp exsify-deploy.zip root@your-server-ip:/var/www/
   ssh root@your-server-ip
   cd /var/www && unzip exsify-deploy.zip
   ```

3. **Install and build on the server**
   ```bash
   cd /var/www/exsify
   npm install
   npm run build
   ```

4. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start dist/boot.js --name exsify
   pm2 save
   pm2 startup
   ```

5. **Set up nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name app.yourdomain.com;
       
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
           proxy_read_timeout 86400;
       }
       
       # File uploads - larger timeout
       location /uploads/ {
           proxy_pass http://localhost:3000/uploads/;
           proxy_buffering off;
           client_max_body_size 20M;
       }
       
       # API - larger body size for uploads
       location /api/upload {
           proxy_pass http://localhost:3000/api/upload;
           client_max_body_size 20M;
       }
   }
   ```

6. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d app.yourdomain.com
   ```

7. **Update OAuth callback URL**
   - Go to Kimi developer portal
   - Set callback URL to: `https://app.yourdomain.com/api/oauth/callback`

8. **Update .env if needed**
   ```env
   # Only change if domain changes
   # The database URL, APP_ID, APP_SECRET stay the same
   ```

### Option B: Deploy to a Separate Server

If your WordPress hosting doesn't support Node.js (most shared hosting doesn't):

**Free/Cheap Options:**
- **Railway.app** - Deploy from GitHub, ~$5/month
- **Render.com** - Free tier available (slows down when idle)
- **Fly.io** - Generous free tier
- **Vercel (frontend only)** + **Railway (backend)** - Split deployment

**For Railway:**
1. Push code to GitHub
2. Connect Railway to your repo
3. Set environment variables from `.env`
4. Deploy automatically

### Option C: WordPress Integration (iframe embed)

If you MUST keep everything on your WordPress domain:

1. Deploy EXSIFY to any server/subdomain (Option A or B)
2. Create a WordPress page: `yourdomain.com/portal`
3. Add an iframe to embed EXSIFY:
   ```html
   <iframe src="https://app.yourdomain.com" 
           style="width:100%;height:100vh;border:none;">
   </iframe>
   ```

This keeps your WordPress site intact while embedding the app.

---

## Part 4: Quick Reference Commands

```bash
# Local development
npm run dev              # Start dev server (port 3000)

# Production
npm run build            # Build frontend + backend
npm start                # Start production server

# Database
npm run db:push          # Sync schema (development only)
npm run db:generate      # Generate migration files
npm run db:migrate       # Apply migrations (production)

# Process management
pm2 start dist/boot.js --name exsify
pm2 restart exsify
pm2 stop exsify
pm2 logs exsify
pm2 monit

# Type checking
npm run check            # Check TypeScript errors
```

---

## Part 5: File Upload Behavior

| Scenario | Upload Tab | URL Tab |
|----------|-----------|---------|
| Backend running (localhost) | Works - saves to `uploads/` | Works - saves any URL |
| Static deployment (preview) | Shows error + suggests URL mode | Works - saves any URL |
| Your domain (with server) | Works - saves to server | Works - saves any URL |

**Best practice for production:**
- Use the **Upload** tab for files you want hosted on your server
- Use the **URL** tab for files hosted elsewhere (CDN, cloud storage)
- Uploaded files are stored in the `uploads/` directory on your server
- The Media Library in admin shows all uploaded files with copy URL buttons
