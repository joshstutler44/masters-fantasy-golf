"use client";

import { useState, useEffect } from "react";
import PickForm from "@/components/PickForm";
import Leaderboard from "@/components/Leaderboard";
import PlayerValues from "@/components/PlayerValues";
import SwapForm from "@/components/SwapForm";

type Tab = "picks" | "leaderboard" | "values" | "swap";

export default function Home() {
  const [tab, setTab] = useState<Tab>("picks");
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/scores");
        const json = await res.json();
        if (json.tournamentStarted) {
          setTournamentStarted(true);
          setTab((prev) => (prev === "picks" ? "leaderboard" : prev));
        }
        if (json.currentRound) setCurrentRound(json.currentRound);
      } catch {}
    }
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const tabBtn = (active: boolean) =>
    `flex-1 py-3 text-sm font-semibold transition-colors ${active ? "border-b-2" : "text-gray-500 hover:text-gray-700"}`;

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
          <button
            onClick={() => setTab("values")}
            className={tabBtn(tab === "values")}
            style={tab === "values" ? { color: "#006747", borderColor: "#006747" } : {}}
          >
            Players & Values
          </button>
          {!tournamentStarted && (
            <button
              onClick={() => setTab("picks")}
              className={tabBtn(tab === "picks")}
              style={tab === "picks" ? { color: "#006747", borderColor: "#006747" } : {}}
            >
              Make My Picks
            </button>
          )}
          {tournamentStarted && (
            <button
              onClick={() => setTab("swap")}
              className={tabBtn(tab === "swap")}
              style={tab === "swap" ? { color: "#006747", borderColor: "#006747" } : {}}
            >
              Replace Player
            </button>
          )}
          <button
            onClick={() => setTab("leaderboard")}
            className={tabBtn(tab === "leaderboard")}
            style={tab === "leaderboard" ? { color: "#006747", borderColor: "#006747" } : {}}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`mx-auto px-4 py-8 ${tab === "leaderboard" ? "max-w-6xl" : "max-w-2xl"}`}>
        {tab === "picks" && <PickForm />}
        {tab === "leaderboard" && <Leaderboard />}
        {tab === "values" && <PlayerValues />}
        {tab === "swap" && <SwapForm currentRound={currentRound} />}
      </div>
    </main>
  );
}
