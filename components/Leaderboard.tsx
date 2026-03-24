"use client";

import db from "@/lib/instantdb";
import { GOLFERS } from "@/lib/golfers";
import { MOCK_SCORES, formatScore } from "@/lib/scores";

export default function Leaderboard() {
  const { isLoading, error, data } = db.useQuery({ submissions: {} });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading leaderboard…</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error loading data. Check your InstantDB App ID.</div>;
  }

  const submissions = Object.values(data?.submissions ?? {});

  if (submissions.length === 0) {
    return <div className="text-center py-12 text-gray-500">No picks submitted yet. Be the first!</div>;
  }

  const ranked = submissions
    .map((sub) => {
      const golferScores = sub.golfers.map((gid: string) => {
        const score = MOCK_SCORES[gid]?.score ?? 0;
        const golfer = GOLFERS.find((g) => g.id === gid);
        return { id: gid, name: golfer?.name ?? gid, score };
      }).sort((a: { score: number }, b: { score: number }) => a.score - b.score);
      const total = golferScores.reduce((s: number, g: { score: number }) => s + g.score, 0);
      return { ...sub, golferScores, total };
    })
    .sort((a, b) => a.total - b.total);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-white" style={{ backgroundColor: "#006747" }}>
          <tr>
            <th className="px-4 py-3 font-semibold w-12">POS</th>
            <th className="px-4 py-3 font-semibold">NAME</th>
            <th className="px-4 py-3 font-semibold text-right">TOTAL</th>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <th key={n} className="px-4 py-3 font-semibold text-center">
                G{n}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ranked.map((entry, i) => (
            <tr
              key={entry.id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-3 font-bold text-gray-500">{i + 1}</td>
              <td className="px-4 py-3 font-semibold text-black">{entry.playerName}</td>
              <td
                className={`px-4 py-3 font-bold text-right ${
                  entry.total === 0 ? "text-gray-600" : entry.total > 0 ? "text-red-600" : ""
                }`}
                style={entry.total < 0 ? { color: "#006747" } : {}}
              >
                {formatScore(entry.total)}
              </td>
              {entry.golferScores.map((g: { id: string; name: string; score: number }) => (
                <td key={g.id} className="px-4 py-3 text-center">
                  <div className="font-medium text-black">{g.name.split(" ").pop()}</div>
                  <div
                    className={`text-xs font-semibold ${
                      g.score === 0 ? "text-gray-500" : g.score > 0 ? "text-red-600" : ""
                    }`}
                    style={g.score < 0 ? { color: "#006747" } : {}}
                  >
                    {formatScore(g.score)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
