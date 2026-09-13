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
