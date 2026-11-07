WEBSITE REZA PAMVNGKAS — versi dengan dashboard

STRUKTUR
  index.html      tampilan situs (membaca isi dari content.json)
  content.json    SEMUA teks, link, dan path foto. Jangan diedit manual; pakai dashboard.
  assets/         foto header & easter egg (foto baru dari dashboard masuk ke assets/uploads/)
  _admin/         file dashboard (diblokir untuk publik; hanya terbuka lewat alamat rahasia + login)
  worker.js       gerbang login dashboard (Cloudflare Workers)
  wrangler.jsonc  konfigurasi Worker — GANTI "name" dengan nama Worker kamu
  .assetsignore   daftar file yang tidak ikut dipublikasikan sebagai halaman web

PASANG (sekali saja)
1. Upload/replace semua file ini ke repo GitHub (index.html, content.json, assets/, _admin/, worker.js, wrangler.jsonc, .assetsignore), commit. Cloudflare akan deploy otomatis.
2. Buat token GitHub:
   GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token
   - Repository access: Only select repositories → pilih repo situs ini
   - Repository permissions: Contents = Read and write
3. Di Cloudflare → Worker → Settings → Variables and secrets (bagian Runtime, tipe Secret), buat 3 nilai: ADMIN_PATH (alamat rahasia), ADMIN_ID (40 karakter, jadi username), ADMIN_PASSWORD. Deploy ulang, lalu buka alamat rahasia itu dan login. Setelah itu, isi username GitHub, nama repo, branch (biasanya main), dan token.
   Kalau file situs ada di dalam sub-folder repo (bukan di root), isi "Folder situs di repo".

PAKAI
- Satu halaman per section di menu kiri. Edit teks, link, foto, tambah/hapus/urutkan item.
- Tombol Preview menampilkan hasil langsung (Mobile/Desktop) sebelum disimpan.
- "Simpan & Publish" = satu commit ke GitHub; situs update sekitar 1 menit.
- Foto/CV yang dipilih baru diunggah saat Simpan. Foto > 2000px otomatis diperkecil.
- Link proyek/organisasi yang kosong tampil sebagai teks biasa (tanpa panah ↗).
- Tombol "Download CV" muncul di hero dan kontak setelah file/link CV diisi (Umum & CV).

KEAMANAN
- Token hanya disimpan di browser perangkatmu. Tanpa token, dashboard tidak bisa mengubah apa pun.
- Alamat, ID, dan password dashboard hanya ada di Cloudflare (ADMIN_PATH, ADMIN_ID, ADMIN_PASSWORD), tidak ada di repo.
- Kalau token bocor/hilang, hapus di GitHub dan buat baru.

CATATAN
- Membuka index.html langsung dari file (double-click) tidak akan menampilkan isi karena browser memblokir fetch. Tes lewat hosting, atau: python3 -m http.server di folder ini.
- Konten dirender oleh JavaScript (Google tetap bisa membacanya).
