import { EXAM_TYPES, SCHEMES, LANGUAGES } from "./academicConfig";

// --- Reusable entities (Section 11 of the working brief: these are data,
// never hardcoded into navigation or components) ---------------------------

export const UNIVERSITIES = [
  { slug: "mumbai-university", name: "University of Mumbai" },
  { slug: "pune-university", name: "Savitribai Phule Pune University" },
  { slug: "mgu-nashik", name: "MG University, Nashik" },
];

export const BOARDS = [
  { slug: "maharashtra-board", name: "Maharashtra State Board" },
  { slug: "cbse", name: "CBSE" },
];

export const COURSES = [
  { slug: "bcom", name: "B.Com", university: "mumbai-university", semesters: 6 },
  { slug: "bms", name: "BMS", university: "mumbai-university", semesters: 6 },
  { slug: "baf", name: "BAF", university: "mumbai-university", semesters: 6 },
  { slug: "ba", name: "B.A.", university: "pune-university", semesters: 6 },
  { slug: "bsc-cs", name: "B.Sc. Computer Science", university: "pune-university", semesters: 6 },
  { slug: "bsc", name: "B.Sc.", university: "mgu-nashik", semesters: 6 },
];

export const COLLEGES = [
  { slug: "hr-college", name: "H.R. College of Commerce & Economics", university: "mumbai-university" },
  { slug: "ferguson-college", name: "Fergusson College", university: "pune-university" },
];

export const INSTITUTIONS = [
  { slug: "vidya-polytechnic", name: "Vidya Institute of Technology" },
];

