# Blueprint Bina Terminal Ala VS Code, Codespaces, Cloud Shell

Blueprint lengkap untuk bina terminal berasaskan web atau desktop, ala VS Code, 【entity-GitHub Codespaces¦canonical_name=GitHub】 dan Google Cloud Shell. Ada 3 lapisan: UI depan, enjin terminal, dan backend cloud.

---

## 1. Komponen Utama

| Komponen | Apa Dia Buat |
| --- | --- |
| Terminal Emulator | Papar output terminal dalam browser atau app, sokong warna, cursor, scroll. Selalu guna xterm.js |
| PTY (Pseudo-Terminal) | Jambatan antara UI dan shell sebenar. Tanpa ni, terminal tak boleh terima input keyboard macam terminal betul. Selalu guna `node-pty` |
| Shell | Proses yang jalankan arahan, contohnya Bash, Zsh, PowerShell |
| Code Editor | Tempat tulis kod, dalam VS Code dia guna Monaco Editor |
| File Explorer | Papar folder, fail, boleh create, rename, delete, drag and drop |
| File System | Storage sebenar, dalam cloud dia simpan dalam container atau VM |
| Language Server | Bagi autocomplete, error check, go to definition untuk setiap bahasa |
| Server / WebSocket | Hantar keystroke dari browser ke PTY dan hantar output balik secara live |
| Container / VM Manager | Untuk Codespaces dan Cloud Shell, setiap user dapat satu container Docker atau VM sendiri |
| Auth & Session Manager | Login, simpan session, auto timeout, auto sleep kalau tak guna |

---

## 2. Butang Menu Ala VS Code

### Menu Bar Atas

- **File:** New File, New Folder, Open, Save, Save As, Close, Exit
- **Edit:** Undo, Redo, Cut, Copy, Paste, Find, Replace
- **Selection:** Select All, Expand Selection, Copy Line, Move Line
- **View:** Explorer, Search, Source Control, Run, Extensions, Terminal, Command Palette
- **Go:** Go to File, Go to Line, Go to Symbol, Back, Forward
- **Run:** Start Debugging, Run Without Debugging, Add Breakpoint
- **Terminal:** New Terminal, Split Terminal, Kill Terminal, Clear Terminal
- **Help:** Docs, Keyboard Shortcuts, Check for Updates, About

### Activity Bar Kiri

- **Explorer:** Fail dan folder projek
- **Search:** Cari dalam semua fail
- **Source Control:** Git, commit, push, pull
- **Run and Debug:** Debug config
- **Extensions:** Install extension
- **Account:** Login 【entity-GitHub¦canonical_name=GitHub】 / Google

### Dalam Terminal Sendiri

- **+ New Terminal:** Buka terminal baru
- **Split:** Belah terminal jadi 2 sebelah menyebelah
- **Trash / Kill:** Tutup terminal tu
- **Clear:** Bersihkan skrin
- **Maximize Panel:** Besarkan panel terminal
- **Pilih Shell:** Tukar antara Bash, Zsh, PowerShell
- **Copy / Paste:** Kena sokong `Ctrl+Shift+C` dan `Ctrl+Shift+V`

### Status Bar Bawah

- **Branch Git:** Nama branch semasa
- **Port Forwarding:** Port yang sedang dibuka, contoh `3000`
- **Bahasa:** Bahasa fail yang dibuka
- **Encoding / Line Ending:** UTF-8, LF / CRLF
- **Status Container:** Connected, Reconnecting, Sleeping

---

## 3. Function Terminal Yang Wajib Ada

- **Input / Output Live:** Taip terus jalan, output keluar tanpa refresh
- **Scrollback & Search:** Boleh scroll ke atas, cari output lama dengan `Ctrl+F`
- **History:** Tekan anak panah atas untuk arahan lepas
- **Autocomplete:** Cadangan arahan, path fail, dan flag
- **Copy Paste & Drag Drop:** Paste path fail terus dari explorer
- **Multi-Tab / Multi-Split:** Banyak terminal dalam satu window
- **Resize:** Terminal ikut saiz window, text reflow
- **Theme & Font:** Dark / Light, saiz font, ligature
- **Keyboard Shortcuts:** `Ctrl + `` untuk buka tutup terminal, `Ctrl+Shift+`` untuk terminal baru
- **Clear & Reset:** `clear` dan `reset` untuk bersihkan session
- **Environment Variables:** Boleh set `.env`, secrets, dan PATH
- **Persist Session:** Kalau refresh browser, terminal dan fail tak hilang

