'use client';

import { useEffect, useRef } from 'react';

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.current = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY.current = (e.clientY - rect.top) / rect.height - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/20 to-transparent blur-3xl animate-orb" />
        <div className="absolute -bottom-1/3 -right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-600/15 to-transparent blur-3xl animate-orb" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600/10 to-transparent blur-3xl animate-orb" style={{ animationDelay: '1s' }} />
      </div>

      {/* Neural network 3D placeholder (CSS-based) */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: '1200px',
        }}
      >
        <div
          className="w-96 h-96 relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${mouseY.current * 10}deg) rotateY(${mouseX.current * 10}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Central node */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 blur-xl opacity-60 animate-glow-pulse" />
            <div className="absolute w-12 h-12 rounded-full border-2 border-violet-500 glow-violet" />
          </div>

          {/* Orbiting nodes */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 150;
            const y = Math.sin(angle) * 150;

            return (
              <div
                key={i}
                className="absolute w-8 h-8 rounded-full border border-cyan-400/50 glow-cyan"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  background: i % 2 === 0 ? 'rgba(108, 71, 255, 0.3)' : 'rgba(0, 212, 255, 0.2)',
                  animation: `orbFloat ${6 + i}s ease-in-out infinite`,
                }}
              >
                <div className="w-2 h-2 bg-cyan-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-text-secondary">Propulsé par Mistral AI</span>
          </div>
        </div>

        {/* Main title */}
        <h1
          className="text-hero font-black text-white mb-6 leading-tight"
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
          }}
        >
          <span className="block">Transforme</span>
          <span className="block">ton cours en</span>
          <span className="inline-block gradient-text-violet-cyan">kit de révision</span>
          <span className="block">en 10 secondes</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-subtitle text-text-secondary max-w-2xl mx-auto mb-8"
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
          }}
        >
          Résumé · Flashcards · QCM — générés automatiquement par intelligence artificielle
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.6s backwards',
          }}
        >
          <button
            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary group inline-flex items-center justify-center gap-2"
          >
            <span>→ Essayer gratuitement</span>
            <span className="group-hover:translate-x-1 transition-transform">✨</span>
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            Voir comment ça marche
            <span>↓</span>
          </button>
        </div>

        {/* Trust signals */}
        <div
          className="flex flex-wrap gap-6 justify-center text-text-secondary text-sm"
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.8s backwards',
          }}
        >
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Aucune donnée stockée</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>Résultat en 10 secondes</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🆓</span>
            <span>3 essais gratuits</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-scroll-indicator">
        <div className="w-6 h-10 border-2 border-violet-500/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-violet-500 rounded-full animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
