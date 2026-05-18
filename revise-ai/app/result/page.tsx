'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlashcardDeck from '@/components/FlashcardDeck';
import QCMSection from '@/components/QCMSection';
import SummarySection from '@/components/SummarySection';

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'qcm'>('summary');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('revise_result');
    if (!stored) { router.push('/'); return; }
    setData(JSON.parse(stored));
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!data) return null;

  const tabs = [
    { id: 'summary', label: '📝 Résumé' },
    { id: 'flashcards', label: '🃏 Flashcards' },
    { id: 'qcm', label: '🎯 QCM' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-blue-900 px-4 py-8">
      <div className={`max-w-2xl mx-auto transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">
              Revise<span className="text-violet-400">AI</span>
            </h1>
            <p className="text-indigo-300 text-sm">Ton kit de révision est prêt ✅</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-400 hover:text-white text-sm border border-white/20 px-3 py-1.5 rounded-lg transition-all"
          >
            ← Nouveau cours
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Résumé', value: '1', icon: '📝' },
            { label: 'Flashcards', value: data.flashcards?.length || 0, icon: '🃏' },
            { label: 'Questions QCM', value: data.qcm?.length || 0, icon: '🎯' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <p className="text-2xl font-black text-white">{s.icon} {s.value}</p>
              <p className="text-indigo-300 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white/10 text-indigo-300 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'summary' && <SummarySection summary={data.summary} concepts={data.key_concepts} />}
        {activeTab === 'flashcards' && <FlashcardDeck flashcards={data.flashcards} />}
        {activeTab === 'qcm' && <QCMSection qcm={data.qcm} />}

        {/* Export */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              const content = `# Résumé\n${data.summary}\n\n# Flashcards\n${data.flashcards.map((f: any, i: number) => `Q${i+1}: ${f.question}\nR: ${f.answer}`).join('\n\n')}\n\n# QCM\n${data.qcm.map((q: any, i: number) => `Q${i+1}: ${q.question}\nA: ${q.choices.A}\nB: ${q.choices.B}\nC: ${q.choices.C}\nD: ${q.choices.D}\nRéponse: ${q.correct}`).join('\n\n')}`;
              navigator.clipboard.writeText(content);
              alert('Copié dans le presse-papier ! ✅');
            }}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-sm font-semibold transition-all border border-white/20"
          >
            📋 Copier tout
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-violet-500 hover:bg-violet-400 text-white py-3 rounded-xl text-sm font-semibold transition-all"
          >
            🖨️ Imprimer / PDF
          </button>
        </div>
      </div>
    </main>
  );
}