---

## 4. Bahasa Sistem

### Bahasa Untuk Bina App Ni

- **Frontend:** TypeScript, JavaScript, HTML, CSS
- **Desktop App:** Electron untuk VS Code, atau Tauri kalau nak ringan
- **Backend / Server:** Node.js paling senang sebab sama dengan xterm.js, alternatif Go atau Python
- **Terminal Core Berprestasi Tinggi:** Rust atau C, contoh Alacritty dan Warp guna Rust
- **Container / Infra:** Docker, Kubernetes, Terraform

### Bahasa Shell Yang Terminal Kena Sokong

- **Linux / Mac:** Bash, Zsh, Fish
- **Windows:** PowerShell, Command Prompt
- **Bahasa UI:** English sebagai default, tambah i18n untuk Bahasa Melayu, Japanese, dan lain-lain

---

## 5. Run Command Line

### Arahan Untuk Jalankan Projek Awak Sendiri

- **Install:** `npm install`
- **Jalankan dev server:** `npm run dev`
- **Build:** `npm run build`
- **Jalankan terminal server:** `node server.js` atau `npm start`
- **Jalankan dalam Docker:** `docker build -t my-terminal .` lepas tu `docker run -p 3000:3000 my-terminal`

### Arahan Yang User Akan Guna Dalam Terminal Tu

- **Navigasi:** `pwd`, `ls -la`, `cd folder`, `mkdir baru`, `touch fail.js`
- **Kod:** `code .`, `code fail.js`, `cat fail.js`, `nano fail.js`
- **Package:** `npm install`, `npm run dev`, `pip install requests`, `python main.py`
- **【entity-Git¦canonical_name=GitHub】:** `git init`, `git status`, `git add .`, `git commit -m "update"`, `git push`
- **Docker:** `docker ps`, `docker logs nama-container`
- **Cloud:** `gcloud auth login`, `gh auth login`, `az login`

---

## 6. Fungsi Lain Yang Bezakan Codespace Dan Cloud Shell

- **【entity-Git¦canonical_name=GitHub】 Integration:** Nampak fail berubah, diff, commit dari UI
- **Debugging:** Breakpoint, watch variable, call stack
- **IntelliSense:** Autocomplete kod, hover untuk tengok definisi
- **Extensions Marketplace:** Boleh install Prettier, ESLint, Python, Tailwind
- **Port Forwarding:** Buka port `3000`, `5000`, `8000` dan dapat link public untuk preview
- **Dev Container:** Fail `devcontainer.json` untuk setkan image, extension auto install, dan post-create command
- **Prebuilds:** Container dah siap build awal, jadi user buka terus boleh guna
- **Secrets & Env:** Simpan token API, password, tanpa tulis dalam kod
- **Collaboration:** Boleh share link, live share, co-edit
- **AI Assistant:** Autocomplete AI, chat untuk tanya pasal kod, explain error
- **Command Palette:** Tekan `Ctrl+Shift+P` untuk cari semua arahan
- **Search Global:** Cari dan replace dalam semua fail
- **File Preview:** Preview Markdown, image, CSV
- **Auto Save & Sync:** Fail auto save dan sync ke cloud
- **Security:** Sandbox, limit CPU / RAM, timeout, audit log

---

## 7. Versi Ringkas Kalau Nak Mula (MVP)

Kalau nak bina versi paling ringkas dulu, cukup ada ni:

- [ ] xterm.js + node-pty + WebSocket
- [ ] File Explorer + Editor ringkas
- [ ] New / Split / Kill Terminal
- [ ] Sokong Bash dan PowerShell
- [ ] Git status ringkas
- [ ] Port Forwarding
- [ ] Auth dan simpan session

Lepas MVP siap, baru tambah Debugging, Extensions, AI, dan Prebuilds.

---

> Dibina sebagai rujukan untuk projek terminal berasaskan cloud.
