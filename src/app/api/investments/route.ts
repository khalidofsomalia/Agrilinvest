import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { farmId, plotCount } = await request.json();

    if (!farmId || !plotCount || plotCount < 1) {
      return NextResponse.json(
        { error: "Invalid investment data" },
        { status: 400 }
      );
    }

    // Get farm details
    const farm = await prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    const availablePlots = farm.totalPlots - farm.soldPlots;
    if (plotCount > availablePlots) {
      return NextResponse.json(
        { error: "Not enough plots available" },
        { status: 400 }
      );
    }

    const amount = plotCount * farm.pricePerPlot;

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user || user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create investment, update farm, update user balance, create transaction
    const [investment] = await prisma.$transaction([
      prisma.investment.create({
        data: {
          userId: session.user.id,
          farmId,
          plotCount,
          amount,
          status: "ACTIVE",
        },
      }),
      prisma.farm.update({
        where: { id: farmId },
        data: {
          soldPlots: { increment: plotCount },
          status:
            farm.soldPlots + plotCount >= farm.totalPlots ? "FUNDED" : "ACTIVE",
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: "INVESTMENT",
          amount: -amount,
          description: `Investment in ${farm.name} (${plotCount} plots)`,
        },
      }),
    ]);

    return NextResponse.json(investment);
  } catch {
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
