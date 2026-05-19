'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { setStatus('error'); return; }

    fetch(`/api/stripe/verify?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.token) {
          localStorage.setItem('revise_pro_token', data.token);
          setEmail(data.email || '');
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-indigo-200">Activation de ton accès Pro...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <p className="text-3xl mb-4">❌</p>
        <p className="text-white text-lg font-bold mb-2">Une erreur est survenue</p>
        <p className="text-indigo-300 text-sm mb-6">Si tu as été débité, contacte-nous.</p>
        <button onClick={() => router.push('/')} className="text-violet-400 hover:text-white">← Retour</button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-6xl mb-4">🎉</p>
      <h1 className="text-3xl font-black text-white mb-2">Tu es Pro !</h1>
      {email && <p className="text-indigo-300 text-sm mb-1">Confirmé pour <span className="text-violet-300">{email}</span></p>}
      <p className="text-indigo-400 text-sm mb-8">Générations illimitées activées sur cet appareil.</p>
      <button
        onClick={() => router.push('/')}
        className="bg-violet-500 hover:bg-violet-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-violet-500/30"
      >
        ✨ Commencer à réviser
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-white">Chargement...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
