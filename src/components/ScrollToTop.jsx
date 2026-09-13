import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// New navigations start at the top of the page; browser back/forward
// (POP) is left alone so the browser can restore scroll position itself.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
    }
  }, [pathname, navType]);

  return null;
}
