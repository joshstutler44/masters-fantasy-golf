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
      <header className="bg-green-800 text-white shadow-lg">
        <div className="mx-auto px-4 py-6 text-center flex flex-col items-center gap-3">
          <img src="/masters-logo.jpg" alt="Masters Logo" className="h-24 w-auto" />
          <h1 className="text-4xl font-bold italic tracking-wide" style={{ fontFamily: "var(--font-masters)" }}>
            Masters Fantasy Pool
          </h1>
          <p className="text-green-200 text-sm">
            Pick 6 golfers · $50,000 salary cap
          </p>
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
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
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
