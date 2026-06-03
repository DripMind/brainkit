'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProgression, LEVELS } from '@/lib/progression';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [xp, setXp] = useState(0);
  const [levelName, setLevelName] = useState('');
  const [levelColor, setLevelColor] = useState('#7EB8F7');
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });

    const prog = getProgression();
    setXp(prog.xp);
    setLevelName(prog.levelName);
    const lvl = LEVELS.find(l => l.name === prog.levelName);
    if (lvl) setLevelColor(lvl.color);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar px-6 py-3 flex items-center justify-between ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <span
        className="font-syne text-xl font-bold cursor-pointer select-none"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Brain<span className="gradient-text">Kit</span>
      </span>

      {/* Links */}
      <div className="hidden md:flex items-center gap-6">
        <a href="#how" className="font-dm text-sm transition-colors hover:text-white" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Comment ça marche
        </a>
        <a href="#pricing" className="font-dm text-sm transition-colors hover:text-white" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Tarifs
        </a>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* XP badge — si l'user a déjà joué */}
        {xp > 0 && (
          <button
            onClick={() => router.push('/dashboard')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs transition-all hover:opacity-80"
            style={{
              background: `${levelColor}12`,
              border: `1px solid ${levelColor}30`,
              color: levelColor,
              cursor: 'pointer',
            }}
          >
            <span>⚡</span>
            <span>{xp} XP</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span>{levelName}</span>
          </button>
        )}

        {/* Dashboard link */}
        <button
          onClick={() => router.push('/dashboard')}
          className="font-dm text-sm px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          Stats
        </button>

        <button
          onClick={() => router.push('/pricing')}
          className="btn-primary text-sm px-5 py-2 rounded-full"
        >
          Pro ⚡
        </button>
      </div>
    </nav>
  );
}
