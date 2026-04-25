import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'sqlite3';
import { UAParser } from 'ua-parser-js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// ─── Credentials (hardcoded) ───────────────────────────────────────────────
const ADMIN_USERNAME = 'electropool';
const ADMIN_PASSWORD = 'DEADpool@005';

// ─── SQLite setup ─────────────────────────────────────────────────────────
const db = new Database.Database(join(__dirname, 'visitor_logs.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS visitor_logs (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      ip        TEXT,
      city      TEXT,
      state     TEXT,
      country   TEXT,
      device    TEXT,
      model     TEXT,
      browser   TEXT,
      os        TEXT,
      ist_date  TEXT,
      ist_time  TEXT,
      timestamp INTEGER
    )
  `);
  // Add model column if upgrading from old schema
  db.run(`ALTER TABLE visitor_logs ADD COLUMN model TEXT`).on?.('error', () => {});
});

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Serve React build ─────────────────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')));

// ─── Helper: get IST date & time ──────────────────────────────────────────
function getIST() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${pad(ist.getDate())}-${pad(ist.getMonth() + 1)}-${ist.getFullYear()}`;
  const time = `${pad(ist.getHours())}:${pad(ist.getMinutes())}:${pad(ist.getSeconds())}`;
  return { date, time };
}

// ─── POST /api/track ─────────────────────────────────────────────────────
app.post('/api/track', async (req, res) => {
  try {
    // Get real IP (handles Cloudflare & proxies)
    const ip =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'Unknown';

    // UA parsing
    const ua = req.headers['user-agent'] || '';
    const parser = new UAParser(ua);
    const result = parser.getResult();
    const device  = result.device.type || 'Desktop';
    const model   = [result.device.vendor, result.device.model].filter(Boolean).join(' ') || 'Unknown';
    const browser = `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim();
    const os      = `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim();

    // Geo lookup (skip for localhost/private)
    let city = 'Local', state = 'Local', country = 'Local';
    const privateRanges = ['127.', '192.168.', '10.', '::1', 'localhost'];
    const isPrivate = privateRanges.some(r => ip.startsWith(r));

    if (!isPrivate) {
      try {
        const geo = await axios.get(`http://ip-api.com/json/${ip}?fields=city,regionName,country`, { timeout: 3000 });
        if (geo.data) {
          city    = geo.data.city    || 'Unknown';
          state   = geo.data.regionName || 'Unknown';
          country = geo.data.country || 'Unknown';
        }
      } catch (_) { /* geo lookup failed silently */ }
    }

    const { date, time } = getIST();

    db.run(
      `INSERT INTO visitor_logs (ip, city, state, country, device, model, browser, os, ist_date, ist_time, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ip, city, state, country, device, model, browser, os, date, time, Date.now()],
      (err) => { if (err) console.error('DB insert error:', err); }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('Track error:', err);
    res.status(500).json({ ok: false });
  }
});

// ─── POST /api/login ─────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ ok: true, token: 'ep_admin_' + Date.now() });
  } else {
    res.status(401).json({ ok: false, message: 'Invalid credentials' });
  }
});

// ─── GET /api/logs ────────────────────────────────────────────────────────
app.get('/api/logs', (req, res) => {
  const auth = req.headers['authorization'];
  // Simple token check (starts with ep_admin_)
  if (!auth || !auth.startsWith('ep_admin_')) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  db.all(
    `SELECT * FROM visitor_logs ORDER BY timestamp DESC LIMIT 500`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ ok: false });
      res.json({ ok: true, logs: rows });
    }
  );
});

// ─── DELETE /api/logs/:id ─────────────────────────────────────────────────
app.delete('/api/logs/:id', (req, res) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('ep_admin_')) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  db.run(`DELETE FROM visitor_logs WHERE id = ?`, [req.params.id], (err) => {
    if (err) return res.status(500).json({ ok: false });
    res.json({ ok: true });
  });
});

// ─── SPA fallback ─────────────────────────────────────────────────────────
app.get(/.*/, (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Electropool Portfolio running on http://localhost:${PORT}`);
  console.log(`🔒 Admin panel: http://localhost:${PORT}/admin\n`);
});
