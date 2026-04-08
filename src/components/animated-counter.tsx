"use client";

import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";
import { useCountUp } from "@/lib/hooks/use-count-up";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  format?: "number" | "currency" | "compact";
  className?: string;
}

function formatValue(
  value: number,
  format: "number" | "currency" | "compact",
  decimals: number
) {
  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);
  }
  if (format === "compact") {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1800,
  decimals = 0,
  format = "number",
  className,
}: AnimatedCounterProps) {
  const { ref, isVisible } = useIntersectionObserver<HTMLSpanElement>({
    threshold: 0.3,
  });
  const current = useCountUp(value, { duration, start: isVisible, decimals });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatValue(current, format, decimals)}
      {suffix}
    </span>
  );
}
