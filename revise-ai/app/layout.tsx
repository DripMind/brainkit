import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrainKit — Transforme ton cours en kit de révision en 10 secondes',
  description: 'Résumé + Flashcards + QCM générés automatiquement par IA. Zéro compte, 3 générations gratuites par jour.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>",
  },
  openGraph: {
    title: 'BrainKit — Révise plus vite avec l\'IA',
    description: 'Transforme n\'importe quel cours en résumé, flashcards et QCM en 10 secondes.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
