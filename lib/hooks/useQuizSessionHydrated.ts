"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies/cookieClient";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";
import { syncCompletedQuizSessionsFromApi } from "@/lib/utils/syncCompletedQuizSessions";

/**
 * True after quiz session state has rehydrated from localStorage **and** (when logged in)
 * completed sessions with full `result` have been merged from the API.
 *
 * Deferring `hydrated` until post-login sync avoids starting duplicate `/sessions/start/`
 * when persisted entries have `completedAt` but stripped `result`.
 */
export function useQuizSessionHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await new Promise<void>((resolve) => {
        if (useQuizSessionStore.persist.hasHydrated()) resolve();
        else useQuizSessionStore.persist.onFinishHydration(() => resolve());
      });
      if (cancelled) return;
      if (getCookie("access")) {
        await syncCompletedQuizSessionsFromApi();
      }
      if (cancelled) return;
      setHydrated(true);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return hydrated;
}
