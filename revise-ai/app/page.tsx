'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasReachedLimit, isProUser, getRemainingGenerations, incrementQuota } from '@/lib/quota';

export default function Home() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(3);
  const [isPro, setIsPro] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setRemaining(getRemainingGenerations());
    setIsPro(isProUser());
  }, []);

  const loadingSteps = [
    { msg: 'Lecture de ton cours...', icon: '📖' },
    { msg: 'Analyse du contenu...', icon: '🧠' },
    { msg: 'Génération du résumé...', icon: '✍️' },
    { msg: 'Création des flashcards...', icon: '🃏' },
    { msg: 'Préparation du QCM...', icon: '🎯' },
    { msg: 'Finalisation de ton kit...', icon: '✨' },
  ];

  const handleGenerate = async () => {
    if (!text.trim() && !file) {
      setError('Colle ton cours ou uploade un PDF pour commencer.');
      return;
    }
    if (!isPro && hasReachedLimit()) {
      router.push('/pricing');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingStep(0);
    setLoadingMsg(loadingSteps[0].msg);

    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, loadingSteps.length - 1);
      setLoadingStep(step);
      setLoadingMsg(loadingSteps[step].msg);
    }, 1800);

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await fetch('/api/generate', { method: 'POST', body: formData });
      } else {
        res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');

      if (!isPro) {
        incrementQuota();
        setRemaining(getRemainingGenerations());
      }

      clearInterval(interval);
      sessionStorage.setItem('revise_result', JSON.stringify(data));
      router.push('/result');
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Une erreur est survenue. Réessaie.');
      setLoading(false);
    }
  };

  return (
    <main className="bg-animated noise min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Ambient orbs */}
      <div className="orb absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-violet-600/20 pointer-events-none" />
      <div className="orb absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-blue-600/15 pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="orb absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-purple-500/10 pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10 fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs text-violet-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Propulsé par Mistral AI — Aucune donnée stockée
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span className="text-white">Brain</span>
            <span className="gradient-text text-glow">Kit</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed">
            Transforme ton cours en kit de révision complet<br className="hidden md:block" />
            en <span className="text-violet-300 font-bold">10 secondes</span>.
          </p>

          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            {['📝 Résumé', '🃏 Flashcards', '🎯 QCM'].map((item) => (
              <span key={item} className="text-sm text-white/40 font-medium">{item}</span>
            ))}
          </div>
        </div>

        {/* Pro badge */}
        {!isPro && (
          <div className="flex justify-center mb-6 fade-in-up-1">
            <button
              onClick={() => router.push('/pricing')}
              className="group border-animated glass rounded-full px-5 py-2 text-xs font-semibold text-violet-300 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-yellow-400">⚡</span>
              Passer au Pro — illimité à 4,99€/mois
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}

        {/* Main card */}
        <div className="glass-strong rounded-3xl p-6 shadow-2xl glow-violet fade-in-up-2">
          {!loading ? (
            <>
              {/* Textarea */}
              <div className="relative mb-4">
                <textarea
                  className="w-full h-44 bg-white/[0.03] text-white placeholder-white/25 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-400/50 border border-white/[0.06] transition-all duration-300 focus:bg-white/[0.06] font-medium leading-relaxed"
                  placeholder="Colle ton cours ici... (texte, notes, paragraphes)"
                  value={text}
                  onChange={(e) => { setText(e.target.value); setFile(null); }}
                />
                {text && (
                  <div className="absolute bottom-3 right-3 text-white/20 text-xs">
                    {text.length} car.
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-white/30 text-xs font-semibold tracking-widest uppercase">ou</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* PDF Upload */}
              <div
                className="w-full border border-dashed border-violet-400/20 rounded-2xl p-5 text-center cursor-pointer hover:border-violet-400/50 hover:bg-violet-500/5 transition-all duration-300 group"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-violet-400 text-lg">📄</span>
                    <p className="text-violet-300 font-semibold text-sm">{file.name}</p>
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                ) : (
                  <>
                    <p className="text-white/40 text-sm group-hover:text-white/60 transition-colors">
                      📎 Clique pour uploader un PDF
                    </p>
                    <p className="text-white/20 text-xs mt-1">PDF texte uniquement · pas scanné</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => { setFile(e.target.files?.[0] || null); setText(''); }}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Quota warning */}
              {!isPro && remaining === 1 && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-yellow-400 text-xs text-center">
                  ⚠️ Dernière génération gratuite —{' '}
                  <button onClick={() => router.push('/pricing')} className="underline hover:text-yellow-300 font-semibold">
                    passe au Pro pour continuer
                  </button>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={handleGenerate}
                disabled={!isPro && remaining === 0}
                className="btn-primary mt-5 w-full text-white font-bold py-4 rounded-2xl text-base relative z-10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                <span className="relative z-10">
                  {!isPro && remaining === 0
                    ? '🔒 Limite atteinte — Passer au Pro'
                    : '✨ Générer mon kit de révision'}
                </span>
              </button>

              {/* Remaining counter */}
              {!isPro && remaining > 0 && (
                <p className="text-center text-white/25 text-xs mt-3">
                  {remaining} génération{remaining > 1 ? 's' : ''} gratuite{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''} aujourd'hui
                </p>
              )}

              {!isPro && remaining === 0 && (
                <button
                  onClick={() => router.push('/pricing')}
                  className="mt-3 w-full py-3 rounded-2xl border border-violet-400/20 text-violet-400 text-sm font-semibold hover:bg-violet-500/10 transition-all duration-300"
                >
                  ⚡ Voir les plans →
                </button>
              )}
            </>
          ) : (
            /* Loading state */
            <div className="flex flex-col items-center justify-center py-14 gap-8">
              <div className="relative">
                <div className="spinner w-16 h-16" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  {loadingSteps[loadingStep]?.icon}
                </div>
              </div>

              <div className="text-center">
                <p className="text-white font-semibold text-lg mb-1">{loadingMsg}</p>
                <p className="text-white/30 text-sm">Ça prend environ 10 secondes...</p>
              </div>

              {/* Progress dots */}
              <div className="flex gap-2">
                {loadingSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      i <= loadingStep ? 'bg-violet-400 scale-110' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer trust signals */}
        <div className="flex items-center justify-center gap-6 mt-8 fade-in-up-4">
          {['🔒 Aucune donnée stockée', '⚡ Résultat en 10s', '🆓 3 essais gratuits'].map((item) => (
            <span key={item} className="text-white/25 text-xs font-medium">{item}</span>
          ))}
        </div>
      </div>
    </main>
  );
}
