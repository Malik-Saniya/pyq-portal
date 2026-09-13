import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { to: "/explore/degree", label: "Degree / UG" },
      { to: "/explore/hsc", label: "Junior College" },
      { to: "/search", label: "Search papers" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/help", label: "Help / FAQ" },
      { to: "/contact", label: "Contact" },
      { to: "/feedback", label: "Feedback" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/about", label: "About" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Use" },
      { to: "/content-policy", label: "Content Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-paper-line bg-paper-dim/60">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-bold text-paper">PQ</span>
              PYQ Portal
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-faint">
              Organized previous-year question papers for Degree, UG and Junior College students — searchable, verified, free to download.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-faint">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-ink-soft hover:text-stamp">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-paper-line pt-6 text-xs text-ink-faint">
          © {new Date().getFullYear()} PYQ Portal. Papers are provided for study reference; report any issue from a paper's page.
        </div>
      </div>
    </footer>
  );
}
