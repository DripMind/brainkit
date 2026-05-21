import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ReviseAI — Transforme ton cours en kit de révision en 10 secondes',
  description: 'Résumé + Flashcards + QCM générés automatiquement par IA. Zéro compte, gratuit.',
  openGraph: {
    title: 'ReviseAI',
    description: 'Transforme ton cours en kit de révision complet en 10 secondes.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
