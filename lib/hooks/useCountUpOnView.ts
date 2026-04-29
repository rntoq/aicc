"use client";

import { useEffect, useState } from "react";

type Params = {
  value: number;
  inView: boolean;
  steps?: number;
  intervalMs?: number;
};

export function useCountUpOnView({ value, inView, steps = 40, intervalMs = 30 }: Params) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const step = Math.max(1, Math.floor(value / steps));
    const timer = setInterval(() => {
      setCount((c) => {
        const next = Math.min(c + step, value);
        if (next >= value) {
          clearInterval(timer);
          return value;
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [inView, intervalMs, steps, value]);

  return count;
}
