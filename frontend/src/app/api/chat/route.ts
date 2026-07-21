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

  // Token Optimization: Compact context objects to essential fields only
  const compactProducts = contextData?.products?.slice(0, 4).map((p: any) => ({
    title: p.title,
    price: p.price,
    stock: p.stock,
    category: p.category
  })) || [];

  const compactOrders = contextData?.orders?.slice(0, 4).map((o: any) => ({
    status: o.status,
    totalAmount: o.totalAmount
  })) || [];

  const dynamicContext = contextData ? `
INFO KONTEKS (HEMAT TOKEN):
- User: ${contextData.profile?.fullName || contextData.profile?.username || 'Peternak'}
- Produk Toko (${contextData.products?.length || 0} items): ${JSON.stringify(compactProducts)}
- Total Produk Market: ${contextData.allMarketplaceCount || 0}
- Pesanan Toko: ${JSON.stringify(compactOrders)}
- Cuaca: ${contextData.weather?.temperature_2m ? `${Math.round(contextData.weather.temperature_2m)}°C` : 'N/A'}
  ` : "";

  // Token Optimization: Limit history to last 6 messages max
  const recentMessages = Array.isArray(messages) ? messages.slice(-6) : [];

  try {
    const result = await streamText({
      model: google('gemini-flash-lite-latest') as any,
      maxTokens: 350, // Strict output token limit to prevent quota exhaustion
      system: `Anda adalah "Pranata Intelligence", konsultan AI peternakan, manajemen kandang, logistik, dan bisnis peternak.

TUGAS:
1. Diagnosis penyakit ternak (Veterinary).
2. Saran operasional kandang & pakan (Management & Business).

INFORMASI PLATFORM PRANATA:
- Marketplace: Jual beli Daging, Susu, Telur. (TIDAK ADA ternak hidup/sayur/buah/alat).
- Fitur: Marketplace, Calendar, AI Veterinary, Store Manager.
- Keterbatasan: Tidak ada IoT/sensor otomatis, tidak ada ternak hidup.

FORMATTING:
- Jawab singkat, padat, ramah, dan to the point.
- Gunakan markdown bullet points dan **bold**. JANGAN buat paragraf panjang.${dynamicContext}`,
      messages: convertToCoreMessages(recentMessages),
    });

    return result.toAIStreamResponse();
  } catch (error: any) {
    console.error("AI Insight Error:", error);
    
    // Auto fallback for 429 quota or other API errors
    const fallbackText = "TITLE: Perhatian API\nVALUE: Limit Tercapai\nDESC: Kuota AI gratis telah habis atau API Key invalid. AI Insight sedang offline.\nCTA_TEXT: Mengerti\nCTA_URL: /hub\n---\nTITLE: Info Status\nVALUE: Mode Fallback\nDESC: Aplikasi tetap berfungsi normal, silakan lanjutkan pengelolaan toko Anda.\nCTA_TEXT: Lihat Etalase\nCTA_URL: /hub/store";
    
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
