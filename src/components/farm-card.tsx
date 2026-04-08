"use client";

import Link from "next/link";
import { useRef } from "react";
import { MapPin, TrendingUp, Sprout, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface FarmCardProps {
  id: string;
  name: string;
  location: string;
  cropType: string;
  totalPlots: number;
  soldPlots: number;
  pricePerPlot: number;
  expectedROI: number;
  imageUrl: string;
  status: string;
}

const statusColors: Record<
  string,
  "default" | "secondary" | "warning" | "outline"
> = {
  ACTIVE: "default",
  FUNDED: "secondary",
  HARVESTING: "warning",
  COMPLETED: "outline",
};

const cropEmojis: Record<string, string> = {
  Wheat: "🌾",
  Coffee: "☕",
  Rice: "🍚",
  Avocado: "🥑",
  Olives: "🫒",
  Cacao: "🍫",
  Grapes: "🍇",
  Bananas: "🍌",
  Mangoes: "🥭",
  Saffron: "🌸",
};

const cropGradients: Record<string, string> = {
  Wheat: "from-amber-400 via-yellow-500 to-orange-400",
  Coffee: "from-amber-700 via-amber-800 to-yellow-900",
  Rice: "from-lime-400 via-green-500 to-emerald-500",
  Avocado: "from-green-400 via-emerald-500 to-teal-500",
  Olives: "from-olive-400 via-lime-600 to-green-700",
  Cacao: "from-amber-600 via-amber-700 to-amber-900",
  Grapes: "from-purple-400 via-violet-500 to-purple-700",
  Bananas: "from-yellow-300 via-yellow-400 to-amber-400",
  Mangoes: "from-orange-400 via-amber-500 to-yellow-500",
  Saffron: "from-violet-400 via-purple-500 to-fuchsia-500",
};

export default function FarmCard({
  id,
  name,
  location,
  cropType,
  totalPlots,
  soldPlots,
  pricePerPlot,
  expectedROI,
  status,
}: FarmCardProps) {
  const percentSold = Math.round((soldPlots / totalPlots) * 100);
  const availablePlots = totalPlots - soldPlots;
  const gradient =
    cropGradients[cropType] || "from-emerald-400 via-emerald-500 to-emerald-700";

  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;
    // Tilt range ±6deg, inverted on Y for natural feel
    const tiltY = (dx / cx) * 6;
    const tiltX = -(dy / cy) * 6;
    el.style.setProperty("--tilt-x", `${tiltX}deg`);
    el.style.setProperty("--tilt-y", `${tiltY}deg`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <Link href={`/farms/${id}`} className="block tilt-card">
      <Card
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="tilt-card-inner group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-2xl bg-white"
      >
        {/* Image placeholder with dynamic gradient */}
        <div
          className={`relative h-52 bg-gradient-to-br ${gradient} overflow-hidden`}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-32 h-32 border border-white/30 rounded-full" />
            <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-30 group-hover:scale-110 transition-transform duration-500">
              {cropEmojis[cropType] || "🌱"}
            </span>
          </div>

          {/* Status badge */}
          <div className="absolute top-4 right-4">
            <Badge
              variant={statusColors[status] || "default"}
              className="backdrop-blur-sm shadow-sm"
            >
              {status}
            </Badge>
          </div>

          {/* ROI badge */}
          <div className="absolute bottom-4 left-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              {formatPercent(expectedROI)} ROI
            </div>
          </div>

          {/* Hover arrow */}
          <div className="absolute top-4 left-4 w-9 h-9 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
            <ArrowUpRight className="w-4 h-4 text-gray-800" />
          </div>
        </div>

        <CardContent className="p-6">
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg leading-tight line-clamp-1">
              {name}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {location}
            </span>
            <span className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-gray-400" />
              {cropType}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">
                {soldPlots} of {totalPlots} plots sold
              </span>
              <span className="font-semibold text-emerald-600">{percentSold}%</span>
            </div>
            <Progress value={percentSold} />
          </div>

          {/* Price & Availability */}
          <div className="flex items-end justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                Per Plot
              </p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(pricePerPlot)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                Available
              </p>
              <p className="text-xl font-bold text-emerald-600">
                {availablePlots}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  plots
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
