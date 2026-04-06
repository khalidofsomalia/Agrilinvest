"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FarmCard from "@/components/farm-card";
import { Search, SlidersHorizontal, X } from "lucide-react";

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Farm Marketplace
          </h1>
          <p className="text-gray-500">
            Discover and invest in verified agricultural land worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search farms by name, location, or crop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="gap-2"
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

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Crop Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {cropTypes.map((crop) => (
                    <button
                      key={crop}
                      onClick={() => setCropType(crop)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        cropType === crop
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        status === s
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Active filters:</span>
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
              >
                {filter}
                <button
                  onClick={() => {
                    if (cropTypes.includes(filter!)) setCropType("All");
                    if (statuses.includes(filter!)) setStatus("All");
                  }}
                  className="cursor-pointer"
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
              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
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
                className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : farms.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No farms found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {farms.length} farm{farms.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm) => (
                <FarmCard key={farm.id} {...farm} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
