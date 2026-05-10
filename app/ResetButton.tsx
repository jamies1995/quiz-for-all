"use client";

import { useState } from "react";

export default function ResetButton() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function openModal() {
    setOpen(true);
    setPassword("");
    setStatus("idle");
    setErrorMsg("");
  }

  function closeModal() {
    setOpen(false);
    setPassword("");
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleReset() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error");
      setStatus("error");
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="text-xs text-purple-500/50 hover:text-purple-400/70 transition-colors"
      >
        Reset Results
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-8 w-full max-w-sm mx-4">
            {status === "success" ? (
              <div className="text-center">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-white mb-2">All results cleared</h2>
                <p className="text-sm text-purple-300/60 mb-6">All leaderboards have been reset.</p>
                <button
                  onClick={closeModal}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-1">Reset All Results</h2>
                <p className="text-sm text-purple-300/60 mb-6">
                  This will permanently clear all quiz scores and leaderboards. Enter the admin password to continue.
                </p>

                <input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && status !== "loading" && handleReset()}
                  className="w-full bg-purple-900/30 border border-purple-700/50 text-white placeholder-purple-500/50 rounded-xl px-4 py-2 text-sm mb-2 focus:outline-none focus:border-purple-500"
                  autoFocus
                />

                {status === "error" && (
                  <p className="text-xs text-red-400 mb-3">{errorMsg}</p>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 text-sm text-purple-400 hover:text-purple-200 border border-purple-700/50 hover:border-purple-500/50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={!password || status === "loading"}
                    className="flex-1 py-2 text-sm font-semibold bg-red-600/80 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                  >
                    {status === "loading" ? "Resetting…" : "Reset"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
