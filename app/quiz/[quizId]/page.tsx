import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuiz, getQuestionsPerRound } from "@/lib/quizzes";
import StartQuizForm from "./StartQuizForm";

export default async function QuizStartPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const quiz = getQuiz(quizId);

  if (!quiz) notFound();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      <nav className="border-b border-purple-900/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-purple-400 hover:text-purple-200 transition-colors text-sm">
            ← Back
          </Link>
          <span className="text-lg font-bold shimmer-text">Quiz for All</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Quiz preview */}
          <div className="glass-card rounded-2xl overflow-hidden mb-8">
            <div className="relative h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={quiz.thumbnailUrl}
                alt={quiz.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16122a]/90 to-transparent flex items-end p-5">
                <div>
                  <span className="text-xs font-semibold text-purple-300 bg-purple-800/60 px-2 py-1 rounded-full">
                    {quiz.category}
                  </span>
                  <h1 className="text-2xl font-black text-white mt-2">{quiz.name}</h1>
                  <p className="text-sm text-purple-300/60">{getQuestionsPerRound(quiz)} questions</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-purple-300/70">{quiz.description}</p>
            </div>
          </div>

          {/* Name entry form */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-1">Ready to play?</h2>
            <p className="text-sm text-purple-300/60 mb-6">
              Enter your name to start — it&apos;ll appear on the leaderboard.
            </p>
            <StartQuizForm quizId={quiz.id} />
          </div>

          <div className="text-center mt-4">
            <Link
              href={`/leaderboard/${quiz.id}`}
              className="text-sm text-purple-400 hover:text-amber-400 transition-colors"
            >
              🏆 View leaderboard for this quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
