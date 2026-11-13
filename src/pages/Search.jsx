import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchPapers, POPULAR_SEARCHES } from "../lib/search";
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
  return value;
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [inputValue, setInputValue] = useState(query);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("relevance");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 260);
    return () => clearTimeout(t);
  }, [query, filters, sort]);

  const { results, interpreted } = useMemo(() => {
    const extra = { ...filters };
    delete extra.level;
    // Level is applied as a post-filter below, so it must not by itself
    // decide whether we run full-text search — otherwise picking only a
    // level (no query, no other filter) fed an empty query + empty hints
    // into searchPapers, which always returns zero candidates.
    const hasQueryOrFilters = query || Object.keys(extra).length > 0;
    const r = hasQueryOrFilters
      ? searchPapers(query, extra)
      : { results: PAPERS.filter((p) => (filters.level ? p.level === filters.level : true)), interpreted: { hints: {} } };

    let list = r.results;
    if (filters.level) list = list.filter((p) => p.level === filters.level);
    if (sort === "newest") {
      list = [...list].sort((a, b) => Number(b.academicYear) - Number(a.academicYear));
    }
    return { results: list, interpreted: r.interpreted };
  }, [query, filters, sort]);

  function submitSearch(e) {
    e.preventDefault();
    setParams(inputValue ? { q: inputValue } : {});
  }

  function removeFilter(key) {
    const next = { ...filters };
    delete next[key];
    setFilters(next);
  }

  const activeFilterEntries = Object.entries(filters).filter(([, v]) => v !== undefined && v !== "");

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

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-card border border-paper-line bg-white p-4">
            <FilterPanel filters={filters} onChange={setFilters} resultCount={results.length} />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-1.5 rounded-md border border-paper-line bg-white px-3 py-2 text-sm font-medium text-ink-soft md:hidden"
              >
                Filters
                {activeFilterEntries.length > 0 && (
                  <span className="rounded-full bg-stamp px-1.5 text-xs text-white">{activeFilterEntries.length}</span>
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
            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilterEntries.map(([k, v]) => (
                <Chip key={k} onRemove={() => removeFilter(k)}>
                  {labelFor(k, v)}
                </Chip>
              ))}
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
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onApply={setFilters}
        resultCount={results.length}
      />
    </div>
  );
}