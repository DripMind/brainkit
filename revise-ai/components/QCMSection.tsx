'use client';
import { useState } from 'react';

interface Question {
  question: string;
  choices: { A: string; B: string; C: string; D: string };
  correct: string;
  explanation: string;
}

interface Props {
  qcm: Question[];
  onComplete?: (correct: number, wrong: number) => void;
}

export default function QCMSection({ qcm, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.entries(answers).filter(([i, a]) => qcm[parseInt(i)]?.correct === a).length;
  const wrong = Object.keys(answers).length - score;
  const pct = Math.round((score / qcm.length) * 100);

  const choiceLabels = ['A', 'B', 'C', 'D'] as const;

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete?.(score, wrong);
  };

  return (
    <div className="space-y-4">
      {qcm.map((q, i) => (
        <div
          key={i}
          className="rounded-2xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <p className="font-dm font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
            <span className="font-mono text-xs mr-2" style={{ color: 'var(--color-violet)' }}>Q{i + 1}.</span>
            {q.question}
          </p>
          <div className="space-y-2">
            {choiceLabels.map((label) => {
              const val = q.choices[label];
              const selected = answers[i] === label;
              const isCorrect = q.correct === label;

              let borderColor = 'var(--border-subtle)';
              let bg = 'transparent';
              let textColor = 'var(--text-secondary)';

              if (submitted) {
                if (isCorrect) { borderColor = 'rgba(74,222,128,0.5)'; bg = 'rgba(74,222,128,0.08)'; textColor = '#4ade80'; }
                else if (selected && !isCorrect) { borderColor = 'rgba(255,107,107,0.5)'; bg = 'rgba(255,107,107,0.08)'; textColor = 'var(--color-accent)'; }
              } else if (selected) {
                borderColor = 'rgba(108,71,255,0.6)'; bg = 'rgba(108,71,255,0.1)'; textColor = 'var(--text-primary)';
              }

              return (
                <button
                  key={label}
                  onClick={() => !submitted && setAnswers(a => ({ ...a, [i]: label }))}
                  disabled={submitted}
                  className="w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 font-dm text-sm transition-all duration-200 disabled:cursor-default"
                  style={{ border: `1px solid ${borderColor}`, background: bg, color: textColor, fontSize: '14px' }}
                >
                  <span className="font-mono text-xs w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {label}
                  </span>
                  {val}
                  {submitted && isCorrect && <span className="ml-auto">✓</span>}
                  {submitted && selected && !isCorrect && <span className="ml-auto">✗</span>}
                </button>
              );
            })}
          </div>
          {submitted && q.explanation && (
            <p className="mt-3 font-dm text-xs leading-relaxed px-1" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              💡 {q.explanation}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < qcm.length}
          className="w-full btn-primary rounded-2xl py-4 font-dm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Valider le QCM
          {Object.keys(answers).length < qcm.length && (
            <span className="ml-2 font-mono text-xs opacity-50">({Object.keys(answers).length}/{qcm.length})</span>
          )}
        </button>
      ) : (
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: pct >= 80 ? 'rgba(74,222,128,0.08)' : pct >= 50 ? 'rgba(108,71,255,0.08)' : 'rgba(255,107,107,0.08)',
            border: `1px solid ${pct >= 80 ? 'rgba(74,222,128,0.3)' : pct >= 50 ? 'var(--border-violet)' : 'rgba(255,107,107,0.3)'}`,
          }}
        >
          <p className="font-syne text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {score}/{qcm.length}
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {pct}% de réussite · +{score * 5 + wrong * 2} XP gagnés
          </p>
          <p className="font-dm text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            {pct >= 80 ? '🎯 Excellent — ces notions sont bien ancrées.' :
             pct >= 50 ? '📈 Bien — continue à réviser les erreurs.' :
             '🔄 Relis le résumé et retente dans quelques jours.'}
          </p>
        </div>
      )}
    </div>
  );
}
