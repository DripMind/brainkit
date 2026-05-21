'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Entre un email valide pour continuer.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erreur de paiement');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const freePros = ['3 générations par jour', 'Résumé + Flashcards + QCM', 'Export PDF / Copie'];
  const freecons = ['Générations illimitées', 'Priorité serveur'];
  const proPros = ['Générations illimitées', 'Résumé + Flashcards + QCM', 'Export PDF / Copie', 'Priorité serveur', 'Nouvelles fonctionnalités en avant-première'];

  return (
    <main className="bg-animated noise min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Orbs */}
      <div className="orb absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-violet-600/20 pointer-events-none" />
      <div className="orb absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/15 pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="text-white">Choisis ton </span>
            <span className="gradient-text">plan</span>
          </h1>
          <p className="text-white/40 text-base">Commence gratuitement. Passe au Pro quand tu veux.</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 fade-in-up-1">

          {/* Free */}
          <div className="glass rounded-3xl p-7 border border-white/[0.08]">
            <div className="mb-6">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Gratuit</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-white">0€</span>
                <span className="text-white/30 text-sm mb-2">pour toujours</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {freePros.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
              {freecons.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/25">
                  <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-white/20 text-xs flex-shrink-0">×</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push('/')}
              className="w-full py-3.5 rounded-2xl border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all duration-300"
            >
              Continuer gratuitement
            </button>
          </div>

          {/* Pro */}
          <div className="relative glass-strong rounded-3xl p-7 border border-violet-400/20 glow-violet-sm">
            <div className="absolute top-5 right-5">
              <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAIRE
              </span>
            </div>

            <div className="mb-6">
              <p className="gradient-text text-xs font-bold uppercase tracking-widest mb-2">Pro</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-white">4,99€</span>
                <span className="text-white/30 text-sm mb-2">/ mois</span>
              </div>
              <p className="text-white/30 text-xs mt-1">Annule quand tu veux</p>
            </div>

            <ul className="space-y-3 mb-6">
              {proPros.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="w-5 h-5 rounded-full bg-violet-500/30 flex items-center justify-center text-violet-400 text-xs flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Email input */}
            <div className="mb-3">
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/50 focus:bg-white/[0.08] transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleCheckout()}
              />
              {error && <p className="text-red-400 text-xs mt-2 px-1">{error}</p>}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner w-4 h-4" />
                  <span>Redirection...</span>
                </>
              ) : (
                <span>🚀 Passer au Pro</span>
              )}
            </button>

            <p className="text-center text-white/25 text-xs mt-3 flex items-center justify-center gap-1.5">
              <span>🔒</span> Paiement sécurisé par Stripe
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-8 fade-in-up-3">
          <button
            onClick={() => router.push('/')}
            className="text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            ← Retour
          </button>
        </div>
      </div>
    </main>
  );
}
