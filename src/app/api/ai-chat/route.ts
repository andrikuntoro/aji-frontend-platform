import { NextResponse } from 'next/server';

// Simulating an LLM logic for the sake of the demo without requiring API keys
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = body;

    // Simulate network delay to make it feel like AI is thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMsg = message.toLowerCase();
    
    // Simple rule-based mock logic for objection handling scenario
    let reply = "";
    
    if (lowerMsg.includes("investasi") || lowerMsg.includes("manfaat") || lowerMsg.includes("kembali")) {
      reply = "Oh, jadi uangnya tidak hilang ya Pak? Tapi tetap saja, kan saya harus keluar uang tiap bulan. Kalau misalnya saya tiba-tiba butuh dana darurat bagaimana?";
    } else if (lowerMsg.includes("darurat") || lowerMsg.includes("tarik") || lowerMsg.includes("fleksibel")) {
      reply = "Hmm masuk akal juga sih. Fleksibel ya bisa ditarik kapan saja. Tapi istri saya kayaknya nggak bakal setuju kalau saya ambil polis sekarang. Gimana dong?";
    } else if (lowerMsg.includes("istri") || lowerMsg.includes("keluarga") || lowerMsg.includes("istrinya")) {
      reply = "Baiklah, Bapak menjelaskannya cukup jelas. Mungkin saya akan coba diskusi dulu dengan istri nanti malam ya. Boleh minta brosurnya?";
    } else if (lowerMsg.includes("brosur") || lowerMsg.includes("kirim") || lowerMsg.includes("baca")) {
      reply = "Terima kasih Pak atas penjelasannya. Nanti saya hubungi lagi ya setelah diskusi.";
    } else {
      // Default bounce-back for generic answers
      reply = "Saya ngerti maksud Bapak, tapi jujur aja saya masih mikir-mikir. Uang segitu kan lumayan kalau buat jajan anak, atau keperluan mendadak. Memang bedanya sama nabung biasa apa?";
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "Maaf, sistem sedang sibuk, bisakah diulangi?" }, { status: 500 });
  }
}
