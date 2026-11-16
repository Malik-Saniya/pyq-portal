import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { LEVELS } from "../data/academicConfig";
import { SCHOOL_PROGRAMMES } from "../data/sscData";

export default function School() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: LEVELS.school.label }]} />
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{LEVELS.school.label}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{LEVELS.school.description}</p>

      <section className="mt-8" aria-labelledby="school-programmes-heading">
        <h2 id="school-programmes-heading" className="font-display text-lg font-semibold text-ink">
          Choose your board and class
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCHOOL_PROGRAMMES.map((p) => (
            <Link
              key={p.key}
              to={p.to}
              className="folio flex items-center justify-between gap-3 rounded-card border border-paper-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-raised"
            >
              <span>
                <span className="block font-display text-lg font-semibold text-ink">{p.boardName}</span>
                <span className="block text-sm text-ink-soft">{p.label}</span>
              </span>
              <span aria-hidden="true" className="text-ink-faint">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}