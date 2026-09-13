import { Link } from "react-router-dom";

export default function EmptyState({ icon = "📄", title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-paper-line bg-white/50 px-6 py-14 text-center">
      <div className="mb-3 text-3xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
