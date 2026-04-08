"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { cn, formatCurrency } from "@/lib/utils";

interface FarmPlotViewProps {
  totalPlots: number;
  soldPlots: number;
  pricePerPlot?: number;
  onSelectionChange: (count: number) => void;
  maxSelect?: number;
}

interface Field {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  tint: string;
  stroke: string;
}

interface Plot {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  fieldIndex: number;
}

const VIEWBOX_W = 1000;
const VIEWBOX_H = 700;

// Four fields arranged 2x2 with a cross-shaped path between them
const FIELDS: Field[] = [
  { x: 110, y: 130, w: 360, h: 200, rotation: -2.5, tint: "#a7e9b6", stroke: "#5fb573" },
  { x: 530, y: 130, w: 360, h: 200, rotation: 1.8, tint: "#bfe9a3", stroke: "#7bb55f" },
  { x: 110, y: 380, w: 360, h: 200, rotation: 3.2, tint: "#9fdfb0", stroke: "#5aae6e" },
  { x: 530, y: 380, w: 360, h: 200, rotation: -1.8, tint: "#b6e598", stroke: "#75aa54" },
];

function distributePlots(total: number): { fieldIndex: number; localIndex: number; globalIndex: number }[] {
  const perField = Math.ceil(total / 4);
  const result: { fieldIndex: number; localIndex: number; globalIndex: number }[] = [];
  let global = 0;
  for (let f = 0; f < 4 && global < total; f++) {
    const count = Math.min(perField, total - global);
    for (let i = 0; i < count; i++) {
      result.push({ fieldIndex: f, localIndex: i, globalIndex: global });
      global++;
    }
  }
  return result;
}

function buildPlotsForField(
  fieldIndex: number,
  countInField: number,
  startGlobalIndex: number
): Plot[] {
  const field = FIELDS[fieldIndex];
  const padding = 14;
  const innerW = field.w - 2 * padding;
  const innerH = field.h - 2 * padding;
  const aspect = innerW / innerH;
  const cols = Math.max(1, Math.round(Math.sqrt(countInField * aspect)));
  const rows = Math.ceil(countInField / cols);
  const plotW = innerW / cols;
  const plotH = innerH / rows;
  const gap = 2.5;

  return Array.from({ length: countInField }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    return {
      index: startGlobalIndex + i,
      x: field.x + padding + col * plotW + gap / 2,
      y: field.y + padding + row * plotH + gap / 2,
      w: plotW - gap,
      h: plotH - gap,
      fieldIndex,
    };
  });
}

