# Inventori Komponen VS Code dan GitHub Codespaces

Dokumen rujukan untuk merancang editor dan terminal sendiri yang mengambil inspirasi daripada VS Code dalam Codespaces.

> **Skop:** Ini ialah inventori fungsi standard dan lazim, bukan senarai mutlak setiap butang yang mungkin muncul. Kedudukan dan pilihan UI berubah mengikut versi, tetapan, extension, jenis workspace, dan kebenaran pengguna. Codespaces ialah persekitaran pembangunan awan; ia bukan nama lain untuk VS Code.

## 1. Peta kawasan utama

| Kawasan | Lokasi lazim | Tujuan |
| --- | --- | --- |
| Title Bar / Command Center | Bahagian paling atas | Nama workspace, carian arahan/fail, kawalan window dan workspace |
| Menu Bar | Atas | Akses arahan File, Edit, View, Terminal dan menu lain |
| Activity Bar | Tepi kiri, boleh dipindahkan | Tukar antara Explorer, Search, Source Control, Run and Debug, Extensions dan view lain |
| Primary Side Bar | Sebelah Activity Bar | Kandungan view yang dipilih, seperti struktur fail atau hasil carian |
| Editor Area | Tengah | Buka dan edit fail, bandingkan perubahan, lihat preview |
| Secondary Side Bar | Tepi kanan, pilihan | Chat, view tambahan atau panel extension |
| Panel | Bawah | Terminal, Problems, Output, Debug Console, Ports dan panel lain |
| Status Bar | Bahagian paling bawah | Status Git, bahasa fail, ralat, port, sambungan dan maklumat konteks |

Panel dan side bar boleh disembunyikan, dipindahkan atau diubah saiznya. Pada skrin kecil atau dalam VS Code versi web, susun aturnya mungkin berbeza.

## 2. Title Bar, menu dan kawalan umum

### Title Bar / Command Center

- Memaparkan nama workspace, folder atau Codespace.
- Command Center boleh digunakan untuk mencari dan menjalankan arahan.
- Menyediakan kawalan tetingkap seperti minimize, maximize dan close bergantung pada platform.
- Dalam Codespaces, halaman GitHub juga menyediakan tindakan pengurusan Codespace seperti membuka, menghentikan atau memadam persekitaran. Tindakan ini bukan sebahagian daripada terminal shell.

### Menu Bar

Menu mungkin berubah mengikut sistem operasi dan tetapan paparan.

| Menu | Contoh fungsi |
| --- | --- |
| **File** | New File, New Window, Open File/Folder, Save, Save As, Auto Save, Close Editor/Folder |
| **Edit** | Undo/Redo, Cut/Copy/Paste, Find/Replace, pilihan multi-cursor |
| **Selection** | Select All, Expand/Shrink Selection, tambah cursor, pilih baris |
| **View** | Buka/tutup Explorer, Search, panel, status bar, appearance, editor layout |
| **Go** | Go to File, Go to Line, Go to Symbol, Go to Definition, Back/Forward |
| **Run** | Start/Stop Debugging, Run Without Debugging, konfigurasi dan breakpoint |
| **Terminal** | New Terminal, Split Terminal, Run Task, pilih shell, Kill/Clear Terminal |
| **Help** | Documentation, Keyboard Shortcuts, video/tutorial, About dan maklum balas |

Menu **Source Control** atau **Extensions** boleh kelihatan dalam sesetengah susun atur/versi; banyak tindakannya juga tersedia melalui Activity Bar dan Command Palette.

### Command Palette dan Quick Access

- **Command Palette**: cari arahan berdasarkan nama, lazimnya `Ctrl+Shift+P` / `Cmd+Shift+P`.
- **Quick Open**: cari dan buka fail dengan cepat, lazimnya `Ctrl+P` / `Cmd+P`.
- Quick Access boleh menyediakan carian simbol, tetapan, view dan arahan melalui awalan tertentu.
- Senarai arahan bergantung pada extension, platform dan konteks semasa.

## 3. Activity Bar dan view utama

