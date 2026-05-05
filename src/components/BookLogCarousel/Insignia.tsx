/* ─────────────────────────────────────────────────────────────
   Insignia — six generative cover marks.
   Variant is chosen by `seed % 6`. Each mark is a small geometric
   diagram in the article's ink color, soft secondary in inkSoft.
   ───────────────────────────────────────────────────────────── */

type InsigniaProps = {
  /** Numeric seed; the variant is `seed % 6`. */
  seed: number;
  /** Primary stroke / text color (ink for light covers, paper for dark). */
  ink: string;
  /** Secondary tone for cross-hairs, dashes, etc. */
  inkSoft: string;
};

export default function Insignia({ seed, ink, inkSoft }: InsigniaProps) {
  const v = seed % 6;
  const stroke = ink;
  const soft = inkSoft;
  const inv = stroke === "#1A1815" ? "#ECEAE5" : "#1A1815";

  if (v === 0) {
    return (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="32" fill="none" stroke={stroke} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="22" fill="none" stroke={stroke} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="12" fill="none" stroke={stroke} strokeWidth="0.5" />
        <line x1="18" y1="50" x2="82" y2="50" stroke={stroke} strokeWidth="0.5" />
        <line x1="50" y1="18" x2="50" y2="82" stroke={stroke} strokeWidth="0.5" />
        <rect x="46" y="46" width="8" height="8" fill={stroke} />
      </svg>
    );
  }

  if (v === 1) {
    return (
      <svg viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke={stroke} strokeWidth="0.5" />
        <rect x="32" y="32" width="36" height="36" fill="none" stroke={stroke} strokeWidth="0.5" />
        <line x1="20" y1="20" x2="80" y2="80" stroke={soft} strokeWidth="0.5" />
        <line x1="80" y1="20" x2="20" y2="80" stroke={soft} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="3" fill={stroke} />
      </svg>
    );
  }

  if (v === 2) {
    return (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth="0.5" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const x1 = 50 + Math.cos(a) * 34;
          const y1 = 50 + Math.sin(a) * 34;
          const x2 = 50 + Math.cos(a) * (i % 4 === 0 ? 28 : 31);
          const y2 = 50 + Math.sin(a) * (i % 4 === 0 ? 28 : 31);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth="0.5"
            />
          );
        })}
        <line x1="50" y1="50" x2="78" y2="36" stroke={stroke} strokeWidth="0.7" />
        <circle cx="78" cy="36" r="2" fill={stroke} />
      </svg>
    );
  }

  if (v === 3) {
    return (
      <svg viewBox="0 0 100 100">
        <line x1="14" y1="50" x2="86" y2="50" stroke={stroke} strokeWidth="0.5" />
        {Array.from({ length: 17 }).map((_, i) => (
          <line
            key={i}
            x1={14 + i * 4.5}
            y1="46"
            x2={14 + i * 4.5}
            y2={i % 4 === 0 ? 40 : 44}
            stroke={stroke}
            strokeWidth="0.5"
          />
        ))}
        <polygon points="50,38 53,44 47,44" fill={stroke} />
        <text
          x="50"
          y="62"
          fontSize="7"
          fontFamily='"DM Sans", ui-sans-serif, system-ui, sans-serif'
          fontWeight="500"
          textAnchor="middle"
          fill={stroke}
        >
          R.A. 80
        </text>
      </svg>
    );
  }

  if (v === 4) {
    return (
      <svg viewBox="0 0 100 100">
        <rect x="22" y="42" width="56" height="16" fill="none" stroke={stroke} strokeWidth="0.5" />
        <rect x="22" y="42" width="34" height="16" fill={stroke} />
        <text
          x="29"
          y="54"
          fontSize="8"
          fontFamily='"DM Sans", ui-sans-serif, system-ui, sans-serif'
          fontWeight="500"
          fill={inv}
        >
          75%
        </text>
        <line
          x1="22"
          y1="34"
          x2="78"
          y2="34"
          stroke={soft}
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <line
          x1="22"
          y1="66"
          x2="78"
          y2="66"
          stroke={soft}
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100">
      <polygon points="50,18 82,50 50,82 18,50" fill="none" stroke={stroke} strokeWidth="0.5" />
      <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke={stroke} strokeWidth="0.5" />
      <line x1="18" y1="50" x2="82" y2="50" stroke={soft} strokeWidth="0.5" />
      <line x1="50" y1="18" x2="50" y2="82" stroke={soft} strokeWidth="0.5" />
      <rect x="48" y="48" width="4" height="4" fill={stroke} />
    </svg>
  );
}
