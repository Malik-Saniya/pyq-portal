const BOOKMARKS_KEY = "pyq:bookmarks";
const RECENT_KEY = "pyq:recent";
const RECENT_LIMIT = 12;

function read(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("pyq:storage-changed", { detail: { key } }));
  } catch {
    // localStorage unavailable (private mode, etc.) — fail silently,
    // bookmarking simply becomes a no-op rather than crashing the app.
  }
}

export function getBookmarks() {
  return read(BOOKMARKS_KEY);
}

export function isBookmarked(paperId) {
  return getBookmarks().includes(paperId);
}

export function toggleBookmark(paperId) {
  const current = getBookmarks();
  const next = current.includes(paperId)
    ? current.filter((id) => id !== paperId)
    : [paperId, ...current];
  write(BOOKMARKS_KEY, next);
  return next.includes(paperId);
}

export function getRecent() {
  return read(RECENT_KEY);
}

export function pushRecent(paperId) {
  const current = getRecent().filter((id) => id !== paperId);
  const next = [paperId, ...current].slice(0, RECENT_LIMIT);
  write(RECENT_KEY, next);
}

export function clearRecent() {
  write(RECENT_KEY, []);
}
