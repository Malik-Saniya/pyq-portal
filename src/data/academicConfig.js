// Academic level configuration.
//
// Decision (see Master Blueprint, Section C.4): level-specific structure lives
// in per-level config, not hardcoded into the Paper schema or the UI. Adding a
// future level (e.g. Diploma) means adding an entry here, not restructuring
// pages or components.

export const LEVELS = {
  degree: {
    key: "degree",
    label: "Degree / UG",
    shortLabel: "Degree",
    topSelector: ["university", "course", "semester"],
    filterFields: ["university", "course", "semester", "subject", "academicYear", "examType", "scheme", "paperType", "language"],
    cardSecondary: ["course", "semester"],
    description: "Undergraduate papers organized by university, course and semester.",
  },
  hsc: {
    key: "hsc",
    label: "Junior College / HSC",
    shortLabel: "HSC",
    topSelector: ["board", "stream", "standard"],
    filterFields: ["board", "stream", "standard", "subject", "academicYear", "examType", "language"],
    cardSecondary: ["stream", "standard"],
    description: "Board papers organized by board, stream and standard (11th / 12th).",
  },
  // School: Maharashtra State Board, SSC Class 10 (see data/sscData.js).
  // Browsed from /school, not /explore/:level, and not (yet) a Search filter
  // level — hence searchable: false (FilterPanel only lists searchable levels).
  school: {
    key: "school",
    label: "School",
    shortLabel: "School",
    searchable: false,
    topSelector: ["board", "exam", "class"],
    filterFields: ["academicYear"],
    cardSecondary: ["board", "class"],
    description: "Board papers for Maharashtra State Board SSC Class 10, organized by subject and academic year.",
  },
};

// Paper Scope — a system field (Section C.2). Students never answer
// "is this college-level or university-level"; scope determines which
// selectors are relevant and is resolved from the paper's own data.
export const SCOPES = {
  board: { key: "board", label: "Board-level", showCollege: false },
  university: { key: "university", label: "University-level", showCollege: false },
  college: { key: "college", label: "College-specific", showCollege: true },
  institution: { key: "institution", label: "Institution-specific", showCollege: true },
};

export const EXAM_TYPES = ["Regular", "Supplementary", "Board", "Practical"];
export const SCHEMES = ["NEP 2020", "CBCS", "Autonomous"];
export const PAPER_TYPES = ["Theory", "Practical", "Viva"];
export const LANGUAGES = ["English", "Marathi", "Hindi"];
export const STREAMS = ["Science", "Commerce", "Arts"];
export const STANDARDS = [11, 12];

export const ACADEMIC_YEARS = ["2025", "2024", "2023", "2022", "2021"];

export function levelLabel(levelKey) {
  return LEVELS[levelKey]?.label ?? levelKey;
}
// NEP 2020 subject baskets, in the order they are shown on a Course page.
// Labels follow the "Standard NEP Subject Basket Classifications" in the
// University of Mumbai syllabus dataset.
export const NEP_CATEGORIES = [
  { key: "MAJOR", label: "Major (DSC / DSE)" },
  { key: "PRACTICAL", label: "Practical" },
  { key: "MINOR", label: "Minor" },
  { key: "OE", label: "Open Elective" },
  { key: "VSC", label: "Vocational Skill Course" },
  { key: "SEC", label: "Skill Enhancement Course" },
  { key: "AEC", label: "Ability Enhancement Course" },
  { key: "VEC", label: "Value Education Course" },
  { key: "IKS", label: "Indian Knowledge System" },
  { key: "PROJECT", label: "Project / Field Work" },
];

export function nepCategoryLabel(key) {
  return NEP_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}