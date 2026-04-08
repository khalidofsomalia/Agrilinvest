"use client";

import { useScrollProgress } from "@/lib/hooks/use-scroll-progress";

export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 transition-[width] duration-150 ease-out shadow-[0_0_8px_rgba(16,185,129,0.6)]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
