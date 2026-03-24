"use client";

import { useState } from "react";
import { GOLFERS, SALARY_CAP, PICK_COUNT, type Golfer } from "@/lib/golfers";
import db from "@/lib/instantdb";
import { id } from "@instantdb/react";

export default function PickForm() {
  const [playerName, setPlayerName] = useState("");
  const [picks, setPicks] = useState<string[]>(Array(PICK_COUNT).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const selectedGolfers: (Golfer | undefined)[] = picks.map((pid) =>
    GOLFERS.find((g) => g.id === pid)
  );

  const totalSalary = selectedGolfers.reduce(
    (sum, g) => sum + (g?.salary ?? 0),
    0
  );

  const overCap = totalSalary > SALARY_CAP;
  const filledPicks = picks.filter(Boolean);
  const canSubmit =
    playerName.trim() &&
    filledPicks.length === PICK_COUNT &&
    !overCap &&
    new Set(filledPicks).size === PICK_COUNT;

  function getAvailableGolfers(slotIndex: number) {
    const otherPicks = picks.filter((_, i) => i !== slotIndex);
    return GOLFERS.filter((g) => !otherPicks.includes(g.id));
  }

  function handlePick(index: number, value: string) {
    setPicks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await db.transact(
        db.tx.submissions[id()].update({
          playerName: playerName.trim(),
          golfers: picks,
          totalSalary,
          createdAt: Date.now(),
        })
      );
      setSubmitted(true);
    } catch {
      setError("Failed to submit. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">⛳</div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          Picks submitted!
        </h2>
        <p className="text-green-700">
          Good luck, <strong>{playerName}</strong>! Check the leaderboard tab to
          track your score.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Player name */}
      <div>
        <label className="block text-sm font-semibold text-black mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
          style={{ color: "black" }}
        />
      </div>

      {/* Salary cap meter */}
      <div>
        <div className="flex justify-between text-sm font-semibold mb-1">
          <span className="text-black">Salary Used</span>
          <span className={overCap ? "text-red-600" : ""} style={!overCap ? { color: "#006747" } : {}}>
            ${totalSalary.toLocaleString()} / ${SALARY_CAP.toLocaleString()}
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${overCap ? "bg-red-500" : ""}`}
            style={!overCap ? { backgroundColor: "#006747" } : {}}
            style={{
              width: `${Math.min((totalSalary / SALARY_CAP) * 100, 100)}%`,
            }}
          />
        </div>
        {overCap && (
          <p className="text-red-600 text-sm mt-1">
            Over cap by ${(totalSalary - SALARY_CAP).toLocaleString()} — swap a
            golfer to stay under ${SALARY_CAP.toLocaleString()}
          </p>
        )}
      </div>

      {/* Golfer picks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {picks.map((pick, i) => {
          const golfer = GOLFERS.find((g) => g.id === pick);
          return (
            <div key={i}>
              <label className="block text-sm font-semibold text-black mb-1">
                Pick {i + 1}
              </label>
              <select
                value={pick}
                onChange={(e) => handlePick(i, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-white"
                style={{ color: pick ? "black" : "#9ca3af" }}
              >
                <option value="">-- Select golfer --</option>
                {getAvailableGolfers(i).map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} — ${g.salary.toLocaleString()}
                  </option>
                ))}
              </select>
              {golfer && (
                <p className="text-xs text-gray-500 mt-1">
                  Salary: ${golfer.salary.toLocaleString()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
          canSubmit ? "" : "bg-gray-300 cursor-not-allowed"
        }`}
        style={canSubmit ? { backgroundColor: "#006747" } : {}}
      >
        {overCap
          ? "Over Salary Cap"
          : filledPicks.length < PICK_COUNT
          ? `Select ${PICK_COUNT - filledPicks.length} more golfer${
              PICK_COUNT - filledPicks.length !== 1 ? "s" : ""
            }`
          : !playerName.trim()
          ? "Enter your name"
          : "Submit My Picks"}
      </button>
    </form>
  );
}
