import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { getQuiz, getQuestionsPerRound } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerName, quizId } = body;

  if (!playerName || !quizId) {
    return NextResponse.json(
      { error: "playerName and quizId are required" },
      { status: 400 }
    );
  }

  const quiz = getQuiz(quizId);
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const session = await getPrisma().quizSession.create({
    data: {
      playerName: playerName.trim(),
      quizId,
      totalQuestions: getQuestionsPerRound(quiz),
      startedAt: new Date(),
    },
  });

  return NextResponse.json({ sessionId: session.id }, { status: 201 });
}
