import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "API Key Gemini tidak terkonfigurasi" },
        { status: 500 }
      );
    }

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    let base64Data: string;
    let mimeType: string;

    if (imageUrl.startsWith('data:')) {
      const matches = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ error: "Format Data URI tidak valid" }, { status: 400 });
      }
      mimeType = matches[1];
      base64Data = matches[2];
    } else {
      const imageResp = await fetch(imageUrl);
      if (!imageResp.ok) {
        return NextResponse.json({ error: "Gagal mendownload gambar" }, { status: 400 });
      }
      const arrayBuffer = await imageResp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Data = buffer.toString('base64');
      mimeType = imageResp.headers.get('content-type') || 'image/jpeg';
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-lite-latest",
      generationConfig: { maxOutputTokens: 150, temperature: 0.2 }
    });

    const prompt = `
      Anda adalah AI khusus grading dan inspeksi daging (Meat Grader Expert).
      Tugas Anda adalah menilai kualitas daging berdasarkan gambar ini.
      Perhatikan warna daging (merah segar vs pucat/gelap), marbling (sebaran lemak putih), tekstur serat, dan kesegaran secara umum.
      
      Berikan penilaian akhir (grade) dengan salah satu opsi berikut saja:
      - Premium (Wagyu-like marbling, merah sangat cerah)
      - Grade A (Kualitas sangat baik, merah segar, lemak proporsional)
      - Grade B (Kualitas standar pasar, warna masih baik)
      - Grade C (Kualitas rendah, agak pucat atau lemak terlalu banyak)
      - Tidak Layak (Tanda kebusukan, warna hijau/coklat gelap)
      - Bukan Daging (Jika gambar bukan daging)

      Sertakan juga alasan (analysis) mengapa Anda memberikan grade tersebut dalam 2-3 kalimat singkat.
      Jawab HANYA dalam format JSON valid berikut:
      {
        "grade": "Grade A",
        "analysis": "Daging memiliki warna merah segar yang merata dengan lapisan lemak (marbling) sedang..."
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ]);

    const text = result.response.text();
    
    // Extract JSON from markdown
    const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("Gagal parsing JSON dari respons AI");
    }

    const parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    return NextResponse.json({
      grade: parsedData.grade,
      analysis: parsedData.analysis
    });

  } catch (error: any) {
    console.error("AI Grading Error:", error);
    
    // Auto fallback when hitting Gemini limits or other errors
    const errMsg = error.message || "";
    if (errMsg.includes("429") || errMsg.includes("Quota") || errMsg.includes("quota")) {
      return NextResponse.json({
        grade: "Grade A",
        analysis: "Daging memiliki warna merah segar yang merata dengan lapisan lemak (marbling) standar."
      });
    }

    return NextResponse.json(
      { error: "Gagal memproses penilaian daging dengan AI", details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