export default function FarmPlotView({
  totalPlots,
  soldPlots,
  pricePerPlot,
  onSelectionChange,
  maxSelect = 20,
}: FarmPlotViewProps) {
  const [selectedPlots, setSelectedPlots] = useState<Set<number>>(new Set());
  const [hoveredPlot, setHoveredPlot] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Compute plot layout once per totalPlots change
  const plots = useMemo(() => {
    const distribution = distributePlots(totalPlots);
    const fieldCounts = [0, 0, 0, 0];
    distribution.forEach((d) => fieldCounts[d.fieldIndex]++);

    const allPlots: Plot[] = [];
    let runningStart = 0;
    for (let f = 0; f < 4; f++) {
      const count = fieldCounts[f];
      if (count === 0) continue;
      allPlots.push(...buildPlotsForField(f, count, runningStart));
      runningStart += count;
    }
    return allPlots;
  }, [totalPlots]);

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

  const hoveredPlotData = hoveredPlot !== null ? plots.find((p) => p.index === hoveredPlot) : null;

  return (
    <div className="space-y-5">
      {/* SVG Farm */}
      <div className="relative w-full bg-gradient-to-b from-sky-50 to-emerald-50 rounded-2xl overflow-hidden border border-emerald-100 shadow-inner">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Interactive farm plot selector"
        >
          <defs>
            {/* Sky gradient */}
            <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#ecfdf5" />
            </linearGradient>

            {/* Grass gradient */}
            <linearGradient id="grass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86efac" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.6" />
            </linearGradient>

            {/* Dirt path texture */}
            <linearGradient id="dirt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#b08760" />
            </linearGradient>

            {/* Pond gradient */}
            <radialGradient id="pond" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>

            {/* Plot drop shadow */}
            <filter id="plot-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="0" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Selected plot glow */}
            <filter id="plot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#10b981" floodOpacity="0.8" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sky background */}
          <rect width={VIEWBOX_W} height="120" fill="url(#sky)" />

          {/* Rolling hills horizon */}
          <path
            d={`M 0 120 Q 200 95 400 115 T 800 110 T ${VIEWBOX_W} 118 L ${VIEWBOX_W} 130 L 0 130 Z`}
            fill="#86efac"
            opacity="0.5"
          />
          <path
            d={`M 0 125 Q 250 105 500 120 T ${VIEWBOX_W} 115 L ${VIEWBOX_W} 135 L 0 135 Z`}
            fill="#4ade80"
            opacity="0.4"
          />

          {/* Grass background */}
          <rect y="120" width={VIEWBOX_W} height={VIEWBOX_H - 120} fill="url(#grass)" />

          {/* Subtle grass texture - small dots */}
          {Array.from({ length: 60 }).map((_, i) => {
            const x = (i * 53) % VIEWBOX_W;
            const y = 140 + ((i * 73) % (VIEWBOX_H - 160));
            return (
              <circle
                key={`grass-${i}`}
                cx={x}
                cy={y}
                r="1.2"
                fill="#16a34a"
                opacity="0.3"
              />
            );
          })}

          {/* Drifting clouds */}
          <g className="animate-float" style={{ animationDuration: "8s" }}>
            <ellipse cx="180" cy="55" rx="42" ry="14" fill="white" opacity="0.95" />
            <ellipse cx="160" cy="50" rx="28" ry="12" fill="white" opacity="0.95" />
            <ellipse cx="200" cy="50" rx="30" ry="13" fill="white" opacity="0.95" />
          </g>
          <g className="animate-float stagger-3" style={{ animationDuration: "10s" }}>
            <ellipse cx="720" cy="45" rx="50" ry="16" fill="white" opacity="0.95" />
            <ellipse cx="700" cy="40" rx="32" ry="13" fill="white" opacity="0.95" />
            <ellipse cx="745" cy="42" rx="34" ry="14" fill="white" opacity="0.95" />
          </g>
          <g className="animate-float stagger-5" style={{ animationDuration: "12s" }}>
            <ellipse cx="450" cy="65" rx="36" ry="12" fill="white" opacity="0.9" />
            <ellipse cx="430" cy="60" rx="22" ry="10" fill="white" opacity="0.9" />
          </g>

          {/* Sun */}
          <circle cx="900" cy="60" r="28" fill="#fde047" opacity="0.9" />
          <circle cx="900" cy="60" r="36" fill="#fde047" opacity="0.3" />

          {/* Cross-shaped dirt paths */}
          {/* Horizontal path */}
          <rect x="50" y="345" width={VIEWBOX_W - 100} height="22" fill="url(#dirt)" rx="2" />
          <line
            x1="50"
            y1="356"
            x2={VIEWBOX_W - 50}
            y2="356"
            stroke="#8b6841"
            strokeWidth="0.5"
            strokeDasharray="6,8"
            opacity="0.5"
          />
          {/* Vertical path */}
          <rect x="489" y="120" width="22" height={VIEWBOX_H - 180} fill="url(#dirt)" rx="2" />
          <line
            x1="500"
            y1="120"
            x2="500"
            y2={VIEWBOX_H - 60}
            stroke="#8b6841"
            strokeWidth="0.5"
            strokeDasharray="6,8"
            opacity="0.5"
          />

          {/* Field backgrounds with rotation */}
          {FIELDS.map((field, i) => {
            const cx = field.x + field.w / 2;
            const cy = field.y + field.h / 2;
            return (
              <g key={`field-bg-${i}`} transform={`rotate(${field.rotation} ${cx} ${cy})`}>
                <rect
                  x={field.x - 6}
                  y={field.y - 6}
                  width={field.w + 12}
                  height={field.h + 12}
                  rx="10"
                  fill={field.tint}
                  stroke={field.stroke}
                  strokeWidth="2"
                  opacity="0.85"
                />
                {/* Field furrows - decorative lines suggesting plowed rows */}
                {Array.from({ length: 6 }).map((_, fi) => (
                  <line
                    key={`furrow-${i}-${fi}`}
                    x1={field.x - 4}
                    y1={field.y + (fi + 1) * (field.h / 7)}
                    x2={field.x + field.w + 4}
                    y2={field.y + (fi + 1) * (field.h / 7)}
                    stroke={field.stroke}
                    strokeWidth="0.6"
                    opacity="0.4"
                  />
                ))}
              </g>
            );
          })}

          {/* Plots - rendered on top of fields, also rotated with their field */}
          {FIELDS.map((field, fi) => {
            const cx = field.x + field.w / 2;
            const cy = field.y + field.h / 2;
            const fieldPlots = plots.filter((p) => p.fieldIndex === fi);
            return (
              <g
                key={`field-plots-${fi}`}
                transform={`rotate(${field.rotation} ${cx} ${cy})`}
              >
                {fieldPlots.map((plot) => {
                  const isSold = plot.index < soldPlots;
                  const isSelected = selectedPlots.has(plot.index);
                  const isHovered = hoveredPlot === plot.index;

                  let fill = "#d1fae5";
                  let stroke = "#34d399";
                  if (isSold) {
                    fill = "#9ca3af";
                    stroke = "#6b7280";
                  } else if (isSelected) {
                    fill = "#059669";
                    stroke = "#065f46";
                  }

                  return (
                    <g
                      key={plot.index}
                      onClick={() => togglePlot(plot.index)}
                      onMouseEnter={() => !isSold && setHoveredPlot(plot.index)}
                      onMouseLeave={() => setHoveredPlot(null)}
                      style={{
                        cursor: isSold ? "not-allowed" : "pointer",
                        transformOrigin: `${plot.x + plot.w / 2}px ${plot.y + plot.h / 2}px`,
                        transform: isHovered && !isSold ? "scale(1.15)" : "scale(1)",
                        transition: "transform 200ms ease-out",
                      }}
                    >
                      <title>
                        Plot {plot.index + 1} —{" "}
                        {isSold ? "Sold" : isSelected ? "Selected" : "Available"}
                      </title>
                      <rect
                        x={plot.x}
                        y={plot.y}
                        width={plot.w}
                        height={plot.h}
                        rx="2"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? 1.5 : 0.8}
                        filter={isSelected ? "url(#plot-glow)" : undefined}
                      />
                      {isSelected && (
                        <text
                          x={plot.x + plot.w / 2}
                          y={plot.y + plot.h / 2 + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={Math.min(plot.w, plot.h) * 0.7}
                          fill="white"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          ✓
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Decorative elements: trees in corners */}
          {[
            { x: 55, y: 200 },
            { x: 55, y: 480 },
            { x: 945, y: 200 },
            { x: 945, y: 510 },
            { x: 50, y: 340 },
            { x: 950, y: 350 },
          ].map((tree, i) => (
            <g key={`tree-${i}`}>
              <rect x={tree.x - 3} y={tree.y + 8} width="6" height="14" fill="#78350f" />
              <circle cx={tree.x - 6} cy={tree.y + 4} r="11" fill="#15803d" />
              <circle cx={tree.x + 6} cy={tree.y + 4} r="11" fill="#16a34a" />
              <circle cx={tree.x} cy={tree.y - 4} r="13" fill="#22c55e" />
              <circle cx={tree.x} cy={tree.y + 2} r="10" fill="#15803d" opacity="0.7" />
            </g>
          ))}

          {/* Barn (top-right outside fields) */}
          <g transform="translate(910, 160)">
            {/* Barn body */}
            <rect x="-22" y="0" width="44" height="36" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
            {/* Roof */}
            <polygon points="-26,0 0,-18 26,0" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
            {/* Door */}
            <rect x="-7" y="14" width="14" height="22" fill="#450a0a" />
            {/* Door cross */}
            <line x1="-7" y1="20" x2="7" y2="20" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
            <line x1="0" y1="14" x2="0" y2="36" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
            {/* Window */}
            <rect x="-4" y="4" width="8" height="6" fill="#fef3c7" stroke="#7f1d1d" strokeWidth="0.5" />
          </g>

          {/* Pond (bottom-right outside fields) */}
          <g>
            <ellipse cx="940" cy="450" rx="32" ry="20" fill="url(#pond)" opacity="0.9" />
            <ellipse cx="934" cy="445" rx="14" ry="6" fill="white" opacity="0.4" />
            {/* Lily pads */}
            <circle cx="950" cy="455" r="3" fill="#15803d" />
            <circle cx="925" cy="450" r="2.5" fill="#16a34a" />
          </g>

          {/* Fence posts along the bottom */}
          {Array.from({ length: 24 }).map((_, i) => (
            <g key={`fence-${i}`}>
              <rect
                x={60 + i * 38}
                y={VIEWBOX_H - 40}
                width="3"
                height="14"
                fill="#92400e"
              />
            </g>
          ))}
          {/* Horizontal fence rails */}
          <line
            x1="60"
            y1={VIEWBOX_H - 36}
            x2={VIEWBOX_W - 60}
            y2={VIEWBOX_H - 36}
            stroke="#92400e"
            strokeWidth="2"
          />
          <line
            x1="60"
            y1={VIEWBOX_H - 30}
            x2={VIEWBOX_W - 60}
            y2={VIEWBOX_H - 30}
            stroke="#92400e"
            strokeWidth="2"
          />

          {/* Field labels */}
          {FIELDS.map((field, i) => {
            const cx = field.x + field.w / 2;
            const cy = field.y + 18;
            return (
              <g
                key={`label-${i}`}
                transform={`rotate(${field.rotation} ${cx} ${field.y + field.h / 2})`}
              >
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#065f46"
                  opacity="0.6"
                  pointerEvents="none"
                >
                  Field {String.fromCharCode(65 + i)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip on hover */}
        {hoveredPlotData && hoveredPlot !== null && hoveredPlot >= soldPlots && (
          <div className="absolute top-3 left-3 px-3 py-2 bg-white rounded-lg shadow-lg border border-emerald-100 text-xs pointer-events-none animate-fade-in">
            <p className="font-bold text-gray-900">Plot #{hoveredPlot + 1}</p>
            {pricePerPlot && (
              <p className="text-emerald-600 font-semibold">
                {formatCurrency(pricePerPlot)}
              </p>
            )}
            <p className="text-gray-500">
              {selectedPlots.has(hoveredPlot) ? "Click to deselect" : "Click to select"}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-gray-400" />
            <span className="text-gray-600 font-medium">Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-emerald-100 border border-emerald-400" />
            <span className="text-gray-600 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-emerald-600 shadow-sm" />
            <span className="text-gray-600 font-medium">Selected</span>
          </div>
        </div>

        <div
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all",
            selectedPlots.size > 0
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          )}
        >
          {selectedPlots.size} plot{selectedPlots.size !== 1 ? "s" : ""} selected
          <span className="text-gray-400 font-normal ml-1">(max {maxSelect})</span>
        </div>
      </div>
    </div>
  );
}
