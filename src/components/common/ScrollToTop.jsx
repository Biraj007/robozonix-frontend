import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Only scroll to top on PUSH or REPLACE actions.
    // POP actions (like browser back/forward or refresh) should maintain scroll position.
    if (navigationType !== "POP") {
      window.scrollTo(0, 0);

      // Lenis scroll reset (if active)
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
