# Mini Task Manager dengan Sistem Audit Trail

Aplikasi manajemen tugas sederhana berskala internal untuk mengelola siklus hidup tugas (*task lifecycle*) yang dilengkapi dengan pencatatan riwayat perubahan (*audit log*) secara kronologis. Aplikasi ini dibangun menggunakan struktur **Monorepo (NPM Workspaces)** dengan teknologi React (Frontend) dan Express.js (Backend) berbasis TypeScript.

Proyek ini dirancang khusus untuk menyelesaikan masalah ketidakjelasan riwayat perubahan status data dengan mengutamakan konsistensi data (*data consistency*), validasi ranah bisnis (*domain validation*), dan sifat pembaruan idenpoten (*idempotent update*).

---

## Setup & Instalasi

### 1. Konfigurasi Environment Variables
Sebelum menjalankan aplikasi, buat file `.env` pada masing-masing package untuk mengatur port dan endpoint API:

* **Backend (`backend/.env`):**
    ```env
    PORT=5001
    ```
* **Frontend (`frontend/.env`):**
    ```env
    VITE_API_URL=http://localhost:5001/api
    ```

### 2. Instalasi Dependensi
Jalankan perintah berikut di root folder untuk menginstal seluruh dependensi backend dan frontend secara bersamaan:
```bash
npm run install:all
```

### 3. Menjalankan Aplikasi (Development)
Untuk menyalakan server backend dan aplikasi frontend sekaligus dalam satu terminal, gunakan perintah:
```bash
npm run dev
```

* API Backend: Berjalan di http://localhost:5001/api
* Aplikasi Frontend: Berjalan di http://localhost:5173

Skrip alternatif untuk menjalankan layanan secara terpisah:

* Hanya Backend:
```bash
npm run dev:backend
```
* Hanya Frontend: 
```bash
npm run dev:frontend
```
---
## Penjelasan Singkat Arsitektur
Proyek ini menggunakan pola arsitektur **Client-Server terpisah (Decoupled Full-Stack)** yang diorganisir dalam satu ekosistem terpadu (**Monorepo Workspaces**). Sistem dirancang dengan prinsip *Separation of Concerns* (SoC) dan *Single Responsibility* baik di sisi frontend maupun backend.

* **Arsitektur Monorepo:** Struktur kode dipisahkan menjadi paket sisi klien (Frontend) dan paket sisi server (Backend) yang mandiri. Ini memastikan isolasi dependensi terlindungi, namun tetap dapat dijalankan secara bersamaan melalui satu instruksi di tingkat root proyek.
* **Arsitektur Sisi Klien (Frontend):** Menggunakan pola pemisahan lapisan antara antarmuka (UI Layer) dan lapisan jaringan (Service Layer). Lapisan UI hanya bertanggung jawab menampilkan data dan menangkap aksi pengguna, sedangkan komunikasi data ke server diisolasi sepenuhnya pada lapisan servis untuk menjaga kode tetap modular.
* **Arsitektur Sisi Server (Backend):** Memanfaatkan arsitektur berbasis RESTful API dengan pendekatan *Side-Effect Automation*. Backend memisahkan rute untuk pengelolaan tugas dan log audit. Setiap kali terjadi mutasi data pada tugas, server secara otomatis memicu pembuatan riwayat log audit baru secara internal sebelum mengembalikan respons ke klien demi menjaga integritas data log.
---
## Asumsi yang Diambil
Kondisi batasan (boundary) yang ditetapkan untuk memenuhi kebutuhan Product Context tanpa melakukan overengineering:
1. **Keamanan Identitas Aktor (Predefined Users):** Sesuai instruksi yang tidak membutuhkan sistem login kompleks, identitas pengguna (*actor*) dianggap valid dan tepercaya langsung berdasarkan nama yang dipilih melalui dropdown pada saat mutasi data dikirim dari frontend.
2. **Kekakuan Alur Status (Linear Progression):** Alur status tugas ditetapkan berjalan maju searah secara mutlak (`TO DO` → `PENDING` → `IN PROGRESS` → `DONE`). Sistem mengasumsikan tidak ada skenario di mana tugas yang sudah berjalan boleh diturunkan kembali statusnya, guna menjaga kepastian lini masa penelusuran.
3. **Idempotensi Berbasis State Terakhir:** Sistem mengasumsikan jika pengguna mengirimkan data status yang sama dengan status tugas saat ini, aksi tersebut dianggap sebagai ketidaksengajaan interaksi pada UI, sehingga backend dibenarkan untuk menolak pembuatan log baru.
---
## Trade-off yang Dibuat
### 1. Penyimpanan Data In-Memory (Atau JSON File) vs Database Relasional Eksternal
Untuk pengerjaan tugas ini, data disimpan menggunakan struktur data memori lokal runtime / file terpusat, alih-alih memasang database relasional penuh seperti PostgreSQL atau MySQL.
* **Kompromi (Trade-off):** Kehilangan fitur bawaan database seperti *ACID Transactions*, *foreign key constraints*, dan data akan hilang jika proses server dimatikan (jika menggunakan murni *in-memory*).
* **Alasan:** Menghindari *overengineering* sesuai batasan instruksi (*No Overengineering*). Fokus utama tugas ini adalah pembuktian logika validasi alur status dan sinkronisasi log. Menggunakan **in-memory/file storage** memangkas waktu setup *infrastructure overhead* tanpa mengurangi validitas logika bisnis yang diuji.

