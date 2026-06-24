# Deploy EXSIFY to cPanel (Your Main Domain)

## The Reality Check

Most cPanel hosts do NOT support Node.js - they only run PHP. EXSIFY is a Node.js app, so it needs a host that supports Node.js.

**BUT** - some modern cPanel hosts DO support Node.js through "Node.js Selector." Let's check.

---

## Step 1: Check If YOUR cPanel Supports Node.js

Log into your cPanel and look for:

| What to Look For | Where | Good Sign |
|-----------------|-------|-----------|
| **"Node.js"** icon | Main cPanel dashboard | YES - You can deploy! |
| **"Setup Node.js App"** | cPanel dashboard | YES - You can deploy! |
| **"Select PHP Version"** | Software section | MAYBE - Keep looking |
| **"CloudLinux"** | Top right corner | Good - likely has Node.js |
| Only "WordPress", "PHP" tools | Dashboard | NO - Need different hosting |

**If you see "Node.js" or "Setup Node.js App" in cPanel → Continue below**
**If you DON'T see it → Skip to "If Your cPanel Doesn't Support Node.js"**

---

## Step 2: If Your cPanel HAS Node.js Support

### 2.1 Setup Node.js in cPanel

1. Log into cPanel
2. Click **"Setup Node.js App"** (or "Node.js Selector")
3. Click **"Create Application"**
4. Fill in:
   - **Node.js version:** Select 20.x (or highest available)
   - **Application mode:** Production
   - **Application root:** `exsify` (this creates `/home/youruser/exsify/`)
   - **Application URL:** `yourdomain.com` (or subdomain)
   - **Application startup file:** `dist/boot.js`
5. Click **Create**

### 2.2 Upload Your Files

In cPanel, go to **File Manager**:

1. Navigate to `/home/youruser/exsify/` (or whatever you set as root)
2. Upload these files/folders using File Manager or FTP:

```
api/                  (backend source code)
contracts/            (shared types)
db/                   (database schema)
dist/                 (BUILT frontend + backend)
  ├── public/         (compiled HTML/CSS/JS)
  └── boot.js         (compiled server)
node_modules/         (all dependencies)
uploads/              (empty folder for file storage)
.env                  (environment variables)
package.json          (npm scripts)
drizzle.config.ts     (database config)
```

**How to get node_modules onto cPanel:**

Since `node_modules` is huge, you have two options:

**Option A - Upload everything (if cPanel has Node.js Selector):**
```bash
# On your local computer, zip the project (without dev files)
cd /mnt/agents/output/app
zip -r exsify-cpanel.zip \
  api/ contracts/ db/ dist/ node_modules/ uploads/ \
  .env package.json package-lock.json drizzle.config.ts \
  tsconfig.json tsconfig.server.json vite.config.ts
```
Upload `exsify-cpanel.zip` via cPanel File Manager, then extract.

**Option B - Install on server (preferred if you have SSH):**
Upload only source files (no node_modules), then:
```bash
# SSH into your cPanel account (if available)
cd /home/youruser/exsify
npm install
npm run build
```

### 2.3 Set Environment Variables

In cPanel Node.js Selector:
1. Find your app, click **"Edit"**
2. Add environment variables from your `.env` file:
   ```
   NODE_ENV=production
   DATABASE_URL=mysql://...
   APP_ID=19dcaf6b-...
   APP_SECRET=...
   KIMI_AUTH_URL=https://auth.kimi.com
   KIMI_OPEN_URL=https://open.kimi.com
   OWNER_UNION_ID=...
   ```
3. Click **Save**

### 2.4 Start the App

In cPanel Node.js Selector:
1. Click **"Restart"** next to your app
2. Visit `yourdomain.com` - it should work!

---

## If Your cPanel Does NOT Support Node.js

You have 3 affordable options:

### Option A: Upgrade Your Hosting (Best Long-term)

Switch to a host that supports Node.js natively:

| Host | Price | Node.js | Link |
|------|-------|---------|------|
| **Hostinger VPS** | $5/month | Yes | hostinger.com/vps-hosting |
| **DigitalOcean** | $6/month | Yes | digitalocean.com |
| **Namecheap EasyWP** | $7/month | No (WordPress only) |
| **A2 Hosting** | $12/month | Yes (Turbo plans) | a2hosting.com |
| **DreamHost VPS** | $13/month | Yes | dreamhost.com |

