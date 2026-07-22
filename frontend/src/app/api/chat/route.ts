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

  // Ensure messages with attachments have valid Base64 data URIs and non-empty prompt text
  const sanitizedMessages = recentMessages.map((msg: any) => {
    let sanitizedMsg = { ...msg };

    if (Array.isArray(sanitizedMsg.experimental_attachments)) {
      sanitizedMsg.experimental_attachments = sanitizedMsg.experimental_attachments.filter((att: any) => {
        if (!att || !att.url || typeof att.url !== 'string') return false;
        // Accept valid data URIs or http/https URLs with sufficient payload length
        return (att.url.startsWith('data:image/') && att.url.includes(';base64,')) || att.url.startsWith('http://') || att.url.startsWith('https://');
      });
    }

    if ((!sanitizedMsg.content || typeof sanitizedMsg.content !== 'string' || sanitizedMsg.content.trim() === '') && (sanitizedMsg.experimental_attachments?.length || sanitizedMsg.attachments?.length)) {
      sanitizedMsg.content = 'Tolong analisis foto / lampiran ini.';
    }

    return sanitizedMsg;
  });

  try {
    const result = await streamText({
      model: google('gemini-2.5-flash') as any,
      maxTokens: 1500, // Sufficient output token limit for complete responses
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
      messages: convertToCoreMessages(sanitizedMessages),
    });

    return result.toAIStreamResponse();
  } catch (error: any) {
    console.error("AI Insight Error:", error?.message || error);
    if (error?.stack) console.error(error.stack);
    
    const errorDetails = error?.message ? ` (${error.message})` : "";
    const fallbackText = `TITLE: Perhatian API\nVALUE: Limit / Key Invalid\nDESC: AI Insight offline${errorDetails}. Pastikan GEMINI_API_KEY di .env.local valid (dari Google AI Studio).\nCTA_TEXT: Mengerti\nCTA_URL: /hub\n---\nTITLE: Info Status\nVALUE: Mode Fallback\nDESC: Aplikasi tetap berfungsi normal, silakan lanjutkan pengelolaan toko Anda.\nCTA_TEXT: Lihat Etalase\nCTA_URL: /hub/store`;
    
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
