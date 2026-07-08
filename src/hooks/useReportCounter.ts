import { useState, useCallback } from "react";

const STORAGE_KEY = "dgp_report_view_count";

/**
 * Tracks how many AI reports the user has viewed in the current session/browser.
 * Returns true when the count hits the threshold (default 3).
 */
export const useReportCounter = (threshold = 3) => {
  const [shouldShowFeedback, setShouldShowFeedback] = useState(false);

  const incrementAndCheck = useCallback(() => {
    const current = parseInt(sessionStorage.getItem(STORAGE_KEY) || "0", 10);
    const next = current + 1;
    sessionStorage.setItem(STORAGE_KEY, String(next));
    if (next >= threshold) {
      setShouldShowFeedback(true);
    }
  }, [threshold]);

  const dismiss = useCallback(() => setShouldShowFeedback(false), []);

  return { shouldShowFeedback, incrementAndCheck, dismiss };
};