| View / ikon | Fungsi utama |
| --- | --- |
| **Explorer** | Lihat fail/folder workspace, buka fail, dan jalankan tindakan fail |
| **Search** | Cari teks merentas fail; pilihan replace, glob dan pengecualian |
| **Source Control** | Lihat perubahan Git, stage, unstage, commit, branch dan sync |
| **Run and Debug** | Jalankan konfigurasi debug, kawal sesi dan lihat pemboleh ubah |
| **Extensions** | Cari, pasang, aktifkan, nyahaktifkan dan urus extension |
| **Testing** | Temui dan jalankan ujian serta lihat keputusan, jika disokong |
| **Remote Explorer** | Urus sasaran remote, container atau port, bergantung pada extension |
| **Accounts** | Urus akaun dan sesi log masuk yang disokong |
| **Manage** (gear) | Settings, Keyboard Shortcuts, Profiles, Themes, Updates dan pengurusan extension |

Activity Bar boleh ditetapkan untuk memaparkan view tambahan. Bukan semua view tersedia secara lalai.

## 4. Explorer dan pengurusan fail

### Workspace Explorer

- Memaparkan folder workspace dalam bentuk pokok; folder boleh dikembangkan/diciutkan.
- Membuka fail dalam editor apabila dipilih.
- Menunjukkan keadaan Git seperti fail baharu, diubah atau dipadam.
- Menyokong tindakan seperti **New File**, **New Folder**, **Rename**, **Delete**, **Copy Path**, **Reveal in File Explorer** dan **Refresh**.
- Menyokong menu konteks, drag-and-drop, multi-select dan collapse/expand, bergantung pada platform.
- Boleh memaparkan bahagian tambahan seperti **Open Editors**, **Outline**, **Timeline** dan **NPM Scripts**.
- Penapis Explorer membantu mencari fail dalam pokok folder.

### Editor dan tab fail

- Tab fail menunjukkan fail terbuka; tab boleh dipilih, ditutup, dipin atau disusun.
- Split Editor membolehkan fail dibuka sebelah-menyebelah atau atas-bawah.
- Breadcrumb menunjukkan laluan fail dan boleh membantu navigasi simbol.
- Editor menyokong syntax highlighting, autocomplete, hover, diagnostics, multi-cursor, code actions dan format dokumen jika language service menyediakannya.
- Gutter boleh memaparkan nombor baris, breakpoint dan perubahan Git.
- Minimap, word wrap, folding, indent guides, whitespace dan sticky scroll ialah pilihan paparan.
- Penanda fail belum disimpan, konflik merge dan read-only bergantung pada keadaan fail.

### Search bar / carian

- **Quick Open** mencari nama fail dalam workspace.
- **Search View** mencari kandungan fail merentas workspace.
- Carian menyokong regex, padanan huruf besar/kecil, seluruh perkataan, include/exclude glob dan ignore files seperti `.gitignore`.
- **Replace** boleh mengganti satu padanan atau semua padanan dalam skop yang dipilih.
- Hasil carian menunjukkan fail, baris dan konteks; memilih hasil membuka lokasi padanan.
- Carian boleh dihadkan kepada folder atau fail tertentu.

## 5. Source Control (Git)

- Memaparkan branch semasa dan senarai perubahan.
- **Changes**: fail yang berubah tetapi belum di-stage.
- **Staged Changes**: perubahan yang akan dimasukkan dalam commit seterusnya.
- Stage/unstage satu fail atau semua perubahan; buka diff sebelum commit.
- Masukkan mesej commit dan jalankan commit.
- Tindakan lazim: checkout/switch branch, create branch, fetch, pull, push, sync, stash dan resolve conflicts.
- Menunjukkan sejarah/diff melalui integrasi Git atau extension.
- Penggunaan Git memerlukan executable Git, konfigurasi identiti, akses repository dan remote yang sah.

## 6. Run and Debug

- Jalankan atau debug fail/program melalui konfigurasi projek atau `launch.json`.
- **Run and Debug** membolehkan pengguna memilih konfigurasi, memulakan, meneruskan, menghentikan dan memulakan semula sesi.
- Breakpoint boleh dipasang pada baris; breakpoint bersyarat/logpoint disokong oleh debugger tertentu.
- Panel debug lazimnya merangkumi **Variables**, **Watch**, **Call Stack** dan **Breakpoints**.
- Debug toolbar menyediakan Continue/Pause, Step Over, Step Into, Step Out dan Restart/Stop.
- **Run Without Debugging** menjalankan program tanpa sesi debugger.
- Sokongan bergantung pada bahasa, runtime, debugger dan konfigurasi projek.

