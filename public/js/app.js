let term, fitAddon, socket;
let currentFile = null;
let isSplit = false;

function connectTerminal() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  socket = new WebSocket(protocol + '//' + location.host + '/ws');
  term = new Terminal({ cursorBlink: true, fontSize: 14, fontFamily: 'Consolas, monospace', theme: { background: '#0c0c0c', foreground: '#d4d4d4' } });
  fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.open(document.getElementById('terminal'));
  fitAddon.fit();
  term.onData((data) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'input', data }));
  });
  term.onResize(({ cols, rows }) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'resize', cols, rows }));
  });
  socket.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'output') term.write(msg.data);
  };
  socket.onclose = () => { document.getElementById('statusDot').textContent = 'Disconnected'; };
  socket.onopen = () => { document.getElementById('statusDot').textContent = 'Connected'; };
  window.addEventListener('resize', () => fitAddon.fit());
}

async function loadFiles() {
  const res = await fetch('/api/files');
  const files = await res.json();
  renderTree(files, document.getElementById('fileTree'));
}

function renderTree(items, container) {
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'file-item ' + (item.type === 'folder' ? 'folder' : '');
    div.innerHTML = `<span>${item.type === 'folder' ? '📁 ' : '📄 '}${item.name}</span><span class="muted">${item.type === 'folder' ? '' : item.size + 'b'}</span>`;
    div.onclick = () => {
      if (item.type === 'folder') sendToTerminal(`cd ${item.path}\nls\n`);
      else openFile(item.path);
    };
    div.oncontextmenu = (e) => {
      e.preventDefault();
      const action = prompt(`Fail: ${item.path}\nTaip: rename / delete`);
      if (action === 'delete' && confirm('Padam ' + item.path + '?')) deleteFile(item.path);
      if (action === 'rename') {
        const to = prompt('Nama baru:', item.path);
        if (to) renameFile(item.path, to);
      }
    };
    container.appendChild(div);
    if (item.children) {
      const sub = document.createElement('div');
      sub.style.paddingLeft = '14px';
      renderTree(item.children, sub);
      container.appendChild(sub);
    }
  });
}

async function openFile(path) {
  const res = await fetch('/api/file?path=' + encodeURIComponent(path));
  const data = await res.json();
  currentFile = path;
  document.getElementById('editor').value = data.content || '';
  document.getElementById('currentFile').textContent = path;
  document.getElementById('editorMeta').textContent = path.split('.').pop() + ' - ' + (data.content || '').length + ' chars';
  document.getElementById('saveStatus').textContent = 'Saved';
  const tabs = document.getElementById('tabs');
  if (![...tabs.children].some(t => t.dataset.file === path)) {
    const b = document.createElement('button');
    b.className = 'tab active'; b.dataset.file = path; b.textContent = '📄 ' + path.split('/').pop();
    b.onclick = () => openFile(path);
    tabs.appendChild(b);
  }
  [...tabs.children].forEach(t => t.classList.toggle('active', t.dataset.file === path));
  updateLineInfo();
}

async function saveCurrentFile() {
  if (!currentFile) { alert('Buka fail dulu atau buat fail baru'); return; }
  const content = document.getElementById('editor').value;
  await fetch('/api/file', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: currentFile, content }) });
  document.getElementById('saveStatus').textContent = 'Saved ✓';
  loadFiles();
}

