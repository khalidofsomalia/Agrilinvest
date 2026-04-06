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

  const cols = Math.ceil(Math.sqrt(totalPlots));
  const rows = Math.ceil(totalPlots / cols);

  const togglePlot = useCallback(
    (index: number) => {
      if (index < soldPlots) return;

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
    <div className="space-y-5">
      {/* Legend */}
      <div className="flex items-center gap-5 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-gray-200" />
          <span className="text-gray-500 font-medium">Sold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-emerald-100 border-2 border-emerald-300" />
          <span className="text-gray-500 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-emerald-600 shadow-sm" />
          <span className="text-gray-500 font-medium">Selected</span>
        </div>
      </div>

      {/* Grid */}
      <div
        className="grid gap-1.5"
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
                "aspect-square rounded-md transition-all duration-200 cursor-pointer relative",
                isSold
                  ? "bg-gray-200 cursor-not-allowed opacity-60"
                  : isSelected
                  ? "bg-emerald-600 shadow-lg shadow-emerald-200 scale-105 ring-2 ring-emerald-400 ring-offset-1"
                  : "bg-emerald-100 border-2 border-emerald-200 hover:bg-emerald-200 hover:scale-105 hover:border-emerald-300"
              )}
              title={
                isSold
                  ? `Plot ${i + 1} (Sold)`
                  : isSelected
                  ? `Plot ${i + 1} (Selected)`
                  : `Plot ${i + 1} (Available)`
              }
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selection counter */}
      <div className="flex items-center justify-center gap-3">
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-semibold transition-all",
          selectedPlots.size > 0
            ? "bg-emerald-100 text-emerald-700"
            : "bg-gray-100 text-gray-500"
        )}>
          {selectedPlots.size} plot{selectedPlots.size !== 1 ? "s" : ""} selected
          <span className="text-gray-400 font-normal ml-1">
            (max {maxSelect})
          </span>
        </div>
      </div>
    </div>
  );
}
