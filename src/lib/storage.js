const BOOKMARKS_KEY = "pyq:bookmarks";
const RECENT_KEY = "pyq:recent";
const RECENT_LIMIT = 12;
const DOWNLOADS_KEY = "pyq:downloads";
const DOWNLOADS_LIMIT = 50;

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

// Download history: a record of downloads *started* from PYQ — [{ id, at }],
// newest first, one entry per paper. The PDF itself is saved by the browser,
// never by the app, so this only remembers which papers were downloaded.
export function getDownloads() {
  const raw = read(DOWNLOADS_KEY);
  if (!Array.isArray(raw)) return [];
  return raw.filter((e) => e && typeof e.id === "string" && typeof e.at === "number");
}

export function recordDownload(paperId) {
  const others = getDownloads().filter((e) => e.id !== paperId);
  const next = [{ id: paperId, at: Date.now() }, ...others].slice(0, DOWNLOADS_LIMIT);
  write(DOWNLOADS_KEY, next);
}

export function removeDownload(paperId) {
  write(DOWNLOADS_KEY, getDownloads().filter((e) => e.id !== paperId));
}

export function clearDownloads() {
  write(DOWNLOADS_KEY, []);
}