## 7. Panel bawah

| Tab panel | Kegunaan |
| --- | --- |
| **Problems** | Senarai error, warning dan info daripada compiler, linter atau language service |
| **Output** | Log daripada extension, task, language server atau sistem |
| **Debug Console** | Input/ekspresi dan output sesi debugger |
| **Terminal** | Shell interaktif untuk menjalankan arahan |
| **Ports** | Lihat port Codespace yang dikesan/di-forward, URL dan tetapan visibility |
| **Test Results** | Keputusan dan butiran ujian, jika tersedia |

Panel boleh ditunjukkan/disembunyikan, diubah saiz, dipindahkan dan dibesarkan. Tab yang muncul bergantung pada projek dan extension.

## 8. Terminal dan menjalankan command line

### Kawalan terminal

- **New Terminal**: cipta sesi shell baharu.
- **Split Terminal**: bahagikan ruang untuk beberapa sesi.
- **Select Default Profile**: pilih shell lalai jika beberapa profile tersedia.
- **Kill Terminal**: tamatkan sesi/proses terminal yang dipilih.
- **Clear**: bersihkan paparan; tidak semestinya memadam sejarah shell.
- **Maximize/Restore Panel** dan pemilih sesi terminal.
- Terminal bersepadu biasanya menyokong tab/sesi, scrollback, carian teks, copy/paste, resize dan warna ANSI.
- Keyboard shortcut terminal boleh berbeza mengikut sistem operasi dan keymap.

### Aliran menjalankan arahan

1. Buka folder/workspace.
2. Buka terminal baharu dan pilih shell.
3. Jalankan arahan dalam direktori workspace.
4. Baca stdout/stderr dan exit code; paparkan ralat tanpa menyembunyikannya.
5. Untuk aplikasi server, forward port yang diperlukan dan buka preview URL.

Contoh arahan pembangunan biasa (bergantung pada projek):

```sh
pwd
ls
git status
npm install
npm run dev
python main.py
```

### Tasks dan konfigurasi Run

- **Tasks** (`tasks.json`) mengautomasikan arahan build, test atau lint.
- Task boleh dijalankan melalui Terminal > Run Task atau Command Palette.
- **Run and Debug** menjalankan program dan debugger; ini berbeza daripada menaip arahan terus dalam terminal.
- Elakkan menganggap satu arahan seperti `npm run dev` wujud untuk semua projek. Semak README dan skrip projek.

## 9. Status Bar

Status Bar memberi maklumat kontekstual dan butang pintas, antaranya:

- Branch Git, sync dan status repository.
- Ralat/amaran yang diketahui.
- Baris dan kolum cursor, indentasi, encoding, line ending dan bahasa fail.
- Keadaan formatter, extension atau language service.
- Indikator remote/Codespace dan sambungan.
- Status port atau notifikasi Codespaces apabila berkaitan.

Item yang dipaparkan boleh berubah mengikut fail aktif, extension, platform dan konfigurasi.

## 10. Ciri khusus GitHub Codespaces

Codespaces menyediakan persekitaran pembangunan jauh yang diakses melalui VS Code desktop atau browser.

- **Create/Open Codespace** daripada repository/branch dan dev container yang dikonfigurasi.
- **Dev Container** (`.devcontainer/devcontainer.json`) menentukan imej/container, tools, extension, konfigurasi port dan arahan lifecycle.
- **Prebuilds** boleh menyediakan konfigurasi yang dibina lebih awal supaya persekitaran sedia dengan lebih cepat.
- Terminal berjalan dalam persekitaran Codespace, bukan shell komputer pengguna.
- **Port Forwarding** menghubungkan port aplikasi dalam persekitaran jauh kepada URL yang boleh dibuka; visibility dan akses bergantung pada tetapan serta polisi.
- **Secrets dan environment variables** dikonfigurasi melalui tetapan yang sesuai; jangan simpan token dalam kod atau log.
- Codespace mempunyai lifecycle dan had penggunaan seperti start, stop, idle timeout, storage dan compute quota bergantung pada pelan/polisi.
- Integrasi repository membolehkan kerja Git dan review perubahan, tetapi operasi bergantung pada kebenaran GitHub.
- Sambungan internet/browser, runtime remote, extension dan kebenaran menentukan fungsi yang tersedia.

