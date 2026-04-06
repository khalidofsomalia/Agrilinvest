"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PlotGrid from "@/components/plot-grid";
import InvestmentCalculator from "@/components/investment-calculator";
import {
  MapPin,
  Sprout,
  TrendingUp,
  Users,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface Farm {
  id: string;
  name: string;
  description: string;
  location: string;
  cropType: string;
  totalPlots: number;
  soldPlots: number;
  pricePerPlot: number;
  expectedROI: number;
  imageUrl: string;
  status: string;
  createdAt: string;
  farmer: { name: string; email: string };
  _count: { investments: number };
}

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

export default function FarmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlots, setSelectedPlots] = useState(0);
  const [investing, setInvesting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const res = await fetch(`/api/farms/${params.id}`);
        if (!res.ok) throw new Error("Farm not found");
        const data = await res.json();
        setFarm(data);
      } catch {
        setFarm(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFarm();
  }, [params.id]);

  const handleSelectionChange = useCallback((count: number) => {
    setSelectedPlots(count);
  }, []);

  const handleInvest = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!farm || selectedPlots === 0) return;

    setInvesting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmId: farm.id,
          plotCount: selectedPlots,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({
          type: "success",
          text: `Successfully invested in ${selectedPlots} plots! Redirecting to dashboard...`,
        });
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="h-80 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Farm not found
          </h2>
          <p className="text-gray-500 mb-4">
            The farm you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/marketplace"
            className="text-emerald-600 font-medium hover:underline"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const availablePlots = farm.totalPlots - farm.soldPlots;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1 text-emerald-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">
                  {cropEmojis[farm.cropType] || "🌱"}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold">{farm.name}</h1>
              </div>
              <div className="flex items-center gap-4 text-emerald-100">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {farm.location}
                </span>
                <span className="flex items-center gap-1">
                  <Sprout className="w-4 h-4" />
                  {farm.cropType}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {farm._count.investments} investors
                </span>
              </div>
            </div>
            <Badge
              className="self-start text-sm px-4 py-1.5"
              variant={farm.status === "ACTIVE" ? "default" : "secondary"}
            >
              {farm.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Price per Plot",
              value: formatCurrency(farm.pricePerPlot),
              icon: "💰",
            },
            {
              label: "Expected ROI",
              value: formatPercent(farm.expectedROI),
              icon: "📈",
            },
            {
              label: "Available Plots",
              value: `${availablePlots} of ${farm.totalPlots}`,
              icon: "🗺️",
            },
            {
              label: "Total Value",
              value: formatCurrency(farm.totalPlots * farm.pricePerPlot),
              icon: "🏦",
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  About This Farm
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {farm.description}
                </p>
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Farm Owner</p>
                    <p className="font-medium text-gray-900">
                      {farm.farmer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Listed</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(farm.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expected Annual ROI</p>
                    <p className="font-medium text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {formatPercent(farm.expectedROI)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min Investment</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(farm.pricePerPlot)} (1 plot)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plot Grid */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Your Plots
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Click on available plots to select them for investment. Each
                  plot costs {formatCurrency(farm.pricePerPlot)}.
                </p>
                {availablePlots > 0 ? (
                  <PlotGrid
                    totalPlots={farm.totalPlots}
                    soldPlots={farm.soldPlots}
                    onSelectionChange={handleSelectionChange}
                    maxSelect={Math.min(20, availablePlots)}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    All plots have been sold. Check back for new listings!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <InvestmentCalculator
              plotCount={selectedPlots}
              pricePerPlot={farm.pricePerPlot}
              expectedROI={farm.expectedROI}
              onInvest={handleInvest}
              disabled={availablePlots === 0}
              loading={investing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
