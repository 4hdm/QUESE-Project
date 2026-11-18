<<<<<<< HEAD
# QueueEase – Smart Queue (Supabase Edition)

Starter project sistem antrean digital: React + Vite + Tailwind CSS, Express.js, dan PostgreSQL yang di-host di Supabase.

## Fitur
- Halaman mahasiswa (`/`): mengisi nama dan NIM, mengambil nomor antrean, serta melihat daftar antrean publik. NIM hanya terlihat oleh petugas yang login.
- Layar TV (`/tv`): menampilkan nomor yang sedang dipanggil dan antrean berikutnya tanpa menampilkan data pribadi; dapat dibuka layar penuh.
- Halaman petugas (`/admin`): login untuk melihat statistik, memanggil antrean berikutnya, dan menyelesaikan antrean.
- Data diperbarui otomatis setiap 5 detik.
- Nomor antrean harian berawalan sesuai keperluan: K (konsultasi), S (surat aktif), L (legalisir), C (cuti), dan U (lainnya).

## A. Persiapan
1. Install Node.js LTS: https://nodejs.org/
2. Siapkan akun Supabase: https://supabase.com/
3. Siapkan Visual Studio Code: https://code.visualstudio.com/

**Tidak perlu menginstal PostgreSQL lokal atau pgAdmin.** Database PostgreSQL disediakan oleh Supabase.

## B. Buat project Supabase
1. Login ke https://supabase.com/dashboard
2. Klik **New project**.
3. Pilih organisasi, isi nama project `queueease`, buat database password, dan pilih region yang sesuai (misalnya Singapore jika tersedia).
4. Klik **Create new project** dan tunggu sampai project siap.
5. Buka **SQL Editor** di menu sebelah kiri.
6. Klik **New query**.
7. Buka file `database/schema.sql` dari folder project, salin seluruh isinya ke SQL Editor.
8. Klik **Run**.
9. Buka **Table Editor** dan pastikan tabel `public.antrean` sudah muncul.

Jika project Supabase sudah memiliki tabel antrean, jalankan kembali isi `database/schema.sql` untuk menambahkan kolom NIM dan indeks nomor antrean per keperluan.

Simpan database password dengan aman. Jangan mengunggah password atau connection string ke GitHub.

## C. Ambil connection string Supabase
1. Di dashboard project Supabase, klik **Connect** (atau buka pengaturan Database/Connection string jika tampilan dashboard berbeda).
2. Pilih tab **Connection string**.
3. Pilih mode **Session pooler** dan format **URI**. Session pooler cocok untuk koneksi aplikasi Node.js yang berjalan terus-menerus dari laptop; bila opsi ini tidak tersedia, ikuti opsi koneksi yang direkomendasikan dashboard Supabase.
4. Salin URI yang ditampilkan. Jangan gunakan contoh URI di bawah sebagai alamat sungguhan.

Bentuk URI biasanya seperti:
`postgresql://postgres.PROJECT_REF:PASSWORD@HOST:5432/postgres`

Jika password mengandung karakter khusus seperti `@`, `#`, `/`, atau `:`, gunakan URL-encoding pada password. Jangan mengubah host, username, port, atau nama database yang diberikan Supabase.

## D. Konfigurasi backend
1. Extract ZIP.
2. Buka folder `queueease-supabase` di VS Code.
3. Buka terminal: **Terminal > New Terminal**.
4. Masuk ke backend:
   - Jika terminal berada di folder utama: `cd backend`
5. Install package:
   `npm install`
6. Salin `.env.example` menjadi `.env`.
   Windows CMD: `copy .env.example .env`
   PowerShell: `Copy-Item .env.example .env`
7. Buka `backend/.env`, lalu ganti `DATABASE_URL` dengan URI asli dari Supabase:

`PORT=5000`
`DATABASE_URL=postgresql://...URI_ASLI_DARI_SUPABASE...`
`OFFICER_USERNAME=petugas`
`OFFICER_PASSWORD=GANTI_DENGAN_PASSWORD_KUAT`
`JWT_SECRET=SECRET_ACAK_MINIMAL_32_KARAKTER`

Jangan beri tanda kutip. Jangan membagikan file `.env` atau memasukkannya ke repository publik.
Ganti username dan password dengan kredensial petugas yang kuat. Buat nilai `JWT_SECRET` acak setidaknya 32 karakter; token login berlaku selama 8 jam.

8. Jalankan backend:
   `npm run dev`

