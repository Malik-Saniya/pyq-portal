import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  SCHOOL_BOARD,
  SSC_CLASS_10,
  SSC_CLASS_10_SUBJECTS,
  getSscPapersBySubject,
  sscSubjectGroups,
  sscSubjectPath,
} from "../data/sscData";

// The popular name only helps when it adds something ("Algebra / Maths 1");
// for "English" or "Information Technology (IT)" it would just repeat the name.
function alternateName(subject) {
  if (!subject.popularName) return null;
  return subject.name.toLowerCase().includes(subject.popularName.toLowerCase()) ? null : subject.popularName;
}

function SubjectRow({ subject }) {
  const count = getSscPapersBySubject(subject.slug).length;
  const alt = alternateName(subject);
  return (
    <li>
      <Link
        to={sscSubjectPath(subject.slug)}
        className="flex min-h-[56px] items-center justify-between gap-3 rounded-card border border-paper-line bg-white px-4 py-3 transition hover:border-stamp"
      >
        <span className="min-w-0">
          <span className="block font-medium text-ink">{subject.name}</span>
          {alt && <span className="mt-0.5 block text-xs text-ink-faint">{alt}</span>}
        </span>
        <span className={`shrink-0 text-xs ${count > 0 ? "font-medium text-pass" : "text-ink-faint"}`}>
          {count > 0 ? `${count} paper${count === 1 ? "" : "s"}` : "No papers yet"}
        </span>
      </Link>
    </li>
  );
}

export default function SchoolClass() {
  const groups = sscSubjectGroups();
  const withPapers = SSC_CLASS_10_SUBJECTS.filter((s) => getSscPapersBySubject(s.slug).length > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { to: "/", label: "Home" },
          { to: "/school", label: "School" },
          { label: SSC_CLASS_10.label },
        ]}
      />

      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{SSC_CLASS_10.label}</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        {SCHOOL_BOARD.name} — pick a subject to see its previous-year papers.
      </p>
      <p className="mt-1 text-xs text-ink-faint">
        {SSC_CLASS_10_SUBJECTS.length} subjects
        {withPapers === 0 ? " • no question papers added yet" : ` • ${withPapers} with papers`}
      </p>

      <div className="mt-6 space-y-8">
        {groups.map((g) => (
          <section key={g.group} aria-labelledby={`ssc-group-${g.group}`}>
            <h2
              id={`ssc-group-${g.group}`}
              className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
            >
              {g.group}
            </h2>
            <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {g.items.map((s) => (
                <SubjectRow key={s.id} subject={s} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}