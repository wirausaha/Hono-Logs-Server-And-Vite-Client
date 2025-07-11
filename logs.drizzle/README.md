## 🚀 Usage

Aplikasi server ini sangat ringan hanya memiliki 3 router dan mungkin akan saya ditambah 1 untuk menghapus log. Server ini bisa di deploy ke Serverless seperti : Vercel, Netlify, Cloudflare, Bun, atau AWS Lambda tetapi saya tidak tahu apakah Prisma cocok atau tidak untuk Serverless.

```bash
npm install

> buat file .env atau copy file .env.sample ke .env lalu edit sesuaikan setting di komputer anda 

npm run dev

atau :

npm run build

> buat file .env atau copy file .env.sample ke .env lalu edit sesuaikan setting di komputer anda 

npm run start

> Pastikan client berjalan pada port yang berbeda dengan server, misalnya klien di port 3000, server di port 3001 

> Aplikasi server ini bisa dijalankan di serverless dengan sedikit penyesuaian dan bisa dimanfaatkan untuk semua project
> tetapi mungkin dibutuhkan modifikasi tergantung kreatifitas dan kebutuhan masing-masing

2025-07-10 
    > Penambahan field sourceApp dan ip supaya tidak perlu pencarian / filter ke dalam field json
    > Pengambilan data hanya 20 (sementara dihardcode jadi 5)
        if (nonlylast20 == 1) {
            nlength = 5
            nstart = 0
        } 
      kalau user ingin mengambil hanya 20 (5) data terakhir berdasar sourceApp dan Category.
      Saya kira 5 cukup, tetapi sudah terlanjur variabelnya diberi nama 20
    