Backend seharusnya menampilkan:
`QueueEase API berjalan di http://localhost:5000`

9. Tes koneksi melalui browser:
   `http://localhost:5000/api/health`

Jika sukses, akan muncul JSON dengan status `ok` dan pesan bahwa API dan PostgreSQL terhubung.

## E. Jalankan frontend
1. Buka terminal baru di VS Code (**Terminal > New Terminal**). Biarkan terminal backend tetap berjalan.
2. Masuk ke folder frontend:
   `cd frontend`
   (Jika terminal baru dimulai dari folder utama, perintah ini langsung benar.)
3. Install package:
   `npm install`
4. Jalankan:
   `npm run dev`
5. Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

## F. Halaman aplikasi
- Mahasiswa: http://localhost:5173/
- Layar antrean untuk TV: http://localhost:5173/tv
- Petugas: http://localhost:5173/admin

Untuk menampilkan antrean di TV, buka alamat layar TV tersebut dari komputer yang tersambung ke HDMI/cast TV, lalu klik **Layar penuh**.

## G. Uji alur antrean
1. Di halaman mahasiswa, isi nama, NIM, dan keperluan.
2. Klik **Ambil Nomor Antrean**. Nomor seperti K001 akan muncul untuk konsultasi.
3. Buka halaman petugas dan login memakai kredensial di `backend/.env`.
4. Klik **Panggil Berikutnya**.
5. Status antrean berubah menjadi **Dipanggil**.
6. Klik **Selesaikan** pada antrean yang ingin diselesaikan.
7. Data pada kedua halaman diperbarui otomatis setiap 5 detik.

## H. Menjalankan kembali pada hari berikutnya
Tidak perlu install ulang. Jalankan dua terminal:

Terminal 1:
`cd backend`
`npm run dev`

Terminal 2:
`cd frontend`
`npm run dev`

## Troubleshooting
- `DATABASE_URL belum diatur`: pastikan file bernama `.env` (bukan `.env.example`) ada di folder `backend`.
- `password authentication failed`: cek password dan URI Supabase.
- `ENOTFOUND` atau timeout: cek koneksi internet, host, port, dan mode pooler dari URI.
- `self-signed certificate` atau masalah SSL: gunakan konfigurasi `ssl` yang sudah tersedia di `backend/src/config/db.js`; jangan menambahkan opsi SSL lain tanpa memeriksa konfigurasi.
- `EADDRINUSE 5000`: port 5000 sedang dipakai aplikasi lain.
- `Network Error`: pastikan backend berjalan dan alamat API frontend tetap `http://localhost:5000/api`.

## Catatan keamanan dan pembelajaran
- Frontend tidak menyimpan password database.
- Express menjadi perantara antara React dan PostgreSQL.
- Connection string database hanya berada di `backend/.env`; jangan commit file ini ke GitHub.
- Endpoint pengelolaan antrean dilindungi token login petugas; endpoint daftar dan pembuatan antrean mahasiswa tetap publik. Jika aplikasi dipublikasikan ke internet, tambahkan HTTPS, pembatasan percobaan login, dan kebijakan keamanan yang sesuai.
- Refresh otomatis 5 detik menggunakan polling, bukan WebSocket.
=======
<div align="center">

# 🎓 Queue Management System & Student Portal

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" />

<p align="center">
  <b>Aplikasi manajemen antrean langsung (Live Queue) dan portal layanan mahasiswa modern berbasis React, Vite, dan Tailwind CSS.</b>
</p>

</div>

---

## ✨ Fitur Unggulan

- 🔴 **Live Queue Management**: Pantau dan kelola antrean layanan akademik secara langsung (*real-time*) dengan status panggilan instan.
- 👨‍🎓 **Student Portal**: Halaman khusus mahasiswa untuk mengambil nomor antrean, memeriksa status antrean pribadi, dan melihat riwayat layanan.
- 🛠️ **Admin Control Panel**: Panel administrasi lengkap untuk melayani antrean, mengubah status tiket, dan mengelola alur loket pelayanan.
- ⚡ **Vite & Tailwind CSS Stack**: Dibangun di atas fondasi *frontend* modern yang sangat cepat dengan desain antarmuka responsif menggunakan Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React (JSX)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, PostCSS
- **API Client:** Axios / Fetch (`src/services/api.js`)

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di komputer lokal Anda:

1. **Clone Repository & Masuk ke Direktori Frontend**
   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd frontend
>>>>>>> 6b89049a15dbfe915910fd0ccd706629d980452e
