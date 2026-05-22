'use client';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    icon: '📎',
    title: 'Tu uploades ton cours',
    desc: "PDF, texte, n'importe quel format. En quelques secondes, BrainKit analyse le contenu.",
    number: '01',
  },
  {
    icon: '🧠',
    title: "L'IA analyse et structure",
    desc: 'Mistral AI identifie les concepts clés, les hiérarchise et les reformule pour la mémorisation.',
    number: '02',
  },
  {
    icon: '✨',
    title: 'Ton kit est prêt',
    desc: 'Résumé condensé, flashcards question/réponse, QCM avec correction automatique.',
    number: '03',
  },
];

export default function HowItWorks() {
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
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how" className="section-padding" ref={sectionRef} style={{ background: 'var(--bg-primary)' }}>
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
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-cyan)' }}>
            Comment ça marche
          </p>
          <h2 className="font-syne text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            De ton cours à ton kit<br />
            <span className="gradient-text">en 3 étapes.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="step-card"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
              }}
            >
              {/* Step number */}
              <div className="font-mono text-xs mb-6" style={{ color: 'var(--color-violet)', opacity: 0.6 }}>
                {step.number}
              </div>

              {/* Icon */}
              <div
                className="text-4xl mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(108, 71, 255, 0.1)', border: '1px solid rgba(108, 71, 255, 0.2)' }}
              >
                {step.icon}
              </div>

              {/* Text */}
              <h3 className="font-syne text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <p className="font-dm text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