### 2. Logika Pembuatan Log Otomatis di Backend (Coupled Service) vs Event Ledger Terpisah
Pembuatan log audit dijahit langsung di dalam fungsi mutasi tugas pada API Backend, bukan menggunakan sistem antrean pesan (*message broker* seperti RabbitMQ) atau database *Event Sourcing* terpisah.
* **Kompromi (Trade-off):** Skalabilitas backend menjadi sedikit lebih berat karena satu *endpoint request* harus melakukan dua operasi penulisan data sekaligus secara berurutan (simultan).
* **Alasan:** Demi menjamin **Data Consistency** yang ketat sesuai *NFR Requirements*. Dengan menggabungkan proses pembaruan tugas dan pembuatan log dalam satu kendali fungsi terpusat di backend, kita bisa memastikan log audit *pasti* tercipta jika tugas berubah, atau menggagalkan seluruh aksi jika salah satunya gagal (*atomic behavior* sederhana).

### 3. Validasi Alur Status Terpusat di Backend vs Validasi Ganda di Frontend
Validasi kepatuhan alur status (`TO DO` → `PENDING` → `IN PROGRESS` → `DONE`) ditegakkan secara ketat di level API Backend (*Domain Validation*), sementara frontend dibiarkan fleksibel (atau hanya melakukan pengecekan dasar).
* **Kompromi (Trade-off):** Pengguna bisa saja mencoba menekan tombol di UI yang melanggar aturan, dan baru mendapatkan umpan balik berupa error setelah request menyentuh server (ada jeda waktu tunggu jaringan).
* **Alasan:** Menegakkan *Single Source of Truth* untuk keamanan data. Validasi di frontend mudah ditembus atau dimanipulasi (misal lewat Postman/Fetch manual). Dengan memusatkan *Domain Validation* di backend, kita memastikan integritas alur status tetap 100% aman terlepas dari platform klien mana yang menembak API tersebut.
---
## Langkah Selanjutnya & Perbaikan ke Depan (Jika Ada Waktu Lebih)
* **Implementasi Autentikasi dan Otorisasi (Auth & RBAC):** Mengintegrasikan sistem autentikasi (seperti JWT atau Session-based Auth) dan Role-Based Access Control (RBAC). Ini penting untuk menggantikan sistem *hardcoded actor dropdown* saat ini, sehingga identitas aktor yang tercatat di log audit murni diambil dari sesi login pengguna yang valid dan terverifikasi secara aman di sisi server.
* **Migrasi ke Database Relasional dengan ACID Transaction:** Mengganti penyimpanan lokal (*in-memory/JSON*) ke database relasional seperti PostgreSQL. Dengan menggunakan *ACID Transactions*, kita dapat menjamin operasi pembaruan tugas dan pembuatan log audit terkunci dalam satu transaksi atomik. Jika salah satu gagal, database otomatis melakukan *rollback* demi konsistensi data 100%.
* **Implementasi Keamanan Kriptografi pada Log Audit:** Menerapkan algoritma hashing (seperti SHA-256) di tingkat kode backend, di mana setiap baris log baru menyimpan tanda tangan (*hash*) dari log sebelumnya. Ini akan memberikan proteksi ekstra pada backend untuk mendeteksi secara instan jika ada berkas atau baris data log yang dimanipulasi secara ilegal.
* **Validasi Skema Berlapis Menggunakan Zod:** Menyuntikkan pustaka validasi skema runtime (`Zod`) pada gerbang masuk Express middleware (backend) dan Axios Interceptor (frontend). Hal ini penting untuk memblokir data korup atau penipuan payload di jaringan sebelum sempat diproses oleh logika bisnis utama.
---

