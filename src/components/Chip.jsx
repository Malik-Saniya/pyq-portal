// An applied-filter chip. Only used for removable filters, so it always has
// the "selected" look; the remove button has a touch-friendly hit area.
export default function Chip({ children, onRemove, removeLabel = "Remove filter", as: As = "span", ...props }) {
  return (
    <As
      className="inline-flex items-center gap-1 rounded-full border border-stamp/30 bg-stamp-light py-1 pl-3 pr-1 text-sm font-medium text-stamp-dark"
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
          aria-label={removeLabel}
          className="flex h-6 w-6 items-center justify-center rounded-full text-stamp/70 transition hover:bg-stamp/10 hover:text-stamp-dark"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </As>
  );
}