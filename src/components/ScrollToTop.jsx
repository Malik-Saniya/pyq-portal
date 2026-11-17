import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// New navigations start at the top of the page; browser back/forward
// (POP) is left alone so the browser can restore scroll position itself.
// A link with a #hash (e.g. a paper card's "Download" -> /paper/x#download)
// scrolls to that element instead of the top.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    if (navType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
    }
  }, [pathname, hash, navType]);

  return null;
}