"use client";

import { useState, useEffect } from "react";
import { GOLFERS } from "@/lib/golfers";
import db from "@/lib/instantdb";
import { id as newId } from "@instantdb/react";

type PlayerStatus = "active" | "cut" | "wd";
type LiveScore = { score: number; position: string; name: string; status: PlayerStatus };

export default function SwapForm({ currentRound }: { currentRound: number }) {
  const [name, setName] = useState("");
  const [searched, setSearched] = useState(false);
  const [liveScores, setLiveScores] = useState<Record<string, LiveScore>>({});
  const [replacements, setReplacements] = useState<Record<string, string>>({}); // key: `${subId}-${idx}` → golfer id
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const { data } = db.useQuery({ submissions: {} });

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch("/api/scores");
        const json = await res.json();
        setLiveScores(json.scores ?? {});
      } catch {}
    }
    fetchScores();
    const interval = setInterval(fetchScores, 60000);
    return () => clearInterval(interval);
  }, []);

  const allSubmissions = Object.values(data?.submissions ?? {}) as {
    id: string;
    playerName: string;
    golfers: string[];
    totalSalary: number;
  }[];

  const userSubmissions = searched
    ? allSubmissions.filter(
        (s) => s.playerName.trim().toLowerCase() === name.trim().toLowerCase()
      )
    : [];

  const windowOpen = currentRound <= 2;

  function getStatus(golferId: string): PlayerStatus {
    const golfer = GOLFERS.find((g) => g.id === golferId);
    if (!golfer) return "active";
    return liveScores[golfer.espnId]?.status ?? "active";
  }

  function getAvailableReplacements(picks: string[], wdGolferId: string) {
    const wdGolfer = GOLFERS.find((g) => g.id === wdGolferId);
    if (!wdGolfer) return [];
    return GOLFERS.filter(
      (g) =>
        !picks.includes(g.id) &&
        g.id !== wdGolferId &&
        g.salary <= wdGolfer.salary &&
        getStatus(g.id) !== "wd"
    ).sort((a, b) => b.salary - a.salary);
  }

  async function handleSwap(sub: { id: string; golfers: string[]; totalSalary: number }, wdIdx: number) {
    const key = `${sub.id}-${wdIdx}`;
    const replacementId = replacements[key];
    if (!replacementId) return;

    const newPicks = [...sub.golfers];
    newPicks[wdIdx] = replacementId;

    const wdGolfer = GOLFERS.find((g) => g.id === sub.golfers[wdIdx]);
    const newGolfer = GOLFERS.find((g) => g.id === replacementId);
    const salaryDiff = (wdGolfer?.salary ?? 0) - (newGolfer?.salary ?? 0);
    const newTotalSalary = sub.totalSalary - salaryDiff;

    try {
      await db.transact(
        db.tx.submissions[sub.id].update({ golfers: newPicks, totalSalary: newTotalSalary })
      );
      setSaved((prev) => ({ ...prev, [key]: true }));
      setError("");
    } catch {
      setError("Failed to save swap. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-bold text-black text-lg mb-1">Replace a Withdrawn Player</h2>
        <p className="text-sm text-gray-600">
          If one of your golfers withdraws before completing 36 holes (rounds 1–2), you may swap them for a replacement of equal or lesser salary value.
          {!windowOpen && (
            <span className="block mt-2 font-semibold text-red-600">
              The replacement window is closed — swaps are only available during rounds 1 and 2.
            </span>
          )}
        </p>
      </div>

      {/* Name lookup */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Your Name</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setSearched(false); }}
              placeholder="Enter the name you submitted with"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              style={{ color: "black" }}
            />
            <button
              onClick={() => setSearched(true)}
              disabled={!name.trim()}
              className="px-5 py-2 rounded-lg font-semibold text-white disabled:bg-gray-300"
              style={name.trim() ? { backgroundColor: "#006747" } : {}}
            >
              Find
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && userSubmissions.length === 0 && (
          <p className="text-sm text-red-600">No submissions found for &quot;{name}&quot;. Make sure you enter your name exactly as you submitted it.</p>
        )}

        {userSubmissions.map((sub, si) => {
          const wdSlots = sub.golfers
            .map((gid, idx) => ({ gid, idx }))
            .filter(({ gid }) => getStatus(gid) === "wd");

          return (
            <div key={sub.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 text-white font-semibold text-sm" style={{ backgroundColor: "#006747" }}>
                {userSubmissions.length > 1 ? `Submission ${si + 1}` : "Your Picks"}
              </div>

              {/* Current picks */}
              <div className="divide-y divide-gray-100">
                {sub.golfers.map((gid, idx) => {
                  const golfer = GOLFERS.find((g) => g.id === gid);
                  const status = getStatus(gid);
                  const isWd = status === "wd";
                  const key = `${sub.id}-${idx}`;
                  const alreadySaved = saved[key];
                  const available = isWd ? getAvailableReplacements(sub.golfers, gid) : [];

                  return (
                    <div key={gid} className={`px-4 py-3 ${isWd ? "bg-red-50" : ""}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-black">{golfer?.name ?? gid}</span>
                          {isWd && (
                            <span className="text-[10px] font-bold bg-red-100 text-red-600 rounded px-1">WD</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">${golfer?.salary.toLocaleString()}</span>
                      </div>

                      {isWd && windowOpen && !alreadySaved && (
                        <div className="mt-2 flex gap-2">
                          <select
                            value={replacements[key] ?? ""}
                            onChange={(e) =>
                              setReplacements((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
                            style={{ color: replacements[key] ? "black" : "#9ca3af" }}
                          >
                            <option value="">— Select replacement —</option>
                            {available.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name} — ${g.salary.toLocaleString()}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSwap(sub, idx)}
                            disabled={!replacements[key]}
                            className="px-4 py-1.5 rounded-lg font-semibold text-sm text-white disabled:bg-gray-300"
                            style={replacements[key] ? { backgroundColor: "#006747" } : {}}
                          >
                            Swap
                          </button>
                        </div>
                      )}

                      {isWd && windowOpen && alreadySaved && (
                        <p className="mt-1 text-xs text-green-700 font-semibold">
                          ✓ Swapped for {GOLFERS.find((g) => g.id === replacements[key])?.name}
                        </p>
                      )}

                      {isWd && !windowOpen && (
                        <p className="mt-1 text-xs text-gray-500">Replacement window closed.</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {wdSlots.length === 0 && (
                <p className="px-4 py-3 text-sm text-gray-500">All your golfers are active — no swaps needed.</p>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
