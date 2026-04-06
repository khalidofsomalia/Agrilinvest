"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  TrendingUp,
  Coins,
  Calendar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface InvestmentCalculatorProps {
  plotCount: number;
  pricePerPlot: number;
  expectedROI: number;
  onInvest: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function InvestmentCalculator({
  plotCount,
  pricePerPlot,
  expectedROI,
  onInvest,
  disabled = false,
  loading = false,
}: InvestmentCalculatorProps) {
  const totalCost = plotCount * pricePerPlot;
  const expectedReturn = totalCost * (expectedROI / 100);
  const totalValue = totalCost + expectedReturn;

  return (
    <Card className="sticky top-24 border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5" />
          Investment Summary
        </CardTitle>
        <p className="text-sm text-emerald-100 mt-1">
          Review your investment details
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Plots selected</span>
            <span className="font-semibold text-gray-900">
              {plotCount}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Price per plot</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(pricePerPlot)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-gray-400" />
              Total investment
            </span>
            <span className="font-bold text-xl text-gray-900">
              {formatCurrency(totalCost)}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 space-y-3 border border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">
              Projected Returns
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Expected ROI
            </span>
            <span className="font-bold text-emerald-700">
              {formatPercent(expectedROI)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Projected return
            </span>
            <span className="font-bold text-emerald-700">
              {formatCurrency(expectedReturn)}
            </span>
          </div>
          <Separator className="bg-emerald-200" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-emerald-900">
              Total projected value
            </span>
            <span className="font-bold text-lg text-emerald-900">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold rounded-xl"
          size="lg"
          onClick={onInvest}
          disabled={disabled || plotCount === 0 || loading}
        >
          {loading
            ? "Processing..."
            : plotCount === 0
            ? "Select plots to invest"
            : `Invest ${formatCurrency(totalCost)}`}
        </Button>

        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Returns are projected and not guaranteed. Past performance does not
            indicate future results. Your capital is at risk.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
