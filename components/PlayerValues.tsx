"use client";

import { GOLFERS } from "@/lib/golfers";

export default function PlayerValues() {
  const sorted = [...GOLFERS].sort((a, b) => b.salary - a.salary);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-white" style={{ backgroundColor: "#006747" }}>
            <tr>
              <th className="px-4 py-3 font-semibold w-10">#</th>
              <th className="px-4 py-3 font-semibold" style={{ borderLeft: "2px solid white" }}>PLAYER</th>
              <th className="px-4 py-3 font-semibold text-right" style={{ borderLeft: "2px solid white" }}>SALARY</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((golfer, i) => (
              <tr key={golfer.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 text-gray-400 font-bold">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-black">{golfer.name}</td>
                <td className="px-4 py-3 text-right font-semibold text-black">
                  ${golfer.salary.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
