import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { score } = body;

  if (typeof score !== "number") {
    return NextResponse.json({ error: "score is required" }, { status: 400 });
  }

  const existing = await prisma.quizSession.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const percentage =
    existing.totalQuestions > 0
      ? (score / existing.totalQuestions) * 100
      : 0;

  const session = await prisma.quizSession.update({
    where: { id },
    data: {
      score,
      percentage: Math.round(percentage * 10) / 10,
      completedAt: new Date(),
    },
  });

  return NextResponse.json(session);
}
