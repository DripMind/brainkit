import { NextRequest, NextResponse } from 'next/server';
import { getSummaryPrompt, getFlashcardsPrompt, getQCMPrompt } from '@/lib/prompts';
import { extractTextFromPDF, truncateToTokenLimit } from '@/lib/parsePDF';
import { callAI, safeParseJSON } from '@/lib/aiClient';

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

    // Appels parallèles avec fallback automatique
    const [summaryRaw, flashcardsRaw, qcmRaw] = await Promise.all([
      callAI(getSummaryPrompt(truncatedText)),
      callAI(getFlashcardsPrompt(truncatedText)),
      callAI(getQCMPrompt(truncatedText)),
    ]);

    const summaryData = safeParseJSON(summaryRaw, {
      summary: 'Erreur de génération du résumé.',
      key_concepts: [],
    });

    const flashcardsData = safeParseJSON(flashcardsRaw, { flashcards: [] });
    const qcmData = safeParseJSON(qcmRaw, { qcm: [] });

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
