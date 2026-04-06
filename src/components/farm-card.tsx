import Link from "next/link";
import { MapPin, TrendingUp, Sprout } from "lucide-react";
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

const statusColors: Record<string, "default" | "secondary" | "warning" | "outline"> = {
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

  return (
    <Link href={`/farms/${id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        {/* Image placeholder with gradient */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-emerald-700 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-40">
              {cropEmojis[cropType] || "🌱"}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={statusColors[status] || "default"}>{status}</Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-gray-800 backdrop-blur-sm"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {formatPercent(expectedROI)} ROI
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {name}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5" />
              {cropType}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>{soldPlots} of {totalPlots} plots sold</span>
              <span>{percentSold}%</span>
            </div>
            <Progress value={percentSold} />
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Price per plot</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(pricePerPlot)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-lg font-bold text-emerald-600">
                {availablePlots}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
