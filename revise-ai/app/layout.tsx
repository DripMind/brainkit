import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrainKit — Transforme ton cours en kit de révision en 10 secondes',
  description: 'Résumé + Flashcards + QCM générés automatiquement par IA. Zéro compte, 3 générations gratuites par jour.',
  metadataBase: new URL('https://brainkit-reviseai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  keywords: ['BrainKit', 'révision IA', 'flashcards IA', 'résumé cours', 'QCM automatique', 'outil révision étudiant'],
  authors: [{ name: 'BrainKit' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>",
  },
  openGraph: {
    title: 'BrainKit — Révise plus vite avec l\'IA',
    description: 'Transforme n\'importe quel cours en résumé, flashcards et QCM en 10 secondes. Gratuit, zéro compte.',
    type: 'website',
    url: 'https://brainkit-reviseai.vercel.app',
    siteName: 'BrainKit',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainKit — Révise plus vite avec l\'IA',
    description: 'Résumé + Flashcards + QCM générés par IA en 10 secondes.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
