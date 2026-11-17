import { PAPERS, COURSES, UNIVERSITIES, BOARDS, SUBJECTS } from "../data/mockData";

// Common shorthand -> canonical entity aliasing (Section G.3 of the
// blueprint: "a maintained alias table"). Kept intentionally small and
// explicit for the MVP; expand as real queries reveal new abbreviations.
//
// FY / SY / TY are *years*, and a year is two semesters (FY = Sem 1-2,
// SY = Sem 3-4, TY = Sem 5-6), so they carry `semesters`, not one `semester`.
const YEAR_SEMESTERS = { fy: [1, 2], sy: [3, 4], ty: [5, 6] };
const YEAR_COURSES = { bsc: "bsc", bcom: "bcom", baf: "baf", bms: "bms", bbi: "bbi", it: "bsc-it", cs: "bsc-cs" };

const ALIASES = {
  ...Object.fromEntries(
    Object.entries(YEAR_SEMESTERS).flatMap(([year, semesters]) =>
      Object.entries(YEAR_COURSES).map(([short, courseSlug]) => [`${year}${short}`, { courseSlug, semesters }])
    )
  ),
  hsc: { level: "hsc" },
  "12th": { standard: 12 },
  "11th": { standard: 11 },
  // SSC (Class 10) is the School level, not Junior College / HSC.
  ssc: { level: "school" },
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

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Whole-word containment, so short names like "ba" don't match inside
// "database" and "bbi" doesn't match inside a longer word.
function hasWord(text, needle) {
  return new RegExp(`(^|[^a-z0-9])${escapeRe(needle)}($|[^a-z0-9])`).test(text);
}

// Removes the first whole-word occurrence, so a word that was turned into a
// structured hint is not also demanded as a keyword.
function removeWord(text, word) {
  return text.replace(new RegExp(`(^|[^a-z0-9])${escapeRe(word)}(?=$|[^a-z0-9])`), "$1 ");
}

// Words that carry no subject meaning. Shared by paper search and the
// syllabus fallback.
const STOPWORDS = new Set([
  "pyq", "pyqs", "paper", "papers", "question", "questions", "qp", "previous", "year", "years",
  "exam", "exams", "the", "of", "for", "and", "in", "pdf", "download", "old",
  "university", "college", "state",
]);

// Generic words in a university / board name that must not, on their own,
// select that university ("university paper" is not "University of Mumbai").
const GENERIC_NAME_WORDS = new Set(["university", "of", "the", "college", "institute", "state"]);

function nameTokens(entity) {
  return [...entity.slug.split("-"), ...entity.name.toLowerCase().split(/[^a-z0-9]+/)].filter(
    (t) => t.length >= 2 && !GENERIC_NAME_WORDS.has(t)
  );
}

function keywordTokens(keywords) {
  return keywords
    .split(" ")
    .map((t) => t.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, ""))
    .filter((t) => t && !STOPWORDS.has(t));
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

  // exact paper-code style tokens, e.g. BCS-304. Looked for only after the
  // semester / year / standard text is gone, so "sem3" is not read as a code.
  const codeMatch = remainder.match(/\b[a-z]{2,5}-?\d{2,4}\b/i);
  if (codeMatch) {
    hints.code = codeMatch[0].toUpperCase();
    remainder = remainder.replace(codeMatch[0], " ");
  }

  Object.keys(ALIASES).forEach((alias) => {
    if (hasWord(remainder, alias)) {
      Object.assign(hints, ALIASES[alias]);
      remainder = removeWord(remainder, alias);
    }
  });

  if (hasWord(remainder, "board")) {
    hints.examType = "Board";
    remainder = removeWord(remainder, "board");
  }

  UNIVERSITIES.forEach((u) => {
    const hit = nameTokens(u).filter((t) => hasWord(remainder, t));
    if (hit.length > 0) {
      hints.universitySlug = u.slug;
      hit.forEach((t) => {
        remainder = removeWord(remainder, t);
      });
    }
  });

  BOARDS.forEach((b) => {
    const first = b.slug.split("-")[0];
    if (hasWord(remainder, first)) {
      hints.boardSlug = b.slug;
      remainder = removeWord(remainder, first);
    }
  });

  // Several courses can match (e.g. "bsc it" also contains "bsc"); the longest
  // matching name wins so "B.Sc. IT" is never read as plain "B.Sc.". The words
  // that matched are removed so they are not also demanded as keywords.
  let bestCourse = null;
  COURSES.forEach((c) => {
    const needles = [c.slug.replace(/-/g, " "), c.name.toLowerCase()];
    const hit = needles.filter((n) => hasWord(remainder, n)).sort((a, b) => b.length - a.length)[0];
    if (hit && (!bestCourse || hit.length > bestCourse.text.length)) bestCourse = { slug: c.slug, text: hit };
  });
  if (bestCourse) {
    hints.courseSlug = bestCourse.slug;
    remainder = remainder.replace(bestCourse.text, " ");
  }

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
  if (hints.semesters?.includes(paper.semester)) s += 25;
  if (hints.standard && paper.standard === hints.standard) s += 25;
  if (hints.level && paper.level === hints.level) s += 15;
  if (hints.academicYear && paper.academicYear === hints.academicYear) s += 20;
  if (hints.examType && paper.examType === hints.examType) s += 15;
  if (hints.universitySlug && paper.university?.slug === hints.universitySlug) s += 20;
  if (hints.boardSlug && paper.board?.slug === hints.boardSlug) s += 20;
  if (hints.courseSlug && paper.course?.slug === hints.courseSlug) s += 20;

  return s;
}

