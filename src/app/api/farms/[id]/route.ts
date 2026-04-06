import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const farm = await prisma.farm.findUnique({
      where: { id },
      include: {
        farmer: {
          select: { name: true, email: true },
        },
        _count: {
          select: { investments: true },
        },
      },
    });

    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    return NextResponse.json(farm);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch farm" },
      { status: 500 }
    );
  }
}