## 11. Settings, extension, akaun dan bantuan

- **Settings**: ubah tetapan pengguna/workspace seperti tema, autosave, font, terminal profile, editor dan security.
- **Keyboard Shortcuts**: cari, ubah dan selesaikan konflik shortcut.
- **Profiles**: simpan gabungan tetapan, keybindings dan extension untuk kegunaan berbeza.
- **Extensions**: tambah sokongan bahasa, formatter, debugger, tema, integrasi cloud dan view baharu.
- **Accounts**: log masuk, tukar akaun atau urus sesi.
- **Notifications**: paparkan hasil tindakan dan masalah yang memerlukan perhatian.
- **Help**: dokumentasi, command reference, keyboard shortcuts dan maklumat versi.
- Tetapan sync, marketplace dan sign-in tertakluk pada platform serta organisasi.

## 12. Komponen sistem untuk membina terminal sendiri

| Lapisan | Komponen yang perlu dipertimbangkan |
| --- | --- |
| UI | Layout, menu, activity bar, explorer, editor, panel, status bar, dialog dan command palette |
| Terminal renderer | Emulator terminal berasaskan web seperti xterm.js; paparkan teks, cursor, warna dan escape sequence |
| Session manager | Cipta, senarai, pilih, split, resize, tutup dan pulihkan sesi |
| PTY / shell host | Mulakan shell sebenar melalui PTY dan urus input/output, resize serta exit status |
| Komunikasi | Saluran dua hala berlatensi rendah antara UI dan host (contohnya WebSocket) |
| Workspace/file service | Operasi fail yang dibenarkan, root workspace, watcher dan pengendalian encoding |
| Process/task runner | Jalankan task/program, tangkap stdout/stderr, status dan signal |
| Remote runtime | Container/VM per pengguna atau projek; lifecycle, resource limits dan isolation |
| Port service | Kesan port, forward secara terkawal dan urus URL/visibility |
| Git integration | Status, diff, stage, commit dan remote melalui Git |
| Configuration | Settings, shell profiles, environment, keybindings dan dev-container config |
| Identity/access | AuthN/AuthZ, pemilikan workspace dan kawalan akses |
| Observability | Log operasi, health, penggunaan resource, error dan audit yang sesuai |

### Keperluan keselamatan dan kebolehpercayaan

- Asingkan sesi dan fail setiap pengguna; hadkan proses kepada workspace/runtime yang ditetapkan.
- Jangan jalankan arahan pengguna sebagai root atau di host aplikasi tanpa keperluan dan pengasingan yang kukuh.
- Simpan secrets di secret store; redaksi daripada UI, output dan log.
- Kawal port forwarding dan visibility; jangan jadikan port private public secara lalai.
- Hadkan CPU, memori, storage, tempoh proses dan bilangan sesi.
- Urus disconnect, reconnect, timeout, proses tamat dan kegagalan secara nyata.
- Validasi path agar operasi fail tidak terkeluar daripada workspace yang dibenarkan.
- Sediakan pengesahan pengguna sebelum tindakan yang memadam atau menjejaskan data.

## 13. Cadangan skop MVP

1. Satu workspace tempatan/terasing dengan file explorer ringkas.
2. Terminal emulator + backend PTY + aliran input/output masa nyata.
3. Cipta, pilih, resize dan tamatkan sesi terminal.
4. Copy/paste, scrollback, warna ANSI, carian output dan pengendalian resize.
5. Paparan ralat/status yang jelas untuk shell gagal, disconnect dan exit code.
6. Had resource dan pengasingan proses sebelum menawarkan penggunaan berbilang pengguna.
7. Kemudian tambah split panes, Git, tasks, port forwarding, editor, debugger dan extension.

## 14. Glosari ringkas

- **Shell**: program yang membaca dan melaksanakan arahan, seperti Bash, Zsh atau PowerShell.
- **PTY**: pseudo-terminal yang membolehkan proses shell berinteraksi seperti terminal sebenar.
- **Terminal emulator**: UI yang melukis output terminal dan menghantar input pengguna.
- **Workspace**: folder/projek yang dibuka dalam editor.
- **Extension**: pakej yang menambah fungsi kepada editor.
- **Dev Container**: konfigurasi persekitaran pembangunan berasaskan container.
- **Port forwarding**: laluan akses dari klien kepada port dalam persekitaran remote.
