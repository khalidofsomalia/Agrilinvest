import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const cropType = searchParams.get("cropType") || "";
    const status = searchParams.get("status") || "";
    const sort = searchParams.get("sort") || "newest";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { cropType: { contains: search } },
      ];
    }

    if (cropType) {
      where.cropType = cropType;
    }

    if (status) {
      where.status = status;
    }

    let orderBy: Record<string, string> = {};
    switch (sort) {
      case "roi":
        orderBy = { expectedROI: "desc" };
        break;
      case "price_low":
        orderBy = { pricePerPlot: "asc" };
        break;
      case "price_high":
        orderBy = { pricePerPlot: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const farms = await prisma.farm.findMany({
      where,
      orderBy,
    });

    return NextResponse.json(farms);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch farms" },
      { status: 500 }
    );
  }
}
