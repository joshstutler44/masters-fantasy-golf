import { NextResponse } from "next/server";
import { Resend } from "resend";

const EVENT_ID = "401811939"; // Switch to 401811941 for The Masters

// ESPN IDs for the two players to watch
const WATCH_PLAYERS = [
  { espnId: "5338",    name: "Bud Cauley" },
  { espnId: "4901368", name: "Matthew McCarty" },
];

function parseScore(scoreStr: string): number {
  if (!scoreStr || scoreStr === "E") return 0;
  return parseInt(scoreStr, 10) || 0;
}

export async function GET() {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?event=${EVENT_ID}`,
      { cache: "no-store" }
    );
    const data = await res.json();

    const event = data?.events?.[0];
    const competitors: { id: string; score: string; athlete: { fullName: string } }[] =
      event?.competitions?.[0]?.competitors ?? [];
    const state = event?.status?.type?.state ?? "pre";
    const tournamentStarted = state === "in" || state === "post";

    // Only check once tournament has started
    if (!tournamentStarted) {
      return NextResponse.json({ message: "Tournament not started yet — no check needed." });
    }

    const espnIds = new Set(competitors.map((c) => c.id));

    const missing = WATCH_PLAYERS.filter((p) => !espnIds.has(p.espnId));

    if (missing.length === 0) {
      return NextResponse.json({ message: "All watched players are present in ESPN data." });
    }

    // Send email alert
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const names = missing.map((p) => p.name).join(" and ");

    await resend.emails.send({
      from: "Masters Fantasy Golf <onboarding@resend.dev>",
      to: "joshstutler44@gmail.com",
      subject: `⚠️ Missing player alert: ${names}`,
      html: `
        <h2>Masters Fantasy Golf — Player Alert</h2>
        <p>The tournament has started but the following player(s) were <strong>not found</strong> in the ESPN leaderboard data:</p>
        <ul>
          ${missing.map((p) => `<li><strong>${p.name}</strong> (ESPN ID: ${p.espnId})</li>`).join("")}
        </ul>
        <p>These players were added manually. You may want to verify their status and update the app if needed.</p>
        <p style="color: #666; font-size: 12px;">This alert was sent automatically by the Masters Fantasy Golf app.</p>
      `,
    });

    return NextResponse.json({
      message: `Alert sent for missing players: ${names}`,
      missing,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
