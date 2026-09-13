import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBookmarks } from "../lib/useBookmarks";

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
function IconBookmark(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_LINKS = [
  { to: "/explore/degree", label: "Degree / UG" },
  { to: "/explore/hsc", label: "Junior College" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();

  function submitSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileSearchOpen(false);
      setMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <button
          className="rounded-md p-1.5 text-ink md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>

        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-bold text-paper">PQ</span>
          <span className="hidden sm:inline">PYQ Portal</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-ink-soft hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-md flex-1 items-center md:flex">
          <div className="flex w-full items-center gap-2 rounded-full border border-paper-line bg-white px-3.5 py-2 focus-within:border-stamp">
            <IconSearch className="text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search papers, subjects, universities…"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              aria-label="Search papers"
            />
          </div>
        </form>

        <button
          className="rounded-md p-1.5 text-ink md:hidden"
          aria-label="Open search"
          onClick={() => setMobileSearchOpen((v) => !v)}
        >
          <IconSearch />
        </button>

        <Link
          to="/library"
          className="relative ml-1 hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-ink-soft hover:text-ink md:flex"
        >
          <IconBookmark />
          Library
          {bookmarks.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-stamp px-1 text-[10px] font-semibold text-white">
              {bookmarks.length}
            </span>
          )}
        </Link>
        <Link to="/library" className="relative rounded-md p-1.5 text-ink md:hidden" aria-label="Library">
          <IconBookmark />
          {bookmarks.length > 0 && (
            <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-stamp" />
          )}
        </Link>
      </div>

      {mobileSearchOpen && (
        <form onSubmit={submitSearch} className="border-t border-paper-line px-4 py-3 md:hidden">
          <div className="flex items-center gap-2 rounded-full border border-paper-line bg-white px-3.5 py-2 focus-within:border-stamp">
            <IconSearch className="text-ink-faint" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search papers, subjects, universities…"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              aria-label="Search papers"
            />
          </div>
        </form>
      )}

      {menuOpen && (
        <nav className="border-t border-paper-line px-4 py-3 md:hidden" aria-label="Primary mobile">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-dim hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/help" onClick={() => setMenuOpen(false)} className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-dim hover:text-ink">
                Help / FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-dim hover:text-ink">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
