import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, investments, transactions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true, name: true },
      }),
      prisma.investment.findMany({
        where: { userId: session.user.id },
        include: {
          farm: {
            select: {
              name: true,
              cropType: true,
              expectedROI: true,
              status: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0);
    const activeInvestments = investments.filter(
      (inv) => inv.status === "ACTIVE"
    ).length;

    // Portfolio value over time (simulated monthly data)
    const portfolioHistory = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (11 - i));
      const monthName = month.toLocaleString("default", { month: "short" });
      const baseValue = totalInvested * ((i + 1) / 12);
      const returns = baseValue * 0.01 * (i + 1);
      return {
        month: monthName,
        value: Math.round(baseValue + returns),
        invested: Math.round(baseValue),
      };
    });

    // Investment distribution by crop type
    const distribution = investments.reduce(
      (acc: Record<string, number>, inv) => {
        const crop = inv.farm.cropType;
        acc[crop] = (acc[crop] || 0) + inv.amount;
        return acc;
      },
      {}
    );

    const cropDistribution = Object.entries(distribution).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return NextResponse.json({
      balance: user?.balance || 0,
      totalInvested,
      totalReturns,
      activeInvestments,
      currentValue: totalInvested + totalReturns,
      investments,
      transactions,
      portfolioHistory,
      cropDistribution,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
