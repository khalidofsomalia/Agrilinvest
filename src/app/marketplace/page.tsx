"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FarmCard from "@/components/farm-card";
import { Reveal } from "@/components/reveal";
import { Search, SlidersHorizontal, X, Sprout, TrendingUp, MapPin } from "lucide-react";

interface Farm {
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

const cropTypes = [
  "All",
  "Wheat",
  "Coffee",
  "Rice",
  "Avocado",
  "Olives",
  "Cacao",
  "Grapes",
  "Bananas",
  "Mangoes",
  "Saffron",
];

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

const statuses = ["All", "ACTIVE", "FUNDED", "HARVESTING", "COMPLETED"];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "roi", label: "Highest ROI" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

export default function MarketplacePage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cropType, setCropType] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (cropType !== "All") params.set("cropType", cropType);
      if (status !== "All") params.set("status", status);
      params.set("sort", sort);

      try {
        const res = await fetch(`/api/farms?${params.toString()}`);
        const data = await res.json();
        setFarms(data);
      } catch (err) {
        console.error("Failed to fetch farms:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchFarms, 300);
    return () => clearTimeout(debounce);
  }, [search, cropType, status, sort]);

  const activeFilters = [
    cropType !== "All" ? cropType : null,
    status !== "All" ? status : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-emerald-100 text-sm mb-6 border border-white/10">
              <Sprout className="w-4 h-4" />
              <span>Verified Agricultural Investments</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Farm Marketplace
            </h1>
            <p className="text-lg text-emerald-100 leading-relaxed">
              Discover and invest in verified agricultural land worldwide.
              Browse curated farms with transparent returns and real-time tracking.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { icon: MapPin, label: "Global Locations", value: "10+ Countries" },
              { icon: TrendingUp, label: "Avg. ROI", value: "12-18%" },
              { icon: Sprout, label: "Crop Varieties", value: "10+ Types" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <stat.icon className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-emerald-200">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 -mt-8 relative z-10 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search farms by name, location, or crop..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl text-base"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 gap-2 rounded-xl px-5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-xs flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Expandable Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Crop Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cropTypes.map((crop) => (
                      <button
                        key={crop}
                        onClick={() => setCropType(crop)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                          cropType === crop
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {crop !== "All" && (
                          <span className="text-base">{cropEmojis[crop]}</span>
                        )}
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                          status === s
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {s === "All"
                          ? "All"
                          : s.charAt(0) + s.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Active filters:</span>
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100"
              >
                {filter}
                <button
                  onClick={() => {
                    if (cropTypes.includes(filter!)) setCropType("All");
                    if (statuses.includes(filter!)) setStatus("All");
                  }}
                  className="cursor-pointer hover:text-emerald-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                setCropType("All");
                setStatus("All");
              }}
              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="h-52 skeleton" />
                <div className="p-6 space-y-4">
                  <div className="h-5 skeleton rounded-lg w-3/4" />
                  <div className="h-4 skeleton rounded-lg w-1/2" />
                  <div className="h-2 skeleton rounded-lg w-full" />
                  <div className="flex justify-between pt-2">
                    <div className="h-8 skeleton rounded-lg w-1/3" />
                    <div className="h-8 skeleton rounded-lg w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : farms.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No farms found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter criteria to discover available farms
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSearch("");
                setCropType("All");
                setStatus("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{farms.length}</span> farm{farms.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm, index) => (
                <Reveal key={farm.id} delay={index * 60}>
                  <FarmCard {...farm} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
