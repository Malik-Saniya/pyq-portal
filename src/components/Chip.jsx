export default function Chip({ children, onRemove, as: As = "span", ...props }) {
  return (
    <As
      className="inline-flex items-center gap-1.5 rounded-full border border-paper-line bg-white px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:border-stamp hover:text-stamp"
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove filter"
          className="rounded-full text-ink-faint hover:text-stamp"
        >
          ×
        </button>
      )}
    </As>
  );
}
