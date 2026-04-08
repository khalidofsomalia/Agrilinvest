"use client";

import { ReactNode } from "react";
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

const directionClasses: Record<string, string> = {
  up: "translate-y-6",
  down: "-translate-y-4",
  left: "-translate-x-8",
  right: "translate-x-8",
  none: "",
};

export function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: RevealProps) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
    >
      {children}
    </div>
  );
}
