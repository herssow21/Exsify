# Deploy EXSIFY to Your Existing Domain

## Important: What Kind of Hosting Do You Have?

### If you have SHARED HOSTING (cPanel, Bluehost, HostGator, etc.)
**You CANNOT run Node.js apps.** Shared hosting only supports PHP (WordPress).

**Solution: Use a SUBDOMAIN + separate server**

### If you have VPS HOSTING (DigitalOcean, Linode, AWS EC2, etc.)
**You CAN run Node.js.** Deploy directly.

**Solution: Deploy to your server**

---

## Option 1: Subdomain + VPS (Recommended for Shared Hosting)

If your WordPress site is at `yourdomain.com`, deploy EXSIFY to `app.yourdomain.com`.

### Step 1: Get a VPS (Virtual Private Server)

| Provider | Price | Link |
|----------|-------|------|
| **DigitalOcean** | $4-6/month | digitalocean.com |
| **Linode** | $5/month | linode.com |
| **Vultr** | $5/month | vultr.com |
| **Hetzner** | ~$4/month | hetzner.com |

Pick the cheapest plan (1GB RAM, 1 CPU, Ubuntu 22.04 is enough).

### Step 2: Point Subdomain to VPS

In your domain registrar (where you bought the domain):
1. Go to DNS management
2. Add an A record:
   - Name: `app` (creates app.yourdomain.com)
   - Value: Your VPS IP address
3. Save and wait 5-30 minutes for DNS to propagate

### Step 3: Set Up the VPS

SSH into your server:
```bash
ssh root@YOUR_VPS_IP
```

Install Node.js 20:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify
node -v   # Should show v20.x.x
npm -v    # Should show 10.x.x

# Install PM2 (process manager)
npm install -g pm2
```

### Step 4: Upload Your Project

On your LOCAL machine, create a deploy package:
```bash
cd /mnt/agents/output/app

# Install everything
npm install

# Build for production
npm run build

# Create deployment archive (excluding node_modules)
tar -czf exsify-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='uploads/*' \
  --exclude='dist' \
  --exclude='db/migrations' \
  .
```

Upload to your server:
```bash
# From your local machine
scp exsify-deploy.tar.gz root@YOUR_VPS_IP:/var/www/
```

On the SERVER, extract and set up:
```bash
ssh root@YOUR_VPS_IP

mkdir -p /var/www/exsify
cd /var/www/exsify
tar -xzf /var/www/exsify-deploy.tar.gz
npm install
npm run build

# Create uploads directory
mkdir -p uploads
chmod 755 uploads
```

### Step 5: Start the Application

```bash
cd /var/www/exsify

# Start with PM2
pm2 start dist/boot.js --name exsify

# Save PM2 config so it restarts on reboot
pm2 save
pm2 startup systemd

# Check it's running
pm2 status
pm2 logs exsify
```

### Step 6: Set Up Nginx

```bash
apt install nginx -y
```

Create config:
```bash
nano /etc/nginx/sites-available/exsify
```

Paste this:
```nginx
server {
    listen 80;
    server_name app.yourdomain.com;
    
    # Frontend + API
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
    
    # File uploads - larger size limit
    location /api/upload {
        proxy_pass http://localhost:3000/api/upload;
        client_max_body_size 20M;
        proxy_request_buffering off;
    }
    
    # Uploaded files
    location /uploads/ {
        proxy_pass http://localhost:3000/uploads/;
        proxy_buffering off;
    }
}
```

Enable and restart:
```bash
ln -s /etc/nginx/sites-available/exsify /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 7: SSL (HTTPS)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d app.yourdomain.com
```

### Step 8: Update OAuth Callback

In the Kimi developer portal, update your callback URL to:
```
https://app.yourdomain.com/api/oauth/callback
```

### Done!

Visit `https://app.yourdomain.com` - your EXSIFY app is live.

Your WordPress site stays at `https://yourdomain.com` untouched.