function runCurrentFile() {
  if (!currentFile) return alert('Buka fail dulu');
  sendToTerminal(`node ${currentFile}\n`);
}
function closeCurrentFile() {
  currentFile = null;
  document.getElementById('editor').value = '';
  document.getElementById('currentFile').textContent = 'Welcome';
}
async function createFilePrompt() {
  const name = prompt('Nama fail baru (contoh: app.js, index.html):');
  if (!name) return;
  await fetch('/api/file', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: name, content: '// Fail baru\n' }) });
  loadFiles(); openFile(name);
}
async function createFolderPrompt() {
  const name = prompt('Nama folder baru:');
  if (!name) return;
  await fetch('/api/folder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: name }) });
  loadFiles();
}
async function deleteFile(path) {
  await fetch('/api/file?path=' + encodeURIComponent(path), { method: 'DELETE' });
  loadFiles();
}
async function renameFile(from, to) {
  await fetch('/api/rename', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to }) });
  loadFiles();
}
function filterFiles(q) {
  const items = document.querySelectorAll('.file-item');
  items.forEach(el => { el.style.display = el.textContent.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none'; });
}
function sendToTerminal(cmd) {
  if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'input', data: cmd }));
  term.focus();
}
function newTerminal() { sendToTerminal('clear\n'); term.write('\r\n--- New Terminal ---\r\n'); }
function splitTerminal() {
  isSplit = !isSplit;
  document.getElementById('terminal2').classList.toggle('hidden', !isSplit);
  if (isSplit) document.getElementById('terminal2').innerHTML = '<p style="padding:12px;color:#999">Split terminal - terminal kedua guna WebSocket yang sama.</p>';
  fitAddon.fit();
}
function clearTerminal() { term.clear(); sendToTerminal('clear\n'); }
function killTerminal() { if (confirm('Tutup terminal?')) { term.write('\r\n[Terminal ditutup - refresh untuk buka baru]\r\n'); socket.close(); } }
function toggleTerminal() { document.querySelector('.terminal-panel').classList.toggle('hidden'); }
function toggleTheme() { document.body.classList.toggle('light'); }
function setTheme(v) { document.body.classList.toggle('light', v === 'Light'); }
function changeFont(v) { document.getElementById('editor').style.fontSize = v + 'px'; }
function showPanel(name) {
  ['explorer','search','git','debug','extensions','account','settings'].forEach(p => {
    const el = document.getElementById('panel-' + p);
    if (el) el.classList.toggle('hidden', p !== name);
  });
  document.getElementById('panelTitle').textContent = name.toUpperCase();
}
function menuAction(menu) {
  if (menu === 'terminal') newTerminal();
  if (menu === 'file') createFilePrompt();
  if (menu === 'view') alert('View: Explorer / Search / Terminal - guna Activity Bar kiri');
  if (menu === 'help') alert('Terminal Cloud v1.0\nDocs: Lihat README.md');
  if (menu === 'run') runCurrentFile();
  if (menu === 'go') { const f = prompt('Go to file:'); if (f) openFile(f); }
  if (menu === 'edit') { document.getElementById('editor').focus(); }
}
function runPalette(cmd) {
  if (!cmd) return;
  if (cmd.includes('new terminal')) newTerminal();
  else if (cmd.includes('clear')) clearTerminal();
  else if (cmd.includes('save')) saveCurrentFile();
  else sendToTerminal(cmd + '\n');
}
function updateLineInfo() {
  const el = document.getElementById('editor');
  const pos = el.selectionStart || 0;
  const text = el.value.substring(0, pos);
  const line = text.split('\n').length;
  const col = pos - text.lastIndexOf('\n');
  document.getElementById('lineInfo').textContent = `Ln ${line}, Col ${col}`;
}
document.getElementById('editor').addEventListener('input', () => {
  document.getElementById('saveStatus').textContent = 'Unsaved';
  updateLineInfo();
});
document.getElementById('editor').addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveCurrentFile(); }
  if (e.key === 'Tab') { e.preventDefault(); const el = e.target; const s = el.selectionStart; el.value = el.value.substring(0,s) + '  ' + el.value.substring(el.selectionEnd); el.selectionStart = el.selectionEnd = s+2; }
});
connectTerminal();
loadFiles();
fetch('/api/info').then(r=>r.json()).then(d=>{ document.getElementById('portInfo').textContent = 'Port: 3000 - ' + d.platform; });
