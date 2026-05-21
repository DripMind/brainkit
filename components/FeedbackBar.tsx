'use client';

import { useState, useEffect } from 'react';

interface Props {
  sessionId: string;
}

export default function FeedbackBar({ sessionId }: Props) {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(`feedback_${sessionId}`);
    if (existing) setVoted(JSON.parse(existing).vote);
  }, [sessionId]);

  const saveFeedback = (vote: 'up' | 'down', note = '') => {
    const entry = {
      vote,
      note,
      date: new Date().toISOString(),
      sessionId,
    };

    // Stocke dans localStorage
    localStorage.setItem(`feedback_${sessionId}`, JSON.stringify(entry));

    // Ajoute à l'historique global
    const history = JSON.parse(localStorage.getItem('revise_feedback_history') || '[]');
    history.push(entry);
    if (history.length > 100) history.shift(); // garde les 100 derniers
    localStorage.setItem('revise_feedback_history', JSON.stringify(history));

    // Stats globales pour améliorer les prompts
    const stats = JSON.parse(localStorage.getItem('revise_stats') || '{"up":0,"down":0,"total":0}');
    stats[vote]++;
    stats.total++;
    stats.satisfaction = Math.round((stats.up / stats.total) * 100);
    localStorage.setItem('revise_stats', JSON.stringify(stats));

    setVoted(vote);
    setSubmitted(true);
  };

  const handleVote = (vote: 'up' | 'down') => {
    if (voted) return;
    if (vote === 'down') {
      setShowInput(true);
      setVoted('down');
    } else {
      saveFeedback('up');
    }
  };

  const handleSubmitComment = () => {
    saveFeedback('down', comment);
    setShowInput(false);
  };

  if (submitted && voted === 'up') {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-green-400 text-sm">
        ✅ Merci pour ton retour !
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mt-2">
      {!showInput ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-indigo-300 text-sm">Ce kit de révision était utile ?</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleVote('up')}
              disabled={!!voted}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                voted === 'up'
                  ? 'bg-green-500/20 border-green-400/40 text-green-300'
                  : 'bg-white/10 border-white/20 text-indigo-200 hover:bg-green-500/10 hover:border-green-400/30'
              }`}
            >
              👍 Oui
            </button>
            <button
              onClick={() => handleVote('down')}
              disabled={!!voted && voted !== 'down'}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                voted === 'down'
                  ? 'bg-red-500/20 border-red-400/40 text-red-300'
                  : 'bg-white/10 border-white/20 text-indigo-200 hover:bg-red-500/10 hover:border-red-400/30'
              }`}
            >
              👎 À améliorer
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-indigo-300 text-sm">Qu'est-ce qui n'allait pas ? <span className="text-indigo-500">(optionnel)</span></p>
          <textarea
            className="w-full bg-white/5 text-white placeholder-indigo-400 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-400 border border-white/10 h-20"
            placeholder="Résumé trop court, flashcards hors sujet, QCM trop facile..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleSubmitComment}
            className="w-full bg-violet-500/30 hover:bg-violet-500/50 text-violet-200 py-2.5 rounded-xl text-sm font-semibold transition-all border border-violet-400/20"
          >
            Envoyer mon retour
          </button>
        </div>
      )}
    </div>
  );
}
