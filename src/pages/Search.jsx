import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchPapers, POPULAR_SEARCHES } from "../lib/search";
import { applyFilters, countActive, pruneHiddenFields } from "../lib/filters";
import { PAPERS, UNIVERSITIES, BOARDS, COURSES } from "../data/mockData";
import PaperCard from "../components/PaperCard";
import FilterPanel from "../components/FilterPanel";
import FilterDrawer from "../components/FilterDrawer";
import Chip from "../components/Chip";
import EmptyState from "../components/EmptyState";
import { CardGridSkeleton } from "../components/Skeleton";

const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest year" },
];

function labelFor(key, value) {
  if (key === "universitySlug") return UNIVERSITIES.find((u) => u.slug === value)?.name;
  if (key === "boardSlug") return BOARDS.find((b) => b.slug === value)?.name;
  if (key === "courseSlug") return COURSES.find((c) => c.slug === value)?.name;
  if (key === "semester") return `Semester ${value}`;
  if (key === "standard") return `${value}th`;
  if (key === "level") return value === "degree" ? "Degree / UG" : "Junior College";
  if (key === "academicYear") return `Year ${value}`;
  if (key === "examType") return `${value} exam`;
  return value;
}

function filtersFromParams(params) {
  const next = {};
  const level = params.get("level");
  if (level === "degree" || level === "hsc") next.level = level;
  const stream = params.get("stream");
  if (stream) next.stream = stream;
  const standard = params.get("standard");
  if (standard) next.standard = Number(standard);
  const boardSlug = params.get("board");
  if (boardSlug) next.boardSlug = boardSlug;
  const academicYear = params.get("year");
  if (academicYear) next.academicYear = academicYear;
  return pruneHiddenFields(next);
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [inputValue, setInputValue] = useState(query);
  const [filters, setFilters] = useState(() => filtersFromParams(params));
  const [sort, setSort] = useState("relevance");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const resultsTopRef = useRef(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Sync filter state when Explore / deep links change URL params
  // (level, stream, standard) without a text query.
  useEffect(() => {
    const fromUrl = filtersFromParams(params);
    if (Object.keys(fromUrl).length > 0) {
      setFilters((prev) => ({ ...prev, ...fromUrl }));
    }
  }, [params]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 260);
    return () => clearTimeout(t);
  }, [query, filters, sort]);

  // The text query ranks papers; the filters then narrow that list. Every
  // selected filter must match (see applyFilters).
  const runSearch = useCallback(
    (activeFilters) => applyFilters(query ? searchPapers(query).results : PAPERS, activeFilters),
    [query]
  );

  const results = useMemo(() => {
    const list = runSearch(filters);
    return sort === "newest" ? [...list].sort((a, b) => Number(b.academicYear) - Number(a.academicYear)) : list;
  }, [runSearch, filters, sort]);

  // Live "N papers match" preview for the unapplied draft in the panel.
  const getCount = useCallback((draft) => runSearch(draft).length, [runSearch]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Applying from the panel: update the results and, if the student has
  // scrolled past the top of the list, bring it back into view.
  const handleApply = useCallback((next) => {
    setFilters(next);
    requestAnimationFrame(() => {
      const el = resultsTopRef.current;
      if (!el || el.getBoundingClientRect().top >= 72) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
    });
  }, []);

  const resetFilters = useCallback(() => setFilters({}), []);

  function submitSearch(e) {
    e.preventDefault();
    setParams(inputValue ? { q: inputValue } : {});
  }

  function removeFilter(key) {
    const next = { ...filters };
    delete next[key];
    // Dropping the level also drops fields that only exist for that level,
    // so no active filter is left hidden from the panel.
    setFilters(key === "level" ? pruneHiddenFields(next) : next);
  }

  const activeFilterEntries = Object.entries(filters).filter(([, v]) => v !== undefined && v !== "");
  const activeCount = countActive(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <form onSubmit={submitSearch} className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-paper-line bg-white px-4 py-2.5 focus-within:border-stamp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink-faint shrink-0">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search papers, subjects, universities…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            aria-label="Search papers"
          />
        </div>
        <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-soft">
          Search
        </button>
      </form>

      {!query && activeFilterEntries.length === 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-faint">Popular:</span>
          {POPULAR_SEARCHES.map((s) => (
            <button
              key={s}
              onClick={() => setParams({ q: s })}
              className="rounded-full border border-paper-line bg-white px-3 py-1 text-xs font-medium text-ink-soft hover:border-stamp hover:text-stamp"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[264px_minmax(0,1fr)]">
        {/* Desktop filters: sticky under the header, and the panel scrolls
            on its own (see FilterPanel) so it never outgrows the viewport. */}
        <aside className="hidden md:sticky md:top-20 md:block md:self-start" aria-label="Filters">
          <FilterPanel applied={filters} onApply={handleApply} onReset={resetFilters} getCount={getCount} />
        </aside>

        <div>
          <div ref={resultsTopRef} className="flex scroll-mt-20 flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-haspopup="dialog"
                className="flex items-center gap-1.5 rounded-md border border-paper-line bg-white px-3 py-2 text-sm font-medium text-ink-soft md:hidden"
              >
                Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-stamp px-1.5 text-xs text-white">{activeCount}</span>
                )}
              </button>
              <p className="text-sm text-ink-faint tabular">{loading ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"}`}</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border border-paper-line bg-white px-2 py-1.5 text-sm outline-none focus:border-stamp"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {activeFilterEntries.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Applied filters">
              {activeFilterEntries.map(([k, v]) => (
                <Chip key={k} onRemove={() => removeFilter(k)} removeLabel={`Remove filter: ${labelFor(k, v)}`}>
                  {labelFor(k, v)}
                </Chip>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-md px-2 py-1 text-sm font-medium text-ink-soft underline-offset-2 hover:text-stamp hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="mt-5">
            {loading ? (
              <CardGridSkeleton count={6} />
            ) : results.length === 0 ? (
              <EmptyState
                icon="🔎"
                title={query ? `No papers match "${query}"` : "No papers match these filters"}
                description="Try removing a filter, dropping the academic year, or searching by subject name only."
                actionLabel="Browse by academic level"
                actionTo="/explore/degree"
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => (
                  <PaperCard key={p.id} paper={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        filters={filters}
        onApply={handleApply}
        onReset={resetFilters}
        getCount={getCount}
      />
    </div>
  );
}