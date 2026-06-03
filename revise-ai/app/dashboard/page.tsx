'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProgression, LEVELS, UserProgression, XP_REWARDS } from '@/lib/progression';

const LEVEL_ICONS = ['🔵', '🟣', '⚡', '🌊', '⭐'];
const STREAK_MILESTONES = [1, 3, 7, 14, 30];

export default function DashboardPage() {
  const router = useRouter();
  const [prog, setProg] = useState<UserProgression | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProg(getProgression());
    setMounted(true);
  }, []);

  if (!mounted || !prog) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="loader-arc" />
      </div>
    );
  }

  const currentLvl = LEVELS.find(l => l.level === prog.level) || LEVELS[0];
  const nextLvl = LEVELS[prog.level] || currentLvl;

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: 'var(--bg-primary)' }}>

      {/* Ambient */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${currentLvl.color}10 0%, transparent 70%)` }} />

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.push('/')} className="font-syne text-xl font-bold" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            Brain<span className="gradient-text">Kit</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="font-dm text-sm px-4 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            ← Retour
          </button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-violet)' }}>
            Tableau de bord
          </p>
          <h1 className="font-syne text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Ta progression
          </h1>
        </div>

        {/* Level card — hero */}
        <div
          className="rounded-3xl p-8 mb-6 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', border: `1px solid ${currentLvl.color}30` }}
        >
          {/* Glow bg */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top right, ${currentLvl.color}0A 0%, transparent 60%)` }} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                  Niveau {prog.level}
                </p>
                <h2 className="font-syne text-4xl font-bold" style={{ color: currentLvl.color }}>
                  {prog.levelName}
                </h2>
              </div>
              <span style={{ fontSize: '48px' }}>{LEVEL_ICONS[prog.level - 1]}</span>
            </div>

            {/* XP bar */}
            <div className="mb-3">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  {prog.xp.toLocaleString()} XP
                </span>
                {prog.level < 5 && (
                  <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    {(currentLvl.maxXP).toLocaleString()} XP → {nextLvl.name}
                  </span>
                )}
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${prog.xpProgress}%`,
                    background: `linear-gradient(90deg, ${currentLvl.color}, var(--color-cyan))`,
                    boxShadow: `0 0 12px ${currentLvl.color}60`,
                  }}
                />
              </div>
            </div>

            {prog.level < 5 && (
              <p className="font-dm text-sm" style={{ color: 'var(--text-muted)' }}>
                Encore <span style={{ color: currentLvl.color }}>{prog.xpToNextLevel.toLocaleString()} XP</span> pour atteindre {nextLvl.name}
              </p>
            )}
            {prog.level === 5 && (
              <p className="font-dm text-sm" style={{ color: currentLvl.color }}>
                ✦ Niveau maximum atteint
              </p>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'XP total',  value: prog.xp.toLocaleString(), icon: '⚡', color: 'var(--color-violet)' },
            { label: 'Streak',    value: `${prog.streak}j`,         icon: '🔥', color: 'var(--color-accent)' },
            { label: 'Sessions',  value: prog.totalSessions,        icon: '📚', color: 'var(--color-cyan)' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="font-syne text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <p className="font-mono text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Streak milestones */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
            🔥 Jalons de streak
          </p>
          <div className="flex items-center justify-between gap-2">
            {STREAK_MILESTONES.map((m) => {
              const reached = prog.streak >= m;
              return (
                <div key={m} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all"
                    style={{
                      background: reached ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${reached ? 'rgba(255,107,107,0.5)' : 'var(--border-subtle)'}`,
                      color: reached ? 'var(--color-accent)' : 'var(--text-muted)',
                      boxShadow: reached ? '0 0 16px rgba(255,107,107,0.2)' : 'none',
                    }}
                  >
                    {m}j
                  </div>
                  {reached && (
                    <span className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tous les niveaux */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>
            ✦ Parcours de niveaux
          </p>
          <div className="space-y-4">
            {LEVELS.map((lvl, i) => {
              const isCurrentLevel = prog.level === lvl.level;
              const isUnlocked = prog.xp >= lvl.minXP;
              return (
                <div key={lvl.level} className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background: isUnlocked ? `${lvl.color}15` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isUnlocked ? lvl.color + '40' : 'var(--border-subtle)'}`,
                    }}
                  >
                    {isUnlocked ? LEVEL_ICONS[i] : '🔒'}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-syne font-bold text-sm"
                        style={{ color: isCurrentLevel ? lvl.color : isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {lvl.name}
                      </span>
                      {isCurrentLevel && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${lvl.color}20`, color: lvl.color, border: `1px solid ${lvl.color}40` }}>
                          actuel
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {lvl.minXP.toLocaleString()} XP{lvl.level < 5 ? ` — ${lvl.maxXP.toLocaleString()} XP` : '+'}
                    </p>
                  </div>

                  {/* Progress si niveau actuel */}
                  {isCurrentLevel && lvl.level < 5 && (
                    <div className="w-24">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${prog.xpProgress}%`, background: lvl.color }} />
                      </div>
                      <p className="font-mono text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>
                        {prog.xpProgress}%
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comment gagner XP */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>
            ⚡ Comment gagner des XP
          </p>
          <div className="space-y-3">
            {[
              { action: 'Bonne réponse flashcard', xp: XP_REWARDS.correctAnswer },
              { action: 'Mauvaise réponse (tu apprends quand même)', xp: XP_REWARDS.wrongAnswer },
              { action: 'Session complétée', xp: XP_REWARDS.sessionComplete },
              { action: 'Streak 3 jours', xp: XP_REWARDS.streak3 },
              { action: 'Streak 7 jours', xp: XP_REWARDS.streak7 },
            ].map((item) => (
              <div key={item.action} className="flex items-center justify-between">
                <span className="font-dm text-sm" style={{ color: 'var(--text-secondary)' }}>{item.action}</span>
                <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(108,71,255,0.1)', color: 'var(--color-violet)', border: '1px solid rgba(108,71,255,0.2)' }}>
                  +{item.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/')}
          className="btn-primary w-full rounded-2xl py-4 font-dm font-semibold text-base flex items-center justify-center gap-3"
        >
          Réviser maintenant <span className="arrow-animate">→</span>
        </button>

      </div>
    </main>
  );
}
