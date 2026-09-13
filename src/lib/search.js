import { PAPERS, COURSES, UNIVERSITIES, BOARDS, SUBJECTS } from "../data/mockData";

// Common shorthand -> canonical entity aliasing (Section G.3 of the
// blueprint: "a maintained alias table"). Kept intentionally small and
// explicit for the MVP; expand as real queries reveal new abbreviations.
const ALIASES = {
  fybsc: { courseSlug: "bsc", semester: 1 },
  sybsc: { courseSlug: "bsc", semester: 3 },
  tybsc: { courseSlug: "bsc", semester: 5 },
  fybcom: { courseSlug: "bcom", semester: 1 },
  sybcom: { courseSlug: "bcom", semester: 3 },
  tybcom: { courseSlug: "bcom", semester: 5 },
  hsc: { level: "hsc" },
  "12th": { standard: 12 },
  "11th": { standard: 11 },
  ssc: { level: "hsc", standard: 10 },
};

// Common word-level shorthand that isn't a substring of the canonical name
// (e.g. "maths" is not a substring of "mathematics", so a plain .includes()
// check would silently fail this documented example query).
const WORD_SYNONYMS = {
  maths: "mathematics",
};

const SEM_RE = /sem(?:ester)?\.?\s*-?\s*(\d)/i;
const YEAR_RE = /\b(19|20)\d{2}\b/;
const STD_RE = /\b(11|12)th\b/i;

function norm(s) {
  return (s || "").toString().toLowerCase().trim();
}

/**
 * Interpret a free-text query into structured hints plus the leftover
 * keyword text used for fuzzy subject/course matching.
 */
export function interpretQuery(raw) {
  const q = norm(raw);
  if (!q) return { keywords: "", hints: {} };

  const hints = {};
  let remainder = q;

  const yearMatch = q.match(YEAR_RE);
  if (yearMatch) {
    hints.academicYear = yearMatch[0];
    remainder = remainder.replace(YEAR_RE, " ");
  }

  const semMatch = q.match(SEM_RE);
  if (semMatch) {
    hints.semester = parseInt(semMatch[1], 10);
    remainder = remainder.replace(SEM_RE, " ");
  }

  const stdMatch = q.match(STD_RE);
  if (stdMatch) {
    hints.standard = parseInt(stdMatch[1], 10);
    remainder = remainder.replace(STD_RE, " ");
  }

  // exact paper-code style tokens, e.g. BCS-304
  const codeMatch = q.match(/\b[a-z]{2,5}-?\d{2,4}\b/i);
  if (codeMatch) {
    hints.code = codeMatch[0].toUpperCase();
  }

  Object.keys(ALIASES).forEach((alias) => {
    if (remainder.includes(alias)) {
      Object.assign(hints, ALIASES[alias]);
      remainder = remainder.replace(alias, " ");
    }
  });

  if (remainder.includes("board")) {
    hints.examType = "Board";
    remainder = remainder.replace("board", " ");
  }

  UNIVERSITIES.forEach((u) => {
    const short = u.name.split(" ")[0].toLowerCase();
    if (remainder.includes(u.slug.split("-")[0]) || remainder.includes(short)) {
      hints.universitySlug = u.slug;
    }
  });

  BOARDS.forEach((b) => {
    if (remainder.includes(b.slug.split("-")[0])) {
      hints.boardSlug = b.slug;
    }
  });

  COURSES.forEach((c) => {
    if (remainder.includes(c.slug.replace("-", " ")) || remainder.includes(c.name.toLowerCase())) {
      hints.courseSlug = c.slug;
    }
  });

  remainder = remainder.replace(/\s+/g, " ").trim();

  // apply word-level synonyms after all structured extraction, so an
  // abbreviation like "maths" scores against "mathematics" correctly
  Object.entries(WORD_SYNONYMS).forEach(([from, to]) => {
    remainder = remainder.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  });

  return { keywords: remainder, hints };
}

function score(paper, keywords, hints) {
  let s = 0;

  if (hints.code && paper.paperCode && paper.paperCode.toUpperCase().startsWith(hints.code)) s += 100;
  if (hints.code && paper.subject.code && paper.subject.code.toUpperCase() === hints.code) s += 100;

  if (keywords) {
    const kw = keywords;
    if (norm(paper.subject.name).includes(kw)) s += 40;
    if (paper.course && norm(paper.course.name).includes(kw)) s += 20;
    if (paper.university && norm(paper.university.name).includes(kw)) s += 15;
    if (paper.board && norm(paper.board.name).includes(kw)) s += 15;
    if (paper.college && norm(paper.college.name).includes(kw)) s += 10;
    // token-level partial match as a softer fallback
    kw.split(" ").filter(Boolean).forEach((tok) => {
      if (norm(paper.subject.name).includes(tok)) s += 8;
    });
  }

  if (hints.semester && paper.semester === hints.semester) s += 25;
  if (hints.standard && paper.standard === hints.standard) s += 25;
  if (hints.level && paper.level === hints.level) s += 15;
  if (hints.academicYear && paper.academicYear === hints.academicYear) s += 20;
  if (hints.examType && paper.examType === hints.examType) s += 15;
  if (hints.universitySlug && paper.university?.slug === hints.universitySlug) s += 20;
  if (hints.boardSlug && paper.board?.slug === hints.boardSlug) s += 20;
  if (hints.courseSlug && paper.course?.slug === hints.courseSlug) s += 20;

  // Recency is a tiebreaker only, and must never be able to turn a
  // non-match into a match — it's added only once something has already
  // matched, otherwise every paper in the dataset would score > 0 and
  // "no results" could never be reached.
  if (s > 0) {
    s += parseInt(paper.academicYear, 10) / 10000;
  }

  return s;
}

export function searchPapers(query, extraFilters = {}) {
  const { keywords, hints } = interpretQuery(query);
  const mergedHints = { ...hints, ...extraFilters };

  let candidates = PAPERS;

  if (!keywords && Object.keys(mergedHints).length === 0) {
    candidates = [];
  }

  const scored = candidates
    .map((p) => ({ paper: p, s: score(p, keywords, mergedHints) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  return {
    results: scored.map((r) => r.paper),
    interpreted: { keywords, hints: mergedHints },
  };
}

export function autocompleteSuggestions(query, limit = 6) {
  const q = norm(query);
  if (!q) return [];
  const subjectMatches = SUBJECTS.filter((s) => norm(s.name).includes(q)).map((s) => ({
    type: "subject",
    label: s.name,
    value: s.name,
  }));
  const courseMatches = COURSES.filter((c) => norm(c.name).includes(q)).map((c) => ({
    type: "course",
    label: c.name,
    value: c.name,
  }));
  const uniMatches = UNIVERSITIES.filter((u) => norm(u.name).includes(q)).map((u) => ({
    type: "university",
    label: u.name,
    value: u.name,
  }));
  return [...subjectMatches, ...courseMatches, ...uniMatches].slice(0, limit);
}

export const POPULAR_SEARCHES = [
  "Java Sem 3",
  "BCom Sem 3 Financial Accounting",
  "HSC Physics 2025",
  "FYBSc Maths",
  "BCS-304",
];