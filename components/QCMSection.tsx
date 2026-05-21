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
}

export default function QCMSection({ qcm }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.entries(answers).filter(([i, a]) => qcm[parseInt(i)]?.correct === a).length;

  const choiceLabels = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className="space-y-4">
      {qcm.map((q, i) => (
        <div key={i} className="bg-white/10 rounded-2xl p-5 border border-white/10">
          <p className="text-white font-semibold text-sm mb-3">
            <span className="text-violet-400 font-bold">Q{i + 1}.</span> {q.question}
          </p>
          <div className="space-y-2">
            {choiceLabels.map((label) => {
              const isSelected = answers[i] === label;
              const isCorrect = q.correct === label;
              const isWrong = submitted && isSelected && !isCorrect;
              const showCorrect = submitted && isCorrect;

              return (
                <button
                  key={label}
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: label }))}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all border ${
                    showCorrect
                      ? 'bg-green-500/20 border-green-400/40 text-green-200'
                      : isWrong
                      ? 'bg-red-500/20 border-red-400/40 text-red-200'
                      : isSelected
                      ? 'bg-violet-500/30 border-violet-400/40 text-white'
                      : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold mr-2">{label}.</span>
                  {q.choices[label]}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="mt-3 text-indigo-300 text-xs bg-white/5 rounded-lg p-2">
              💡 {q.explanation}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < qcm.length}
          className="w-full bg-violet-500 hover:bg-violet-400 disabled:opacity-40 text-white font-bold py-4 rounded-xl transition-all"
        >
          Valider mes réponses ({Object.keys(answers).length}/{qcm.length})
        </button>
      ) : (
        <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/10">
          <p className="text-3xl font-black text-white">{score}/{qcm.length}</p>
          <p className="text-indigo-300 mt-1 text-sm">
            {score === qcm.length ? '🎉 Parfait ! Tu maîtrises ce cours.' : score >= qcm.length / 2 ? '👍 Bon score ! Revois les erreurs.' : '📚 Continue à réviser, tu y es presque !'}
          </p>
          <button
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-4 text-violet-400 text-sm hover:text-violet-300 transition-all"
          >
            🔄 Recommencer le QCM
          </button>
        </div>
      )}
    </div>
  );
}
