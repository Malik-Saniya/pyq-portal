import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PAPERS } from "../data/mockData";
import { useBookmarks } from "../lib/useBookmarks";
import { getRecent, clearRecent } from "../lib/storage";
import PaperCard from "../components/PaperCard";
import EmptyState from "../components/EmptyState";

export default function Library() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "recent" ? "recent" : "bookmarks";
  const { bookmarks } = useBookmarks();
  const [recentIds, setRecentIds] = useState(getRecent());

  const bookmarkedPapers = useMemo(
    () => bookmarks.map((id) => PAPERS.find((p) => p.id === id)).filter(Boolean),
    [bookmarks]
  );
  const recentPapers = useMemo(
    () => recentIds.map((id) => PAPERS.find((p) => p.id === id)).filter(Boolean),
    [recentIds]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Library</h1>
      <p className="mt-1 text-sm text-ink-soft">Stored on this device — no account needed.</p>

      <div className="mt-6 flex gap-1 border-b border-paper-line" role="tablist">
        {[
          { key: "bookmarks", label: `Bookmarks (${bookmarkedPapers.length})` },
          { key: "recent", label: "Recently viewed" },
        ].map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setParams(t.key === "bookmarks" ? {} : { tab: "recent" })}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.key ? "border-stamp text-stamp" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
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
        ) : recentPapers.length === 0 ? (
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
        )}
      </div>
    </div>
  );
}
