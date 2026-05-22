'use client';
import { useEffect, useRef, useState } from 'react';

const PHRASES = [
  'Tu passes 3h à lire tes cours.',
  'Tu retiens 20% le lendemain.',
  'Il existe une meilleure méthode.',
];

export default function ProblemSection() {
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setRevealed(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 250);
            obs.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-content text-center">
        <div className="flex flex-col gap-8 mb-16">
          {PHRASES.map((phrase, i) => (
            <p
              key={i}
              ref={el => { refs.current[i] = el; }}
              className={`font-syne text-4xl md:text-5xl lg:text-6xl font-bold blur-reveal ${revealed[i] ? 'revealed' : ''}`}
              style={{
                color: i === 2 ? 'transparent' : 'var(--text-primary)',
                ...(i === 2 ? {
                  background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--color-cyan) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transitionDelay: `${i * 0.25}s`,
                } : {
                  opacity: revealed[i] ? (i === 0 ? 0.5 : 0.7) : 0,
                  transitionDelay: `${i * 0.25}s`,
                }),
              }}
            >
              {phrase}
            </p>
          ))}
        </div>

        {/* Gradient divider */}
        <div className="gradient-line w-full max-w-2xl mx-auto" style={{ opacity: revealed[2] ? 1 : 0, transition: 'opacity 1s 0.8s ease' }} />
      </div>
    </section>
  );
}
