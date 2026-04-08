"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FarmPlotView from "@/components/farm-plot-view";
import InvestmentCalculator from "@/components/investment-calculator";
import {
  MapPin,
  Sprout,
  TrendingUp,
  Users,
  Calendar,
  ArrowLeft,
  Shield,
  Leaf,
  BarChart3,
  DollarSign,
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
        <div className="h-72 skeleton" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-10 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl skeleton shadow-sm" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-white rounded-2xl skeleton" />
              <div className="h-64 bg-white rounded-2xl skeleton" />
            </div>
            <div className="h-80 bg-white rounded-2xl skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sprout className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Farm not found
          </h2>
          <p className="text-gray-500 mb-6">
            The farm you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const availablePlots = farm.totalPlots - farm.soldPlots;
  const percentFunded = Math.round((farm.soldPlots / farm.totalPlots) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-emerald-200 hover:text-white text-sm mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </Link>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <span className="text-4xl">
                    {cropEmojis[farm.cropType] || "🌱"}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                    {farm.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-emerald-100">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {farm.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sprout className="w-4 h-4" />
                      {farm.cropType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/10">
                  <Users className="w-3.5 h-3.5" />
                  {farm._count.investments} investors
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/10">
                  <Shield className="w-3.5 h-3.5" />
                  Verified Farm
                </div>
                <Badge
                  className="text-sm px-4 py-1.5 bg-white/20 backdrop-blur-sm border-white/20 text-white"
                >
                  {farm.status}
                </Badge>
              </div>
            </div>

            {/* Funding progress mini */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 min-w-[200px]">
              <p className="text-sm text-emerald-200 mb-2">Funding Progress</p>
              <p className="text-3xl font-bold">{percentFunded}%</p>
              <div className="w-full h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${percentFunded}%` }}
                />
              </div>
              <p className="text-xs text-emerald-200 mt-2">
                {farm.soldPlots} of {farm.totalPlots} plots sold
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.type === "success" ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              {message.type === "success" ? "✓" : "!"}
            </div>
            {message.text}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 relative z-10 mb-10">
          {[
            {
              label: "Price per Plot",
              value: formatCurrency(farm.pricePerPlot),
              icon: DollarSign,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Expected ROI",
              value: formatPercent(farm.expectedROI),
              icon: TrendingUp,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Available Plots",
              value: `${availablePlots} of ${farm.totalPlots}`,
              icon: BarChart3,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              label: "Total Value",
              value: formatCurrency(farm.totalPlots * farm.pricePerPlot),
              icon: Leaf,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-5">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  About This Farm
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {farm.description}
                </p>
                <Separator className="my-8" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Farm Owner</p>
                    <p className="font-semibold text-gray-900">
                      {farm.farmer.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Listed</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(farm.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Expected Annual ROI</p>
                    <p className="font-semibold text-emerald-600 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      {formatPercent(farm.expectedROI)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Min Investment</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(farm.pricePerPlot)}
                      <span className="text-gray-400 font-normal"> (1 plot)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plot Grid */}
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    Select Your Plots
                  </h2>
                  <span className="text-sm text-gray-500">
                    {availablePlots} available
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Click on available plots to select them for investment. Each
                  plot costs {formatCurrency(farm.pricePerPlot)}.
                </p>
                {availablePlots > 0 ? (
                  <FarmPlotView
                    totalPlots={farm.totalPlots}
                    soldPlots={farm.soldPlots}
                    pricePerPlot={farm.pricePerPlot}
                    onSelectionChange={handleSelectionChange}
                    maxSelect={Math.min(20, availablePlots)}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sprout className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="font-medium">All plots have been sold</p>
                    <p className="text-sm mt-1">Check back for new listings!</p>
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
