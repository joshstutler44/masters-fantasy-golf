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

export async function GET() {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?event=${EVENT_ID}`,
      { next: { revalidate: 60 } } // cache for 60 seconds
    );
    const data = await res.json();

    const event = data?.events?.[0];
    const competitors = event?.competitions?.[0]?.competitors ?? [];
    const state = event?.status?.type?.state ?? "pre"; // "pre" | "in" | "post"
    const tournamentStarted = state === "in" || state === "post";
    const currentRound: number = event?.status?.period ?? 1;

    const scores: Record<string, { score: number; position: string; name: string; status: PlayerStatus }> = {};

    competitors.forEach((c: {
      id: string;
      order: number;
      score: string;
      athlete: { fullName: string };
      status?: { type?: { name?: string } };
    }) => {
      scores[c.id] = {
        score: parseScore(c.score),
        position: String(c.order),
        name: c.athlete.fullName,
        status: parseStatus(c.status?.type?.name),
      };
    });

    return NextResponse.json({ scores, tournamentStarted, currentRound });
  } catch {
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
