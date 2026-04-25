import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/db";
import { getQuiz } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

async function getQuizLeaderboard(quizId: string) {
  return getPrisma().quizSession.findMany({
    where: { quizId, completedAt: { not: null } },
    orderBy: [{ percentage: "desc" }, { completedAt: "asc" }],
    take: 50,
  });
}

export default async function QuizLeaderboardPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const quiz = getQuiz(quizId);

  if (!quiz) notFound();

  const sessions = await getQuizLeaderboard(quizId);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <nav className="border-b border-purple-900/30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-200 transition-colors text-sm"
          >
            ← Home
          </Link>
          <span className="text-lg font-bold shimmer-text">Quiz for All</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🏆</div>
          <h1 className="text-4xl font-black text-white mb-2">
            {quiz.name}
          </h1>
          <p className="text-purple-300/60 text-sm mb-4">Leaderboard</p>

          <div className="flex justify-center gap-4">
            <Link
              href={`/quiz/${quizId}`}
              className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition-colors font-semibold"
            >
              Play this quiz
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm text-purple-400 hover:text-purple-200 transition-colors px-4 py-2 rounded-xl border border-purple-700/30 hover:border-purple-500"
            >
              Overall leaderboard
            </Link>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-purple-300/60">
              No scores yet — be the first to play!
            </p>
            <Link
              href={`/quiz/${quizId}`}
              className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-200 transition-colors"
            >
              Play now →
            </Link>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-800/40">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-purple-900/20 hover:bg-purple-900/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <RankBadge rank={i + 1} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-white">
                        {s.playerName}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm text-purple-400">
                          {s.score}/{s.totalQuestions}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            s.percentage >= 90
                              ? "text-amber-400"
                              : s.percentage >= 70
                              ? "text-emerald-400"
                              : s.percentage >= 50
                              ? "text-blue-400"
                              : "text-red-400"
                          }`}
                        >
                          {s.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right hidden md:table-cell">
                      <span className="text-xs text-purple-500">
                        {s.completedAt
                          ? new Date(s.completedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm font-bold text-purple-500">{rank}</span>;
}
