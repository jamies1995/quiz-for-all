import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessions = await getPrisma().quizSession.findMany({
    where: { completedAt: { not: null } },
    orderBy: [{ percentage: "desc" }, { completedAt: "asc" }],
    take: 50,
  });

  return NextResponse.json(sessions);
}
