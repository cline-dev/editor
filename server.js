const 【entity-express¦canonical_name=express】 = require('【entity-express¦canonical_name=express】');
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = 【entity-express¦canonical_name=express】();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const PORT = process.env.PORT || 3000;
const WORKSPACE = path.join(__dirname, 'workspace');
if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE, { recursive: true });

app.use(【entity-express¦canonical_name=express】.json({ limit: '10mb' }));
app.use(【entity-express¦canonical_name=express】.static(path.join(__dirname, 'public')));

function safeJoin(base, target) {
  const p = path.join(base, target || '');
  if (!p.startsWith(base)) throw new Error('Path tidak dibenarkan');
  return p;
}

function buildTree(dir, baseDir) {
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => !d.name.startsWith('.git') && d.name !== 'node_modules')
    .sort((a,b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  return items.map(d => {
    const full = path.join(dir, d.name);
    const rel = path.relative(baseDir, full);
    if (d.isDirectory()) {
      return { name: d.name, path: rel, type: 'folder', children: buildTree(full, baseDir) };
    }
    return { name: d.name, path: rel, type: 'file', size: fs.statSync(full).size };
  });
}

app.get('/api/files', (req, res) => {
  try { res.json(buildTree(WORKSPACE, WORKSPACE)); }
  catch(e){ res.status(500).json({ error: e.message }); }
});

app.get('/api/file', (req, res) => {
  try {
    const p = safeJoin(WORKSPACE, req.query.path || '');
    if (!fs.existsSync(p)) return res.status(404).json({ error: 'Fail tidak dijumpai' });
    const content = fs.readFileSync(p, 'utf-8');
    res.json({ path: req.query.path, content });
  } catch(e){ res.status(400).json({ error: e.message }); }
});

app.post('/api/file', (req, res) => {
  try {
    const { path: rel, content } = req.body;
    const p = safeJoin(WORKSPACE, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content ?? '');
    res.json({ ok: true });
  } catch(e){ res.status(400).json({ error: e.message }); }
});

app.post('/api/folder', (req, res) => {
  try {
    const p = safeJoin(WORKSPACE, req.body.path);
    fs.mkdirSync(p, { recursive: true });
    res.json({ ok: true });
  } catch(e){ res.status(400).json({ error: e.message }); }
});

app.delete('/api/file', (req, res) => {
  try {
    const p = safeJoin(WORKSPACE, req.query.path);
    fs.rmSync(p, { recursive: true, force: true });
    res.json({ ok: true });
  } catch(e){ res.status(400).json({ error: e.message }); }
});

app.post('/api/rename', (req, res) => {
  try {
    const from = safeJoin(WORKSPACE, req.body.from);
    const to = safeJoin(WORKSPACE, req.body.to);
    fs.renameSync(from, to);
    res.json({ ok: true });
  } catch(e){ res.status(400).json({ error: e.message }); }
});

app.get('/api/info', (req, res) => {
  res.json({
    platform: os.platform(),
    shell: os.platform() === 'win32' ? 'powershell.exe' : (process.env.SHELL || '/bin/bash'),
    workspace: 'workspace',
    node: process.version,
    cwd: WORKSPACE
  });
});

wss.on('connection', (ws) => {
  const shell = os.platform() === 'win32' ? 'powershell.exe' : (process.env.SHELL || '/bin/bash');
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 120,
    rows: 30,
    cwd: WORKSPACE,
    env: { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' }
  });

  ptyProcess.onData((data) => {
    try { ws.send(JSON.stringify({ type: 'output', data })); } catch {}
  });

  ws.on('message', (msg) => {
    try {
      const parsed = JSON.parse(msg.toString());
      if (parsed.type === 'input') ptyProcess.write(parsed.data);
      if (parsed.type === 'resize') ptyProcess.resize(parsed.cols, parsed.rows);
      if (parsed.type === 'clear') ptyProcess.write('\x1bc');
    } catch {
      ptyProcess.write(msg.toString());
    }
  });

  ws.on('close', () => { try { ptyProcess.kill(); } catch {} });
  ws.on('error', () => { try { ptyProcess.kill(); } catch {} });

  ws.send(JSON.stringify({ type: 'output', data: '\r\nTerminal Cloud siap! Taip ls, node --version, git status untuk mula.\r\n' }));
});

server.listen(PORT, () => {
  console.log(`Terminal Cloud jalan di http://localhost:${PORT}`);
  console.log(`Workspace: ${WORKSPACE}`);
});
