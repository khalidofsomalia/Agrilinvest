"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Coins, Calendar } from "lucide-react";
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
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-emerald-600" />
          Investment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Plots selected</span>
            <span className="font-medium">{plotCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Price per plot</span>
            <span className="font-medium">{formatCurrency(pricePerPlot)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              Total investment
            </span>
            <span className="font-bold text-lg">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-emerald-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Expected ROI
            </span>
            <span className="font-semibold text-emerald-700">
              {formatPercent(expectedROI)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Projected return
            </span>
            <span className="font-semibold text-emerald-700">
              {formatCurrency(expectedReturn)}
            </span>
          </div>
          <Separator className="bg-emerald-200" />
          <div className="flex justify-between">
            <span className="text-sm font-medium text-emerald-800">
              Total projected value
            </span>
            <span className="font-bold text-emerald-800">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>

        <Button
          className="w-full"
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

        <p className="text-xs text-gray-400 text-center">
          Returns are projected and not guaranteed. Past performance does not
          indicate future results.
        </p>
      </CardContent>
    </Card>
  );
}
