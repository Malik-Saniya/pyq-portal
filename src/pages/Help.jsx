import StaticPage from "../components/StaticPage";

const FAQS = [
  { q: "Do I need an account to download a paper?", a: "No. Search, preview, bookmark and download all work without signing in. Bookmarks are stored on your device." },
  { q: "Why can't I find a specific paper?", a: "Try searching with just the subject name, or drop the year/exam type filter — search results always suggest a broader option when nothing matches exactly." },
  { q: "What does “Scheme / Pattern” mean?", a: "It refers to the syllabus pattern a paper follows (e.g. NEP 2020, CBCS). It only appears where it's relevant to that course." },
  { q: "A paper's metadata looks wrong. What do I do?", a: "Open the paper and use “Report an issue” at the bottom of the page — it goes straight to review." },
  { q: "Will my bookmarks sync across devices?", a: "Not yet — bookmarks are currently device-local. Account sync is planned for a future update." },
];

export default function Help() {
  return (
    <StaticPage title="Help & FAQ">
      <div className="divide-y divide-paper-line">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
              <span className="flex items-center justify-between">
                {f.q}
                <span className="text-ink-faint transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </StaticPage>
  );
}
