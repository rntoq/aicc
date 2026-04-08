"use client";

import { useEffect, useState } from "react";

export function useDelayedFlag(flag: boolean, delayMs = 400): boolean {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!flag) {
      setDelayed(false);
      return;
    }

    const t = window.setTimeout(() => setDelayed(true), delayMs);
    return () => window.clearTimeout(t);
  }, [flag, delayMs]);

  return delayed;
}

