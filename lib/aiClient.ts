/**
 * AI Client avec fallback automatique
 * Primaire  : Mistral AI (gratuit, console.mistral.ai)
 * Secondaire : Google Gemini Flash (gratuit, aistudio.google.com)
 */

// ─── MISTRAL ────────────────────────────────────────────────────────────────
async function callMistral(prompt: string): Promise<string> {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    }),
    signal: AbortSignal.timeout(20000), // timeout 20s
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mistral error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ─── GEMINI ─────────────────────────────────────────────────────────────────
async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
          responseMimeType: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

// ─── CLIENT AVEC FALLBACK ────────────────────────────────────────────────────
export async function callAI(prompt: string): Promise<string> {
  // Essai 1 : Mistral
  if (process.env.MISTRAL_API_KEY) {
    try {
      const result = await callMistral(prompt);
      console.log('[AI] Mistral ✅');
      return result;
    } catch (err) {
      console.warn('[AI] Mistral failed, fallback Gemini:', err);
    }
  }

  // Fallback : Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await callGemini(prompt);
      console.log('[AI] Gemini fallback ✅');
      return result;
    } catch (err) {
      console.error('[AI] Gemini also failed:', err);
    }
  }

  throw new Error('Aucune IA disponible. Vérifie tes clés API dans .env.local');
}

// ─── PARSE JSON SAFE ─────────────────────────────────────────────────────────
export function safeParseJSON(str: string, fallback: any) {
  try {
    const match = str.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    return JSON.parse(match[0]);
  } catch {
    return fallback;
  }
}
