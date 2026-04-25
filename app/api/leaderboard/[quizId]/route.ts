import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params;

  const sessions = await prisma.quizSession.findMany({
    where: { quizId, completedAt: { not: null } },
    orderBy: [{ percentage: "desc" }, { completedAt: "asc" }],
    take: 50,
  });

  return NextResponse.json(sessions);
}
