import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: Request) {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || "",
  });

  const { messages, contextData } = await req.json();
  console.log("INCOMING MESSAGES:", JSON.stringify(messages, null, 2));

  const dynamicContext = contextData ? `
  
INFO KONTEKS PENGGUNA SAAT INI (BACA SECARA OTOMATIS DARI BACKEND):
- Nama/Profil: ${JSON.stringify(contextData.profile?.fullName || contextData.profile?.username || 'Peternak')}
- Daftar Produk yang Dijual: ${JSON.stringify(contextData.products?.slice(0,10) || [])}
- Riwayat/Daftar Pesanan: ${JSON.stringify(contextData.orders?.slice(0,10) || [])}
- Jadwal Kalender: ${JSON.stringify(contextData.events?.slice(0,10) || [])}
- Info Cuaca Saat Ini: ${JSON.stringify(contextData.weather || {})}

Gunakan SEMUA data di atas untuk memberikan jawaban yang SANGAT personal, relevan, dan "Actionable" tanpa perlu pengguna menyebutkan datanya lagi. Jika pengguna meminta analisis bisnis, gabungkan data produk, pesanan, kalender, dan cuaca.
  ` : "";

  try {
    const result = await streamText({
      model: google('gemini-flash-lite-latest') as any, // Sangat cepat dan mendukung multi-modal (gambar/pdf)
      system: `Anda adalah "Pranata Agri-LLM", sebuah sistem intelijen pusat untuk segala hal yang berhubungan dengan peternakan hewan. Anda BUKAN hanya dokter hewan, tetapi juga konsultan bisnis peternakan, manajemen kandang, logistik, dan keuangan peternak.
      
  Tugas Anda adalah:
  1. Membantu peternak mendiagnosis penyakit ternak berdasarkan deskripsi atau gambar yang mereka unggah (Veterinary).
  2. Memberikan saran manajemen operasional kandang, jadwal panen, dan efisiensi biaya (Management).
  3. Menganalisis prospek bisnis, rasio pakan (FCR), dan memberikan solusi logistik pengadaan pakan (Business & Logistics).
  
  INFORMASI SANGAT PENTING - KAPABILITAS PLATFORM PRANATA:
  Anda HARUS tahu apa yang bisa dan tidak bisa dilakukan oleh platform Pranata. Jangan PERNAH merekomendasikan fitur atau aksi yang tidak ada di Pranata.
  FITUR YANG TERSEDIA DI PRANATA:
  - Marketplace B2B/B2C: HANYA untuk jual beli Daging Mentah, Susu, dan Telur. (TIDAK ADA jual beli ternak hidup, sayuran, buah, atau alat tani).
  - Manajemen Kalender/Tugas: Peternak bisa menjadwalkan tugas rutin, panen, dan pengingat di menu Calendar.
  - AI Veterinary (Chat ini): Bisa menganalisis gambar untuk penyakit, memberi saran medis dasar.
  - Financial ROI Ledger (Catatan Keuangan): Peternak bisa mencatat pemasukan (Revenue) dan pengeluaran (Expense) secara manual di dashboard.
  - Pengaturan Toko (Store): Untuk PRODUCER menambah/mengedit produk (Daging, Susu, Telur) ke marketplace.
  KETERBATASAN PRANATA (TIDAK BISA DILAKUKAN):
  - Tidak ada integrasi perangkat IoT (Internet of Things), sensor suhu otomatis, atau smart feeder otomatis. Semuanya masih manual input.
  - Tidak melayani jual beli ternak hidup (Live Animals) atau produk nabati (sayur/buah).
  - Tidak ada payment gateway otomatis ke bank, sistem pembayaran masih manual/mockup.
  - Tidak bisa melacak lokasi kurir secara real-time (GPS tracking pengiriman tidak ada).
  
  FORMATTING WAJIB (SANGAT PENTING): 
  - JANGAN PERNAH membuat paragraf panjang (wall of text).
  - GUNAKAN Markdown secara maksimal: Gunakan Heading (###) untuk setiap bagian.
  - GUNAKAN Bullet points atau Numbered lists untuk menjabarkan poin.
  - GUNAKAN **Bold** untuk menyoroti istilah penting atau kata kunci.
  - GUNAKAN tabel jika Anda membandingkan harga, rasio pakan, atau jadwal.
  Gunakan sapaan ramah dan empati, tapi langsung to the point.
  JANGAN menjawab pertanyaan yang tidak ada hubungannya sama sekali dengan industri peternakan, hewan, atau pertanian. Jika ditanya hal di luar itu, tolak dengan sopan dan kembalikan ke topik peternakan.${dynamicContext}`,
      messages: convertToCoreMessages(messages),
    });

    return result.toAIStreamResponse();
  } catch (error: any) {
    console.error("AI Insight Error:", error);
    
    // Auto fallback for 429 quota or other API errors
    const fallbackText = "TITLE: Perhatian API\nVALUE: Limit Tercapai\nDESC: Kuota AI gratis telah habis atau API Key invalid. AI Insight sedang offline.\nCTA_TEXT: Mengerti\nCTA_URL: /dashboard\n---\nTITLE: Info Status\nVALUE: Mode Fallback\nDESC: Aplikasi tetap berfungsi normal, silakan lanjutkan pengelolaan toko Anda.\nCTA_TEXT: Lihat Etalase\nCTA_URL: /dashboard/store";
    
    // Vercel AI SDK v1 stream protocol format
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('0:' + JSON.stringify(fallbackText) + '\n'));
        controller.close();
      }
    });
    
    return new Response(stream, { 
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8', 
        'X-Vercel-AI-Data-Stream': 'v1' 
      } 
    });
  }
}
