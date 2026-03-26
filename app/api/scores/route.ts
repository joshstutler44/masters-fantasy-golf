import { NextResponse } from "next/server";

// Switch this ID to 401811941 when The Masters begins
const EVENT_ID = "401811939"; // Texas Children's Houston Open

function parseScore(scoreStr: string): number {
  if (!scoreStr || scoreStr === "E") return 0;
  return parseInt(scoreStr, 10) || 0;
}

type PlayerStatus = "active" | "cut" | "wd";

function parseStatus(statusName: string | undefined): PlayerStatus {
  if (!statusName) return "active";
  const n = statusName.toUpperCase();
  if (n.includes("CUT")) return "cut";
  if (n.includes("WITHDRAW") || n === "STATUS_WD") return "wd";
  return "active";
}

// Returns "F" (finished round), "1"-"17" (thru that hole), or "-" (not started)
function parseThru(
  linescores: { period: number; linescores?: unknown[] }[],
  currentRound: number
): string {
  const roundLs = linescores.find((ls) => ls.period === currentRound);
  if (!roundLs) return "-";
  const holesCompleted = roundLs.linescores?.length ?? 0;
  if (holesCompleted === 0) return "-";
  if (holesCompleted >= 18) return "F";
  return String(holesCompleted);
}

export async function GET() {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?event=${EVENT_ID}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();

    const event = data?.events?.[0];
    const competition = event?.competitions?.[0];
    const competitors = competition?.competitors ?? [];
    const state = event?.status?.type?.state ?? "pre";
    const tournamentStarted = state === "in" || state === "post";
    // period lives on competition.status, not event.status
    const currentRound: number = competition?.status?.period ?? 1;

    const scores: Record<string, {
      score: number;
      position: string;
      name: string;
      status: PlayerStatus;
      thru: string;
    }> = {};

    competitors.forEach((c: {
      id: string;
      order: number;
      score: string;
      athlete: { fullName: string };
      status?: { type?: { name?: string } };
      linescores?: { period: number; linescores?: unknown[] }[];
    }) => {
      scores[c.id] = {
        score: parseScore(c.score),
        position: String(c.order),
        name: c.athlete.fullName,
        status: parseStatus(c.status?.type?.name),
        thru: parseThru(c.linescores ?? [], currentRound),
      };
    });

    return NextResponse.json({ scores, tournamentStarted, currentRound });
  } catch {
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
