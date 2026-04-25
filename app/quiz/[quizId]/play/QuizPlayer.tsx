"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Quiz } from "@/lib/quizzes";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizPlayer({
  quiz,
  sessionId,
}: {
  quiz: Quiz;
  sessionId: string;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  function handleSelect(optionIndex: number) {
    if (answered) return;
    setSelectedOption(optionIndex);
    setAnswered(true);
    if (optionIndex === question.correctAnswerIndex) {
      setScore((s) => s + 1);
    }
  }

  async function handleNext() {
    if (isLast) {
      setSubmitting(true);
      const finalScore = selectedOption === question.correctAnswerIndex ? score : score;
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: answered && selectedOption === question.correctAnswerIndex ? score : score }),
        });
      } finally {
        router.push(`/quiz/${quiz.id}/results?sessionId=${sessionId}&score=${score}&total=${quiz.questions.length}`);
      }
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setAnswered(false);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="border-b border-purple-900/30 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold shimmer-text">{quiz.name}</span>
          <span className="text-sm text-purple-400">
            {currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-3 h-1.5 bg-purple-900/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <h2 className="text-lg font-semibold text-purple-100 mb-6 text-center">
            {question.question}
          </h2>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-purple-800/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.imageUrl}
              alt="Quiz question"
              className="w-full object-cover max-h-72"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {question.options.map((option, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === question.correctAnswerIndex;
              let optionStyle =
                "glass-card cursor-pointer rounded-xl p-4 flex items-center gap-3 transition-all duration-200 border";

              if (!answered) {
                optionStyle +=
                  " hover:border-purple-400 hover:bg-purple-900/40 border-purple-800/30";
              } else if (isCorrect) {
                optionStyle += " border-emerald-500 bg-emerald-900/30";
              } else if (isSelected && !isCorrect) {
                optionStyle += " border-red-500 bg-red-900/30";
              } else {
                optionStyle += " border-purple-800/20 opacity-50";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={optionStyle}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      answered && isCorrect
                        ? "bg-emerald-600 text-white"
                        : answered && isSelected && !isCorrect
                        ? "bg-red-600 text-white"
                        : "bg-purple-800/60 text-purple-300"
                    }`}
                  >
                    {answered && isCorrect
                      ? "✓"
                      : answered && isSelected && !isCorrect
                      ? "✗"
                      : OPTION_LABELS[i]}
                  </span>
                  <span className="text-sm text-purple-100">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Score tally */}
          {answered && (
            <div className="text-center mb-6">
              <p
                className={`text-sm font-semibold ${
                  selectedOption === question.correctAnswerIndex
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {selectedOption === question.correctAnswerIndex
                  ? "✓ Correct!"
                  : `✗ The answer was: ${question.options[question.correctAnswerIndex]}`}
              </p>
              <p className="text-xs text-purple-400/60 mt-1">
                Score: {score} / {currentIndex + 1}
              </p>
            </div>
          )}

          {answered && (
            <button
              onClick={handleNext}
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 transition-all duration-200 hover:scale-[1.01]"
            >
              {submitting
                ? "Saving..."
                : isLast
                ? "See Results →"
                : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
