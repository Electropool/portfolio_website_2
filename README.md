# ⚡ Electropool Portfolio — Arpan Kar

> Personal portfolio website with integrated visitor tracking and admin dashboard.
> Live at: **https://electropool.online**

---

## 🔐 Admin Panel

Access the admin panel at:
- `https://electropool.online/admin`
- `https://electropool.online/login`

The admin dashboard shows:
- Visitor IP address
- City, State, Country (auto-detected via geolocation)
- Device type (Desktop / Mobile / Tablet)
- Browser name and version
- Operating System
- Date and Time in **IST (Indian Standard Time)**

> ⚠️ **Note:** Visitor tracking only works in production (live server). It will NOT track on `localhost` because the backend API (`/api/track`) is only available when running `node server.js`, not during `npm run dev`.

---

## 💻 1. Run on Localhost (Development)

### Install dependencies

```bash
npm install
```

### Start dev server

```bash
npm run dev
```

Access at: **http://localhost:5173**

> 🔴 **Admin panel & visitor tracking will NOT work in dev mode.** These require the backend (`node server.js`) and a built `dist/` folder.

---

## 🏗️ 2. Build for Production

Run this whenever you update the site:

```bash
npm run build
```

This creates the `dist/` folder which the backend serves.

---

## 🖥️ 3. Normal VPS Hosting (Nginx — Only if ports 80/443 are free)

> ⚠️ **SKIP THIS** if you are using Cloudflare Tunnel (Section 4 below).

### Move files

```bash
sudo mkdir -p /var/www/portfolio_website
sudo cp -r dist/* /var/www/portfolio_website/
```

### Nginx config

```nginx
server {
    listen 80;
    server_name electropool.online www.electropool.online;

    root /var/www/portfolio_website;
    index index.html;

    location /api {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Restart nginx

```bash
sudo systemctl restart nginx
```

---

## ☁️ 4. VPS + Cloudflare Tunnel (CURRENT SETUP ✅)

> ✅ Use this when ports 80/443 are NOT available.
> ✅ This is the method currently running on the Oracle VPS.

### Step 1 — Upload project to VPS

```bash
# On your local machine, from the project folder:
scp -r . user@your-vps-ip:/var/www/portfolio_website/
```

Or use `git`:
```bash
# On VPS
cd /var/www/portfolio_website
git pull
```

### Step 2 — Install Node.js on VPS (if not done)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3 — Install dependencies and build

```bash
cd /var/www/portfolio_website
npm install
npm run build
```

### Step 4 — Run the backend server

Instead of `npx serve`, now run:

```bash
node server.js
```

This starts the portfolio website + admin backend together on port **4173**.

---

### Step 5 — Cloudflare Tunnel Setup (one-time)

#### Login to Cloudflare

```bash
cloudflared tunnel login
```

#### Create tunnel

```bash
cloudflared tunnel create electropool
```

#### Config file

Location: `/root/.cloudflared/config.yml`

```yaml
tunnel: electropool
credentials-file: /root/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: electropool.online
    service: http://localhost:4173
  - hostname: www.electropool.online
    service: http://localhost:4173
  - service: http_status:404
```

> Replace `<tunnel-id>` with the UUID shown after `cloudflared tunnel create`.

#### Route DNS

```bash
cloudflared tunnel route dns electropool electropool.online
cloudflared tunnel route dns electropool www.electropool.online
```

#### Run tunnel

```bash
cloudflared tunnel run electropool
```

---

## 🔄 5. Auto-Start on VPS (Run 24/7)

### Portfolio backend service

```bash
sudo nano /etc/systemd/system/portfolio.service
```

Paste:

```ini
[Unit]
Description=Electropool Portfolio Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/portfolio_website
ExecStart=/usr/bin/node /var/www/portfolio_website/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Cloudflare Tunnel service

```bash
sudo nano /etc/systemd/system/cloudflared.service
```

Paste:

```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/cloudflared tunnel run electropool
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Enable and start both

```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio cloudflared
sudo systemctl start portfolio cloudflared
```

### Check status

```bash
sudo systemctl status portfolio
sudo systemctl status cloudflared
```

---

## 🔁 6. Updating the Website (IMPORTANT)

Whenever you make changes to the site on your local machine:

```bash
# Local: build first
npm run build

# Then upload to VPS (or use git pull on VPS)
scp -r dist/ user@your-vps-ip:/var/www/portfolio_website/
# OR on VPS:
# cd /var/www/portfolio_website && git pull && npm run build

# Restart the portfolio service
sudo systemctl restart portfolio
```

> ✅ No need to restart Cloudflare Tunnel — it keeps running automatically.

---

## 📁 Project Structure

```
portfolio_v6/
├── dist/                   # Built production files (auto-generated)
├── public/assets/          # Static images, audio, etc.
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/
│   │   ├── AdminPage.tsx   # 🔒 Admin login + visitor log dashboard
│   │   └── SinglePage.tsx  # Main portfolio page
│   ├── App.tsx             # Root app component (includes tracking)
│   └── main.tsx            # Router setup (/admin, /login, /)
├── server.js               # 🚀 Express backend (API + static serving)
├── visitor_logs.db         # SQLite database (auto-created on first run)
└── package.json
```

---

## 🌐 Live URLs

| URL | Purpose |
|-----|---------|
| `https://electropool.online` | Main portfolio |
| `https://electropool.online/admin` | Admin dashboard |
| `https://electropool.online/login` | Same admin login |

---

## 🔮 Future Additions

- Image upload from admin panel
- Music track management
- Admin credential change UI
- Export visitor logs as CSV
