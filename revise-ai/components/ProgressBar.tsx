'use client';
import { useEffect, useState } from 'react';
import { getProgression, LEVELS, UserProgression } from '@/lib/progression';

export default function ProgressBar() {
  const [prog, setProg] = useState<UserProgression | null>(null);

  useEffect(() => {
    setProg(getProgression());
  }, []);

  if (!prog) return null;

  const lvlData = LEVELS.find(l => l.level === prog.level) || LEVELS[0];
  const nextLvlData = LEVELS[prog.level] || lvlData;

  const streakLabel =
    prog.streak >= 7 ? `🔥×7 ${prog.streak}j` :
    prog.streak >= 3 ? `🔥×3 ${prog.streak}j` :
    prog.streak > 0  ? `🔥 ${prog.streak}j` : '';

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 rounded-2xl font-dm text-sm"
      style={{ background: 'rgba(13,11,24,0.8)', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(12px)' }}
    >
      {/* Level badge */}
      <div
        className="font-syne font-bold text-xs px-3 py-1 rounded-full whitespace-nowrap"
        style={{ background: `${lvlData.color}18`, border: `1px solid ${lvlData.color}40`, color: lvlData.color }}
      >
        {prog.levelName}
      </div>

      {/* XP bar */}
      <div className="flex-1 min-w-[80px]">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${prog.xpProgress}%`, background: `linear-gradient(90deg, ${lvlData.color}, var(--color-cyan))` }}
          />
        </div>
      </div>

      {/* XP counter */}
      <span className="font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
        {prog.xp} XP
      </span>

      {/* Streak */}
      {streakLabel && (
        <span className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>
          {streakLabel}
        </span>
      )}
    </div>
  );
}
