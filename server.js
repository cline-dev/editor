require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const fs = require('fs');
const path = require('path');
const os = require('os');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { loadUsers, saveUsers, makeToken, requireAuth, findOrCreateOAuthUser, exchangeCode } = require('./auth');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const WORKSPACE = path.join(__dirname, 'workspace');
if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE, { recursive: true });

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ===== AUTH: EMAIL + PASSWORD =====
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib' });
  const users = loadUsers();
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email dah wujud, sila login' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, name: name || email.split('@')[0], avatar: '', provider: 'email', password: hash, createdAt: new Date().toISOString() };
  users.push(user); saveUsers(users);
  const token = makeToken(user);
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.json({ ok: true, user: { email: user.email, name: user.name }, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'User tak jumpa' });
  if (user.provider !== 'email') return res.status(400).json({ error: `Akaun ni login guna ${user.provider}, bukan email` });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Password salah' });
  const token = makeToken(user);
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.json({ ok: true, user: { email: user.email, name: user.name }, token });
});

app.post('/api/auth/logout', (req, res) => { res.clearCookie('token'); res.json({ ok: true }); });
app.get('/api/auth/me', requireAuth, (req, res) => { res.json({ user: req.user }); });

// ===== AUTH: GOOGLE =====
app.get('/api/auth/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'PASTE_SINI') return res.send('Sila isi GOOGLE_CLIENT_ID dalam fail .env dulu');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${BASE_URL}/api/auth/google/callback&response_type=code&scope=openid%20email%20profile`;
  res.redirect(url);
});
app.get('/api/auth/google/callback', async (req, res) => {
  const data = await exchangeCode('https://oauth2.googleapis.com/token', {
    code: req.query.code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${BASE_URL}/api/auth/google/callback`, grant_type: 'authorization_code'
  });
  const info = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${data.access_token}` } }).then(r => r.json());
  const user = findOrCreateOAuthUser({ email: info.email, name: info.name, avatar: info.picture }, 'google');
  const token = makeToken(user);
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.redirect('/');
});

// ===== AUTH: GITHUB =====
app.get('/api/auth/github', (req, res) => {
  if (!process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID === 'PASTE_SINI') return res.send('Sila isi GITHUB_CLIENT_ID dalam fail .env dulu');
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${BASE_URL}/api/auth/github/callback&scope=user:email`);
});
app.get('/api/auth/github/callback', async (req, res) => {
  const data = await exchangeCode('https://github.com/login/oauth/access_token', {
    code: req.query.code, client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, redirect_uri: `${BASE_URL}/api/auth/github/callback`
  });
  const userData = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${data.access_token}` } }).then(r => r.json());
  const emails = await fetch('https://api.github.com/user/emails', { headers: { Authorization: `Bearer ${data.access_token}` } }).then(r => r.json());
  const email = emails.find(e => e.primary)?.email || userData.email || `${userData.login}@github.com`;
  const user = findOrCreateOAuthUser({ email, name: userData.name || userData.login, avatar: userData.avatar_url }, 'github');
  const token = makeToken(user);
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.redirect('/');
});

// ===== AUTH: OPENCODE =====
app.get('/api/auth/opencode', (req, res) => {
  if (!process.env.OPENCODE_CLIENT_ID || process.env.OPENCODE_CLIENT_ID === 'PASTE_SINI') return res.send('Sila isi OPENCODE_CLIENT_ID dalam .env. Kalau OpenCode awak guna GitHub login, boleh guna butang GitHub dulu.');
  const authUrl = process.env.OPENCODE_AUTH_URL || 'https://opencode.ai/oauth/authorize';
  res.redirect(`${authUrl}?client_id=${process.env.OPENCODE_CLIENT_ID}&redirect_uri=${BASE_URL}/api/auth/opencode/callback&response_type=code&scope=openid%20email%20profile`);
});
app.get('/api/auth/opencode/callback', async (req, res) => {
  const data = await exchangeCode(process.env.OPENCODE_TOKEN_URL, {
    code: req.query.code, client_id: process.env.OPENCODE_CLIENT_ID, client_secret: process.env.OPENCODE_CLIENT_SECRET,
    redirect_uri: `${BASE_URL}/api/auth/opencode/callback`, grant_type: 'authorization_code'
  });
  const info = await fetch(process.env.OPENCODE_USER_URL, { headers: { Authorization: `Bearer ${data.access_token}` } }).then(r => r.json()).catch(() => ({ email: `opencode-${Date.now()}@opencode.ai`, name: 'OpenCode User' }));
  const user = findOrCreateOAuthUser({ email: info.email, name: info.name, avatar: info.avatar || '' }, 'opencode');
  const token = makeToken(user);
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.redirect('/');
});

