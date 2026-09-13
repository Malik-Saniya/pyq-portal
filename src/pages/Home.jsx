import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PAPERS, getFeaturedPapers, getPopularSubjects } from "../data/mockData";
import { POPULAR_SEARCHES } from "../lib/search";
import { getRecent } from "../lib/storage";
import PaperCard from "../components/PaperCard";

const QUICK_ACCESS = [
  { to: "/explore/degree", label: "Degree / UG", icon: "🎓", desc: "University & college papers" },
  { to: "/explore/hsc", label: "Junior College / HSC", icon: "📘", desc: "Board papers by stream" },
];

function recentPapers() {
  return getRecent()
    .map((id) => PAPERS.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 3);
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRecent(recentPapers());
  }, []);

  function submit(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  const popularSubjects = getPopularSubjects(8);
  const recentPapersList = getFeaturedPapers(6);

  return (
    <div>
      {/* Hero */}
      <section className="ruled border-b border-paper-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-11 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-stamp">Previous Year Question Papers</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Find the exact paper you need — in one search.
          </h1>
          <p className="mt-4 max-w-xl text-ink-soft">
            Degree, UG and Junior College papers, organized by subject, course and year. No sign-in required to search, preview or download.
          </p>

          <form onSubmit={submit} className="mt-8 max-w-xl">
            <label htmlFor="hero-search" className="sr-only">
              Search papers, subjects, courses, universities
            </label>
            <div className="flex items-center gap-2 rounded-full border border-paper-line bg-white p-1.5 pl-4 shadow-card focus-within:border-stamp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink-faint">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" strokeLinecap="round" />
              </svg>
              <input
                id="hero-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. BCom Sem 3 Financial Accounting 2024"
                className="w-full bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-faint sm:text-base"
              />
              <button type="submit" className="shrink-0 rounded-full bg-stamp px-5 py-2.5 text-sm font-medium text-white hover:bg-stamp-dark">
                Search
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-faint">Try:</span>
            {POPULAR_SEARCHES.map((s) => (
              <Link
                key={s}
                to={`/search?q=${encodeURIComponent(s)}`}
                className="rounded-full border border-paper-line bg-paper px-3 py-1 text-xs font-medium text-ink-soft hover:border-stamp hover:text-stamp"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Quick academic access */}
        <section aria-labelledby="quick-access-heading">
          <h2 id="quick-access-heading" className="font-display text-xl font-semibold text-ink">
            Browse by academic level
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {QUICK_ACCESS.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="folio flex items-center gap-4 rounded-card border border-paper-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-raised"
              >
                <span className="text-3xl" aria-hidden="true">{q.icon}</span>
                <span>
                  <span className="block font-display text-lg font-semibold text-ink">{q.label}</span>
                  <span className="block text-sm text-ink-soft">{q.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Continue where you left off */}
        {recent.length > 0 && (
          <section className="mt-10" aria-labelledby="recent-heading">
            <div className="flex items-center justify-between">
              <h2 id="recent-heading" className="font-display text-xl font-semibold text-ink">
                Continue where you left off
              </h2>
              <Link to="/library?tab=recent" className="text-sm font-medium text-stamp hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((p) => (
                <PaperCard key={p.id} paper={p} />
              ))}
            </div>
          </section>
        )}

        {/* Popular subjects */}
        <section className="mt-10" aria-labelledby="subjects-heading">
          <h2 id="subjects-heading" className="font-display text-xl font-semibold text-ink">
            Popular subjects
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {popularSubjects.map((s) => (
              <Link
                key={s.slug}
                to={`/subject/${s.slug}`}
                className="rounded-full border border-paper-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:border-stamp hover:text-stamp"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Recent papers */}
        <section className="mt-10" aria-labelledby="recent-papers-heading">
          <div className="flex items-center justify-between">
            <h2 id="recent-papers-heading" className="font-display text-xl font-semibold text-ink">
              Recently added papers
            </h2>
            <Link to="/search" className="text-sm font-medium text-stamp hover:underline">
              Browse all
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPapersList.map((p) => (
              <PaperCard key={p.id} paper={p} />
            ))}
          </div>
        </section>

        {/* Trust section */}
        <section className="mt-11 rounded-card border border-paper-line bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-ink">Built for finding papers fast</h2>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: "Organized by course & year", desc: "Every paper is tagged with subject, course, semester and academic year — not just dumped in a folder." },
              { title: "Search understands you", desc: "Type “BCom Sem 3 Economics 2024” or just the subject name — search interprets it either way." },
              { title: "No sign-in needed", desc: "Preview, bookmark and download without creating an account." },
            ].map((f) => (
              <div key={f.title}>
                <h3 className="font-medium text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}