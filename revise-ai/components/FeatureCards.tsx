'use client';
import { useEffect, useRef, useState } from 'react';

const FEATURES = [
  {
    icon: '📝',
    title: 'Résumé intelligent',
    desc: 'Les points essentiels de ton cours, restructurés pour la mémorisation. Plus de remplissage, que l\'essentiel.',
    color: 'var(--color-violet)',
  },
  {
    icon: '🃏',
    title: 'Flashcards Q/R',
    desc: 'Des paires question/réponse générées automatiquement. Format idéal pour la répétition espacée.',
    color: 'var(--color-cyan)',
  },
  {
    icon: '🎯',
    title: 'QCM avec correction',
    desc: 'Teste-toi immédiatement. L\'IA explique chaque réponse correcte et incorrecte.',
    color: 'var(--color-accent)',
  },
];

export default function FeatureCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section-padding" ref={sectionRef} style={{ background: 'var(--bg-primary)' }}>
      <div className="max-content">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-violet)' }}>
            Fonctionnalités
          </p>
          <h2 className="font-syne text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Tout ce dont tu as besoin<br />
            <span className="gradient-text">pour réviser efficacement.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              ref={el => {
                if (el) {
                  el.style.transitionDelay = `${i * 100}ms`;
                  el.classList.toggle('visible', visible);
                }
              }}
            >
              {/* Icon */}
              <div
                className="text-3xl mb-6 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                }}
              >
                {f.icon}
              </div>

              {/* Gradient accent line */}
              <div
                className="w-8 h-0.5 mb-5 rounded"
                style={{ background: f.color }}
              />

              <h3 className="font-syne text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p className="font-dm text-base leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
