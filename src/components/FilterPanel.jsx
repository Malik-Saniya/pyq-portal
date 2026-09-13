import { LEVELS, ACADEMIC_YEARS, EXAM_TYPES, SCHEMES, STREAMS, STANDARDS, LANGUAGES } from "../data/academicConfig";
import { UNIVERSITIES, BOARDS, COURSES } from "../data/mockData";

function Select({ label, value, onChange, options, placeholder = "Any" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-faint">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="w-full rounded-md border border-paper-line bg-white px-2.5 py-2 text-sm text-ink outline-none focus:border-stamp"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function FilterPanel({ filters, onChange, resultCount }) {
  // activeLevel reflects only a level the user actually chose (used for
  // highlighting/aria-pressed); displayLevel falls back to "degree" only
  // to decide which contextual field set to render before any choice is
  // made. Using one variable for both previously made the "Degree/UG"
  // pill look selected even when no level filter was applied at all.
  const activeLevel = filters.level;
  const displayLevel = activeLevel ?? "degree";
  const config = LEVELS[displayLevel];

  // Fields meaningful regardless of level — switching level should not
  // discard these, only the level-specific fields (university/course/
  // semester/scheme vs board/stream/standard).
  const SHARED_FIELDS = ["academicYear", "examType", "language"];

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function switchLevel(newLevel) {
    const preserved = {};
    SHARED_FIELDS.forEach((f) => {
      if (filters[f] !== undefined) preserved[f] = filters[f];
    });
    onChange({ level: newLevel, ...preserved });
  }

  function clearAll() {
    onChange({});
  }

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-paper-line pb-3">
        <h2 className="font-display text-base font-semibold text-ink">Filters</h2>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll} className="text-xs font-medium text-stamp hover:underline">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4 overflow-y-auto pb-4">
        <fieldset>
          <legend className="mb-1.5 text-xs font-medium text-ink-faint">Academic level</legend>
          <div className="flex gap-2">
            {Object.values(LEVELS).map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => switchLevel(l.key)}
                aria-pressed={activeLevel === l.key}
                className={`flex-1 rounded-md border px-2.5 py-2 text-sm font-medium transition ${
                  activeLevel === l.key
                    ? "border-stamp bg-stamp-light text-stamp-dark"
                    : "border-paper-line bg-white text-ink-soft hover:border-ink-faint"
                }`}
              >
                {l.shortLabel}
              </button>
            ))}
          </div>
        </fieldset>

        {displayLevel === "degree" ? (
          <>
            <Select
              label="University"
              value={filters.universitySlug}
              onChange={(v) => set("universitySlug", v)}
              options={UNIVERSITIES.map((u) => ({ value: u.slug, label: u.name }))}
            />
            <Select
              label="Course / Program"
              value={filters.courseSlug}
              onChange={(v) => set("courseSlug", v)}
              options={COURSES.map((c) => ({ value: c.slug, label: c.name }))}
            />
            <Select
              label="Semester"
              value={filters.semester}
              onChange={(v) => set("semester", v ? Number(v) : undefined)}
              options={[1, 2, 3, 4, 5, 6].map((s) => ({ value: s, label: `Semester ${s}` }))}
            />
            <Select
              label="Scheme / Pattern"
              value={filters.scheme}
              onChange={(v) => set("scheme", v)}
              options={SCHEMES.map((s) => ({ value: s, label: s }))}
            />
          </>
        ) : (
          <>
            <Select
              label="Board"
              value={filters.boardSlug}
              onChange={(v) => set("boardSlug", v)}
              options={BOARDS.map((b) => ({ value: b.slug, label: b.name }))}
            />
            <Select
              label="Stream"
              value={filters.stream}
              onChange={(v) => set("stream", v)}
              options={STREAMS.map((s) => ({ value: s, label: s }))}
            />
            <Select
              label="Standard"
              value={filters.standard}
              onChange={(v) => set("standard", v ? Number(v) : undefined)}
              options={STANDARDS.map((s) => ({ value: s, label: `${s}th` }))}
            />
          </>
        )}

        <Select
          label="Academic year"
          value={filters.academicYear}
          onChange={(v) => set("academicYear", v)}
          options={ACADEMIC_YEARS.map((y) => ({ value: y, label: y }))}
        />
        <Select
          label="Exam type"
          value={filters.examType}
          onChange={(v) => set("examType", v)}
          options={EXAM_TYPES.map((e) => ({ value: e, label: e }))}
        />
        <Select
          label="Language"
          value={filters.language}
          onChange={(v) => set("language", v)}
          options={LANGUAGES.map((l) => ({ value: l, label: l }))}
        />
      </div>

      {typeof resultCount === "number" && (
        <div className="mt-auto border-t border-paper-line pt-3 text-xs text-ink-faint">
          {resultCount} paper{resultCount === 1 ? "" : "s"} match
        </div>
      )}
    </div>
  );
}