**Recommended:** Hostinger VPS ($5/month) - they have a user-friendly control panel, and you can still use your existing domain.

### Option B: Keep cPanel for Domain, Use External for App

Keep your current cPanel hosting for email/domain management, but point your domain to an external Node.js host:

1. Sign up for **Railway.app** (~$5/month) or **Render.com** (free tier)
2. Deploy EXSIFY there (they handle everything)
3. In cPanel, go to **DNS Zone Editor**
4. Change your main A record to point to Railway/Render's IP
5. Your domain now serves EXSIFY instead of WordPress

### Option C: Cheapest - Use Render.com Free Tier

1. Push your code to GitHub
2. Sign up at **render.com** (free)
3. New → Web Service → Connect your GitHub repo
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add environment variables from `.env`
7. Render gives you a URL like `exsify.onrender.com`
8. In cPanel DNS, create a CNAME record:
   - Name: `@` (root domain) or `www`
   - Value: `exsify.onrender.com`
9. Wait 5 minutes, visit your domain

**Free tier downside:** App sleeps after 15 min of inactivity, takes ~30 seconds to wake up. Paid tier ($7/month) fixes this.

---

## Option D: VPS + Your Domain (Full Control, $5-6/month)

This gives you the most control. Your domain points directly to a VPS you manage.

### 1. Buy VPS
- **Hostinger:** VPS 1 plan ($5.99/month)
- **DigitalOcean:** Basic Droplet ($6/month)
- **Vultr:** Cloud Compute ($5/month)

### 2. Point Your Domain to VPS
In cPanel (or your domain registrar):
1. Go to **DNS Zone Editor**
2. Find the A record for `@` (root)
3. Change the value to your VPS IP address
4. Also update `www` A record if it exists

### 3. Set Up VPS
SSH into your server and run:

```bash
# 1. Update system
apt update && apt upgrade -y

# 2. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install nginx and certbot
apt install -y nginx certbot python3-certbot-nginx

# 4. Install PM2
npm install -g pm2

# 5. Create app directory
mkdir -p /var/www/exsify
cd /var/www/exsify

# 6. Upload your files here (via SCP or FTP)
# Files needed: api/, contracts/, db/, dist/, node_modules/, uploads/, .env, package.json, drizzle.config.ts

# 7. If uploading source only (without node_modules), run:
npm install
npm run build

# 8. Create uploads directory
mkdir -p uploads
chmod 755 uploads

# 9. Start with PM2
pm2 start dist/boot.js --name exsify
pm2 save
pm2 startup systemd

# 10. Configure nginx
cat > /etc/nginx/sites-available/exsify << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

    location /api/upload {
        proxy_pass http://localhost:3000/api/upload;
        client_max_body_size 20M;
        proxy_request_buffering off;
    }

    location /uploads/ {
        proxy_pass http://localhost:3000/uploads/;
        proxy_buffering off;
    }
}
EOF

ln -s /etc/nginx/sites-available/exsify /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# 11. SSL
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Done! Visit https://yourdomain.com
```

---

## My Recommendation for Your Situation

Since you have cPanel and want EXSIFY as your MAIN domain app:

**If your cPanel has Node.js Selector:** Use the cPanel method (Section 2 above)

**If your cPanel does NOT have Node.js:** 
1. Sign up for **Hostinger VPS** ($5.99/month) 
2. Point your domain's A record to the VPS IP
3. Follow the VPS setup commands above
4. Cancel or downgrade your cPanel hosting (keep it for email if needed)

**If budget is tight:**
1. Use **Render.com free tier** 
2. In cPanel DNS, point your domain to Render
3. Upgrade to paid ($7/month) later when ready

---

## What Happens to Your cPanel Hosting?

| Approach | cPanel Role | Cost |
|----------|------------|------|
| cPanel has Node.js | Everything stays, app runs in cPanel | Current cost |
| VPS + point domain | Cancel cPanel or keep for email only | $5 VPS + current cPanel |
| Render + point domain | Keep cPanel for email, domain DNS only | $7 Render + current cPanel |
| Full switch to VPS | Cancel cPanel entirely | $5 VPS only |
