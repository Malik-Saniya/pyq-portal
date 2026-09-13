import { useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import PaperCard from "../components/PaperCard";
import EmptyState from "../components/EmptyState";
import { getSubjectBySlug, getPapersBySubject } from "../data/mockData";
import { levelLabel } from "../data/academicConfig";
import { subjectBlurb } from "../lib/format";

export default function Subject() {
  const { subjectSlug } = useParams();
  const subject = getSubjectBySlug(subjectSlug);
  const [year, setYear] = useState("all");

  const papers = useMemo(() => getPapersBySubject(subjectSlug), [subjectSlug]);
  const years = useMemo(
    () => [...new Set(papers.map((p) => p.academicYear))].sort((a, b) => b - a),
    [papers]
  );
  const filtered = year === "all" ? papers : papers.filter((p) => p.academicYear === year);

  if (!subject) return <Navigate to="/404" replace />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { to: "/", label: "Home" },
          { to: `/explore/${subject.level}`, label: levelLabel(subject.level) },
          { label: subject.name },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{subject.name}</h1>
          <p className="mt-1.5 max-w-xl text-sm text-ink-soft">{subjectBlurb(subject, papers)}</p>
          <p className="mt-1 text-xs text-ink-faint">
            {papers.length} paper{papers.length === 1 ? "" : "s"} available
            {subject.code ? ` • Subject code ${subject.code}` : ""}
          </p>
        </div>
        <Link
          to={`/search?q=${encodeURIComponent(subject.name)}`}
          className="rounded-md border border-paper-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:border-stamp hover:text-stamp"
        >
          Search within {subject.name}
        </Link>
      </div>

      {years.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setYear("all")}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              year === "all" ? "border-stamp bg-stamp-light text-stamp-dark" : "border-paper-line bg-white text-ink-soft"
            }`}
          >
            All years
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                year === y ? "border-stamp bg-stamp-light text-stamp-dark" : "border-paper-line bg-white text-ink-soft"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            title={`No ${subject.name} papers for ${year}`}
            description="Try a different year, or view papers across all years for this subject."
            actionLabel="Show all years"
            onAction={() => setYear("all")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PaperCard key={p.id} paper={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}