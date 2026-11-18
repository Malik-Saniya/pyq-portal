// Pure helpers for the Search filter UI. No React, no data fetching — just
// the rules for what a "filter set" is and how it narrows a list of papers.
import { ACADEMIC_YEARS, EXAM_TYPES, LANGUAGES, SCHEMES, STANDARDS, STREAMS } from "../data/academicConfig";
import { UNIVERSITIES, BOARDS, COURSES } from "../data/mockData";

// Fields that only make sense for one academic level (see LEVELS in
// academicConfig). Shared fields (year, exam type, language) apply to both.
export const DEGREE_FIELDS = ["universitySlug", "courseSlug", "semester", "scheme"];
export const HSC_FIELDS = ["boardSlug", "stream", "standard"];

function isSet(value) {
  return value !== undefined && value !== null && value !== "";
}

// Drops empty values so {} and { stream: undefined } compare as equal.
export function normalizeFilters(filters = {}) {
  const out = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (isSet(value)) out[key] = value;
  });
  return out;
}

export function countActive(filters) {
  return Object.keys(normalizeFilters(filters)).length;
}

export function filtersEqual(a, b) {
  const x = normalizeFilters(a);
  const y = normalizeFilters(b);
  const keys = Object.keys(x);
  return keys.length === Object.keys(y).length && keys.every((k) => x[k] === y[k]);
}

// The panel shows the Degree fields until a level is chosen, so a filter
// belonging to the *other* level would be active but invisible. This removes
// such orphaned fields whenever the level changes.
export function pruneHiddenFields(filters) {
  const shown = filters.level ?? "degree";
  const hidden = shown === "degree" ? HSC_FIELDS : DEGREE_FIELDS;
  const next = { ...filters };
  hidden.forEach((key) => delete next[key]);
  return normalizeFilters(next);
}

// Every selected filter must match (AND). Previously the search layer scored
// filters additively, so adding a filter could *widen* the results.
export function applyFilters(papers, filters) {
  const f = normalizeFilters(filters);
  return papers.filter(
    (p) =>
      (!f.level || p.level === f.level) &&
      (!f.universitySlug || p.university?.slug === f.universitySlug) &&
      (!f.courseSlug || p.course?.slug === f.courseSlug) &&
      (f.semester === undefined || p.semester === Number(f.semester)) &&
      (!f.scheme || p.scheme === f.scheme) &&
      (!f.boardSlug || p.board?.slug === f.boardSlug) &&
      (!f.stream || p.stream === f.stream) &&
      (f.standard === undefined || p.standard === Number(f.standard)) &&
      (!f.academicYear || p.academicYear === f.academicYear) &&
      (!f.examType || p.examType === f.examType) &&
      (!f.language || p.language === f.language)
  );
}

// --- URL <-> filters ---------------------------------------------------
// The URL is the single source of truth for applied filters, so Back/Forward,
// refresh and shared links all restore exactly what the student saw.
// filter key -> query-string name. The names that existed before
// (level, stream, standard, board, year) are unchanged, so Explore links work.
const PARAM_NAMES = {
  level: "level",
  universitySlug: "university",
  courseSlug: "course",
  semester: "sem",
  scheme: "scheme",
  boardSlug: "board",
  stream: "stream",
  standard: "standard",
  academicYear: "year",
  examType: "exam",
  language: "lang",
};

const oneOf = (list) => (v) => (list.includes(v) ? v : undefined);
const intOneOf = (list) => (v) => {
  const n = Number(v);
  return Number.isInteger(n) && list.includes(n) ? n : undefined;
};

// Each parser returns a valid value or undefined; an invalid or unknown
// value in the URL is dropped rather than turned into an impossible filter.
const PARSERS = {
  level: oneOf(["degree", "hsc"]),
  universitySlug: oneOf(UNIVERSITIES.map((u) => u.slug)),
  courseSlug: oneOf(COURSES.map((c) => c.slug)),
  semester: intOneOf([1, 2, 3, 4, 5, 6]),
  scheme: oneOf(SCHEMES),
  boardSlug: oneOf(BOARDS.map((b) => b.slug)),
  stream: oneOf(STREAMS),
  standard: intOneOf(STANDARDS),
  academicYear: oneOf(ACADEMIC_YEARS),
  examType: oneOf(EXAM_TYPES),
  language: oneOf(LANGUAGES),
};

export function filtersFromParams(params) {
  const next = {};
  Object.entries(PARAM_NAMES).forEach(([key, name]) => {
    const raw = params.get(name);
    if (raw === null) return;
    const value = PARSERS[key](raw);
    if (value !== undefined) next[key] = value;
  });
  return pruneHiddenFields(next);
}

export function filtersToParams(filters) {
  const out = {};
  Object.entries(normalizeFilters(filters)).forEach(([key, value]) => {
    if (PARAM_NAMES[key]) out[PARAM_NAMES[key]] = String(value);
  });
  return out;
}