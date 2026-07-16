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

  const { messages } = await req.json();
  console.log("INCOMING MESSAGES:", JSON.stringify(messages, null, 2));

  const result = await streamText({
    model: google('gemini-2.5-flash') as any, // Sangat cepat dan mendukung multi-modal (gambar/pdf)
    system: `Anda adalah "Pranata Agri-LLM", sebuah sistem intelijen pusat untuk segala hal yang berhubungan dengan peternakan hewan. Anda BUKAN hanya dokter hewan, tetapi juga konsultan bisnis peternakan, manajemen kandang, logistik, dan keuangan peternak.
    
Tugas Anda adalah:
1. Membantu peternak mendiagnosis penyakit ternak berdasarkan deskripsi atau gambar yang mereka unggah (Veterinary).
2. Memberikan saran manajemen operasional kandang, jadwal panen, dan efisiensi biaya (Management).
3. Menganalisis prospek bisnis, rasio pakan (FCR), dan memberikan solusi logistik pengadaan pakan (Business & Logistics).
4. Selalu berikan jawaban yang ringkas, ilmiah, praktis, dan mudah dimengerti oleh peternak awam.
5. Gunakan sapaan ramah dan empati. Gunakan tabel jika Anda membandingkan harga atau rasio pakan.
6. JANGAN menjawab pertanyaan yang tidak ada hubungannya sama sekali dengan industri peternakan, hewan, atau pertanian. Jika ditanya hal di luar itu, tolak dengan sopan dan kembalikan ke topik peternakan.`,
    messages: convertToCoreMessages(messages),
  });

  return result.toAIStreamResponse();
}
