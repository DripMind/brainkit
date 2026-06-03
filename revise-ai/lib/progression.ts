// ─── COUCHE 2 — Système de progression ───────────────────────────────────────
// XP · Niveaux · Streaks — 100% localStorage, zéro backend

export interface UserProgression {
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  lastPlayedDate: string;
  totalSessions: number;
  xpToNextLevel: number;
  xpProgress: number; // 0–100
}

export const LEVELS = [
  { level: 1, name: 'Synapse', minXP: 0,     maxXP: 500,   color: '#7EB8F7' },
  { level: 2, name: 'Neurone', minXP: 500,   maxXP: 2000,  color: '#8B7FFF' },
  { level: 3, name: 'Réseau',  minXP: 2000,  maxXP: 6000,  color: '#6C47FF' },
  { level: 4, name: 'Cortex',  minXP: 6000,  maxXP: 15000, color: '#00D4FF' },
  { level: 5, name: 'Atlas',   minXP: 15000, maxXP: 99999, color: '#FFFFFF' },
];

export const XP_REWARDS = {
  correctAnswer:   5,
  wrongAnswer:     2,
  sessionComplete: 25,
  streak3:         20,
  streak7:         50,
};

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getLevelFromXP(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

function buildProgression(raw: { xp?: number; streak?: number; lastPlayedDate?: string; totalSessions?: number }): UserProgression {
  const xp = raw.xp || 0;
  const lvl = getLevelFromXP(xp);
  const nextLvl = LEVELS[lvl.level] || lvl;
  const xpInLevel = xp - lvl.minXP;
  const xpNeeded = nextLvl.maxXP - lvl.minXP;
  return {
    xp,
    level: lvl.level,
    levelName: lvl.name,
    streak: raw.streak || 0,
    lastPlayedDate: raw.lastPlayedDate || '',
    totalSessions: raw.totalSessions || 0,
    xpToNextLevel: Math.max(0, nextLvl.maxXP - xp),
    xpProgress: lvl.level === 5 ? 100 : Math.round((xpInLevel / xpNeeded) * 100),
  };
}

export function getProgression(): UserProgression {
  if (typeof window === 'undefined') return buildProgression({});
  try {
    const raw = localStorage.getItem('ss_progression');
    return buildProgression(raw ? JSON.parse(raw) : {});
  } catch {
    return buildProgression({});
  }
}

function saveRaw(data: Partial<{ xp: number; streak: number; lastPlayedDate: string; totalSessions: number }>) {
  if (typeof window === 'undefined') return;
  const current = JSON.parse(localStorage.getItem('ss_progression') || '{}');
  localStorage.setItem('ss_progression', JSON.stringify({ ...current, ...data }));
}

export function updateStreak(): { streak: number; bonusXP: number } {
  const prog = getProgression();
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (prog.lastPlayedDate === today) return { streak: prog.streak, bonusXP: 0 };

  const newStreak = prog.lastPlayedDate === yesterday ? prog.streak + 1 : 1;
  let bonusXP = 0;
  if (newStreak === 3) bonusXP = XP_REWARDS.streak3;
  if (newStreak === 7) bonusXP = XP_REWARDS.streak7;

  saveRaw({ streak: newStreak, lastPlayedDate: today });
  return { streak: newStreak, bonusXP };
}

export function addXP(amount: number): { newXP: number; leveledUp: boolean; newLevel: string } {
  const prog = getProgression();
  const oldLevel = prog.level;
  const newXP = prog.xp + amount;
  const newLvl = getLevelFromXP(newXP);
  saveRaw({ xp: newXP });
  return { newXP, leveledUp: newLvl.level > oldLevel, newLevel: newLvl.name };
}

export function completeSession(correct: number, wrong: number) {
  const xpEarned = correct * XP_REWARDS.correctAnswer + wrong * XP_REWARDS.wrongAnswer + XP_REWARDS.sessionComplete;
  const { bonusXP, streak } = updateStreak();
  const total = xpEarned + bonusXP;
  const result = addXP(total);
  const prog = getProgression();
  saveRaw({ totalSessions: (prog.totalSessions || 0) + 1 });
  return { xpEarned: total, ...result, streak, bonusXP };
}
