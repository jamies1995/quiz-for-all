import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/quizzes";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ quizId: string }>;
  searchParams: Promise<{ sessionId?: string; score?: string; total?: string }>;
}) {
  const { quizId } = await params;
  const { sessionId, score: scoreStr, total: totalStr } = await searchParams;

  const quiz = getQuiz(quizId);
  if (!quiz) notFound();

  const score = parseInt(scoreStr ?? "0", 10);
  const total = parseInt(totalStr ?? "0", 10);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  let playerName = "Player";
  if (sessionId) {
    const session = await getPrisma().quizSession.findUnique({
      where: { id: sessionId },
      select: { playerName: true },
    });
    if (session) playerName = session.playerName;
  }

  const grade =
    percentage >= 90
      ? { label: "Outstanding!", emoji: "🏆", color: "text-amber-400" }
      : percentage >= 70
      ? { label: "Great job!", emoji: "🎉", color: "text-purple-300" }
      : percentage >= 50
      ? { label: "Good effort!", emoji: "👍", color: "text-blue-400" }
      : { label: "Keep practising!", emoji: "💪", color: "text-orange-400" };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #7c3aed 0%, transparent 70%)",
        }}
      />
      <div className="w-full max-w-md relative z-10">
        {/* Score card */}
        <div className="glass-card rounded-3xl p-8 text-center mb-6">
          <div className="text-5xl mb-3">{grade.emoji}</div>
          <h1 className={`text-2xl font-black mb-1 ${grade.color}`}>
            {grade.label}
          </h1>
          <p className="text-sm text-purple-300/60 mb-8">
            Well done, {playerName}!
          </p>

          {/* Score ring */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#2d1b69"
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white">{percentage}%</span>
              <span className="text-xs text-purple-400/60">
                {score}/{total}
              </span>
            </div>
          </div>

          <p className="text-sm text-purple-300/50">
            {quiz.name} &bull; {total} questions
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/leaderboard/${quizId}`}
            className="w-full text-center py-3 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-400 transition-colors"
          >
            🏆 View Leaderboard
          </Link>
          <Link
            href={`/quiz/${quizId}`}
            className="w-full text-center py-3 rounded-xl font-semibold text-purple-200 glass-card hover:border-purple-400 transition-colors border border-purple-700/30"
          >
            Play Again
          </Link>
          <Link
            href="/"
            className="w-full text-center py-3 rounded-xl font-semibold text-purple-400 hover:text-purple-200 transition-colors"
          >
            ← Back to all quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}