export const SUBJECTS = [
  // Degree — commerce
  { slug: "financial-accounting", name: "Financial Accounting", code: "UBCM301", courses: ["bcom", "baf"], level: "degree" },
  { slug: "business-economics", name: "Business Economics", code: "UBCM302", courses: ["bcom", "bms"], level: "degree" },
  { slug: "cost-accounting", name: "Cost Accounting", code: "UBCM401", courses: ["bcom", "baf"], level: "degree" },
  { slug: "business-law", name: "Business Law", code: "UBMS205", courses: ["bms"], level: "degree" },
  { slug: "marketing-management", name: "Marketing Management", code: "UBMS310", courses: ["bms"], level: "degree" },
  { slug: "auditing", name: "Auditing", code: "UBAF501", courses: ["baf"], level: "degree" },
  // Degree — arts / science
  { slug: "political-science", name: "Political Science", code: "UBA210", courses: ["ba"], level: "degree" },
  { slug: "economics", name: "Economics", code: "UBA220", courses: ["ba"], level: "degree" },
  { slug: "data-structures", name: "Data Structures", code: "UCS303", courses: ["bsc-cs"], level: "degree" },
  { slug: "java-programming", name: "Java Programming", code: "BCS-304", courses: ["bsc-cs"], level: "degree" },
  { slug: "database-management", name: "Database Management Systems", code: "UCS405", courses: ["bsc-cs"], level: "degree" },
  { slug: "physics", name: "Physics", code: "USC101", courses: ["bsc"], level: "degree" },
  { slug: "chemistry", name: "Chemistry", code: "USC102", courses: ["bsc"], level: "degree" },
  { slug: "mathematics", name: "Mathematics", code: "USC103", courses: ["bsc"], level: "degree" },

  // -------------------------------------------------------------------------
  // Junior College / HSC (MSBSHSE) — Class 11 & 12
  // Source of truth: verified Maharashtra Board subject structure (Arts /
  // Science / Commerce). Subjects apply to both standards unless noted.
  // Qualifying institutional subjects (Environment & Water Security,
  // Physical Education) are graded A–D and are omitted from this list.
  // -------------------------------------------------------------------------

  // Languages (available across streams; English compulsory)
  { slug: "hsc-english", name: "English", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-marathi", name: "Marathi", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-hindi", name: "Hindi", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-urdu", name: "Urdu", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-gujarati", name: "Gujarati", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-kannada", name: "Kannada", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-sindhi", name: "Sindhi", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-sanskrit", name: "Sanskrit", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-persian", name: "Persian", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-pali", name: "Pali", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-ardhamagadhi", name: "Ardhamagadhi", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-french", name: "French", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-german", name: "German", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-russian", name: "Russian", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-japanese", name: "Japanese", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },

  // Science stream — core
  { slug: "hsc-physics", name: "Physics", code: null, streams: ["Science"], level: "hsc" },
  { slug: "hsc-chemistry", name: "Chemistry", code: null, streams: ["Science"], level: "hsc" },
  { slug: "hsc-mathematics-statistics", name: "Mathematics & Statistics", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-biology", name: "Biology", code: null, streams: ["Science"], level: "hsc" },

  // Science stream — optional / fourth elective
  { slug: "hsc-information-technology", name: "Information Technology", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },
  { slug: "hsc-computer-science", name: "Computer Science", code: null, streams: ["Science"], level: "hsc" },
  { slug: "hsc-electronics", name: "Electronics", code: null, streams: ["Science"], level: "hsc" },
  { slug: "hsc-geography", name: "Geography", code: null, streams: ["Science", "Arts"], level: "hsc" },
  { slug: "hsc-economics", name: "Economics", code: null, streams: ["Science", "Commerce", "Arts"], level: "hsc" },

  // Commerce stream — core
  { slug: "hsc-book-keeping-accountancy", name: "Book Keeping & Accountancy", code: null, streams: ["Commerce"], level: "hsc" },
  { slug: "hsc-organisation-of-commerce", name: "Organisation of Commerce and Management", code: null, streams: ["Commerce"], level: "hsc" },
  { slug: "hsc-secretarial-practice", name: "Secretarial Practice", code: null, streams: ["Commerce"], level: "hsc" },
  { slug: "hsc-co-operation", name: "Co-operation", code: null, streams: ["Commerce"], level: "hsc" },
  { slug: "hsc-banking", name: "Banking", code: null, streams: ["Commerce"], level: "hsc" },
  { slug: "hsc-marketing", name: "Marketing", code: null, streams: ["Commerce"], level: "hsc" },

  // Arts / Humanities stream — core social sciences
  { slug: "hsc-history", name: "History", code: null, streams: ["Arts"], level: "hsc" },
  { slug: "hsc-political-science", name: "Political Science", code: null, streams: ["Arts"], level: "hsc" },
  { slug: "hsc-sociology", name: "Sociology", code: null, streams: ["Arts"], level: "hsc" },
  { slug: "hsc-psychology", name: "Psychology", code: null, streams: ["Arts"], level: "hsc" },
  { slug: "hsc-logic", name: "Logic", code: null, streams: ["Arts"], level: "hsc" },
  { slug: "hsc-philosophy", name: "Philosophy", code: null, streams: ["Arts"], level: "hsc" },
];

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

// Degree papers
SUBJECTS.filter((s) => s.level === "degree").forEach((subject) => {
  subject.courses.forEach((courseSlug) => {
    const course = courseFor(courseSlug);
    if (!course) return;
    const semesters = [1, 2, 3, 4].filter((s) => s <= course.semesters);
    semesters.slice(0, 2).forEach((semester, i) => {
      ["2024", "2023", "2022"].forEach((year, yi) => {
        const seed = nextSeed();
        const isCollegeScope = seed % 5 === 0; // occasional college-specific paper
        const scope = isCollegeScope ? "college" : "university";
        const college = isCollegeScope ? pick(COLLEGES.filter(c => c.university === course.university), seed) : null;
        const university = UNIVERSITIES.find((u) => u.slug === course.university);
        const scheme = seed % 3 === 0 ? "NEP 2020" : yi === 2 ? "CBCS" : "NEP 2020";
        const examType = yi === 0 ? "Regular" : pick(EXAM_TYPES, seed);
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
          paperType: "Theory",
          paperCode: subject.code ? `${subject.code}-${year.slice(2)}` : null,
          language: pick(LANGUAGES, seed) === "Marathi" && subject.level === "degree" ? "English" : "English",
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

// HSC papers — only for core subjects that commonly have board PYQs.
// Language and less-common elective subjects remain in SUBJECTS (for
// navigation and empty states) but do not receive fabricated papers.
const HSC_PAPER_SUBJECT_SLUGS = new Set([
  "hsc-english",
  "hsc-marathi",
  "hsc-hindi",
  "hsc-physics",
  "hsc-chemistry",
  "hsc-mathematics-statistics",
  "hsc-biology",
  "hsc-information-technology",
  "hsc-computer-science",
  "hsc-book-keeping-accountancy",
  "hsc-organisation-of-commerce",
  "hsc-secretarial-practice",
  "hsc-economics",
  "hsc-geography",
  "hsc-history",
  "hsc-political-science",
  "hsc-sociology",
  "hsc-psychology",
]);

SUBJECTS.filter((s) => s.level === "hsc" && HSC_PAPER_SUBJECT_SLUGS.has(s.slug)).forEach((subject) => {
  subject.streams.forEach((stream) => {
    [11, 12].forEach((standard) => {
      ["2025", "2024", "2023"].forEach((year) => {
        const seed = nextSeed();
        const board = BOARDS[0];
        const isSciencePractical =
          subject.slug === "hsc-physics" ||
          subject.slug === "hsc-chemistry" ||
          subject.slug === "hsc-biology";
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
          paperType: isSciencePractical ? "Theory" : null,
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

export const PAPERS = papers;

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

/** HSC subjects offered in a given stream (Science / Commerce / Arts). */
export function subjectsForStream(stream) {
  return SUBJECTS.filter(
    (s) => s.level === "hsc" && Array.isArray(s.streams) && s.streams.includes(stream)
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
  "financial-accounting", // B.Com
  "business-economics", // B.Com / BMS
  "mathematics", // B.Sc
  "political-science", // B.A.
  "hsc-physics", // HSC Science
  "hsc-book-keeping-accountancy", // HSC Commerce
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
  const degree = subjectsForLevel("degree");
  const hsc = subjectsForLevel("hsc");
  const interleaved = [];
  const max = Math.max(degree.length, hsc.length);
  for (let i = 0; i < max; i++) {
    if (degree[i]) interleaved.push(degree[i]);
    if (hsc[i]) interleaved.push(hsc[i]);
  }
  return interleaved.slice(0, limit);
}