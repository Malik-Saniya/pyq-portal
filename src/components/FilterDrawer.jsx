import { useEffect, useState } from "react";
import FilterPanel from "./FilterPanel";

export default function FilterDrawer({ open, onClose, filters, onApply, resultCount }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      <button
        className="absolute inset-0 bg-ink/40"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-2xl bg-paper p-4 shadow-raised">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-paper-line" aria-hidden="true" />
        <div className="max-h-[65vh] overflow-y-auto">
          <FilterPanel filters={draft} onChange={setDraft} resultCount={resultCount} />
        </div>
        <div className="mt-3 flex gap-2 border-t border-paper-line pt-3">
          <button
            type="button"
            onClick={() => setDraft({})}
            className="flex-1 rounded-md border border-paper-line px-4 py-2.5 text-sm font-medium text-ink-soft"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="flex-1 rounded-md bg-stamp px-4 py-2.5 text-sm font-medium text-white"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
