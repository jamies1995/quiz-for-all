"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartQuizForm({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name.trim(), quizId }),
      });

      if (!res.ok) throw new Error("Failed to create session");

      const { sessionId } = await res.json();
      router.push(`/quiz/${quizId}/play?sessionId=${sessionId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">
          Your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          maxLength={30}
          className="w-full px-4 py-3 rounded-xl bg-purple-900/30 border border-purple-700/40 text-white placeholder-purple-500 focus:outline-none focus:border-purple-400 transition-colors"
          autoFocus
        />
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={!name.trim() || loading}
        className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? "Starting..." : "Start Quiz →"}
      </button>
    </form>
  );
}
