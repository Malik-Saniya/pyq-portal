import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LEVELS, ACADEMIC_YEARS, EXAM_TYPES, SCHEMES, STREAMS, STANDARDS, LANGUAGES } from "../data/academicConfig";
import { UNIVERSITIES, BOARDS, COURSES } from "../data/mockData";
import { countActive, filtersEqual, normalizeFilters, pruneHiddenFields } from "../lib/filters";

function Select({ label, value, onChange, options, wide = false, placeholder = "Any" }) {
  const id = useId();
  const hasValue = value !== undefined && value !== "";
  return (
    <div className={wide ? "col-span-full" : undefined}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <div className="relative">
        {/* Native <select>: the browser positions and closes the option list
            itself, so it can't clip, overflow or dismiss unexpectedly — and on
            phones it opens the OS picker. text-base on mobile stops iOS
            Safari from zooming the page when a select is focused. */}
        <select
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          className={`w-full appearance-none rounded-md border py-2 pl-3 pr-9 text-base text-ink outline-none transition focus:border-stamp md:text-sm ${
            hasValue ? "border-stamp/50 bg-stamp-light/40 font-medium" : "border-paper-line bg-white hover:border-ink-faint"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function Group({ title, columns, children }) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{title}</h3>
      <div className={`grid gap-3 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>{children}</div>
    </section>
  );
}

/**
 * Filter panel with a draft/apply model.
 *
 *  - `applied`  : the filters currently narrowing the results (owned by Search)
 *  - draft      : what the student is editing here; nothing changes in the
 *                 results until "Apply filters" is pressed
 *  - `onApply`  : receives the draft when Apply is pressed
 *  - `onReset`  : clears applied filters immediately
 *  - `getCount` : (filters) => number of matching papers, used for the live
 *                 "N papers match" preview of the draft
 *  - `variant`  : "sidebar" (desktop, independently scrolling card) or
 *                 "drawer" (mobile bottom sheet content)
 */
export default function FilterPanel({
  applied,
  onApply,
  onApplied,
  onReset,
  onClose,
  getCount,
  variant = "sidebar",
}) {
  const isDrawer = variant === "drawer";
  const [draft, setDraft] = useState(() => normalizeFilters(applied));
  const [justApplied, setJustApplied] = useState(false);
  const feedbackTimer = useRef(null);

  // Keep the draft in step when the applied filters change from outside
  // (removing a chip, "Clear all", Reset). Adjusting state during render is
  // React's recommended way to reset state when a prop changes.
  const [prevApplied, setPrevApplied] = useState(applied);
  if (applied !== prevApplied) {
    setPrevApplied(applied);
    setDraft(normalizeFilters(applied));
  }

  useEffect(() => () => clearTimeout(feedbackTimer.current), []);

  const dirty = !filtersEqual(draft, applied);
  const previewCount = useMemo(() => (getCount ? getCount(draft) : null), [getCount, draft]);

  const activeLevel = draft.level;
  const displayLevel = activeLevel ?? "degree";

  function set(key, value) {
    setDraft((d) => normalizeFilters({ ...d, [key]: value }));
  }

  function toggleLevel(levelKey) {
    setDraft((d) => {
      const next = { ...d };
      if (d.level === levelKey) delete next.level;
      else next.level = levelKey;
      return pruneHiddenFields(next);
    });
  }

  // Course options follow the chosen university, so impossible combinations
  // (e.g. Pune + B.Com) can't be selected.
  function setUniversity(value) {
    setDraft((d) => {
      const next = { ...d, universitySlug: value };
      const course = COURSES.find((c) => c.slug === d.courseSlug);
      if (value && course && course.university !== value) delete next.courseSlug;
      return normalizeFilters(next);
    });
  }

  const courseOptions = COURSES.filter((c) => !draft.universitySlug || c.university === draft.universitySlug);

  function apply() {
    onApply(normalizeFilters(draft));
    if (isDrawer) {
      onApplied?.();
      return;
    }
    setJustApplied(true);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setJustApplied(false), 1600);
  }

  function reset() {
    setDraft({});
    onReset();
  }

  const showApplied = justApplied && !dirty;
  const canReset = countActive(draft) > 0 || countActive(applied) > 0;
  const activeCount = countActive(applied);

  const rootClass = isDrawer
    ? "flex min-h-0 flex-1 flex-col"
    : "flex max-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-card border border-paper-line bg-white shadow-card";

  return (
    <div className={rootClass}>
      {/* Header — fixed */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-paper-line px-4 py-3">
        <h2 className="font-display text-base font-semibold text-ink">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-stamp px-1.5 py-0.5 align-middle text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-1">
          {canReset && (
            <button
              type="button"
              onClick={reset}
              className="rounded-md px-2 py-1 text-xs font-medium text-stamp hover:bg-stamp-light"
            >
              Reset all
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-paper-dim"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Body — the only part that scrolls */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4">
        <fieldset>
          <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Academic level</legend>
          <div className="grid grid-cols-2 gap-1 rounded-md bg-paper-dim p-1">
            {Object.values(LEVELS).map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => toggleLevel(l.key)}
                aria-pressed={activeLevel === l.key}
                className={`rounded px-2.5 py-1.5 text-sm font-medium transition ${
                  activeLevel === l.key
                    ? "bg-white text-stamp-dark shadow-card ring-1 ring-stamp/30"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.shortLabel}
              </button>
            ))}
          </div>
        </fieldset>

        {displayLevel === "degree" ? (
          <Group title="University & course" columns={isDrawer ? 2 : 1}>
            <Select
              label="University"
              wide
              value={draft.universitySlug}
              onChange={setUniversity}
              options={UNIVERSITIES.map((u) => ({ value: u.slug, label: u.name }))}
            />
            <Select
              label="Course / Program"
              wide
              value={draft.courseSlug}
              onChange={(v) => set("courseSlug", v)}
              options={courseOptions.map((c) => ({ value: c.slug, label: c.name }))}
            />
            <Select
              label="Semester"
              value={draft.semester}
              onChange={(v) => set("semester", v ? Number(v) : undefined)}
              options={[1, 2, 3, 4, 5, 6].map((s) => ({ value: s, label: `Semester ${s}` }))}
            />
            <Select
              label="Scheme / Pattern"
              value={draft.scheme}
              onChange={(v) => set("scheme", v)}
              options={SCHEMES.map((s) => ({ value: s, label: s }))}
            />
          </Group>
        ) : (
          <Group title="Board & stream" columns={isDrawer ? 2 : 1}>
            <Select
              label="Board"
              wide
              value={draft.boardSlug}
              onChange={(v) => set("boardSlug", v)}
              options={BOARDS.map((b) => ({ value: b.slug, label: b.name }))}
            />
            <Select
              label="Stream"
              value={draft.stream}
              onChange={(v) => set("stream", v)}
              options={STREAMS.map((s) => ({ value: s, label: s }))}
            />
            <Select
              label="Standard"
              value={draft.standard}
              onChange={(v) => set("standard", v ? Number(v) : undefined)}
              options={STANDARDS.map((s) => ({ value: s, label: `${s}th` }))}
            />
          </Group>
        )}

        <Group title="Paper details" columns={isDrawer ? 2 : 1}>
          <Select
            label="Academic year"
            value={draft.academicYear}
            onChange={(v) => set("academicYear", v)}
            options={ACADEMIC_YEARS.map((y) => ({ value: y, label: y }))}
          />
          <Select
            label="Exam type"
            value={draft.examType}
            onChange={(v) => set("examType", v)}
            options={EXAM_TYPES.map((e) => ({ value: e, label: e }))}
          />
          <Select
            label="Language"
            value={draft.language}
            onChange={(v) => set("language", v)}
            options={LANGUAGES.map((l) => ({ value: l, label: l }))}
          />
        </Group>
      </div>

      {/* Footer — fixed, always visible */}
      <div
        className={`shrink-0 border-t border-paper-line bg-white px-4 pt-3 ${
          isDrawer ? "pb-[max(0.75rem,env(safe-area-inset-bottom))]" : "pb-3"
        }`}
      >
        {typeof previewCount === "number" && (
          <p className="mb-2 text-xs text-ink-faint" aria-live="polite">
            {previewCount === 1 ? "1 paper matches" : `${previewCount} papers match`}
            {dirty && <span className="ml-1.5 font-medium text-stamp">· not applied yet</span>}
          </p>
        )}
        <button
          type="button"
          onClick={apply}
          disabled={!isDrawer && !dirty}
          className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold transition ${
            showApplied
              ? "bg-pass text-white"
              : !isDrawer && !dirty
                ? "cursor-not-allowed bg-paper-dim text-ink-faint"
                : "bg-stamp text-white hover:bg-stamp-dark active:scale-[0.99]"
          }`}
        >
          {showApplied ? "Filters applied ✓" : "Apply filters"}
        </button>
      </div>
    </div>
  );
}