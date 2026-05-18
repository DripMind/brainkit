'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const loadingMessages = [
    'Lecture de ton cours... 📖',
    'Analyse du contenu... 🧠',
    'Génération du résumé... ✍️',
    'Création des flashcards... 🃏',
    'Préparation du QCM... 🎯',
    'Finalisation de ton kit... ✨',
  ];

  const handleGenerate = async () => {
    if (!text.trim() && !file) {
      setError('Colle ton cours ou uploade un PDF pour commencer.');
      return;
    }
    setError('');
    setLoading(true);

    let msgIndex = 0;
    setLoadingMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIndex]);
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
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Revise<span className="text-violet-400">AI</span>
        </h1>
        <p className="mt-3 text-lg md:text-xl text-indigo-200 font-medium">
          Transforme ton cours en kit de révision complet en{' '}
          <span className="text-violet-300 font-bold">10 secondes</span>.
        </p>
        <p className="mt-1 text-sm text-indigo-400">
          Résumé + Flashcards + QCM · Zéro compte · Gratuit
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
        {!loading ? (
          <>
            <textarea
              className="w-full h-48 bg-white/5 text-white placeholder-indigo-300 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 border border-white/10"
              placeholder="Colle ton cours ici... (texte, notes, paragraphes)"
              value={text}
              onChange={(e) => { setText(e.target.value); setFile(null); }}
            />

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-indigo-300 text-xs font-medium">OU</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            <div
              className="w-full border-2 border-dashed border-violet-400/50 rounded-xl p-5 text-center cursor-pointer hover:border-violet-400 hover:bg-white/5 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <p className="text-violet-300 font-medium">📄 {file.name}</p>
              ) : (
                <>
                  <p className="text-indigo-300 text-sm">📎 Clique pour uploader un PDF</p>
                  <p className="text-indigo-500 text-xs mt-1">PDF texte uniquement (pas scanné)</p>
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

            {error && (
              <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              className="mt-5 w-full bg-violet-500 hover:bg-violet-400 text-white font-bold py-4 rounded-xl text-lg transition-all active:scale-95 shadow-lg shadow-violet-500/30"
            >
              ✨ Générer mon kit de révision
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-indigo-200 text-lg font-medium animate-pulse">{loadingMsg}</p>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-violet-400 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-indigo-500 text-xs text-center">
        Propulsé par GPT-4o-mini · Aucune donnée stockée
      </p>
    </main>
  );
}
