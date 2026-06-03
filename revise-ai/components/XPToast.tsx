'use client';
import { useEffect, useState } from 'react';
import { LEVELS } from '@/lib/progression';

interface Props {
  xpEarned: number;
  streak: number;
  bonusXP: number;
  leveledUp: boolean;
  newLevel: string;
  onDone: () => void;
}

export default function XPToast({ xpEarned, streak, bonusXP, leveledUp, newLevel, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 400); }, 3200);
    return () => clearTimeout(t);
  }, []);

  const lvlData = LEVELS.find(l => l.name === newLevel) || LEVELS[0];

  return (
    <div
      className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      style={{ transition: 'opacity 0.4s ease, transform 0.4s ease', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-16px)' }}
    >
      {/* XP earned */}
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-3 font-dm font-semibold text-sm"
        style={{ background: 'rgba(13,11,24,0.95)', border: '1px solid rgba(108,71,255,0.4)', color: 'var(--text-primary)', backdropFilter: 'blur(12px)', boxShadow: '0 0 30px rgba(108,71,255,0.2)' }}
      >
        <span style={{ color: 'var(--color-violet)', fontSize: '18px' }}>⚡</span>
        <span>+{xpEarned} XP</span>
        {bonusXP > 0 && (
          <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--color-accent)' }}>
            🔥 Streak +{bonusXP}
          </span>
        )}
      </div>

      {/* Streak */}
      {streak >= 1 && (
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-3 font-dm text-sm"
          style={{ background: 'rgba(13,11,24,0.95)', border: '1px solid rgba(255,107,107,0.3)', color: 'var(--text-primary)', backdropFilter: 'blur(12px)' }}
        >
          <span style={{ fontSize: '18px' }}>🔥</span>
          <span style={{ color: 'var(--color-accent)' }}>{streak} jour{streak > 1 ? 's' : ''} de suite</span>
        </div>
      )}

      {/* Level up */}
      {leveledUp && (
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-3 font-syne font-bold text-sm"
          style={{ background: `${lvlData.color}18`, border: `1px solid ${lvlData.color}60`, color: lvlData.color, backdropFilter: 'blur(12px)', boxShadow: `0 0 30px ${lvlData.color}30` }}
        >
          <span style={{ fontSize: '18px' }}>✦</span>
          <span>Niveau atteint — {newLevel}</span>
        </div>
      )}
    </div>
  );
}