### 1. Bagaimana kamu memastikan audit log tidak ter-modifikasi?
Pada aplikasi yang saya bangun saat ini, kepastian bahwa data audit log bersifat Append-Only (hanya bisa bertambah, tidak bisa diubah atau dihapus) dijamin sepenuhnya melalui pembatasan akses (enkapsulasi) di level backend:

* **Ketiadaan Endpoint Mutasi (No Update/Delete Routes):** Di dalam arsitektur API backend, saya hanya menyediakan endpoint `GET /api/tasks/:id/audit-logs` dan `GET /api/tasks/audit-logs`. Server sama sekali tidak mengekspos rute `PUT`, `PATCH`, atau `DELETE` untuk entitas log. Jadi, tidak ada akses luar yang bisa memicu perubahan data.
* **Isolasi Logika Bisnis di Sisi Server:** Pembuatan data log baru tidak bisa ditembak langsung dari frontend via HTTP POST ke endpoint log tersendiri. Log audit murni diproduksi secara otomatis di latar belakang oleh backend (*side-effect*) hanya ketika ada request mutasi *task* seperti update status.
* **Penguncian Operasi Array/File Storage:** Di dalam *service layer* backend yang mengelola manipulasi data, satu-satunya fungsi yang berinteraksi dengan array atau penyimpanan data log adalah fungsi operasi penambahan data (`.push()` atau operasi tulis baru). Tidak ada baris kode atau fungsi apa pun di backend yang ditulis untuk melakukan penyuntingan (*update*) maupun penghapusan (*delete*) pada data log yang sudah tersimpan.
---

### 2. Bagian mana dari solusi ini yang paling berisiko jika digunakan oleh banyak user?

Bagian yang paling berisiko tinggi dalam aplikasi saat ini adalah **Mekanisme Penyimpanan Data Konkuren di Sisi Backend** (baik menggunakan *In-Memory Array* maupun *JSON File* lokal) yang dipadukan dengan proses penulisan data ganda.

Berikut adalah risiko nyata yang akan terjadi jika digunakan oleh banyak pengguna secara bersamaan:

* **Tabrakan Data (Race Conditions):** Karena data disimpan dalam satu *state* terpusat di memori server atau satu berkas JSON, jika ada dua pengguna mengubah status tugas yang sama di milidetik yang mirip, operasi penulisan kedua berisiko menimpa (*overwrite*) hasil penulisan pertama. Hal ini dapat menyebabkan hilangnya riwayat log atau status tugas menjadi tidak sinkron.
* **Kebocoran Memori & Crash Server (jika murni In-Memory):** Setiap mutasi status menghasilkan baris log baru. Jika ratusan pengguna aktif membuat dan mengubah tugas tanpa henti, ukuran array log di memori RAM Node.js akan membengkak secara eksponensial. Lambat laun, server akan kehabisan memori (*Out of Memory*) dan mengalami *crash* total.
* **Bottleneck Proses I/O (jika menggunakan File JSON):** Jika penyimpanan menggunakan baca-tulis berkas lokal (`fs.writeFileSync`), sistem operasi harus mengunci file tersebut setiap kali ada perubahan. Ketika banyak pengguna menembak API secara bersamaan, antrean proses tulis-baca file akan menumpuk, membuat performa aplikasi menjadi sangat lambat (*blocking I/O*).
---

### 3. Jika task ini berkembang menjadi sistem besar, bagian mana yang akan kamu refactor terlebih dahulu dan kenapa?
Jika aplikasi ini berkembang menjadi sistem skala besar, ada dua bagian utama yang akan saya refaktor terlebih dahulu:

