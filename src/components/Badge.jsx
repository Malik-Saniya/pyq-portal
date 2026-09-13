const TONES = {
  neutral: "bg-paper-dim text-ink-soft border-paper-line",
  stamp: "bg-stamp-light text-stamp-dark border-stamp/30",
  pass: "bg-pass-light text-pass border-pass/30",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono tracking-tight ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