// ===== FILE API - KENA LOGIN =====
function safeJoin(base, target) { const p = path.join(base, target || ''); if (!p.startsWith(base)) throw new Error('Path tidak dibenarkan'); return p; }
function buildTree(dir, baseDir) {
  const items = fs.readdirSync(dir, { withFileTypes: true }).filter(d => !d.name.startsWith('.git') && d.name !== 'node_modules').sort((a,b) => a.isDirectory() !== b.isDirectory() ? (a.isDirectory() ? -1 : 1) : a.name.localeCompare(b.name));
  return items.map(d => {
    const full = path.join(dir, d.name); const rel = path.relative(baseDir, full);
    if (d.isDirectory()) return { name: d.name, path: rel, type: 'folder', children: buildTree(full, baseDir) };
    return { name: d.name, path: rel, type: 'file', size: fs.statSync(full).size };
  });
}
app.get('/api/files', requireAuth, (req, res) => { try { res.json(buildTree(WORKSPACE, WORKSPACE)); } catch(e){ res.status(500).json({ error: e.message }); } });
app.get('/api/file', requireAuth, (req, res) => {
  try { const p = safeJoin(WORKSPACE, req.query.path || ''); const content = fs.readFileSync(p, 'utf-8'); res.json({ path: req.query.path, content }); } catch(e){ res.status(400).json({ error: e.message }); }
});
app.post('/api/file', requireAuth, (req, res) => {
  try { const p = safeJoin(WORKSPACE, req.body.path); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, req.body.content ?? ''); res.json({ ok: true }); } catch(e){ res.status(400).json({ error: e.message }); }
});
app.post('/api/folder', requireAuth, (req, res) => { try { fs.mkdirSync(safeJoin(WORKSPACE, req.body.path), { recursive: true }); res.json({ ok: true }); } catch(e){ res.status(400).json({ error: e.message }); } });
app.delete('/api/file', requireAuth, (req, res) => { try { fs.rmSync(safeJoin(WORKSPACE, req.query.path), { recursive: true, force: true }); res.json({ ok: true }); } catch(e){ res.status(400).json({ error: e.message }); } });

// ===== TERMINAL - KENA LOGIN =====
wss.on('connection', (ws, req) => {
  // Check cookie token
  const cookie = req.headers.cookie || '';
  const token = cookie.split('token=')[1]?.split(';')[0];
  if (!token) { ws.send(JSON.stringify({ type: 'output', data: '\r\nSila login dulu di /login.html\r\n' })); ws.close(); return; }
  const shell = os.platform() === 'win32' ? 'powershell.exe' : (process.env.SHELL || '/bin/bash');
  const ptyProcess = pty.spawn(shell, [], { name: 'xterm-color', cols: 120, rows: 30, cwd: WORKSPACE, env: { ...process.env, TERM: 'xterm-256color' } });
  ptyProcess.onData((data) => { try { ws.send(JSON.stringify({ type: 'output', data })); } catch {} });
  ws.on('message', (msg) => {
    try { const parsed = JSON.parse(msg.toString()); if (parsed.type === 'input') ptyProcess.write(parsed.data); if (parsed.type === 'resize') ptyProcess.resize(parsed.cols, parsed.rows); } catch { ptyProcess.write(msg.toString()); }
  });
  ws.on('close', () => { try { ptyProcess.kill(); } catch {} });
  ws.send(JSON.stringify({ type: 'output', data: '\r\nTerminal Cloud siap! Taip ls untuk mula.\r\n' }));
});

server.listen(PORT, () => console.log(`Jalan di ${BASE_URL} - Login di ${BASE_URL}/login.html`));