---

## Option 2: Platform-as-a-Service (Easiest, No Server Management)

### Railway.app (Recommended - Simplest)

1. Push your code to GitHub
2. Go to railway.app and sign up
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your EXSIFY repo
5. Add environment variables from your `.env` file
6. Railway automatically builds and deploys
7. Add a custom domain: Project Settings → Domains → `app.yourdomain.com`
8. Point your subdomain A record to Railway's IP

**Cost:** ~$5/month (starter plan)

### Render.com (Free tier available)

1. Push code to GitHub
2. Go to render.com
3. New → Web Service → Connect your repo
4. Set:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables from `.env`
6. Deploy

**Cost:** Free (sleeps after 15 min idle, slow to wake) or $7/month

---

## Option 3: VPS Direct Deployment (You Already Have a VPS)

If you already have a VPS running your WordPress site, you can run EXSIFY on the SAME server:

### Check if your VPS can handle both:
```bash
free -h    # Check RAM (need at least 1GB total)
df -h      # Check disk space (need at least 2GB free)
```

### Deploy alongside WordPress:

Follow Steps 3-5 from Option 1 above (skip Step 1 and 2).

For nginx, instead of a separate subdomain, you can use a subpath:
```nginx
# In your existing nginx config for yourdomain.com
location /portal/ {
    proxy_pass http://localhost:3000/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

Then access at: `https://yourdomain.com/portal/`

**Warning:** This is more complex. Subdomain (Option 1) is cleaner.

---

## Option 4: WordPress + iframe (Quick Hack)

If you just want EXSIFY accessible from your WordPress site:

1. Deploy EXSIFY using Option 1 or 2 (anywhere)
2. In WordPress, create a new page called "Portal"
3. Add this HTML block:
```html
<iframe 
    src="https://app.yourdomain.com" 
    style="width:100%;height:100vh;border:none;"
    allowfullscreen>
</iframe>
```

Now `yourdomain.com/portal` shows EXSIFY inside your WordPress site.

---

## Quick Checklist

| Step | Action |
|------|--------|
| 1 | Buy a VPS ($4-5/month) OR sign up for Railway/Render |
| 2 | Point `app.yourdomain.com` to the server IP |
| 3 | SSH into server, install Node.js 20 + PM2 |
| 4 | Upload project files (`scp` or git clone) |
| 5 | Run `npm install && npm run build` |
| 6 | Run `pm2 start dist/boot.js --name exsify` |
| 7 | Install nginx, configure reverse proxy |
| 8 | Run `certbot` for SSL |
| 9 | Update OAuth callback URL in Kimi portal |
| 10 | Visit `https://app.yourdomain.com` |

---

## What Files You Need to Transfer

**Minimum files needed on the server:**
```
api/                  (backend source)
contracts/            (shared types)
db/                   (database schema)
dist/boot.js          (compiled backend)
dist/public/          (compiled frontend)
node_modules/         (dependencies)
uploads/              (empty folder for uploads)
.env                  (environment variables)
package.json          (for npm start)
drizzle.config.ts     (database config)
```

**You do NOT need:**
```
src/                  (frontend source - already compiled to dist/public/)
public/               (assets - already in dist/public/)
index.html            (build input)
.git/                 (git history)
```

---

## Troubleshooting

**"Cannot connect" after deployment:**
- Check firewall: `ufw allow 80 && ufw allow 443`
- Check PM2: `pm2 logs exsify`
- Check nginx: `nginx -t && systemctl status nginx`

**"Port 3000 already in use":**
```bash
lsof -ti:3000 | xargs kill
pm2 restart exsify
```

**"File uploads fail":**
- Check `uploads/` directory exists and is writable: `chmod 755 uploads`
- Check nginx `client_max_body_size` is set to 20M

**"Database connection error":**
- Verify `DATABASE_URL` in `.env` is correct
- The database URL in your `.env` is already configured and working
