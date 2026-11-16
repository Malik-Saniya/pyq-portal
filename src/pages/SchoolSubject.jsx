import { useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import PaperCard from "../components/PaperCard";
import EmptyState from "../components/EmptyState";
import { SSC_BASE_PATH, SSC_CLASS_10, getSscSubjectBySlug, getSscPapersBySubject } from "../data/sscData";

export default function SchoolSubject() {
  const { subjectSlug } = useParams();
  const subject = getSscSubjectBySlug(subjectSlug);
  const [year, setYear] = useState("all");

  const papers = useMemo(() => getSscPapersBySubject(subjectSlug), [subjectSlug]);
  // Only years that actually have a paper for this subject are offered.
  const years = useMemo(
    () => [...new Set(papers.map((p) => p.academicYear))].sort((a, b) => b - a),
    [papers]
  );

  if (!subject) return <Navigate to="/404" replace />;

  // Guards against a year left over from another subject that has no such paper.
  const activeYear = years.includes(year) ? year : "all";
  const filtered = activeYear === "all" ? papers : papers.filter((p) => p.academicYear === activeYear);
  const alt =
    subject.popularName && !subject.name.toLowerCase().includes(subject.popularName.toLowerCase())
      ? subject.popularName
      : null;
  const hasMock = papers.some((p) => p.isMock);

  const chip = (active) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium ${
      active ? "border-stamp bg-stamp-light text-stamp-dark" : "border-paper-line bg-white text-ink-soft"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { to: "/", label: "Home" },
          { to: "/school", label: "School" },
          { to: SSC_BASE_PATH, label: SSC_CLASS_10.label },
          { label: subject.name },
        ]}
      />

      <Link to={SSC_BASE_PATH} className="mb-3 inline-block text-sm font-medium text-stamp hover:underline">
        ← All {SSC_CLASS_10.label} subjects
      </Link>

      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{subject.name}</h1>
      {alt && <p className="mt-1 text-sm text-ink-soft">{alt}</p>}
      {papers.length > 0 && (
        <p className="mt-1 text-xs text-ink-faint">
          {papers.length} paper{papers.length === 1 ? "" : "s"} available
        </p>
      )}
      {hasMock && (
        <p className="mt-2 text-xs text-ink-faint">Sample data for testing — these are not real question papers.</p>
      )}

      {years.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by academic year">
          <button type="button" onClick={() => setYear("all")} aria-pressed={activeYear === "all"} className={chip(activeYear === "all")}>
            All years
          </button>
          {years.map((y) => (
            <button key={y} type="button" onClick={() => setYear(y)} aria-pressed={activeYear === y} className={chip(activeYear === y)}>
              {y}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        {papers.length === 0 ? (
          <EmptyState
            title="No question papers available yet"
            description={`Papers for ${subject.name} will appear here once they're added.`}
            actionLabel="Back to all subjects"
            actionTo={SSC_BASE_PATH}
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