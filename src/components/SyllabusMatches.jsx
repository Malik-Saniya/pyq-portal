import { Link } from "react-router-dom";
import { getCourseBySlug, getPapersBySubject } from "../data/mockData";
import { nepCategoryLabel } from "../data/academicConfig";

// Shown under an empty Search result: subjects from the syllabus that match
// the query. It says plainly whether papers exist — a subject being in the
// syllabus never implies a paper has been added.
export default function SyllabusMatches({ items, total }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-8" aria-labelledby="syllabus-matches-heading">
      <h2 id="syllabus-matches-heading" className="font-display text-lg font-semibold text-ink">
        Matching subjects in the syllabus
      </h2>
      <p className="mt-1 text-sm text-ink-soft">Open a subject to see whether question papers are available for it.</p>
      <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.map((s) => {
          const course = getCourseBySlug(s.courseSlug);
          const paperCount = getPapersBySubject(s.slug).length;
          return (
            <li key={s.id}>
              <Link
                to={`/subject/${s.slug}`}
                className="flex items-start justify-between gap-3 rounded-card border border-paper-line bg-white px-4 py-3 transition hover:border-stamp"
              >
                <span className="min-w-0">
                  <span className="block font-medium text-ink">{s.name}</span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {course?.shortName} • Semester {s.semester} • {nepCategoryLabel(s.nepCategory)}
                  </span>
                </span>
                <span className={`shrink-0 text-xs ${paperCount > 0 ? "font-medium text-pass" : "text-ink-faint"}`}>
                  {paperCount > 0 ? `${paperCount} paper${paperCount === 1 ? "" : "s"}` : "No papers yet"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {total > items.length && (
        <p className="mt-3 text-xs text-ink-faint">
          Showing {items.length} of {total} matching subjects — add a course or semester to narrow it down.
        </p>
      )}
    </section>
  );
}