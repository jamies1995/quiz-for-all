import Link from "next/link";
import { getAllQuizzes, type Quiz } from "@/lib/quizzes";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getStats() {
  const totalPlayers = await prisma.quizSession.count({
    where: { completedAt: { not: null } },
  });
  const totalQuizzes = getAllQuizzes().length;
  return { totalPlayers, totalQuizzes };
}

export default async function HomePage() {
  const quizzes = getAllQuizzes();
  const stats = await getStats();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Nav */}
      <nav className="border-b border-purple-900/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold shimmer-text">Quiz for All</span>
          <Link
            href="/leaderboard"
            className="text-sm text-purple-300 hover:text-purple-100 transition-colors flex items-center gap-2"
          >
            🏆 Overall Leaderboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #7c3aed 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="float-animation inline-block text-6xl mb-6">🧠</div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            <span className="shimmer-text">Quiz for All</span>
          </h1>
          <p className="text-xl text-purple-200/70 max-w-xl mx-auto mb-10">
            Test your knowledge with our image-based quizzes. Pick a category,
            enter your name, and see how you rank.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-12 mb-4">
            <div className="text-center">
              <div className="text-3xl font-black text-amber-400">
                {stats.totalQuizzes}
              </div>
              <div className="text-sm text-purple-300/60 uppercase tracking-wider mt-1">
                Quizzes
              </div>
            </div>
            <div className="w-px bg-purple-800/40" />
            <div className="text-center">
              <div className="text-3xl font-black text-amber-400">
                {stats.totalPlayers}
              </div>
              <div className="text-sm text-purple-300/60 uppercase tracking-wider mt-1">
                Players
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-purple-100 mb-8">
            Choose a Quiz
          </h2>

          {quizzes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-purple-900/30 py-6 text-center text-sm text-purple-400/50">
        Quiz for All &mdash; have fun!
      </footer>
    </div>
  );
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/40">
      <div className="relative h-44 overflow-hidden bg-purple-900/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={quiz.thumbnailUrl}
          alt={quiz.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16122a] via-transparent to-transparent" />
        <span className="absolute top-3 right-3 text-xs font-semibold bg-purple-600/80 text-purple-100 px-2 py-1 rounded-full backdrop-blur-sm">
          {quiz.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1">{quiz.name}</h3>
        <p className="text-sm text-purple-300/60 mb-1">{quiz.description}</p>
        <p className="text-xs text-purple-400/50 mb-4">
          {quiz.questions.length} questions
        </p>

        <div className="flex gap-2">
          <Link
            href={`/quiz/${quiz.id}`}
            className="flex-1 text-center bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm py-2 rounded-xl transition-colors"
          >
            Play Now
          </Link>
          <Link
            href={`/leaderboard/${quiz.id}`}
            className="px-3 py-2 text-sm text-purple-400 hover:text-amber-400 border border-purple-700/50 hover:border-amber-500/50 rounded-xl transition-colors"
            title="View leaderboard"
          >
            🏆
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 glass-card rounded-2xl">
      <div className="text-5xl mb-4">🎯</div>
      <h3 className="text-xl font-bold text-purple-200 mb-2">
        No quizzes yet
      </h3>
      <p className="text-purple-400/60 text-sm max-w-sm mx-auto">
        Quizzes are coming soon. Check back later!
      </p>
    </div>
  );
}