#### 1. Sisi Backend: Migrasi dari In-Memory/JSON Storage ke Database Relasional (PostgreSQL/MySQL)
* **Kenapa?** Karena sistem penyimpanan saat ini (array memori atau file JSON lokal) tidak dirancang untuk menangani data besar, transaksi konkuren dari banyak pengguna, atau integritas data jangka panjang. Jika pengguna bertambah, server akan *crash* karena kehabisan RAM atau terjadi *race conditions*.
* **Bagaimana Refaktornya:** Saya akan mengganti lapisan penyimpanan dengan database relasional seperti PostgreSQL dan memanfaatkan fitur **ACID Transactions**. Dengan begitu, proses pembaruan tugas dan pembuatan log audit dapat dibungkus dalam satu transaksi aman (jika salah satu gagal, seluruh proses dibatalkan/diretur otomatis), sehingga konsistensi data tetap 100% terjaga.

#### 2. Sisi Frontend: Memisahkan Manajemen Status (State Management) dari `App.tsx`
* **Kenapa?** Saat ini `App.tsx` bertindak sebagai komponen *God Component* yang mengurus terlalu banyak hal—mulai dari menyimpan data tugas, daftar log global, status loading, kontrol buka-tutup dialog konfirmasi, hingga penanganan error jaringan. Jika fitur bertambah, file ini akan menjadi sangat panjang, sulit dirawat, dan memicu render ulang visual (*unnecessary re-renders*) yang membuat browser lambat.
* **Bagaimana Refaktornya:** Saya akan memecah logika ini dengan menggunakan **Zustand** sebagai *global state management* untuk mengelola status antarmuka UI (seperti modal dan notifikasi), dan mengadopsi **TanStack Query (React Query)** khusus untuk menangani proses penarikan data dari API backend, manajemen memori sementara (*caching*), serta otomatisasi sinkronisasi data di latar belakang.
---

## Penggunaan AI

Aplikasi ini dikembangkan dengan melibatkan AI (**Gemini versi Chat/LLM**) sebagai rekan diskusi pemrograman untuk mempercepat pencarian solusi arsitektur yang bersih.

### Bagian yang Dibantu oleh AI:
* **Inisialisasi & Arsitektur Monorepo:** Membantu memformulasikan struktur *Monorepo* menggunakan NPM Workspaces serta konfigurasi dasar TypeScript yang sinkron antara *frontend* dan *backend*.
* **Perancangan Backend & Aturan Bisnis:** Berdiskusi dalam mendesain skema data tugas dan *audit log*, logika otomatisasi *side-effect* saat status berubah, serta penegakan validasi alur status linear di sisi server.
* **Pengembangan UI/UX & Layouting:** Berdiskusi mengenai struktur antarmuka untuk komponen, penataan tata letak papan tugas, dan penataan tata letak *audit logs*.
* **Brainstorming & Eksplorasi Solusi:** Meminta saran alternatif dan *trade-off* taktis untuk memenuhi kebutuhan *Non-Functional Requirements* (seperti menjaga konsistensi data dan sifat *idempotent update*) tanpa memicu *overengineering*.
* ***Troubleshooting* & *Debugging*:** Membantu menganalisis pesan *error*, mengatasi kendala tipe data (*type mismatch*) pada TypeScript, serta melacak masalah render ulang (*re-renders*) di sisi klien.

### Metode Validasi Hasil AI:
Seluruh masukan dan potongan kode dari AI tidak langsung ditelan mentah-mentah, melainkan divalidasi melalui proses interaktif berikut:
* **Eksperimen & Perombakan Mandiri (*UI/UX Customization*):** Setiap potongan kode dari AI dicoba langsung ke dalam proyek. Jika hasil kodenya tidak sesuai ekspektasi atau merusak tampilan yang diinginkan, saya melakukan perombakan kode secara mandiri.
* **Diskusi Iteratif Terbimbing (*Iterative Debugging*):** Ketika kode yang disarankan AI menghasilkan eror (seperti kendala tipe data TypeScript atau kegagalan logika di backend), saya mengevaluasi letak kesalahannya lalu meminta AI memperbaiki kembali dengan instruksi yang lebih spesifik.
* **Verifikasi Fungsi secara Manual (*Manual Testing*):** Memastikan secara manual di browser bahwa setiap fitur (seperti transisi status tugas dan pencatatan audit log) beneran berjalan stabil, tidak memicu eror di konsol browser, dan menolak aksi ilegal sesuai ketentuan soal.