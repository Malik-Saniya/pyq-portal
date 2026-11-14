import { useEffect, useRef } from "react";
import FilterPanel from "./FilterPanel";

// Mobile bottom sheet. It only owns the sheet behaviour (backdrop, Escape,
// body scroll lock, focus); the filter UI itself is the shared FilterPanel.
// The panel mounts only while open, so its draft always starts from the
// currently applied filters.
export default function FilterDrawer({ open, onClose, filters, onApply, onReset, getCount }) {
  const sheetRef = useRef(null);
  // Search passes a new onClose on some renders; reading it through a ref
  // keeps the effect below from tearing down and re-locking the page.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    // The sheet is mobile-only; if the window grows past the md breakpoint
    // (rotation, resize) close it instead of leaving the page scroll-locked.
    const mq = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (e) => {
      if (e.matches) onCloseRef.current();
    };

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      <div className="fade-in absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={sheetRef}
        tabIndex={-1}
        className="sheet-in absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-2xl bg-white shadow-raised outline-none"
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-paper-line" aria-hidden="true" />
        <FilterPanel
          variant="drawer"
          applied={filters}
          onApply={onApply}
          onApplied={onClose}
          onReset={onReset}
          onClose={onClose}
          getCount={getCount}
        />
      </div>
    </div>
  );
}