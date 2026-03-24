"use client";

import { useState } from "react";
import PickForm from "@/components/PickForm";
import Leaderboard from "@/components/Leaderboard";

type Tab = "picks" | "leaderboard";

export default function Home() {
  const [tab, setTab] = useState<Tab>("picks");

  return (
    <main className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="text-white shadow-lg" style={{ backgroundColor: "#006747" }}>
        <div className="mx-auto px-8 py-5 flex items-center justify-center gap-5">
          <img
            src="/masters-logo.jpg"
            alt="Masters Logo"
            className="h-20 w-auto rounded"
            style={{ backgroundColor: "#006747" }}
          />
          <div>
            <h1 className="text-4xl font-bold italic tracking-wide" style={{ fontFamily: "var(--font-masters)" }}>
              Masters Fantasy Pool
            </h1>
            <p className="text-green-200 text-sm mt-1">
              Pick 6 golfers · $50,000 salary cap
            </p>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 flex">
          {(["picks", "leaderboard"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                tab === t
                  ? "border-b-2"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={tab === t ? { color: "#006747", borderColor: "#006747" } : {}}
            >
              {t === "picks" ? "Make My Picks" : "Leaderboard"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`mx-auto px-4 py-8 ${tab === "leaderboard" ? "max-w-6xl" : "max-w-2xl"}`}>
        {tab === "picks" ? <PickForm /> : <Leaderboard />}
      </div>
    </main>
  );
}
