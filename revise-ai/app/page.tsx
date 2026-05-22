'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasReachedLimit, isProUser, getRemainingGenerations, incrementQuota } from '@/lib/quota';
import Navbar from '@/components/Navbar';
import Hero3D from '@/components/Hero3D';
import ProblemSection from '@/components/ProblemSection';
import HowItWorks from '@/components/HowItWorks';
import FeatureCards from '@/components/FeatureCards';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

// ─── UPLOAD + GENERATE SECTION ───────────────────────────────────────────────
function UploadSection() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(3);
  const [isPro, setIsPro] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setRemaining(getRemainingGenerations());
    setIsPro(isProUser());
  }, []);

  const loadingSteps = [
    { msg: 'Lecture de ton cours…', icon: '📖' },
    { msg: 'Analyse du contenu…', icon: '🧠' },
    { msg: 'Génération du résumé…', icon: '✍️' },
    { msg: 'Création des flashcards…', icon: '🃏' },
    { msg: 'Préparation du QCM…', icon: '🎯' },
    { msg: 'Finalisation du kit…', icon: '✨' },
  ];

  const handleGenerate = async () => {
    if (!text.trim() && !file) { setError('Colle ton cours ou uploade un PDF.'); return; }
    if (!isPro && hasReachedLimit()) { router.push('/pricing'); return; }

    setError('');
    setLoading(true);
    setLoadingStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, loadingSteps.length - 1);
      setLoadingStep(step);
    }, 1800);

    try {
      let res;
      if (file) {
        const fd = new FormData(); fd.append('file', file);
        res = await fetch('/api/generate', { method: 'POST', body: fd });
      } else {
        res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      if (!isPro) { incrementQuota(); setRemaining(getRemainingGenerations()); }

      clearInterval(interval);
      sessionStorage.setItem('revise_result', JSON.stringify(data));
      router.push('/result');
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Erreur inattendue. Réessaie.');
      setLoading(false);
    }
  };

  return (
    <section id="upload" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-content">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-violet)' }}>
            Essaie maintenant
          </p>
          <h2 className="font-syne text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Ton kit en <span className="gradient-text">10 secondes.</span>
          </h2>
        </div>

        {/* Desktop 2-col layout */}
        <div className="grid lg:grid-cols-[55fr_45fr] gap-10 items-start upload-grid">

          {/* Left — upload + generate */}
          <div>
            {!loading ? (
              <>
                {/* Textarea */}
                <div className="relative mb-4">
                  <textarea
                    className="w-full h-48 rounded-2xl p-5 font-dm text-base resize-none focus:outline-none"
                    style={{
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      caretColor: 'var(--color-violet)',
                      fontSize: '15px',
                      lineHeight: '1.7',
                    }}
                    placeholder="Colle ton cours ici… (texte, notes, paragraphes)"
                    value={text}
                    onChange={(e) => { setText(e.target.value); setFile(null); }}
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--border-violet)';
                      e.target.style.boxShadow = 'var(--glow-violet)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--border-subtle)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {text && (
                    <span className="absolute bottom-4 right-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {text.length} car.
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-5">
                  <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>ou</span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                </div>

                {/* PDF Drop zone */}
                <div
                  className={`upload-zone p-6 text-center mb-6 ${dragOver ? 'drag-over' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault(); setDragOver(false);
                    const f = e.dataTransfer.files[0];
                    if (f?.type === 'application/pdf') { setFile(f); setText(''); }
                  }}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">📄</span>
                      <span className="font-dm font-medium" style={{ color: 'var(--color-violet)', fontSize: '15px' }}>
                        {file.name}
                      </span>
                      <span style={{ color: '#4ade80' }}>✓</span>
                    </div>
                  ) : (
                    <>
                      <p className="font-dm" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                        📎 Glisse ton PDF ici ou clique pour uploader
                      </p>
                      <p className="font-mono text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        PDF texte uniquement · pas scanné
                      </p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                    onChange={e => { setFile(e.target.files?.[0] || null); setText(''); }} />
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 rounded-xl px-4 py-3 font-dm text-sm text-center"
                    style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: 'var(--color-accent)' }}>
                    {error}
                  </div>
                )}

                {/* Quota warning */}
                {!isPro && remaining === 1 && (
                  <div className="mb-4 rounded-xl px-4 py-3 font-dm text-xs text-center"
                    style={{ background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.2)', color: '#facc15' }}>
                    ⚠️ Dernière génération gratuite —{' '}
                    <button onClick={() => router.push('/pricing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#facc15', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit' }}>
                      passe au Pro
                    </button>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleGenerate}
                  disabled={!isPro && remaining === 0}
                  className="btn-primary w-full rounded-2xl py-4 font-dm text-base font-semibold flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {!isPro && remaining === 0 ? '🔒 Limite atteinte' : (
                    <>Générer mon kit <span className="arrow-animate">→</span></>
                  )}
                </button>

                {/* Counter */}
                {!isPro && remaining > 0 && (
                  <p className="text-center font-mono text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                    {remaining} génération{remaining > 1 ? 's' : ''} gratuite{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''} aujourd'hui
                  </p>
                )}
              </>
            ) : (
              /* Loading */
              <div className="flex flex-col items-center justify-center py-16 gap-8 card" style={{ minHeight: '360px' }}>
                <div className="loader-arc" />
                <div className="text-center">
                  <p className="font-syne text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {loadingSteps[loadingStep]?.icon} {loadingSteps[loadingStep]?.msg}
                  </p>
                  <p className="font-dm text-sm" style={{ color: 'var(--text-muted)' }}>
                    L'IA analyse ton cours…
                  </p>
                </div>
                <div className="flex gap-2">
                  {loadingSteps.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full transition-all duration-500"
                      style={{
                        background: i <= loadingStep ? 'var(--color-cyan)' : 'var(--border-subtle)',
                        transform: i === loadingStep ? 'scale(1.3)' : 'scale(1)',
                      }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — preview mockup */}
          <PreviewMockup />
        </div>
      </div>
    </section>
  );
}

// Animated preview mockup
function PreviewMockup() {
  const [active, setActive] = useState(0);
  const tabs = ['📝 Résumé', '🃏 Flashcards', '🎯 QCM'];

  const previews = [
    {
      content: (
        <div className="space-y-3">
          <div className="h-3 rounded-full" style={{ background: 'var(--border-subtle)', width: '85%' }} />
          <div className="h-3 rounded-full" style={{ background: 'var(--border-subtle)', width: '70%' }} />
          <div className="h-3 rounded-full" style={{ background: 'var(--border-subtle)', width: '90%' }} />
          <div className="h-3 rounded-full" style={{ background: 'var(--border-subtle)', width: '60%' }} />
          <div className="mt-6 h-px" style={{ background: 'var(--border-subtle)' }} />
          <p className="font-mono text-xs" style={{ color: 'var(--color-violet)' }}>Concepts clés :</p>
          <div className="flex flex-wrap gap-2">
            {['Photosynthèse', 'Chlorophylle', 'ATP', 'NADPH'].map(t => (
              <span key={t} className="font-mono text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(108,71,255,0.15)', color: 'var(--color-violet)', border: '1px solid rgba(108,71,255,0.3)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <p className="font-dm font-medium mb-4" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
            Qu'est-ce que la photosynthèse ?
          </p>
          <div className="h-px mb-4" style={{ background: 'var(--border-subtle)' }} />
          <p className="font-dm text-sm" style={{ color: 'var(--text-secondary)' }}>
            Processus de transformation de la lumière solaire en énergie chimique par les plantes.
          </p>
          <p className="font-mono text-xs mt-4" style={{ color: 'var(--color-cyan)', opacity: 0.6 }}>
            Clique pour retourner
          </p>
        </div>
      )
    },
    {
      content: (
        <div className="space-y-3">
          <p className="font-dm font-medium mb-4" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
            Où se déroule la photosynthèse ?
          </p>
          {['A. Dans les mitochondries', 'B. Dans les chloroplastes', 'C. Dans le noyau', 'D. Dans les ribosomes'].map((opt, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-3 font-dm text-sm transition-all"
              style={{
                background: i === 1 ? 'rgba(74,222,128,0.1)' : 'var(--bg-card)',
                border: `1px solid ${i === 1 ? 'rgba(74,222,128,0.3)' : 'var(--border-subtle)'}`,
                color: i === 1 ? '#4ade80' : 'var(--text-secondary)',
                fontSize: '13px',
              }}>
              {opt}
            </div>
          ))}
        </div>
      )
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % tabs.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="card p-6" style={{ background: 'var(--bg-card)' }}>
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`tab-btn text-sm pb-3 ${active === i ? 'active' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ minHeight: '200px', transition: 'opacity 0.4s ease' }}>
        {previews[active].content}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Aperçu en direct</span>
        <span className="font-mono text-xs gradient-text">● Live</span>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero3D />
      <ProblemSection />
      <HowItWorks />
      <UploadSection />
      <FeatureCards />
      <PricingSection />
      <Footer />
    </>
  );
}
