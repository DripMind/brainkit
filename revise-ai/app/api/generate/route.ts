import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSummaryPrompt, getFlashcardsPrompt, getQCMPrompt } from '@/lib/prompts';
import { extractTextFromPDF, truncateToTokenLimit } from '@/lib/parsePDF';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeParseJSON(str: string, fallback: any) {
  try {
    const match = str.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    return JSON.parse(match[0]);
  } catch {
    return fallback;
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let text = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const rawText = formData.get('text') as string | null;

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        text = await extractTextFromPDF(buffer);
      } else if (rawText) {
        text = rawText;
      }
    } else {
      const body = await req.json();
      text = body.text || '';
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Le texte est trop court. Colle au moins quelques paragraphes de cours.' },
        { status: 400 }
      );
    }

    const truncatedText = truncateToTokenLimit(text);

    const [summaryRes, flashcardsRes, qcmRes] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: getSummaryPrompt(truncatedText) }],
        temperature: 0.3,
        max_tokens: 800,
      }),
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: getFlashcardsPrompt(truncatedText) }],
        temperature: 0.3,
        max_tokens: 1200,
      }),
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: getQCMPrompt(truncatedText) }],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    ]);

    const summaryData = safeParseJSON(summaryRes.choices[0].message.content || '', {
      summary: 'Erreur de génération du résumé.',
      key_concepts: [],
    });

    const flashcardsData = safeParseJSON(flashcardsRes.choices[0].message.content || '', {
      flashcards: [],
    });

    const qcmData = safeParseJSON(qcmRes.choices[0].message.content || '', {
      qcm: [],
    });

    return NextResponse.json({
      summary: summaryData.summary,
      key_concepts: summaryData.key_concepts || [],
      flashcards: flashcardsData.flashcards || [],
      qcm: qcmData.qcm || [],
    });
  } catch (err: any) {
    console.error('Erreur API generate:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur serveur. Réessaie dans quelques secondes.' },
      { status: 500 }
    );
  }
}
