import { useCallback, useEffect, useState } from "react";
import { getBookmarks, toggleBookmark } from "./storage";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(getBookmarks());

  useEffect(() => {
    const onChange = () => setBookmarks(getBookmarks());
    window.addEventListener("pyq:storage-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pyq:storage-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggle = useCallback((paperId) => {
    toggleBookmark(paperId);
  }, []);

  return { bookmarks, isBookmarked: (id) => bookmarks.includes(id), toggle };
}
