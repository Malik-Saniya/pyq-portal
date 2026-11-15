import { useParams, useSearchParams, Navigate, Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import { UNIVERSITIES, getCourseBySlug, getSubjectsForCourse, getPapersBySubject } from "../data/mockData";
import { NEP_CATEGORIES } from "../data/academicConfig";

const TYPE_LABEL = { DSC: "Core (DSC)", DSE: "Elective (DSE)" };

function SubjectRow({ subject }) {
  const paperCount = getPapersBySubject(subject.slug).length;
  const hasMeta = subject.majorType || subject.specialization || subject.discipline || subject.note;
  return (
    <li>
      <Link
        to={`/subject/${subject.slug}`}
        className="flex items-start justify-between gap-3 rounded-card border border-paper-line bg-white px-4 py-3 transition hover:border-stamp"
      >
        <span className="min-w-0">
          <span className="block font-medium text-ink">{subject.name}</span>
          {hasMeta && (
            <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {subject.majorType && <Badge tone="stamp">{TYPE_LABEL[subject.majorType]}</Badge>}
              {subject.specialization && <Badge>{subject.specialization}</Badge>}
              {subject.discipline && <Badge>{subject.discipline}</Badge>}
              {subject.note && <span className="text-xs text-ink-faint">{subject.note}</span>}
            </span>
          )}
        </span>
        <span className={`shrink-0 text-xs ${paperCount > 0 ? "font-medium text-pass" : "text-ink-faint"}`}>
          {paperCount > 0 ? `${paperCount} paper${paperCount === 1 ? "" : "s"}` : "No papers yet"}
        </span>
      </Link>
    </li>
  );
}

export default function Course() {
  const { courseSlug } = useParams();
  const [params] = useSearchParams();
  const course = getCourseBySlug(courseSlug);

  if (!course || !course.hasSyllabus) return <Navigate to="/404" replace />;

  const semesters = Array.from({ length: course.semesters }, (_, i) => i + 1);
  const requested = parseInt(params.get("sem") ?? "1", 10);
  const semester = semesters.includes(requested) ? requested : 1;

  const subjects = getSubjectsForCourse(course.slug, semester);
  const groups = NEP_CATEGORIES.map((cat) => ({
    ...cat,
    items: subjects.filter((s) => s.nepCategory === cat.key),
  })).filter((g) => g.items.length > 0);

  const university = UNIVERSITIES.find((u) => u.slug === course.university);
  const withPapers = subjects.filter((s) => getPapersBySubject(s.slug).length > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { to: "/", label: "Home" },
          { to: "/explore/degree", label: "Degree / UG" },
          { label: course.name },
        ]}
      />

      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{course.name}</h1>
      <p className="mt-1.5 text-sm text-ink-soft">{course.fullName}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {university && <Badge>{university.name}</Badge>}
        <Badge>{course.faculty}</Badge>
        <Badge tone="pass">{course.scheme}</Badge>
      </div>

      {course.structureNote && (
        <p className="mt-4 max-w-2xl rounded-card border border-paper-line bg-white/70 px-4 py-3 text-sm text-ink-soft">
          {course.structureNote}
        </p>
      )}

      <div
        className="mt-6 flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label={`Semesters of ${course.name}`}
      >
        {semesters.map((n) => (
          <Link
            key={n}
            to={`/course/${course.slug}?sem=${n}`}
            replace
            aria-current={n === semester ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium ${
              n === semester
                ? "border-stamp bg-stamp-light text-stamp-dark"
                : "border-paper-line bg-white text-ink-soft hover:border-stamp hover:text-stamp"
            }`}
          >
            Semester {n}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        {subjects.length === 0 ? (
          <EmptyState
            icon="📚"
            title={`Subjects for Semester ${semester} aren't listed yet`}
            description="The syllabus data we have for this course doesn't name the papers of this semester, so we don't show any."
            actionLabel={semester !== 1 ? "Go to Semester 1" : undefined}
            actionTo={semester !== 1 ? `/course/${course.slug}?sem=1` : undefined}
          />
        ) : (
          <>
            <p className="text-sm text-ink-faint">
              {subjects.length} subject{subjects.length === 1 ? "" : "s"} in Semester {semester}
              {withPapers === 0
                ? " • no question papers added yet"
                : ` • ${withPapers} with papers`}
            </p>
            <div className="mt-4 space-y-8">
              {groups.map((g) => (
                <section key={g.key} aria-labelledby={`cat-${g.key}`}>
                  <h2
                    id={`cat-${g.key}`}
                    className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
                  >
                    {g.label}
                  </h2>
                  <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {g.items.map((s) => (
                      <SubjectRow key={s.id} subject={s} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}