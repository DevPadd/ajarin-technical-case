# Student's Pet Companion

## Overview

### Fitur yang dibuat:

Pet companion yang bisa tumbuh dan dikustomisasi, terinspirasi dari crackd.it dan wayground.com

- Pet virtual 6 stage dengan animasi dan aura
- Sistem tugas dengan XP (daily-login, send-chat, join-series)
- Kustomisasi pet (rename pet dengan double click pada nama pet, memilih 7 warna + 3 aksesoris seperti topi, mahkota, dan beanie)

### Masalah yang ingin diselesaikan:

Retensi dan interaktivitas siswa yang kurang, terutama di platform belajar online karena kurangnya elemen engaging dan feedback progres yang visual.

### Mengapa solusi ini meningkatkan engagement:

- Elemen gamifikasi (pet evolusi, XP) memberikan rasa pencapaian dan progres visual
- Tugas harian mendorong kebiasaan belajar konsisten
- Kustomisasi pet menciptakan ikatan personal dengan pengguna

## Technical Details

### Tech Stack

- Next.js 16 (App Router), TypeScript strict
- Tailwind CSS v4, Framer Motion, lucide-react, react-hot-toast
- localStorage untuk persistensi data

### Architecture & Decisions:

- Frontend-only + localStorage, tidak memakai backend karena waktu dan kapabilitas developer yang belum cukup
- React Context + custom hook untuk state management gamification
- Route group (app) untuk memisahkan halaman dengan sidebar
- SVG inline untuk pet

### Running Locally:

1. Clone repositori:
   `git clone <url-repo>`
   `cd ajarin-submission-2`
2. Install dependencies:
   `npm install`
3. Jalankan development server:
   `npm run dev`
4. Buka `http://localhost:3000` di browser.
5. (Opsional) Build untuk production:
   `npm run build`
   `npm start`
   Catatan: Semua data disimpan di localStorage browser. Tidak ada database atau backend yang diperlukan. Data akan hilang jika localStorage dibersihkan.

## Development Process

### AI Usage

### AI/Agent yang digunakan

agent Opencode dengan model Deepseek V4 Flash Free dan Minimax-m3

### Workflow yang digunakan:

Vibe coding: user membuat component statis, lalu menginstruksikan AI untuk menerapkan fungsionalitasnya. AI langsung menulis kode secara iteratif. User mereview hasilnya, meminta perubahan, dan AI menyesuaikan. Proses diulang sampai project selesai.

### Bagaimana AI membantu selama pengerjaan:

- Menulis logic and interaktibilitas komponen React (pet, sidebar, modal)
- Membantu debugging (stale closure, XSS, scroll leak, stage inconsistency)
- Refactoring kode (rename provider, hapus streak system, flatten route structure)
- Audit keamanan dan produksi — menemukan 47 isu, memperbaiki semuanya
- Dokumentasi arsitektur ke EXPLANATION.md

### Tantangan terbesar:

- toast XP selalu menampilkan nilai yang salah karena result dihitung di dalam updater setState
- Sidebar ikut scroll bersama konten utama, dan layout flex flow standar tidak bisa menanganinya

### Bagaimana mengatasinya:

- compute StreakResult dari closure state sebelum memanggil setState
- ticky top-0 h-screen di sidebar lalu overflow-y-auto di main content

### Kompromi yang diambil:

- Streak system dihapus, fokus hanya ke pet, tugas, dan kustomisasi
- Tidak ada backend, semua data di localStorage, tidak ada auth atau multi-user
- Data user hardcoded ("Dio V")
- Hanya 1 series sampel pada halaman series, tidak ada data dinamis

### Future Improvements

Menghubungkan backend agar menjadi fitur yang siap dideploy, menambahkan aset aksesoris lebih banyak lagi agar bervariasi, menambahkan variasi task yang lebih banyak, menambahkan interaktivitas pet dimana user bisa mengclick pet dan mendapatkan feedback seperti gerakan tubuh atau ekspresi yang berubah.

## AI Conversation Summary

### Tujuan & Ide Awal

Membangun Ajarin, platform belajar frontend-only berbasis Next.js dengan gamifikasi (pet virtual + sistem tugas) untuk meningkatkan retensi siswa, tanpa backend.

### Fitur yang Diimplementasikan

- Pet virtual — SVG inline, 6 stage (Telur → Legenda), animasi bernapas/berkedip, aura per stage
- Sistem tugas — 3 jenis: daily-login (10 XP), send-chat (15 XP), join-series (30 XP), dedup per hari via isTaskDoneToday
- Kustomisasi pet — 7 warna + 3 aksesoris (Cap, Crown, Beanie) dengan preview SVG di modal
- Chat room — localStorage, XP per pesan, rendering aman via textContent (anti-XSS)
- Halaman series — pencarian + filter subjek dengan 1 series sampel
- DevFab — panel debug untuk tester (atur XP, toggle tugas, reset data)
- Sidebar responsif — rail desktop + drawer mobile
- Loading/error boundaries di route group (app)

### Keputusan Teknis

- Frontend-only + localStorage — tanpa backend, cocok untuk case study statis
- React Context (GamificationProvider) — lebih ringan dari Redux, semua komponen berbagi state
- SVG inline — path data di JSX, tanpa network request, aksesoris di-inline untuk hindari background rect
- Route group (app) — sidebar hanya untuk halaman yang membutuhkan
- Streak system dihapus atas permintaan user — fokus hanya pet, tugas, kustomisasi

### Bug & Perbaikan

- XSS di chat → diperbaiki dengan SafeText + textContent
- Toaster selalu +2 XP → stale closure di completeTask, diperbaiki dengan hitung result sebelum setState
- Root layout tanpa <html>/<body> → rewrite app/layout.tsx
- Sidebar ikut scroll → sticky top-0 h-screen + overflow-y-auto di main
- Stage 6 tidak bisa dicapai → konsistensi clamp di pet.tsx, labels, fungsi XP
- Series filter tidak jalan → di-wire dengan useState
- Focus trap & body scroll leak → ditambahkan di modal dan sidebar
- 8 aset publik tidak terpakai → dihapus

### Peran AI Selama Development

- Menulis kode — komponen React, hook, utility functions, layout, styling Tailwind, halaman
- Refactoring — rename StreakProvider → GamificationProvider, flatten route groups, hapus streak system
- Debugging — identifikasi stale closure di completeTask, XSS di chat, scroll leak di sidebar
- Audit produksi — menjelajahi seluruh codebase, menemukan 47 isu (2 critical, 9 high, sisanya medium/low), membantu memperbaiki semuanya
- Dokumentasi — membuat EXPLANATION.md yang menjelaskan arsitektur dan alur data secara menyeluruh
