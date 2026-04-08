"use client";

import { RefObject, useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
  relativeX: number;
  relativeY: number;
}

/**
 * Tracks mouse position relative to a target element.
 * Returns normalized 0..1 coordinates plus pixel-relative coordinates.
 * Only listens while the cursor is over the element.
 */
export function useMousePosition<T extends HTMLElement>(
  ref: RefObject<T | null>
) {
  const [pos, setPos] = useState<Position>({
    x: 0.5,
    y: 0.5,
    relativeX: 0,
    relativeY: 0,
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      setPos({
        x: relativeX / rect.width,
        y: relativeY / rect.height,
        relativeX,
        relativeY,
      });
    };

    node.addEventListener("mousemove", handleMove);
    return () => node.removeEventListener("mousemove", handleMove);
  }, [ref]);

  return pos;
}
