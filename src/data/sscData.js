// School section — Maharashtra State Board, SSC Class 10.
// Edit this file to add subjects, classes or real papers.

export const SCHOOL_BOARD = { slug: "maharashtra-board", name: "Maharashtra State Board" };

export const SSC_CLASS_10 = { exam: "SSC", classNumber: 10, label: "SSC Class 10" };

export const SSC_BASE_PATH = `/school/${SCHOOL_BOARD.slug}/ssc/class-10`;

export const SCHOOL_PROGRAMMES = [
  { key: "maharashtra-ssc-10", boardName: SCHOOL_BOARD.name, label: "SSC · Class 10", to: SSC_BASE_PATH },
];

export const SSC_CLASS_10_SUBJECTS = [
  { id: "english",  slug: "english",  name: "English",  popularName: "English",  group: "Language" },
  { id: "marathi",  slug: "marathi",  name: "Marathi",  popularName: "Marathi",  group: "Language" },
  { id: "hindi",    slug: "hindi",    name: "Hindi",    popularName: "Hindi",    group: "Language" },
  { id: "urdu",     slug: "urdu",     name: "Urdu",     popularName: "Urdu",     group: "Language" },
  { id: "maths-1-algebra",  slug: "maths-1-algebra",  name: "Mathematics Part I (Algebra)",   popularName: "Algebra / Maths 1",   group: "Mathematics", parentSubject: "Mathematics" },
  { id: "maths-2-geometry", slug: "maths-2-geometry", name: "Mathematics Part II (Geometry)", popularName: "Geometry / Maths 2",  group: "Mathematics", parentSubject: "Mathematics" },
  { id: "science-1", slug: "science-1", name: "Science and Technology Part I",  popularName: "Science 1 (Physics & Chemistry)", group: "Science", parentSubject: "Science and Technology" },
  { id: "science-2", slug: "science-2", name: "Science and Technology Part II", popularName: "Science 2 (Biology)",             group: "Science", parentSubject: "Science and Technology" },
  { id: "history-political-science", slug: "history-political-science", name: "History and Political Science", popularName: "History & Civics / Social Science 1", group: "Social Science", parentSubject: "Social Sciences" },
  { id: "geography", slug: "geography", name: "Geography", popularName: "Geography / Social Science 2", group: "Social Science", parentSubject: "Social Sciences" },
  { id: "information-technology", slug: "information-technology", name: "Information Technology (IT)", popularName: "IT", group: "Optional", isOptional: true },
];

export function getSscSubjectBySlug(slug) {
  return SSC_CLASS_10_SUBJECTS.find((s) => s.slug === slug);
}

export function sscSubjectPath(subjectSlug) {
  return `${SSC_BASE_PATH}/${subjectSlug}`;
}

export function sscSubjectGroups() {
  const groups = [];
  SSC_CLASS_10_SUBJECTS.forEach((s) => {
    let g = groups.find((x) => x.group === s.group);
    if (!g) {
      g = { group: s.group, items: [] };
      groups.push(g);
    }
    g.items.push(s);
  });
  return groups;
}

// MOCK DATA — NOT REAL QUESTION PAPERS. Only English and Algebra have papers;
// every other subject is deliberately empty. To remove the mock data, delete
// the SSC_MOCK_PAPERS block and make SSC_PAPERS = [].
function buildSscPaper(subject, year, index) {
  return {
    id: `ssc10-${subject.slug}-${year}`,
    slug: `ssc-class-10-${subject.slug}-${year}`,
    level: "school",
    scope: "board",
    title: subject.name,
    subject: { slug: `ssc10-${subject.slug}`, name: subject.name, code: null },
    course: null,
    semester: null,
    university: null,
    college: null,
    institution: null,
    board: { ...SCHOOL_BOARD },
    stream: null,
    standard: SSC_CLASS_10.classNumber,
    academicYear: year,
    examType: "Board",
    scheme: null,
    paperType: null,
    paperCode: null,
    language: "English",
    fileType: "PDF",
    pageCount: 4 + (index % 4),
    status: "available",
    school: {
      boardSlug: SCHOOL_BOARD.slug,
      exam: SSC_CLASS_10.exam,
      classNumber: SSC_CLASS_10.classNumber,
      subjectSlug: subject.slug,
    },
    isMock: true,
  };
}

const MOCK_PAPER_YEARS = {
  english: ["2025", "2024", "2023"],
  "maths-1-algebra": ["2024", "2023"],
};

const SSC_MOCK_PAPERS = Object.entries(MOCK_PAPER_YEARS).flatMap(([subjectSlug, years]) => {
  const subject = getSscSubjectBySlug(subjectSlug);
  return subject ? years.map((year, i) => buildSscPaper(subject, year, i)) : [];
});

export const SSC_PAPERS = [...SSC_MOCK_PAPERS];

export function getSscPapersBySubject(subjectSlug) {
  return SSC_PAPERS.filter((p) => p.school.subjectSlug === subjectSlug);
}