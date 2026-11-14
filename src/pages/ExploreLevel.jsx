import { useParams, Link, Navigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { LEVELS, STREAMS, STANDARDS } from "../data/academicConfig";
import { COURSES, UNIVERSITIES, BOARDS, subjectsForLevel, subjectsForStream } from "../data/mockData";

export default function ExploreLevel() {
  const { level } = useParams();
  const config = LEVELS[level];
  if (!config) return <Navigate to="/explore/degree" replace />;

  const subjects = subjectsForLevel(level);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: config.label }]} />
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{config.label}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{config.description}</p>

      {level === "degree" ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink">Browse by university</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UNIVERSITIES.map((u) => (
              <div key={u.slug} className="rounded-card border border-paper-line bg-white p-4">
                <h3 className="font-medium text-ink">{u.name}</h3>
                <ul className="mt-3 space-y-1.5">
                  {COURSES.filter((c) => c.university === u.slug).map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/search?q=${encodeURIComponent(c.name)}`}
                        className="text-sm text-ink-soft hover:text-stamp"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Browse by class</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Maharashtra State Board (MSBSHSE) — Class 11 and Class 12 share the same subject structure by stream.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {STANDARDS.map((std) => (
                <Link
                  key={std}
                  to={`/search?level=hsc&standard=${std}`}
                  className="rounded-card border border-paper-line bg-white px-5 py-3 text-sm font-medium text-ink hover:border-stamp hover:text-stamp"
                >
                  Class {std}
                  <span className="mt-0.5 block text-xs font-normal text-ink-faint">Std {std} · Board papers</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ink">Streams & subjects</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {BOARDS[0].name}. Select a stream to see its subjects; open a subject for available papers.
            </p>
            <div className="mt-6 space-y-8">
              {STREAMS.map((stream) => {
                const streamSubjects = subjectsForStream(stream);
                return (
                  <div key={stream} className="rounded-card border border-paper-line bg-white p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-ink">{stream}</h3>
                      <div className="flex gap-2">
                        {STANDARDS.map((std) => (
                          <Link
                            key={std}
                            to={`/search?level=hsc&stream=${encodeURIComponent(stream)}&standard=${std}`}
                            className="rounded-full border border-paper-line px-3 py-1 text-xs font-medium text-ink-soft hover:border-stamp hover:text-stamp"
                          >
                            Class {std}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {streamSubjects.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/subject/${s.slug}`}
                          className="rounded-full border border-paper-line bg-paper px-3 py-1.5 text-sm text-ink-soft hover:border-stamp hover:text-stamp"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                    {streamSubjects.length === 0 && (
                      <p className="mt-3 text-sm text-ink-faint">No subjects listed for this stream yet.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {level === "degree" && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">Subjects</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {subjects.map((s) => (
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
      )}
    </div>
  );
}
