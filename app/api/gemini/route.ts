import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are SurakshaSOS AI — an emergency response assistant for India.
You provide concise, calm, step-by-step first-aid and emergency guidance.
Always: number your steps clearly, keep each step under 2 sentences, end with "Call 112 immediately if unsure."
Never recommend dangerous actions. Prioritise calling professional emergency services.
Respond in the same language the user writes in (Hindi or English).`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
  }

  const { messages } = await req.json() as {
    messages: { role: string; parts: { text: string }[] }[];
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages,
        generationConfig: { maxOutputTokens: 512, temperature: 0.4 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, no response received.';
  return NextResponse.json({ text });
}
