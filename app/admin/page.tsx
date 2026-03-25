"use client";

import { useState } from "react";
import db from "@/lib/instantdb";

const ADMIN_PASSWORD = "masters2025";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  const { data } = db.useQuery({ submissions: {} });
  const submissions = Object.values(data?.submissions ?? {});

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission?")) return;
    await db.transact(db.tx.submissions[id].delete());
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-green-50">
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow p-8 w-full max-w-sm space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            style={{ color: "black" }}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold text-white"
            style={{ backgroundColor: "#006747" }}
          >
            Log In
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin — Submissions ({submissions.length})
        </h1>

        {submissions.length === 0 ? (
          <p className="text-gray-500">No submissions yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "#006747" }} className="text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Golfers</th>
                  <th className="px-4 py-3 text-left">Salary</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => (
                  <tr key={sub.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-semibold text-black">{sub.playerName}</td>
                    <td className="px-4 py-3 text-gray-700">{sub.golfers.join(", ")}</td>
                    <td className="px-4 py-3 text-gray-700">${sub.totalSalary?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