// Every structured hint found in the query must match the paper (AND). The
// scoring above only orders papers; it must never let a paper in. Without this
// gate, "java sem 2" returned every Semester 2 paper of every subject.
function matchesHints(paper, hints) {
  return (
    (!hints.academicYear || paper.academicYear === hints.academicYear) &&
    (!hints.semester || paper.semester === hints.semester) &&
    (!hints.semesters || hints.semesters.includes(paper.semester)) &&
    (!hints.standard || paper.standard === hints.standard) &&
    (!hints.level || paper.level === hints.level) &&
    (!hints.examType || paper.examType === hints.examType) &&
    (!hints.universitySlug || paper.university?.slug === hints.universitySlug) &&
    (!hints.boardSlug || paper.board?.slug === hints.boardSlug) &&
    (!hints.courseSlug || paper.course?.slug === hints.courseSlug)
  );
}

function searchText(paper) {
  return norm(
    [
      paper.subject.name,
      paper.subject.code,
      paper.paperCode,
      paper.course?.name,
      paper.university?.name,
      paper.board?.name,
      paper.college?.name,
      paper.institution?.name,
      paper.stream,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

// The words left after structured hints were taken out must all appear in the
// paper's own details; a paper-code hint must match the paper's code.
function matchesKeywords(paper, tokens, code) {
  if (code) {
    const codeOk =
      (paper.paperCode && paper.paperCode.toUpperCase().startsWith(code)) ||
      (paper.subject.code && paper.subject.code.toUpperCase() === code);
    if (!codeOk) return false;
  }
  if (tokens.length === 0) return true;
  const text = searchText(paper);
  return tokens.every((t) => (t.length < 3 ? hasWord(text, t) : text.includes(t)));
}

export function searchPapers(query, extraFilters = {}) {
  const { keywords, hints } = interpretQuery(query);
  const mergedHints = { ...hints, ...extraFilters };
  const tokens = keywordTokens(keywords);

  const nothingToSearchFor = tokens.length === 0 && Object.keys(mergedHints).length === 0;

  const scored = nothingToSearchFor
    ? []
    : PAPERS.filter((p) => matchesHints(p, mergedHints) && matchesKeywords(p, tokens, mergedHints.code))
        .map((p) => ({
          paper: p,
          // Recency is a tiebreaker only.
          s: score(p, keywords, mergedHints) + parseInt(p.academicYear, 10) / 10000,
        }))
        .sort((a, b) => b.s - a.s);

  return {
    results: scored.map((r) => r.paper),
    interpreted: { keywords, hints: mergedHints },
  };
}

// Syllabus subjects (ones that carry a courseSlug) matching a query, for the
// "no papers found" state. Subjects have no papers of their own here — this
// only helps the student find where a subject sits in the syllabus.
const COURSE_BY_SLUG = new Map(COURSES.map((c) => [c.slug, c]));

export function searchSyllabusSubjects(query, filters = {}, limit = 12) {
  const none = { items: [], total: 0 };
  const { keywords, hints } = interpretQuery(query);

  // HSC / board filters, or paper-only filters (year, exam type, language),
  // describe papers, not syllabus subjects — don't pretend they apply.
  if (filters.level === "hsc" || filters.level === "school" || filters.boardSlug || filters.stream || filters.standard) return none;
  if (filters.academicYear || filters.examType || filters.language) return none;
  if (hints.level === "hsc" || hints.level === "school" || hints.boardSlug || hints.standard) return none;

  const f = { ...hints, ...filters };
  const tokens = keywordTokens(keywords);
  if (tokens.length === 0 && !f.courseSlug) return none;

  const phrase = tokens.join(" ");
  const matches = [];
  SUBJECTS.forEach((s) => {
    if (!s.courseSlug) return;
    if (f.universitySlug && s.universitySlug !== f.universitySlug) return;
    if (f.courseSlug && s.courseSlug !== f.courseSlug) return;
    if (f.semester !== undefined && s.semester !== Number(f.semester)) return;
    if (f.semesters && !f.semesters.includes(s.semester)) return;
    if (f.scheme && s.scheme !== f.scheme) return;

    const course = COURSE_BY_SLUG.get(s.courseSlug);
    const hay = norm(
      [s.name, course?.name, course?.shortName, s.courseSlug.replace(/-/g, " "), s.discipline, s.specialization].join(" ")
    );
    const ok = tokens.every((t) => (t.length < 3 ? hasWord(hay, t) : hay.includes(t)));
    if (ok) matches.push({ subject: s, rank: phrase && norm(s.name).includes(phrase) ? 0 : 1 });
  });

  matches.sort((a, b) => a.rank - b.rank);
  return { items: matches.slice(0, limit).map((m) => m.subject), total: matches.length };
}

export function autocompleteSuggestions(query, limit = 6) {
  const q = norm(query);
  if (!q) return [];
  // Several courses share subject names (e.g. "Data Structures"); suggest each name once.
  const seenSubjectNames = new Set();
  const subjectMatches = SUBJECTS.filter((s) => {
    if (!norm(s.name).includes(q) || seenSubjectNames.has(norm(s.name))) return false;
    seenSubjectNames.add(norm(s.name));
    return true;
  }).map((s) => ({
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
  "Java Sem 2",
  "BCom Sem 3 Accountancy",
  "BSc IT Python",
  "HSC Physics 2025",
  "FYBSc Maths",
  "BCS-304",
];