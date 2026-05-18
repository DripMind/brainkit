'use client';

interface Props {
  summary: string;
  concepts: string[];
}

export default function SummarySection({ summary, concepts }: Props) {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-violet-300 font-bold text-base mt-4 mb-1">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-violet-300 font-black text-lg mt-4 mb-1">{line.replace('# ', '')}</h1>;
      if (line.startsWith('- ')) return <li key={i} className="text-indigo-200 text-sm ml-4 list-disc">{line.replace('- ', '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-indigo-100 text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">📝 Résumé du cours</h3>
        <div className="space-y-1">{renderMarkdown(summary)}</div>
      </div>

      {concepts && concepts.length > 0 && (
        <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
          <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">🔑 Notions clés</h3>
          <div className="flex flex-wrap gap-2">
            {concepts.map((c, i) => (
              <span key={i} className="bg-violet-500/30 text-violet-200 text-xs px-3 py-1.5 rounded-full border border-violet-400/30">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
