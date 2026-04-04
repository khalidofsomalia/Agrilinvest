"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PlotGridProps {
  totalPlots: number;
  soldPlots: number;
  onSelectionChange: (count: number) => void;
  maxSelect?: number;
}

export default function PlotGrid({
  totalPlots,
  soldPlots,
  onSelectionChange,
  maxSelect = 20,
}: PlotGridProps) {
  const [selectedPlots, setSelectedPlots] = useState<Set<number>>(new Set());

  // Calculate grid dimensions
  const cols = Math.ceil(Math.sqrt(totalPlots));
  const rows = Math.ceil(totalPlots / cols);

  const togglePlot = useCallback(
    (index: number) => {
      if (index < soldPlots) return; // Can't select sold plots

      setSelectedPlots((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else if (next.size < maxSelect) {
          next.add(index);
        }
        onSelectionChange(next.size);
        return next;
      });
    },
    [soldPlots, maxSelect, onSelectionChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-300" />
          <span className="text-gray-500">Sold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300" />
          <span className="text-gray-500">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-600" />
          <span className="text-gray-500">Selected</span>
        </div>
      </div>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          if (i >= totalPlots) return <div key={i} />;

          const isSold = i < soldPlots;
          const isSelected = selectedPlots.has(i);

          return (
            <button
              key={i}
              onClick={() => togglePlot(i)}
              disabled={isSold}
              className={cn(
                "aspect-square rounded-sm transition-all duration-150 cursor-pointer",
                isSold
                  ? "bg-gray-200 cursor-not-allowed"
                  : isSelected
                  ? "bg-emerald-600 shadow-md scale-105"
                  : "bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 hover:scale-105"
              )}
              title={
                isSold
                  ? `Plot ${i + 1} (Sold)`
                  : isSelected
                  ? `Plot ${i + 1} (Selected)`
                  : `Plot ${i + 1} (Available)`
              }
            />
          );
        })}
      </div>

      <p className="text-sm text-gray-500 text-center">
        {selectedPlots.size} plot{selectedPlots.size !== 1 ? "s" : ""} selected
        {maxSelect && ` (max ${maxSelect})`}
      </p>
    </div>
  );
}
