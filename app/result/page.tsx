'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlashcardDeck from '@/components/FlashcardDeck';
import QCMSection from '@/components/QCMSection';
import SummarySection from '@/components/SummarySection';
import FeedbackBar from '@/components/FeedbackBar';

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'qcm'>('summary');
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);

  useEffect(() => {
    const stored = sessionStorage.getItem('revise_result');
    if (!stored) { router.push('/'); return; }
    setData(JSON.parse(stored));
    const count = parseInt(localStorage.getItem('revise_count') || '0') + 1;
    localStorage.setItem('revise_count', String(count));
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!data) return null;

  const tabs = [
    { id: 'summary', label: 'Résumé', icon: '📝' },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏', count: data.flashcards?.length },
    { id: 'qcm', label: 'QCM', icon: '🎯', count: data.qcm?.length },
  ];

  const handleCopy = () => {
    const content = `# Résumé\n${data.summary}\n\n# Flashcards\n${data.flashcards.map((f: any, i: number) => `Q${i+1}: ${f.question}\nR: ${f.answer}`).join('\n\n')}\n\n# QCM\n${data.qcm.map((q: any, i: number) => `Q${i+1}: ${q.question}\nA: ${q.choices.A}\nB: ${q.choices.B}\nC: ${q.choices.C}\nD: ${q.choices.D}\nRéponse: ${q.correct}`).join('\n\n')}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="bg-animated noise min-h-screen px-4 py-8 relative overflow-hidden">

      {/* Ambient orbs */}
      <div className="orb fixed top-[-80px] right-[-80px] w-[400px] h-[400px] bg-violet-600/15 pointer-events-none" />
      <div className="orb fixed bottom-[-100px] left-[-80px] w-[450px] h-[450px] bg-blue-600/10 pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className={`relative z-10 max-w-2xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="fade-in-up">
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-white">Brain</span>
              <span className="gradient-text">Kit</span>
            </h1>
            <p className="text-white/40 text-sm mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Kit de révision prêt
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="no-print glass rounded-xl px-4 py-2 text-white/50 hover:text-white text-sm font-medium transition-all duration-300 hover:bg-white/10 flex items-center gap-2"
          >
            <span>←</span> Nouveau cours
          </button>
        </div>

        {/* Stats bento */}
        <div className="grid grid-cols-3 gap-3 mb-6 fade-in-up-1">
          {[
            { label: 'Résumé', value: '1', icon: '📝', color: 'from-violet-500/20 to-purple-500/10' },
            { label: 'Flashcards', value: data.flashcards?.length || 0, icon: '🃏', color: 'from-blue-500/20 to-cyan-500/10' },
            { label: 'Questions', value: data.qcm?.length || 0, icon: '🎯', color: 'from-pink-500/20 to-rose-500/10' },
          ].map((s) => (
            <div key={s.label} className={`glass rounded-2xl p-4 text-center card-hover bg-gradient-to-br ${s.color} border border-white/[0.08]`}>
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-white/40 text-xs mt-1 font-medium flex items-center justify-center gap-1">
                <span>{s.icon}</span> {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-1.5 mb-5 flex gap-1 fade-in-up-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'tab-active text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/40'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="fade-in-up-3">
          {activeTab === 'summary' && <SummarySection summary={data.summary} concepts={data.key_concepts} />}
          {activeTab === 'flashcards' && <FlashcardDeck flashcards={data.flashcards} />}
          {activeTab === 'qcm' && <QCMSection qcm={data.qcm} />}
        </div>

        {/* Export actions */}
        <div className="mt-6 grid grid-cols-2 gap-3 no-print fade-in-up-4">
          <button
            onClick={handleCopy}
            className={`glass rounded-2xl py-3.5 text-sm font-semibold transition-all duration-300 border border-white/[0.08] flex items-center justify-center gap-2 ${
              copied ? 'text-green-400 border-green-400/30 bg-green-500/10' : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {copied ? '✅ Copié !' : '📋 Copier tout'}
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary rounded-2xl py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2"
          >
            🖨️ Imprimer / PDF
          </button>
        </div>

        {/* Feedback */}
        <div className="no-print">
          <FeedbackBar sessionId={sessionId} />
        </div>

      </div>
    </main>
  );
}
