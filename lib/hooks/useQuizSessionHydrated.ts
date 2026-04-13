"use client";

import { useEffect, useState } from "react";
import { useQuizSessionStore } from "@/lib/store/useQuizStore";

/** True after persisted quiz session state has rehydrated from localStorage (client-only). */
export function useQuizSessionHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useQuizSessionStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useQuizSessionStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
