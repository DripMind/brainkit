export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid' }} className="border-gradient-line">
      <div
        className="w-full gradient-line"
        style={{ marginBottom: 0 }}
      />
      <div className="max-content section-padding" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-syne text-xl font-bold">
            Brain<span className="gradient-text">Kit</span>
          </span>

          <div className="flex items-center gap-8">
            {['Mentions légales', 'Contact', 'Twitter / X'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-dm text-sm transition-colors hover:text-white"
                style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <p className="text-center font-dm text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
          © 2025 BrainKit — Fait avec ⚡ et Mistral AI
        </p>
      </div>
    </footer>
  );
}
