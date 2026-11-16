import { levelLabel } from "../data/academicConfig";
import { SSC_BASE_PATH, SSC_CLASS_10, sscSubjectPath } from "../data/sscData";

// Scope-aware secondary line for a Paper Card (Section I.1 of the blueprint):
// College/Institution is shown only when it disambiguates; inside a single
// context it would be redundant.
export function paperContextLine(paper) {
  if (paper.level === "school") {
    const exam = paper.school ? `${paper.school.exam} Class ${paper.school.classNumber}` : null;
    return [paper.board?.name, exam].filter(Boolean).join(" • ");
  }
  if (paper.level === "hsc") {
    return [paper.stream, `Std ${paper.standard}`, paper.board?.name].filter(Boolean).join(" • ");
  }
  const parts = [paper.course?.name, paper.semester ? `Semester ${paper.semester}` : null];
  if (paper.scope === "college" && paper.college) parts.push(paper.college.name);
  else if (paper.scope === "institution" && paper.institution) parts.push(paper.institution.name);
  else if (paper.university) parts.push(paper.university.name);
  return parts.filter(Boolean).join(" • ");
}

// Where "all papers of this subject" lives. School subjects have their own
// route; Degree / HSC subjects use /subject/:slug.
export function paperSubjectPath(paper) {
  return paper.level === "school" && paper.school
    ? sscSubjectPath(paper.school.subjectSlug)
    : `/subject/${paper.subject.slug}`;
}

export function paperBreadcrumbs(paper) {
  if (paper.level === "school") {
    return [
      { to: "/", label: "Home" },
      { to: "/school", label: "School" },
      { to: SSC_BASE_PATH, label: SSC_CLASS_10.label },
      { to: paperSubjectPath(paper), label: paper.subject.name },
      { label: `${paper.academicYear}` },
    ];
  }
  return [
    { to: "/", label: "Home" },
    { to: `/explore/${paper.level}`, label: levelLabel(paper.level) },
    { to: paperSubjectPath(paper), label: paper.subject.name },
    { label: `${paper.academicYear}` },
  ];
}

export function paperExamLine(paper) {
  return [paper.examType ? `${paper.examType} Examination` : null, paper.scheme].filter(Boolean).join(" • ");
}

export function paperTitleSlugParts(paper) {
  return [paper.subject.name, paper.course?.name ?? paper.stream, paper.academicYear].filter(Boolean);
}

// One-line orientation for a Subject Page, so a student arriving directly
// from a search engine (no prior site context) immediately understands
// what this page covers before scanning the paper list.
export function subjectBlurb(subject, papers) {
  if (papers.length === 0) {
    if (subject.level === "hsc") {
      const streamLabel = subject.streams?.length
        ? ` (${subject.streams.join(", ")})`
        : "";
      return `Board papers for this subject${streamLabel} will appear here as they're added. Class 11 and Class 12 share the same subject structure.`;
    }
    return "Papers for this subject will appear here as they're added.";
  }
  if (subject.level === "hsc") {
    const streams = [...new Set(papers.map((p) => p.stream))];
    const standards = [...new Set(papers.map((p) => p.standard))].sort();
    return `Board papers for ${streams.join(" & ")} — Std ${standards.join(" & ")}.`;
  }
  const courses = [...new Set(papers.map((p) => p.course?.name).filter(Boolean))];
  return courses.length > 0
    ? `Papers for ${courses.join(", ")}, across semesters and academic years.`
    : "Degree-level papers, across semesters and academic years.";
}