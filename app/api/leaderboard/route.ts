import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sessions = await prisma.quizSession.findMany({
    where: { completedAt: { not: null } },
    orderBy: [{ percentage: "desc" }, { completedAt: "asc" }],
    take: 50,
  });

  return NextResponse.json(sessions);
}
