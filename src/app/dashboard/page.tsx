"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/stats-card";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  BarChart3,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Sprout,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardData {
  balance: number;
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  currentValue: number;
  investments: Array<{
    id: string;
    plotCount: number;
    amount: number;
    returns: number;
    status: string;
    createdAt: string;
    farm: {
      name: string;
      cropType: string;
      expectedROI: number;
      status: string;
      location: string;
    };
  }>;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
  }>;
  portfolioHistory: Array<{
    month: string;
    value: number;
    invested: number;
  }>;
  cropDistribution: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = [
  "#059669",
  "#0891b2",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((res) => res.json())
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 skeleton rounded-lg w-56 mb-2" />
                <div className="h-4 skeleton rounded-lg w-80" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-2xl skeleton shadow-sm" />
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-80 bg-white rounded-2xl skeleton shadow-sm" />
              <div className="h-80 bg-white rounded-2xl skeleton shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {session?.user?.name?.split(" ")[0]}
            </h1>
            <p className="text-gray-500 mt-1">
              Here&apos;s an overview of your agricultural portfolio
            </p>
          </div>
          <Button asChild className="rounded-xl h-11 px-6 gap-2 self-start">
            <Link href="/marketplace">
              <Sprout className="w-4 h-4" />
              Browse Farms
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Account Balance"
            value={formatCurrency(data.balance)}
            icon={Wallet}
            subtitle="Available to invest"
          />
          <StatsCard
            title="Total Invested"
            value={formatCurrency(data.totalInvested)}
            icon={PiggyBank}
            trend={{ value: 12.5, positive: true }}
          />
          <StatsCard
            title="Total Returns"
            value={formatCurrency(data.totalReturns)}
            icon={TrendingUp}
            trend={{ value: 8.3, positive: true }}
          />
          <StatsCard
            title="Active Investments"
            value={data.activeInvestments.toString()}
            icon={BarChart3}
            subtitle={`${data.investments.length} total`}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Portfolio Chart */}
          <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Portfolio Performance</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Portfolio Value
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.portfolioHistory}>
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#059669"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#059669"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      stroke="transparent"
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      stroke="transparent"
                      tickLine={false}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Value",
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        fontSize: "13px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#059669"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Crop Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {data.cropDistribution.length > 0 ? (
                <>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.cropDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="#fff"
                        >
                          {data.cropDistribution.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            fontSize: "13px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2.5 mt-2">
                    {data.cropDistribution.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-gray-600">
                            {cropEmojis[item.name] || ""} {item.name}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sprout className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-gray-500 mb-3">No investments yet</p>
                  <Button asChild size="sm" className="rounded-xl">
                    <Link href="/marketplace">Start Investing</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investments */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Active Investments</CardTitle>
              <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 rounded-lg">
                <Eye className="w-4 h-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {data.investments.length > 0 ? (
                <div className="space-y-3">
                  {data.investments.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <span className="text-2xl">
                            {cropEmojis[inv.farm.cropType] || "🌱"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {inv.farm.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {inv.plotCount} plots &middot; {inv.farm.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(inv.amount)}
                        </p>
                        <Badge
                          variant={
                            inv.status === "ACTIVE"
                              ? "default"
                              : inv.status === "PAID"
                              ? "secondary"
                              : "warning"
                          }
                          className="text-xs mt-1"
                        >
                          {inv.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="font-medium">No investments yet</p>
                  <p className="text-sm mt-1">Browse the marketplace to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {data.transactions.length > 0 ? (
                <div className="space-y-1">
                  {data.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            tx.amount >= 0
                              ? "bg-emerald-100"
                              : "bg-red-100"
                          }`}
                        >
                          {tx.amount >= 0 ? (
                            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {tx.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-bold text-sm ${
                          tx.amount >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.amount >= 0 ? "+" : ""}
                        {formatCurrency(Math.abs(tx.amount))}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="font-medium">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
