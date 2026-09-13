import { useEffect, useRef, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import PaperCard from "../components/PaperCard";
import Badge from "../components/Badge";
import { getPaperBySlug, getRelatedPapers } from "../data/mockData";
import { levelLabel } from "../data/academicConfig";
import { paperContextLine } from "../lib/format";
import { useBookmarks } from "../lib/useBookmarks";
import { pushRecent } from "../lib/storage";

function metadataRows(paper) {
  const rows = [];
  if (paper.course) rows.push(["Course / Program", paper.course.name]);
  if (paper.semester) rows.push(["Semester", paper.semester]);
  if (paper.stream) rows.push(["Stream", paper.stream]);
  if (paper.standard) rows.push(["Standard", `${paper.standard}th`]);
  if (paper.university) rows.push(["University", paper.university.name]);
  if (paper.board) rows.push(["Board", paper.board.name]);
  if (paper.college) rows.push(["College", paper.college.name]);
  if (paper.institution) rows.push(["Institution", paper.institution.name]);
  rows.push(["Academic year", paper.academicYear]);
  if (paper.examType) rows.push(["Exam type", paper.examType]);
  if (paper.scheme) rows.push(["Scheme / Pattern", paper.scheme]);
  if (paper.paperType) rows.push(["Paper type", paper.paperType]);
  if (paper.subject.code) rows.push(["Subject code", paper.subject.code]);
  if (paper.paperCode) rows.push(["Paper code", paper.paperCode]);
  rows.push(["Language", paper.language]);
  rows.push(["File", `${paper.fileType} • ${paper.pageCount} pages`]);
  return rows;
}

function DownloadAction({ paper }) {
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function startDownload() {
    if (paper.status !== "available") return;
    setState("loading");
    timer.current = setTimeout(() => {
      // Deterministic mock: this is a prototype data layer with no real file,
      // so downloads always resolve successfully unless the record itself
      // is flagged unavailable/removed (handled above the fold instead).
      setState("success");
    }, 700);
  }

  if (paper.status === "removed") {
    return (
      <div className="rounded-md border border-stamp/30 bg-stamp-light p-4 text-sm text-stamp-dark">
        <p className="font-medium">This paper was removed.</p>
        <p className="mt-1 text-stamp-dark/80">It was taken down for a content-quality or rights reason.</p>
        <Link to={`/subject/${paper.subject.slug}`} className="mt-3 inline-block text-sm font-medium underline">
          See other {paper.subject.name} papers
        </Link>
      </div>
    );
  }

  if (paper.status === "unavailable") {
    return (
      <div className="rounded-md border border-paper-line bg-paper-dim p-4 text-sm text-ink-soft">
        <p className="font-medium text-ink">This paper is temporarily unavailable.</p>
        <p className="mt-1">We're re-checking the file. Please try again shortly.</p>
        <button onClick={() => window.location.reload()} className="mt-3 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-paper">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div id="download">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={startDownload}
          disabled={state === "loading"}
          className="min-w-[160px] rounded-md bg-stamp px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stamp-dark disabled:opacity-70"
        >
          {state === "loading" ? "Preparing…" : state === "success" ? "Downloaded ✓" : "Download PDF"}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-sm text-stamp">Something interrupted the download. <button onClick={startDownload} className="underline">Retry</button></p>
      )}
      {state === "success" && (
        <p className="mt-2 text-sm text-pass">Saved to your device. Check your browser's downloads.</p>
      )}
    </div>
  );
}

export default function PaperDetail() {
  const { paperSlug } = useParams();
  const paper = getPaperBySlug(paperSlug);
  const { isBookmarked, toggle } = useBookmarks();

  useEffect(() => {
    if (paper) pushRecent(paper.id);
  }, [paper]);

  if (!paper) return <Navigate to="/404" replace />;

  const related = getRelatedPapers(paper, 4);
  const bookmarked = isBookmarked(paper.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { to: "/", label: "Home" },
          { to: `/explore/${paper.level}`, label: levelLabel(paper.level) },
          { to: `/subject/${paper.subject.slug}`, label: paper.subject.name },
          { label: `${paper.academicYear}` },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="folio rounded-card border border-paper-line bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {paper.subject.name} — {paper.academicYear}
                </h1>
                <p className="mt-1 text-sm text-ink-soft">{paperContextLine(paper)}</p>
              </div>
              <button
                onClick={() => toggle(paper.id)}
                aria-pressed={bookmarked}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  bookmarked ? "border-stamp bg-stamp-light text-stamp-dark" : "border-paper-line text-ink-soft hover:border-stamp hover:text-stamp"
                }`}
              >
                {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge>{paper.examType}</Badge>
              {paper.scheme && <Badge tone="pass">{paper.scheme}</Badge>}
              {paper.status !== "available" && <Badge tone="stamp">{paper.status}</Badge>}
            </div>

            {/* Inline preview — first-class, not a separate route */}
            <div className="ruled mt-6 flex aspect-[3/4] max-h-[420px] w-full items-center justify-center rounded-md border border-paper-line bg-paper-dim/60 sm:aspect-[4/3]">
              <div className="text-center text-ink-faint">
                <div className="font-mono text-5xl">PDF</div>
                <p className="mt-2 text-sm">Inline preview of {paper.subject.name} ({paper.academicYear})</p>
              </div>
            </div>

            <div className="mt-6">
              <DownloadAction paper={paper} />
            </div>
          </div>

          {/* Full metadata */}
          <div className="mt-6 rounded-card border border-paper-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Paper information</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {metadataRows(paper).map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-paper-line/70 pb-2 text-sm sm:block sm:border-0 sm:pb-0">
                  <dt className="text-ink-faint">{label}</dt>
                  <dd className="font-medium text-ink sm:mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-card border border-dashed border-paper-line bg-white/60 p-4 text-sm text-ink-soft">
            <span>Notice something wrong with this paper's metadata or file?</span>
            <Link to="/contact?subject=report-issue" className="font-medium text-stamp hover:underline">
              Report an issue →
            </Link>
          </div>
        </div>

        {/* Related / recommended rail */}
        <aside>
          <h2 className="font-display text-lg font-semibold text-ink">Related papers</h2>
          <div className="mt-4 flex flex-col gap-4">
            {related.length === 0 ? (
              <p className="text-sm text-ink-faint">No related papers yet.</p>
            ) : (
              related.map((p) => <PaperCard key={p.id} paper={p} />)
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
