import { notFound, redirect } from "next/navigation";
import { getQuiz } from "@/lib/quizzes";
import QuizPlayer from "./QuizPlayer";

export default async function PlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ quizId: string }>;
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { quizId } = await params;
  const { sessionId } = await searchParams;

  if (!sessionId) redirect(`/quiz/${quizId}`);

  const quiz = getQuiz(quizId);
  if (!quiz) notFound();

  return <QuizPlayer quiz={quiz} sessionId={sessionId} />;
}
