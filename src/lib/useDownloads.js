import { useCallback, useEffect, useRef, useState } from "react";
import { getDownloads, recordDownload } from "./storage";

// Live view of the download history (newest first), kept in sync across
// components and tabs the same way useBookmarks is.
export function useDownloads() {
  const [downloads, setDownloads] = useState(getDownloads);

  useEffect(() => {
    const onChange = () => setDownloads(getDownloads());
    window.addEventListener("pyq:storage-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pyq:storage-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return downloads;
}

// The one place a paper download is started. Used by Paper Detail and by the
// Library Downloads tab so both behave identically.
// A download is recorded in history only when it is genuinely initiated:
// the paper must be available and no download for this button may already
// be in flight.
export function usePaperDownload(paper) {
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = useCallback(() => {
    if (!paper || paper.status !== "available" || state === "loading") return;
    recordDownload(paper.id);
    setState("loading");
    timer.current = setTimeout(() => {
      // Prototype data layer: there is no real file yet, so this always
      // resolves. When papers get a real file URL, trigger the browser
      // download here (e.g. an <a download> click) and set "error" on failure.
      setState("success");
    }, 700);
  }, [paper, state]);

  const reset = useCallback(() => setState("idle"), []);

  return { state, start, reset };
}