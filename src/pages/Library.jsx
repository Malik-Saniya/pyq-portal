import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PAPERS } from "../data/mockData";
import { useBookmarks } from "../lib/useBookmarks";
import { useDownloads, usePaperDownload } from "../lib/useDownloads";
import { getRecent, clearRecent, clearDownloads, removeDownload } from "../lib/storage";
import { paperContextLine } from "../lib/format";
import PaperCard from "../components/PaperCard";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";

const TABS = [
  { key: "bookmarks", param: null },
  { key: "recent", param: "recent" },
  { key: "downloads", param: "downloads" },
];

function formatDownloadDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// One downloaded paper. Reuses the PaperCard look so the tab feels native.
function DownloadCard({ paper, downloadedAt, onRemove }) {
  const { state, start, reset } = usePaperDownload(paper);
  const available = paper.status === "available";

  // Let the button return to "Download again" shortly after a download starts.
  useEffect(() => {
    if (state !== "success") return undefined;
    const t = setTimeout(reset, 2500);
    return () => clearTimeout(t);
  }, [state, reset]);

  return (
    <div className="folio flex flex-col justify-between rounded-card border border-paper-line bg-white/70 p-4 shadow-card">
      <div>
        <Link
          to={`/paper/${paper.slug}`}
          className="font-display text-lg font-semibold leading-snug text-ink hover:text-stamp"
        >
          {paper.subject.name}
        </Link>
        <p className="mt-2 text-sm text-ink-soft">{paperContextLine(paper)}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="neutral">{paper.academicYear}</Badge>
          {paper.examType && <Badge tone="neutral">{paper.examType}</Badge>}
          {paper.scheme && <Badge tone="pass">{paper.scheme}</Badge>}
          {!available && <Badge tone="stamp">{paper.status}</Badge>}
        </div>

        {downloadedAt && (
          <p className="mt-3 text-xs text-ink-faint">Downloaded on {formatDownloadDate(downloadedAt)}</p>
        )}
      </div>

      <div className="mt-4 border-t border-paper-line pt-3">
        <div className="flex items-center gap-2">
          <Link
            to={`/paper/${paper.slug}`}
            className="flex-1 rounded-md bg-ink px-3 py-2 text-center text-sm font-medium text-paper transition hover:bg-ink-soft"
          >
            View details
          </Link>
          <button
            type="button"
            onClick={start}
            disabled={!available || state === "loading"}
            aria-label={`Download ${paper.subject.name} ${paper.academicYear} again`}
            className="rounded-md border border-paper-line px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-stamp hover:text-stamp disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-paper-line disabled:hover:text-ink-soft"
          >
            {state === "loading" ? "Preparing…" : state === "success" ? "Downloaded ✓" : "Download again"}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-ink-faint" role="status">
            {!available
              ? "This paper can't be downloaded right now."
              : state === "success"
                ? "Download started — check your browser's downloads."
                : ""}
          </p>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${paper.subject.name} ${paper.academicYear} from download history`}
            className="shrink-0 text-xs font-medium text-ink-faint hover:text-stamp"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// A history entry whose paper no longer exists in the catalogue.
function MissingDownloadCard({ downloadedAt, onRemove }) {
  return (
    <div className="flex flex-col justify-between rounded-card border border-dashed border-paper-line bg-paper-dim/50 p-4">
      <div>
        <p className="font-display text-lg font-semibold leading-snug text-ink-soft">Paper no longer available</p>
        <p className="mt-2 text-sm text-ink-soft">
          This paper has been removed or moved, so it can't be opened or downloaded again.
        </p>
        {downloadedAt && (
          <p className="mt-3 text-xs text-ink-faint">Downloaded on {formatDownloadDate(downloadedAt)}</p>
        )}
      </div>
      <div className="mt-4 border-t border-paper-line pt-3">
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-ink-faint hover:text-stamp"
        >
          Remove from history
        </button>
      </div>
    </div>
  );
}

export default function Library() {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab");
  const tab = tabParam === "recent" ? "recent" : tabParam === "downloads" ? "downloads" : "bookmarks";
  const { bookmarks } = useBookmarks();
  const downloads = useDownloads();
  const [recentIds, setRecentIds] = useState(getRecent());

  const bookmarkedPapers = useMemo(
    () => bookmarks.map((id) => PAPERS.find((p) => p.id === id)).filter(Boolean),
    [bookmarks]
  );
  const recentPapers = useMemo(
    () => recentIds.map((id) => PAPERS.find((p) => p.id === id)).filter(Boolean),
    [recentIds]
  );
  const downloadItems = useMemo(
    () => downloads.map((entry) => ({ entry, paper: PAPERS.find((p) => p.id === entry.id) })),
    [downloads]
  );

  const tabLabels = {
    bookmarks: `Bookmarks (${bookmarkedPapers.length})`,
    recent: "Recently viewed",
    downloads: "Downloads",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Library</h1>
      <p className="mt-1 text-sm text-ink-soft">Stored on this device — no account needed.</p>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-paper-line" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setParams(t.param ? { tab: t.param } : {})}
            className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.key ? "border-stamp text-stamp" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tabLabels[t.key]}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "bookmarks" ? (
          bookmarkedPapers.length === 0 ? (
            <EmptyState
              icon="☆"
              title="No bookmarks yet"
              description="Tap the bookmark icon on any paper to save it here for later — no sign-in required."
              actionLabel="Browse papers"
              actionTo="/search"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarkedPapers.map((p) => (
                <PaperCard key={p.id} paper={p} />
              ))}
            </div>
          )
        ) : tab === "recent" ? (
          recentPapers.length === 0 ? (
            <EmptyState
              icon="🕘"
              title="Nothing viewed yet"
              description="Papers you open will show up here so you can pick up where you left off."
              actionLabel="Browse papers"
              actionTo="/search"
            />
          ) : (
            <>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => {
                    clearRecent();
                    setRecentIds([]);
                  }}
                  className="text-xs font-medium text-ink-faint hover:text-stamp"
                >
                  Clear history
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentPapers.map((p) => (
                  <PaperCard key={p.id} paper={p} />
                ))}
              </div>
            </>
          )
        ) : downloadItems.length === 0 ? (
          <EmptyState
            icon="⬇"
            title="No downloads yet"
            description="Papers you download from PYQ will be listed here so you can find them again. The PDF itself is saved by your browser."
            actionLabel="Browse papers"
            actionTo="/search"
          />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs text-ink-faint">
                A record of downloads started from PYQ. Files are saved by your browser, not stored here.
              </p>
              <button
                onClick={clearDownloads}
                className="shrink-0 text-xs font-medium text-ink-faint hover:text-stamp"
              >
                Clear history
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {downloadItems.map(({ entry, paper }) =>
                paper ? (
                  <DownloadCard
                    key={entry.id}
                    paper={paper}
                    downloadedAt={entry.at}
                    onRemove={() => removeDownload(entry.id)}
                  />
                ) : (
                  <MissingDownloadCard
                    key={entry.id}
                    downloadedAt={entry.at}
                    onRemove={() => removeDownload(entry.id)}
                  />
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}