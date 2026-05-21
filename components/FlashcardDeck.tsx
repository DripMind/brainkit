'use client';

import { useState } from 'react';

interface Flashcard {
  question: string;
  answer: string;
}

interface Props {
  flashcards: Flashcard[];
}

export default function FlashcardDeck({ flashcards }: Props) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = flashcards[current];
  const progress = Math.round(((current + 1) / flashcards.length) * 100);

  const next = () => { setFlipped(false); setTimeout(() => setCurrent((c) => Math.min(c + 1, flashcards.length - 1)), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setCurrent((c) => Math.max(c - 1, 0)), 150); };
  const markKnown = () => { setKnown((k) => new Set([...k, current])); next(); };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-indigo-300 text-xs mb-2">
        <span>{current + 1} / {flashcards.length}</span>
        <span>{known.size} maîtrisées ✅</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
        <div className="bg-violet-400 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div
        className="cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '180px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-indigo-400 text-xs uppercase tracking-wide mb-3">Question</p>
            <p className="text-white font-semibold text-base">{card.question}</p>
            <p className="text-indigo-400 text-xs mt-4">Clique pour voir la réponse</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 bg-violet-500/20 border border-violet-400/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-violet-300 text-xs uppercase tracking-wide mb-3">Réponse</p>
            <p className="text-white font-semibold text-base">{card.answer}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex-1 py-3 rounded-xl bg-white/10 text-indigo-300 text-sm font-semibold disabled:opacity-30 hover:bg-white/20 transition-all"
        >
          ← Précédente
        </button>
        <button
          onClick={markKnown}
          className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-300 text-sm font-semibold hover:bg-green-500/30 transition-all border border-green-400/20"
        >
          ✅ Je sais
        </button>
        <button
          onClick={next}
          disabled={current === flashcards.length - 1}
          className="flex-1 py-3 rounded-xl bg-white/10 text-indigo-300 text-sm font-semibold disabled:opacity-30 hover:bg-white/20 transition-all"
        >
          Suivante →
        </button>
      </div>

      {/* All cards list */}
      <div className="mt-4 space-y-2">
        <p className="text-indigo-400 text-xs uppercase tracking-wide">Toutes les cartes</p>
        {flashcards.map((f, i) => (
          <div
            key={i}
            onClick={() => { setFlipped(false); setCurrent(i); }}
            className={`p-3 rounded-xl cursor-pointer transition-all border text-sm ${
              i === current
                ? 'bg-violet-500/20 border-violet-400/40 text-white'
                : known.has(i)
                ? 'bg-green-500/10 border-green-400/20 text-indigo-300'
                : 'bg-white/5 border-white/10 text-indigo-300 hover:bg-white/10'
            }`}
          >
            <span className="font-medium">Q{i + 1}:</span> {f.question}
          </div>
        ))}
      </div>
    </div>
  );
}
