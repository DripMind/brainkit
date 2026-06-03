'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FlashcardDeck from '@/components/FlashcardDeck';
import QCMSection from '@/components/QCMSection';
import SummarySection from '@/components/SummarySection';
import FeedbackBar from '@/components/FeedbackBar';
import XPToast from '@/components/XPToast';
import ProgressBar from '@/components/ProgressBar';
import { completeSession, getProgression } from '@/lib/progression';

interface XPResult { xpEarned: number; streak: number; bonusXP: number; leveledUp: boolean; newLevel: string; }

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'qcm'>('summary');
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [xpResult, setXpResult] = useState<XPResult | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}`);

  useEffect(() => {
    const stored = sessionStorage.getItem('revise_result');
    if (!stored) { router.push('/'); return; }
    setData(JSON.parse(stored));

    // Bonus XP pour avoir généré un kit
    const result = completeSession(0, 0); // session de lecture = bonus fixe
    setXpResult(result);

    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleActivityComplete = (correct: number, wrong: number) => {
    const result = completeSession(correct, wrong);
    setXpResult(result);
  };

  if (!data) return null;

  const tabs = [
    { id: 'summary',    label: 'Résumé',     icon: '📝' },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏', count: data.flashcards?.length },
    { id: 'qcm',        label: 'QCM',        icon: '🎯', count: data.qcm?.length },
  ];

  const handleCopy = () => {
    const content = [
      `# Résumé\n${data.summary}`,
      `# Flashcards\n${data.flashcards.map((f: any, i: number) => `Q${i+1}: ${f.question}\nR: ${f.answer}`).join('\n\n')}`,
      `# QCM\n${data.qcm.map((q: any, i: number) => `Q${i+1}: ${q.question}\nA: ${q.choices.A}\nB: ${q.choices.B}\nC: ${q.choices.C}\nD: ${q.choices.D}\nRéponse: ${q.correct}`).join('\n\n')}`,
    ].join('\n\n');
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen px-4 py-8 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>

      {/* Orbs */}
      <div className="fixed top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(108,71,255,0.12) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />

      {/* XP Toast */}
      {xpResult && (
        <XPToast {...xpResult} onDone={() => setXpResult(null)} />
      )}

      <div
        className="relative z-10 max-w-2xl mx-auto"
        style={{ transition: 'opacity 0.6s ease, transform 0.6s ease', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne text-2xl font-bold">
              Brain<span className="gradient-text">Kit</span>
            </h1>
            <p className="font-mono text-xs mt-0.5 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ animation: 'pulse 2s infinite' }} />
              Kit prêt
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="no-print font-dm text-sm px-4 py-2 rounded-xl transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            ← Nouveau cours
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6 no-print">
          <ProgressBar />
        </div>

        {/* Stats bento */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Résumé',     value: '1',                          icon: '📝', color: 'var(--color-violet)' },
            { label: 'Flashcards', value: data.flashcards?.length || 0, icon: '🃏', color: 'var(--color-cyan)' },
            { label: 'Questions',  value: data.qcm?.length || 0,        icon: '🎯', color: 'var(--color-accent)' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <p className="font-syne text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <p className="font-mono text-xs mt-1 flex items-center justify-center gap-1" style={{ color: 'var(--text-muted)' }}>
                {s.icon} {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-5 border-b no-print" style={{ borderColor: 'var(--border-subtle)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`tab-btn text-sm flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded-md"
                  style={{ background: activeTab === tab.id ? 'rgba(108,71,255,0.2)' : 'rgba(255,255,255,0.05)', color: activeTab === tab.id ? 'var(--color-violet)' : 'var(--text-muted)' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'summary' && <SummarySection summary={data.summary} concepts={data.key_concepts} />}
          {activeTab === 'flashcards' && <FlashcardDeck flashcards={data.flashcards} onComplete={handleActivityComplete} />}
          {activeTab === 'qcm' && <QCMSection qcm={data.qcm} onComplete={handleActivityComplete} />}
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3 no-print">
          <button
            onClick={handleCopy}
            className="rounded-2xl py-3.5 font-dm text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: copied ? 'rgba(74,222,128,0.1)' : 'transparent',
              border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'var(--border-subtle)'}`,
              color: copied ? '#4ade80' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {copied ? '✅ Copié !' : '📋 Copier tout'}
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary rounded-2xl py-3.5 font-dm text-sm font-semibold flex items-center justify-center gap-2"
          >
            🖨️ Imprimer
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
