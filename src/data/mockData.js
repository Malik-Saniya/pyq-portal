import { EXAM_TYPES } from "./academicConfig";
import { MU_UNIVERSITY, MU_COURSES, MU_SUBJECTS } from "./universities/mu";
import { SSC_PAPERS } from "./sscData";
// --- Reusable entities (Section 11 of the working brief: these are data,
// never hardcoded into navigation or components) ---------------------------

export const UNIVERSITIES = [
  MU_UNIVERSITY,
  { slug: "pune-university", name: "Savitribai Phule Pune University" },
  { slug: "mgu-nashik", name: "MG University, Nashik" },
];

export const BOARDS = [
  { slug: "maharashtra-board", name: "Maharashtra State Board" },
  { slug: "cbse", name: "CBSE" },
];

export const COURSES = [
  // University of Mumbai — real NEP 2020 syllabus (see universities/mu.js)
  ...MU_COURSES,
  // Other universities — still mock data
  { slug: "ba", name: "B.A.", university: "pune-university", semesters: 6 },
  { slug: "bsc-cs-pune", name: "B.Sc. Computer Science", university: "pune-university", semesters: 6 },
  { slug: "bsc", name: "B.Sc.", university: "mgu-nashik", semesters: 6 },
];

export const COLLEGES = [
  { slug: "hr-college", name: "H.R. College of Commerce & Economics", university: "mumbai-university" },
  { slug: "ferguson-college", name: "Fergusson College", university: "pune-university" },
];

export const INSTITUTIONS = [
  { slug: "vidya-polytechnic", name: "Vidya Institute of Technology" },
];

// Mock subjects for the non-Mumbai universities and for HSC. The University of
// Mumbai subjects are NOT here — they come from the syllabus (MU_SUBJECTS).
const MOCK_SUBJECTS = [
  // Degree — arts / science
  { slug: "political-science", name: "Political Science", code: "UBA210", courses: ["ba"], level: "degree" },
  { slug: "economics", name: "Economics", code: "UBA220", courses: ["ba"], level: "degree" },
  { slug: "data-structures", name: "Data Structures", code: "UCS303", courses: ["bsc-cs-pune"], level: "degree" },
  { slug: "java-programming", name: "Java Programming", code: "BCS-304", courses: ["bsc-cs-pune"], level: "degree" },
  { slug: "database-management", name: "Database Management Systems", code: "UCS405", courses: ["bsc-cs-pune"], level: "degree" },
  { slug: "physics", name: "Physics", code: "USC101", courses: ["bsc"], level: "degree" },
  { slug: "chemistry", name: "Chemistry", code: "USC102", courses: ["bsc"], level: "degree" },
  { slug: "mathematics", name: "Mathematics", code: "USC103", courses: ["bsc"], level: "degree" },
  // HSC — commerce
  { slug: "book-keeping-accountancy", name: "Book Keeping & Accountancy", code: null, streams: ["Commerce"], level: "hsc" },
  { slug: "organisation-of-commerce", name: "Organisation of Commerce", code: null, streams: ["Commerce"], level: "hsc" },
  { slug: "secretarial-practice", name: "Secretarial Practice", code: null, streams: ["Commerce"], level: "hsc" },
  // HSC — science
  { slug: "hsc-physics", name: "Physics", code: null, streams: ["Science"], level: "hsc" },
  { slug: "hsc-chemistry", name: "Chemistry", code: null, streams: ["Science"], level: "hsc" },
  { slug: "hsc-mathematics", name: "Mathematics", code: null, streams: ["Science"], level: "hsc" },
  { slug: "biology", name: "Biology", code: null, streams: ["Science"], level: "hsc" },
  // HSC — arts
  { slug: "history", name: "History", code: null, streams: ["Arts"], level: "hsc" },
  { slug: "geography", name: "Geography", code: null, streams: ["Arts"], level: "hsc" },
];

export const SUBJECTS = [...MOCK_SUBJECTS, ...MU_SUBJECTS];

