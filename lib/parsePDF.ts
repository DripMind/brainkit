import pdf from 'pdf-parse';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    const text = data.text.trim();
    if (!text || text.length < 50) {
      throw new Error('PDF vide ou illisible. Assure-toi que ton PDF contient du texte (pas une image scannée).');
    }
    return text;
  } catch (err: any) {
    throw new Error(err.message || 'Impossible de lire ce PDF.');
  }
}

export function truncateToTokenLimit(text: string, maxChars = 12000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n\n[... texte tronqué pour respecter la limite]';
}
