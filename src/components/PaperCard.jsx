import { Link } from "react-router-dom";
import { paperContextLine } from "../lib/format";
import { useBookmarks } from "../lib/useBookmarks";
import Badge from "./Badge";

function BookmarkIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function PaperCard({ paper }) {
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(paper.id);

  return (
    <div className="folio group relative flex flex-col justify-between rounded-card border border-paper-line bg-white/70 p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-raised">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link
            to={`/paper/${paper.slug}`}
            className="font-display text-lg font-semibold leading-snug text-ink hover:text-stamp"
          >
            {paper.subject.name}
          </Link>
          <button
            type="button"
            aria-pressed={bookmarked}
            aria-label={bookmarked ? `Remove ${paper.subject.name} from bookmarks` : `Bookmark ${paper.subject.name}`}
            onClick={() => toggle(paper.id)}
            className={`shrink-0 rounded-full p-1.5 transition ${bookmarked ? "text-stamp" : "text-ink-faint hover:text-stamp"}`}
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
        </div>

        <p className="text-sm text-ink-soft">{paperContextLine(paper)}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="neutral">{paper.academicYear}</Badge>
          {paper.examType && <Badge tone="neutral">{paper.examType}</Badge>}
          {paper.scheme && <Badge tone="pass">{paper.scheme}</Badge>}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-paper-line pt-3">
        <Link
          to={`/paper/${paper.slug}`}
          className="flex-1 rounded-md bg-ink px-3 py-2 text-center text-sm font-medium text-paper transition hover:bg-ink-soft"
        >
          View paper
        </Link>
        <Link
          to={`/paper/${paper.slug}#download`}
          className="rounded-md border border-paper-line px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-stamp hover:text-stamp"
          aria-label={`Download ${paper.subject.name} ${paper.academicYear}`}
        >
          Download
        </Link>
      </div>
    </div>
  );
}
