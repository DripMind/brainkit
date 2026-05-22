'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FREE_FEATURES = [
  '3 générations / jour',
  'Résumé + Flashcards + QCM',
  'Aucun compte requis',
];

const PRO_FEATURES = [
  'Générations illimitées',
  'Historique de tes kits',
  'Export PDF des résultats',
  'Priorité serveur',
  'Nouvelles fonctionnalités en avant-première',
];

export default function PricingSection() {
  const router = useRouter();

  return (
    <section id="pricing" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-content">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-cyan)' }}>
            Tarifs
          </p>
          <h2 className="font-syne text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Simple et transparent.
          </h2>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free */}
          <div className="card p-10">
            <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              Gratuit
            </p>
            <div className="flex items-end gap-2 mb-8">
              <span className="font-syne text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>0€</span>
              <span className="font-dm text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>pour toujours</span>
            </div>

            <ul className="space-y-4 mb-10">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 font-dm text-base" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-green-400 text-sm">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full py-4 rounded-2xl font-dm font-semibold text-base transition-all duration-300 hover:bg-white/5"
              style={{
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              Commencer gratuitement →
            </button>
          </div>

          {/* Pro */}
          <div className="pricing-pro p-10">
            {/* Badge */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs tracking-widest uppercase gradient-text font-bold">Pro</p>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full font-dm"
                style={{ background: 'rgba(108,71,255,0.2)', color: 'var(--color-violet)', border: '1px solid rgba(108,71,255,0.3)' }}
              >
                Recommandé
              </span>
            </div>

            <div className="flex items-end gap-2 mb-1">
              <span className="font-syne text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>4,99€</span>
              <span className="font-dm text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>/mois</span>
            </div>
            <p className="font-dm text-xs mb-8" style={{ color: 'var(--text-muted)' }}>Annulation à tout moment</p>

            <ul className="space-y-4 mb-10">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 font-dm text-base" style={{ color: 'var(--text-primary)' }}>
                  <span className="gradient-text text-sm font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push('/pricing')}
              className="btn-accent w-full py-4 rounded-2xl text-base font-semibold"
              style={{ border: 'none' }}
            >
              Passer au Pro ⚡
            </button>
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center font-dm text-sm mt-10" style={{ color: 'var(--text-muted)' }}>
          🔒 Aucune donnée stockée · Propulsé par Mistral AI · Annulation à tout moment
        </p>
      </div>
    </section>
  );
}
