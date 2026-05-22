'use client';

import { useEffect, useRef } from 'react';

const steps = [
  {
    icon: '📎',
    title: 'Tu uploades ton cours',
    description: 'PDF, texte, n\'importe quel format. En quelques secondes.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: '🧠',
    title: 'L\'IA analyse et structure',
    description: 'Mistral AI identifie les concepts clés et les hiérarchise.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: '✨',
    title: 'Ton kit de révision est prêt',
    description: 'Résumé, flashcards, QCM — tout en quelques secondes.',
    color: 'from-violet-500 to-cyan-500',
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.step-card');
            cards.forEach((card, i) => {
              const htmlCard = card as HTMLElement;
              htmlCard.style.animation = `fadeInUp 0.6s ease-out ${i * 0.15}s forwards`;
              htmlCard.style.opacity = '0';
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-32 px-4 section-padding"
    >
      <div className="container-max">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-display mb-4 gradient-text-violet-cyan">Comment ça marche</h2>
          <p className="text-subtitle text-text-secondary">Trois étapes simples pour réviser plus vite</p>
        </div>

        {/* Steps Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-card card-base card-hover group"
            >
              {/* Icon Background */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{step.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-title text-white mb-3">{step.title}</h3>
              <p className="text-body text-text-secondary">{step.description}</p>

              {/* Step Number */}
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">
                {index + 1}
              </div>

              {/* Connection Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-500" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <button
            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary inline-flex items-center gap-2"
          >
            Essayer maintenant
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
