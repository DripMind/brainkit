'use client';
import { useState } from 'react';

interface Flashcard { question: string; answer: string; }
interface Props { flashcards: Flashcard[]; onComplete?: (correct: number, wrong: number) => void; }

export default function FlashcardDeck({ flashcards, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const card = flashcards[current];
  const total = flashcards.length;

  const flip = () => { setFlipped(f => !f); setRevealed(true); };

  const answer = (knew: boolean) => {
    if (knew) setCorrect(c => c + 1); else setWrong(w => w + 1);
    setFlipped(false);
    setRevealed(false);
    setTimeout(() => {
      if (current + 1 >= total) {
        setDone(true);
        onComplete?.(knew ? correct + 1 : correct, knew ? wrong : wrong + 1);
      } else {
        setCurrent(c => c + 1);
      }
    }, 150);
  };

  if (done) {
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <p className="font-syne text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{correct}/{total}</p>
        <p className="font-mono text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          {pct}% · +{correct * 5 + wrong * 2} XP
        </p>
        <p className="font-dm text-sm" style={{ color: 'var(--text-secondary)' }}>
          {pct >= 80 ? '🃏 Maîtrise solide.' : pct >= 50 ? '📈 Continue, tu progresses.' : '🔄 Reviens demain pour consolider.'}
        </p>
        <button
          onClick={() => { setCurrent(0); setCorrect(0); setWrong(0); setDone(false); setFlipped(false); }}
          className="mt-5 px-6 py-3 rounded-xl font-dm text-sm font-semibold transition-all"
          style={{ background: 'rgba(108,71,255,0.15)', border: '1px solid var(--border-violet)', color: 'var(--color-violet)', cursor: 'pointer' }}
        >
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((current) / total) * 100}%`, background: 'linear-gradient(90deg, var(--color-violet), var(--color-cyan))' }}
          />
        </div>
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{current + 1}/{total}</span>
      </div>

      {/* Card */}
      <div
        onClick={flip}
        className="relative cursor-pointer rounded-2xl p-8 text-center min-h-[220px] flex flex-col items-center justify-center select-none transition-all duration-300"
        style={{
          background: flipped ? 'rgba(108,71,255,0.06)' : 'var(--bg-card)',
          border: `1px solid ${flipped ? 'var(--border-violet)' : 'var(--border-subtle)'}`,
          boxShadow: flipped ? 'var(--glow-violet)' : 'none',
        }}
      >
        <span className="font-mono text-xs mb-4 uppercase tracking-widest" style={{ color: flipped ? 'var(--color-violet)' : 'var(--text-muted)' }}>
          {flipped ? '↩ Réponse' : '→ Question'}
        </span>
        <p className="font-dm font-medium" style={{ color: 'var(--text-primary)', fontSize: '17px', lineHeight: '1.6' }}>
          {flipped ? card.answer : card.question}
        </p>
        {!revealed && (
          <p className="mt-4 font-mono text-xs" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
            Clique pour révéler
          </p>
        )}
      </div>

      {/* Answer buttons — apparaissent seulement après flip */}
      {revealed && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => answer(false)}
            className="py-4 rounded-2xl font-dm font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', color: 'var(--color-accent)', cursor: 'pointer' }}
          >
            ✗ Je ne savais pas
            <span className="block font-mono text-xs mt-0.5 opacity-50">+{2} XP</span>
          </button>
          <button
            onClick={() => answer(true)}
            className="py-4 rounded-2xl font-dm font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', cursor: 'pointer' }}
          >
            ✓ Je savais
            <span className="block font-mono text-xs mt-0.5 opacity-50">+{5} XP</span>
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
        <span style={{ color: '#4ade80' }}>✓ {correct}</span>
        <span>·</span>
        <span style={{ color: 'var(--color-accent)' }}>✗ {wrong}</span>
      </div>
    </div>
  );
}
