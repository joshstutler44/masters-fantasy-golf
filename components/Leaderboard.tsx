"use client";

import { useEffect, useState } from "react";
import db from "@/lib/instantdb";
import { GOLFERS } from "@/lib/golfers";

type LiveScore = {
  score: number;
  position: string;
  name: string;
};

type GolferScore = {
  id: string;
  name: string;
  score: number;
  position: string;
};

type RankedEntry = {
  id: string;
  playerName: string;
  golferScores: GolferScore[];
  total: number;
};

function formatScore(score: number): string {
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : `${score}`;
}

function scoreColor(score: number): React.CSSProperties {
  if (score < 0) return { color: "#006747" };
  if (score > 0) return { color: "#dc2626" };
  return { color: "#6b7280" };
}

export default function Leaderboard() {
  const { isLoading, error, data } = db.useQuery({ submissions: {} });
  const [liveScores, setLiveScores] = useState<Record<string, LiveScore>>({});
  const [scoresLoading, setScoresLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch("/api/scores");
        const json = await res.json();
        setLiveScores(json.scores ?? {});
      } catch {
        console.error("Failed to fetch live scores");
      } finally {
        setScoresLoading(false);
      }
    }
    fetchScores();
    const interval = setInterval(fetchScores, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || scoresLoading) {
    return <div className="text-center py-12 text-gray-500">Loading leaderboard…</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error loading data.</div>;
  }

  const submissions = Object.values(data?.submissions ?? {});

  if (submissions.length === 0) {
    return <div className="text-center py-12 text-gray-500">No picks submitted yet. Be the first!</div>;
  }

  const ranked: RankedEntry[] = submissions
    .map((sub) => {
      const golferScores: GolferScore[] = sub.golfers
        .map((gid: string) => {
          const golfer = GOLFERS.find((g) => g.id === gid);
          const live = golfer ? liveScores[golfer.espnId] : undefined;
          return {
            id: gid,
            name: golfer?.name ?? gid,
            score: live?.score ?? 0,
            position: live?.position ?? "—",
          };
        })
        .sort((a: GolferScore, b: GolferScore) => a.score - b.score);

      const total = golferScores.reduce((s, g) => s + g.score, 0);
      return { id: sub.id, playerName: sub.playerName, golferScores, total };
    })
    .sort((a, b) => a.total - b.total);

  // Assign positions with proper tie handling (1, 2, 2, 4, ...)
  const positions: number[] = [];
  ranked.forEach((entry, i) => {
    if (i === 0) positions.push(1);
    else if (entry.total === ranked[i - 1].total) positions.push(positions[i - 1]);
    else positions.push(i + 1);
  });

  return (
    <>
      {/* ── DESKTOP TABLE (hidden on mobile) ── */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-white" style={{ backgroundColor: "#006747" }}>
            <tr>
              <th className="px-4 py-3 font-semibold w-12">POS</th>
              <th className="px-4 py-3 font-semibold">NAME</th>
              <th className="px-4 py-3 font-semibold text-right">TOTAL</th>
              <th className="px-4 py-3 font-semibold text-center" colSpan={6}>PLAYERS</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((entry, i) => (
              <tr key={entry.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-bold text-gray-400">{positions[i]}</td>
                <td className="px-4 py-3 font-semibold text-black">{entry.playerName}</td>
                <td className="px-4 py-3 font-bold text-right" style={scoreColor(entry.total)}>
                  {formatScore(entry.total)}
                </td>
                {entry.golferScores.map((g) => (
                  <td key={g.id} className="px-4 py-3 text-center">
                    <div className="font-medium text-black">{g.name.split(" ").pop()}</div>
                    <div className="text-xs font-semibold" style={scoreColor(g.score)}>
                      {formatScore(g.score)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS (hidden on desktop) ── */}
      <div className="md:hidden space-y-3">
        {ranked.map((entry, i) => (
          <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ backgroundColor: "#006747" }}>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold opacity-70">#{positions[i]}</span>
                <span className="text-lg font-bold">{entry.playerName}</span>
              </div>
              <span className="text-2xl font-extrabold" style={entry.total === 0 ? { color: "white" } : entry.total < 0 ? { color: "#bbf7d0" } : { color: "#fca5a5" }}>
                {formatScore(entry.total)}
              </span>
            </div>

            {/* Golfer rows */}
            <div className="divide-y divide-gray-100">
              {entry.golferScores.map((g, gi) => (
                <div key={g.id} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-4">{gi + 1}</span>
                    <span className="text-sm font-medium text-black">{g.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={scoreColor(g.score)}>
                    {formatScore(g.score)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
