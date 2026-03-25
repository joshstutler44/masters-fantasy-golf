import { NextResponse } from "next/server";

// Switch this ID to 401811941 when The Masters begins
const EVENT_ID = "401811939"; // Texas Children's Houston Open

function parseScore(scoreStr: string): number {
  if (!scoreStr || scoreStr === "E") return 0;
  return parseInt(scoreStr, 10) || 0;
}

export async function GET() {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?event=${EVENT_ID}`,
      { next: { revalidate: 60 } } // cache for 60 seconds
    );
    const data = await res.json();

    const competitors = data?.events?.[0]?.competitions?.[0]?.competitors ?? [];

    const scores: Record<string, { score: number; position: string; name: string }> = {};

    competitors.forEach((c: { id: string; order: number; score: string; athlete: { fullName: string } }) => {
      scores[c.id] = {
        score: parseScore(c.score),
        position: String(c.order),
        name: c.athlete.fullName,
      };
    });

    return NextResponse.json(scores);
  } catch {
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
