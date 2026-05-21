'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCheckout = async () => {
    if (!email || !email.includes('@')) {
      setError('Entre un email valide.');
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
        setError(data.error || 'Erreur lors du paiement.');
        setLoading(false);
      }
    } catch {
      setError('Erreur réseau. Réessaie.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white">
          Revise<span className="text-violet-400">AI</span>
        </h1>
        <p className="mt-2 text-indigo-300">Choisis ton plan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">

        {/* Plan Gratuit */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col">
          <div className="mb-4">
            <span className="text-indigo-300 text-sm font-semibold uppercase tracking-widest">Gratuit</span>
            <p className="text-4xl font-black text-white mt-1">0€</p>
            <p className="text-indigo-400 text-sm mt-1">Pour toujours</p>
          </div>
          <ul className="space-y-2 flex-1 mb-6">
            {[
              '✅ 3 générations par jour',
              '✅ Résumé + Flashcards + QCM',
              '✅ Export PDF / Copie',
              '❌ Générations illimitées',
              '❌ Priorité serveur',
            ].map((item) => (
              <li key={item} className="text-sm text-indigo-200">{item}</li>
            ))}
          </ul>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all"
          >
            Continuer gratuitement
          </button>
        </div>

        {/* Plan Pro */}
        <div className="bg-violet-500/20 border-2 border-violet-400 rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-violet-400 text-white text-xs font-bold px-2 py-1 rounded-full">
            POPULAIRE
          </div>
          <div className="mb-4">
            <span className="text-violet-300 text-sm font-semibold uppercase tracking-widest">Pro</span>
            <p className="text-4xl font-black text-white mt-1">4,99€</p>
            <p className="text-violet-300 text-sm mt-1">par mois · Annule quand tu veux</p>
          </div>
          <ul className="space-y-2 flex-1 mb-6">
            {[
              '✅ Générations illimitées',
              '✅ Résumé + Flashcards + QCM',
              '✅ Export PDF / Copie',
              '✅ Priorité serveur',
              '✅ Nouvelles fonctionnalités en avant-première',
            ].map((item) => (
              <li key={item} className="text-sm text-indigo-100">{item}</li>
            ))}
          </ul>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="w-full bg-white/10 text-white placeholder-indigo-400 rounded-xl px-4 py-3 text-sm mb-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm transition-all disabled:opacity-60 shadow-lg shadow-violet-500/30"
          >
            {loading ? 'Redirection...' : '🚀 Passer au Pro'}
          </button>
          <p className="text-indigo-400 text-xs text-center mt-2">Paiement sécurisé par Stripe</p>
        </div>
      </div>

      <button
        onClick={() => router.push('/')}
        className="mt-8 text-indigo-400 hover:text-white text-sm transition-all"
      >
        ← Retour
      </button>
    </main>
  );
}
