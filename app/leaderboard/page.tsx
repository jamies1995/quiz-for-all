import Link from "next/link";
import { getPrisma } from "@/lib/db";
import { getAllQuizzes } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

async function getOverallLeaderboard() {
  return getPrisma().quizSession.findMany({
    where: { completedAt: { not: null } },
    orderBy: [{ percentage: "desc" }, { completedAt: "asc" }],
    take: 50,
  });
}

export default async function OverallLeaderboardPage() {
  const [sessions, quizzes] = await Promise.all([
    getOverallLeaderboard(),
    Promise.resolve(getAllQuizzes()),
  ]);

  const quizMap = Object.fromEntries(quizzes.map((q) => [q.id, q.name]));

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
            Overall Leaderboard
          </h1>
          <p className="text-purple-300/60 text-sm">
            Top scores across all quizzes
          </p>
        </div>

        <LeaderboardTable sessions={sessions} quizMap={quizMap} showQuiz />

        {sessions.length === 0 && (
          <div className="text-center py-20 glass-card rounded-2xl">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-purple-300/60">
              No scores yet — be the first to play!
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-sm text-purple-400 hover:text-purple-200 transition-colors"
            >
              Browse quizzes →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderboardTable({
  sessions,
  quizMap,
  showQuiz,
}: {
  sessions: Awaited<ReturnType<typeof getOverallLeaderboard>>;
  quizMap: Record<string, string>;
  showQuiz?: boolean;
}) {
  if (sessions.length === 0) return null;

  return (
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
            {showQuiz && (
              <th className="text-left px-5 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider hidden sm:table-cell">
                Quiz
              </th>
            )}
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
                <span className="font-semibold text-white">{s.playerName}</span>
              </td>
              {showQuiz && (
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="text-sm text-purple-300/60">
                    {quizMap[s.quizId] ?? s.quizId}
                  </span>
                </td>
              )}
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
                    ? new Date(s.completedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <span className="text-lg" title="1st">🥇</span>;
  if (rank === 2)
    return <span className="text-lg" title="2nd">🥈</span>;
  if (rank === 3)
    return <span className="text-lg" title="3rd">🥉</span>;
  return (
    <span className="text-sm font-bold text-purple-500">{rank}</span>
  );
}