function slugify(parts) {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function courseFor(slug) {
  return COURSES.find((c) => c.slug === slug);
}

// --- Paper generation --------------------------------------------------
// Deterministic (no Math.random) so the dataset — and therefore search
// results, filter counts, and empty states — is stable across reloads.

let papers = [];
let seedCounter = 0;
function nextSeed() {
  seedCounter += 1;
  return seedCounter;
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

// Degree papers (mock). Syllabus-backed subjects (subject.source) get NO
// generated papers: a subject existing in the syllabus must never imply that a
// paper exists. Real papers for them will be added as real PAPERS records.
const DEGREE_EXAM_TYPES = EXAM_TYPES.filter((t) => t !== "Board");
SUBJECTS.filter((s) => s.level === "degree" && !s.source).forEach((subject) => {
subject.courses.forEach((courseSlug) => {
    const course = courseFor(courseSlug);
    if (!course) return;
    const semesters = [1, 2, 3, 4].filter((s) => s <= course.semesters);
  semesters.slice(0, 2).forEach((semester) => {

    ["2024", "2023", "2022"].forEach((year, yi) => {
        const seed = nextSeed();
        const collegesHere = COLLEGES.filter((c) => c.university === course.university);
        const isCollegeScope = seed % 5 === 0 && collegesHere.length > 0;
        const scope = isCollegeScope ? "college" : "university";
        const college = isCollegeScope ? pick(collegesHere, seed) : null;
        const university = UNIVERSITIES.find((u) => u.slug === course.university);
        const scheme = seed % 3 === 0 ? "NEP 2020" : yi === 2 ? "CBCS" : "NEP 2020";
        const examType = yi === 0 ? "Regular" : DEGREE_EXAM_TYPES[(semester + yi) % DEGREE_EXAM_TYPES.length];

        papers.push({
          id: `deg-${slugify([subject.slug, course.slug, "s" + semester, year])}`,
          slug: slugify([subject.slug, course.slug, "sem", semester, year]),
          level: "degree",
          scope,
          title: subject.name,
          subject: { slug: subject.slug, name: subject.name, code: subject.code },
          course: { slug: course.slug, name: course.name },
          semester,
          university: { slug: university.slug, name: university.name },
          college: college ? { slug: college.slug, name: college.name } : null,
          institution: null,
          board: null,
          stream: null,
          standard: null,
          academicYear: year,
          examType,
          scheme,
          paperType: examType === "Practical" ? "Practical" : "Theory",
          paperCode: subject.code ?
          language: "English",
          fileType: "PDF",
          pageCount: 4 + (seed % 5),
        });
      });
    });
  });
});

// A few institution-specific diploma papers to exercise that scope
SUBJECTS.filter((s) => s.slug === "physics" || s.slug === "chemistry").forEach((subject) => {
  ["2024", "2023"].forEach((year) => {
    const seed = nextSeed();
    papers.push({
      id: `inst-${slugify([subject.slug, year])}`,
      slug: slugify([subject.slug, "diploma", year]),
      level: "degree",
      scope: "institution",
      title: subject.name,
      subject: { slug: subject.slug, name: subject.name, code: subject.code },
      course: { slug: "diploma-engg", name: "Diploma in Engineering" },
      semester: 2,
      university: null,
      college: null,
      institution: INSTITUTIONS[0],
      board: null,
      stream: null,
      standard: null,
      academicYear: year,
      examType: "Regular",
      scheme: null,
      paperType: "Theory",
      paperCode: null,
      language: "English",
      fileType: "PDF",
      pageCount: 3 + (seed % 3),
    });
  });
});

// HSC papers
SUBJECTS.filter((s) => s.level === "hsc").forEach((subject) => {
  subject.streams.forEach((stream) => {
    [11, 12].forEach((standard) => {
      ["2025", "2024", "2023"].forEach((year) => {
        const seed = nextSeed();
        const board = BOARDS[0];
        papers.push({
          id: `hsc-${slugify([subject.slug, stream, standard, year])}`,
          slug: slugify([subject.slug, stream, standard, year]),
          level: "hsc",
          scope: "board",
          title: subject.name,
          subject: { slug: subject.slug, name: subject.name, code: subject.code },
          course: null,
          semester: null,
          university: null,
          college: null,
          institution: null,
          board: { slug: board.slug, name: board.name },
          stream,
          standard,
          academicYear: year,
          examType: "Board",
          scheme: null,
          paperType: standard === 12 && (subject.slug.includes("physics") || subject.slug.includes("chemistry")) ? "Theory" : null,
          paperCode: null,
          language: "English",
          fileType: "PDF",
          pageCount: 6 + (seed % 4),
        });
      });
    });
  });
});

// Give every paper a default availability status, then flag a couple of
// examples so the Paper Detail / error architecture (removed, unavailable)
// has real records to render against.
papers = papers.map((p) => ({ ...p, status: "available" }));
if (papers[3]) papers[3] = { ...papers[3], status: "unavailable" };
if (papers[9]) papers[9] = { ...papers[9], status: "removed" };

// School (SSC Class 10) papers come from sscData.js and are appended after the
// generated ones, so the indexed status flags above are unaffected.
export const PAPERS = [...papers, ...SSC_PAPERS];

export function getPaperBySlug(slug) {
  return PAPERS.find((p) => p.slug === slug);
}

export function getPapersBySubject(subjectSlug) {
  return PAPERS.filter((p) => p.subject.slug === subjectSlug);
}

export function getSubjectBySlug(slug) {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function getRelatedPapers(paper, limit = 4) {
  const sameSubjectOtherYear = PAPERS.filter(
    (p) => p.id !== paper.id && p.subject.slug === paper.subject.slug
  );
  const sameContextOtherSubject = PAPERS.filter(
    (p) =>
      p.id !== paper.id &&
      p.subject.slug !== paper.subject.slug &&
      ((paper.course && p.course?.slug === paper.course?.slug && p.semester === paper.semester) ||
        (paper.stream && p.stream === paper.stream && p.standard === paper.standard))
  );
  const combined = [...sameSubjectOtherYear, ...sameContextOtherSubject];
  const seen = new Set();
  const unique = [];
  for (const p of combined) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      unique.push(p);
    }
    if (unique.length >= limit) break;
  }
  return unique;
}

export function subjectsForLevel(levelKey) {
  return SUBJECTS.filter((s) => s.level === levelKey);
}
export function subjectsForStream(stream) {
  return SUBJECTS.filter(
    (s) => s.level === "hsc" && Array.isArray(s.streams) && s.streams.includes(stream)
  );
}
// Subjects that actually have at least one paper. Used for discovery lists
// (Explore, Popular) so they never fill up with syllabus entries that have
// nothing to open.
export function browsableSubjects(levelKey) {
  const withPapers = new Set(PAPERS.map((p) => p.subject.slug));
  return subjectsForLevel(levelKey).filter((s) => withPapers.has(s.slug));
}

export function getCourseBySlug(slug) {
  return COURSES.find((c) => c.slug === slug);
}

// Subjects of one syllabus-backed course, optionally for a single semester.
export function getSubjectsForCourse(courseSlug, semester) {
  return SUBJECTS.filter(
    (s) => s.courseSlug === courseSlug && (semester === undefined || s.semester === semester)
  );
}

// --- Homepage sampling helpers -----------------------------------------
// Home.jsx previously used PAPERS.slice(0,6) / SUBJECTS.slice(0,8). Because
// generation above iterates subject-by-subject and year-by-year, a raw
// slice returned six near-identical "Financial Accounting" cards and eight
// Degree-only subjects. These helpers deliberately sample across subjects
// and academic levels so the homepage reads as a real multi-category
// platform rather than a single repeated subject.

// A hand-picked spread across course type (Commerce / Science / Arts) and
// level (Degree + HSC) — deliberate curation, not the dataset's insertion
// order, since insertion order is grouped by subject and skews to Commerce.
const FEATURED_SUBJECT_SLUGS = [
  "data-structures", // B.Sc. CS (mock, Pune)
  "economics", // B.A. (mock, Pune)
  "mathematics", // B.Sc. (mock, Nashik)
  "political-science", // B.A. (mock, Pune)
  "hsc-physics", // HSC Science
  "book-keeping-accountancy", // HSC Commerce
];

export function getFeaturedPapers(limit = 6) {
  const picks = FEATURED_SUBJECT_SLUGS.map((slug) => {
    const subjectPapers = PAPERS.filter((p) => p.subject.slug === slug);
    const available = subjectPapers.filter((p) => p.status === "available");
    const pool = available.length > 0 ? available : subjectPapers;
    return pool.slice().sort((a, b) => Number(b.academicYear) - Number(a.academicYear))[0];
  }).filter(Boolean);
  return picks.slice(0, limit);
}

export function getPopularSubjects(limit = 8) {
  const degree = browsableSubjects("degree");
  const hsc = browsableSubjects("hsc");
  const interleaved = [];
  const max = Math.max(degree.length, hsc.length);
  for (let i = 0; i < max; i++) {
    if (degree[i]) interleaved.push(degree[i]);
    if (hsc[i]) interleaved.push(hsc[i]);
  }
  return interleaved.slice(0, limit);
}