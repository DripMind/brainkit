'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Lazy load the 3D canvas to avoid SSR issues
const NeuralCanvas = dynamic(() => import('./NeuralCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(108,71,255,0.4) 0%, transparent 70%)'
      }} />
    </div>
  ),
});

const WORDS = ['TRANSFORME', 'TON COURS', 'EN KIT DE', 'RÉVISION', 'EN 10 SECONDES.'];

export default function Hero3D() {
  const router = useRouter();
  const [visibleWords, setVisibleWords] = useState<number[]>([]);

  useEffect(() => {
    WORDS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleWords(prev => [...prev, i]);
      }, 300 + i * 100);
    });
  }, []);

  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <NeuralCanvas />
      </div>

      {/* Overlay gradient pour lisibilité du texte */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: 'linear-gradient(to right, rgba(3,1,10,0.7) 0%, rgba(3,1,10,0.2) 50%, rgba(3,1,10,0.5) 100%)'
      }} />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-10 md:px-16 lg:px-24" style={{ paddingTop: '80px' }}>
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="hero-title mb-8">
            {WORDS.map((word, i) => (
              <span
                key={i}
                className="block"
                style={{
                  opacity: visibleWords.includes(i) ? 1 : 0,
                  transform: visibleWords.includes(i) ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                  color: i === 4 ? 'transparent' : 'var(--text-primary)',
                  ...(i === 4 ? {
                    background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--color-cyan) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  } : {}),
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            className="font-dm text-xl mb-10"
            style={{
              color: 'var(--text-secondary)',
              opacity: visibleWords.length === WORDS.length ? 1 : 0,
              transform: visibleWords.length === WORDS.length ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s 0.3s ease, transform 0.6s 0.3s ease',
            }}
          >
            Résumé · Flashcards · QCM — générés par IA.
          </p>

          {/* CTAs */}
          <div
            className="flex items-center gap-6 flex-wrap"
            style={{
              opacity: visibleWords.length === WORDS.length ? 1 : 0,
              transform: visibleWords.length === WORDS.length ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s 0.5s ease, transform 0.6s 0.5s ease',
            }}
          >
            <button
              onClick={scrollToUpload}
              className="btn-primary glow-pulse rounded-2xl px-8 py-4 text-base font-semibold flex items-center gap-3"
            >
              Essayer gratuitement
              <span className="arrow-animate text-lg">→</span>
            </button>
            <button
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-dm text-base transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Voir comment ça marche ↓
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-bounce"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8" cy="7" r="2" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
