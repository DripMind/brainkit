'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar px-8 py-4 flex items-center justify-between ${scrolled ? 'scrolled' : ''}`}>
      <span
        className="font-syne text-xl font-bold cursor-pointer select-none"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Brain<span className="gradient-text">Kit</span>
      </span>
      <div className="flex items-center gap-6">
        <a href="#how" className="text-sm font-dm" style={{ color: 'var(--text-secondary)' }}>
          Comment ça marche
        </a>
        <a href="#pricing" className="text-sm font-dm" style={{ color: 'var(--text-secondary)' }}>
          Tarifs
        </a>
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
