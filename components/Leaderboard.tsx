"use client";

import db from "@/lib/instantdb";
import { GOLFERS } from "@/lib/golfers";
import { MOCK_SCORES, formatScore } from "@/lib/scores";

export default function Leaderboard() {
  const { isLoading, error, data } = db.useQuery({ submissions: {} });

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading leaderboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading data. Check your InstantDB App ID.
      </div>
    );
  }

  const submissions = Object.values(data?.submissions ?? {});

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No picks submitted yet. Be the first!
      </div>
    );
  }

  const ranked = submissions
    .map((sub) => {
      const golferScores = sub.golfers.map((gid: string) => {
        const score = MOCK_SCORES[gid]?.score ?? 0;
        const golfer = GOLFERS.find((g) => g.id === gid);
        return { id: gid, name: golfer?.name ?? gid, score };
      });
      const total = golferScores.reduce((s: number, g: { score: number }) => s + g.score, 0);
      return { ...sub, golferScores, total };
    })
    .sort((a, b) => a.total - b.total);

  return (
    <div className="space-y-4">
      {ranked.map((entry, i) => (
        <div
          key={entry.id}
          className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-400 w-8">
                {i + 1}
              </span>
              <span className="text-lg font-bold text-gray-800">
                {entry.playerName}
              </span>
            </div>
            <span
              className={`text-xl font-bold ${
                entry.total < 0
                  ? "text-green-700"
                  : entry.total === 0
                  ? "text-gray-600"
                  : "text-red-600"
              }`}
            >
              {formatScore(entry.total)}
            </span>
          </div>

          {/* Golfer breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {entry.golferScores.map((g: { id: string; name: string; score: number }) => {
              const pos = MOCK_SCORES[g.id]?.position ?? "—";
              return (
                <div
                  key={g.id}
                  className="bg-gray-50 rounded-lg px-3 py-2 flex justify-between items-center text-sm"
                >
                  <span className="text-gray-700 truncate pr-2">{g.name}</span>
                  <div className="text-right shrink-0">
                    <div
                      className={`font-semibold ${
                        g.score < 0
                          ? "text-green-700"
                          : g.score === 0
                          ? "text-gray-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatScore(g.score)}
                    </div>
                    <div className="text-xs text-gray-400">Pos: {pos}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
