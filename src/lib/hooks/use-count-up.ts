"use client";

import { useEffect, useState } from "react";

interface Options {
  duration?: number;
  start?: boolean;
  decimals?: number;
}

export function useCountUp(
  target: number,
  { duration = 1800, start = true, decimals = 0 }: Options = {}
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    // Honor reduced-motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }

    let rafId: number;
    let startTime: number | null = null;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = eased * target;
      setValue(
        decimals === 0 ? Math.round(current) : Number(current.toFixed(decimals))
      );

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start, decimals]);

  return value;
}
