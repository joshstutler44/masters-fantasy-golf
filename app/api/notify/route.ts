import { NextResponse } from "next/server";
import { Resend } from "resend";
import { GOLFERS } from "@/lib/golfers";

// Switch to 401811941 for The Masters
const EVENT_ID = "401811939";

// DraftKings name → salary lookup (multiple normalized aliases per player for fuzzy matching)
const DK_SALARIES: Record<string, { name: string; salary: number }> = {
  "scottie scheffler":             { name: "Scottie Scheffler",             salary: 14800 },
  "min woo lee":                   { name: "Min Woo Lee",                   salary: 9900  },
  "chris gotterup":                { name: "Chris Gotterup",                salary: 9800  },
  "sam burns":                     { name: "Sam Burns",                     salary: 9700  },
  "brooks koepka":                 { name: "Brooks Koepka",                 salary: 9600  },
  "jake knapp":                    { name: "Jake Knapp",                    salary: 9500  },
  "rickie fowler":                 { name: "Rickie Fowler",                 salary: 9400  },
  "kurt kitayama":                 { name: "Kurt Kitayama",                 salary: 9300  },
  "nicolai hojgaard":              { name: "Nicolai Hojgaard",              salary: 9200  },
  "marco penge":                   { name: "Marco Penge",                   salary: 9100  },
  "adam scott":                    { name: "Adam Scott",                    salary: 9000  },
  "harris english":                { name: "Harris English",                salary: 8900  },
  "ben griffin":                   { name: "Ben Griffin",                   salary: 8800  },
  "shane lowry":                   { name: "Shane Lowry",                   salary: 8700  },
  "michael thorbjornsen":          { name: "Michael Thorbjornsen",          salary: 8600  },
  "harry hall":                    { name: "Harry Hall",                    salary: 8500  },
  "ryan gerard":                   { name: "Ryan Gerard",                   salary: 8400  },
  "wyndham clark":                 { name: "Wyndham Clark",                 salary: 8300  },
  "keith mitchell":                { name: "Keith Mitchell",                salary: 8200  },
  "rasmus hojgaard":               { name: "Rasmus Hojgaard",               salary: 8100  },
  "jason day":                     { name: "Jason Day",                     salary: 8000  },
  "pierceson coody":               { name: "Pierceson Coody",               salary: 8000  },
  "sam stevens":                   { name: "Sam Stevens",                   salary: 7900  },
  "taylor pendrith":               { name: "Taylor Pendrith",               salary: 7900  },
  "alex smalley":                  { name: "Alex Smalley",                  salary: 7800  },
  "stephan jaeger":                { name: "Stephan Jaeger",                salary: 7800  },
  "aaron rai":                     { name: "Aaron Rai",                     salary: 7700  },
  "will zalatoris":                { name: "Will Zalatoris",                salary: 7700  },
  "sahith theegala":               { name: "Sahith Theegala",               salary: 7600  },
  "tony finau":                    { name: "Tony Finau",                    salary: 7600  },
  "patrick rodgers":               { name: "Patrick Rodgers",               salary: 7600  },
  "sungjae im":                    { name: "Sungjae Im",                    salary: 7500  },
  "davis thompson":                { name: "Davis Thompson",                salary: 7500  },
  "ricky castillo":                { name: "Ricky Castillo",                salary: 7500  },
  "max greyserman":                { name: "Max Greyserman",                salary: 7400  },
  "jordan l. smith":               { name: "Jordan L. Smith",               salary: 7400  },
  "jordan smith":                  { name: "Jordan L. Smith",               salary: 7400  },
  "ryan fox":                      { name: "Ryan Fox",                      salary: 7400  },
  "gary woodland":                 { name: "Gary Woodland",                 salary: 7400  },
  "kristoffer reitan":             { name: "Kristoffer Reitan",             salary: 7300  },
  "rico hoey":                     { name: "Rico Hoey",                     salary: 7300  },
  "hao-tong li":                   { name: "Hao-Tong Li",                   salary: 7300  },
  "haotong li":                    { name: "Hao-Tong Li",                   salary: 7300  },
  "nicolas echavarria":            { name: "Nicolas Echavarria",            salary: 7300  },
  "nico echavarria":               { name: "Nicolas Echavarria",            salary: 7300  },
  "j.t. poston":                   { name: "J.T. Poston",                   salary: 7300  },
  "thorbjorn olesen":              { name: "Thorbjorn Olesen",              salary: 7200  },
  "aldrich potgieter":             { name: "Aldrich Potgieter",             salary: 7200  },
  "michael brennan":               { name: "Michael Brennan",               salary: 7200  },
  "matthew mccarty":               { name: "Matthew McCarty",               salary: 7200  },
  "sudarshan yellamaraju":         { name: "Sudarshan Yellamaraju",         salary: 7200  },
  "doug ghim":                     { name: "Doug Ghim",                     salary: 7200  },
  "christiaan bezuidenhout":       { name: "Christiaan Bezuidenhout",       salary: 7100  },
  "adrien dumont de chassart":     { name: "Adrien Dumont De Chassart",     salary: 7100  },
  "mackenzie hughes":              { name: "Mackenzie Hughes",              salary: 7100  },
  "tom kim":                       { name: "Tom Kim",                       salary: 7100  },
  "matti schmid":                  { name: "Matti Schmid",                  salary: 7100  },
  "seamus power":                  { name: "Seamus Power",                  salary: 7100  },
  "lee hodges":                    { name: "Lee Hodges",                    salary: 7000  },
  "rasmus neergaard-petersen":     { name: "Rasmus Neergaard-Petersen",     salary: 7000  },
  "eric cole":                     { name: "Eric Cole",                     salary: 7000  },
  "mac meissner":                  { name: "Mac Meissner",                  salary: 7000  },
  "denny mccarthy":                { name: "Denny McCarthy",                salary: 7000  },
  "john parry":                    { name: "John Parry",                    salary: 7000  },
  "kris ventura":                  { name: "Kris Ventura",                  salary: 7000  },
  "matt wallace":                  { name: "Matt Wallace",                  salary: 6900  },
  "bud cauley":                    { name: "Bud Cauley",                    salary: 6900  },
  "max mcgreevy":                  { name: "Max McGreevy",                  salary: 6900  },
  "william mouw":                  { name: "William Mouw",                  salary: 6900  },
  "seonghyeon kim":                { name: "Seonghyeon Kim",                salary: 6900  },
  "s.h. kim":                      { name: "Seonghyeon Kim",                salary: 6900  },
  "kevin roy":                     { name: "Kevin Roy",                     salary: 6900  },
  "jesper svensson":               { name: "Jesper Svensson",               salary: 6800  },
  "billy horschel":                { name: "Billy Horschel",                salary: 6800  },
  "chris kirk":                    { name: "Chris Kirk",                    salary: 6800  },
  "emiliano grillo":               { name: "Emiliano Grillo",               salary: 6800  },
  "chandler blanchet":             { name: "Chandler Blanchet",             salary: 6800  },
  "david lipsky":                  { name: "David Lipsky",                  salary: 6800  },
  "kevin yu":                      { name: "Kevin Yu",                      salary: 6700  },
  "chad ramey":                    { name: "Chad Ramey",                    salary: 6700  },
  "daniel brown":                  { name: "Daniel Brown",                  salary: 6700  },
  "dan brown":                     { name: "Daniel Brown",                  salary: 6700  },
  "david ford":                    { name: "David Ford",                    salary: 6700  },
  "vince whaley":                  { name: "Vince Whaley",                  salary: 6700  },
  "john keefer":                   { name: "John Keefer",                   salary: 6700  },
  "johnny keefer":                 { name: "John Keefer",                   salary: 6700  },
  "austin eckroat":                { name: "Austin Eckroat",                salary: 6700  },
  "andrew putnam":                 { name: "Andrew Putnam",                 salary: 6700  },
  "alejandro tosti":               { name: "Alejandro Tosti",               salary: 6600  },
  "steven fisk":                   { name: "Steven Fisk",                   salary: 6600  },
  "garrick higgo":                 { name: "Garrick Higgo",                 salary: 6600  },
  "zecheng dou":                   { name: "Zecheng Dou",                   salary: 6600  },
  "matthieu pavon":                { name: "Matthieu Pavon",                salary: 6600  },
  "a.j. ewart":                    { name: "A.J. Ewart",                    salary: 6600  },
  "aj ewart":                      { name: "A.J. Ewart",                    salary: 6600  },
  "dylan wu":                      { name: "Dylan Wu",                      salary: 6600  },
  "beau hossler":                  { name: "Beau Hossler",                  salary: 6500  },
  "lucas glover":                  { name: "Lucas Glover",                  salary: 6500  },
  "tom hoge":                      { name: "Tom Hoge",                      salary: 6500  },
  "zachary bauchou":               { name: "Zachary Bauchou",               salary: 6500  },
  "zach bauchou":                  { name: "Zachary Bauchou",               salary: 6500  },
  "luke clanton":                  { name: "Luke Clanton",                  salary: 6500  },
  "isaiah salinda":                { name: "Isaiah Salinda",                salary: 6500  },
  "takumi kanaya":                 { name: "Takumi Kanaya",                 salary: 6500  },
  "jhonattan vegas":               { name: "Jhonattan Vegas",               salary: 6400  },
  "adrien saddier":                { name: "Adrien Saddier",                salary: 6400  },
  "gordon sargent":                { name: "Gordon Sargent",                salary: 6400  },
  "mark hubbard":                  { name: "Mark Hubbard",                  salary: 6400  },
  "chandler phillips":             { name: "Chandler Phillips",             salary: 6400  },
  "davis riley":                   { name: "Davis Riley",                   salary: 6400  },
  "adam svensson":                 { name: "Adam Svensson",                 salary: 6400  },
  "sam ryder":                     { name: "Sam Ryder",                     salary: 6400  },
  "patrick fishburn":              { name: "Patrick Fishburn",              salary: 6300  },
  "christo lamprecht":             { name: "Christo Lamprecht",             salary: 6300  },
  "mason howell":                  { name: "Mason Howell",                  salary: 6300  },
  "neal shipley":                  { name: "Neal Shipley",                  salary: 6300  },
  "john vanderlaan":               { name: "John VanDerLaan",               salary: 6300  },
  "danny walker":                  { name: "Danny Walker",                  salary: 6300  },
  "hank lebioda":                  { name: "Hank Lebioda",                  salary: 6300  },
  "jimmy stanger":                 { name: "Jimmy Stanger",                 salary: 6300  },
  "jackson suber":                 { name: "Jackson Suber",                 salary: 6300  },
  "karl vilips":                   { name: "Karl Vilips",                   salary: 6200  },
  "bronson burgoon":               { name: "Bronson Burgoon",               salary: 6200  },
  "cole hammer":                   { name: "Cole Hammer",                   salary: 6200  },
  "trey mullinax":                 { name: "Trey Mullinax",                 salary: 6200  },
  "pontus nyholm":                 { name: "Pontus Nyholm",                 salary: 6200  },
  "erik van rooyen":               { name: "Erik Van Rooyen",               salary: 6200  },
  "kensei hirata":                 { name: "Kensei Hirata",                 salary: 6200  },
  "joe highsmith":                 { name: "Joe Highsmith",                 salary: 6200  },
  "davis chatfield":               { name: "Davis Chatfield",               salary: 6100  },
  "patton kizzire":                { name: "Patton Kizzire",                salary: 6100  },
  "nick dunlap":                   { name: "Nick Dunlap",                   salary: 6100  },
  "brian campbell":                { name: "Brian Campbell",                salary: 6100  },
  "brice garnett":                 { name: "Brice Garnett",                 salary: 6100  },
  "kyoung-hoon lee":               { name: "Kyoung-Hoon Lee",               salary: 6100  },
  "k.h. lee":                      { name: "Kyoung-Hoon Lee",               salary: 6100  },
  "kh lee":                        { name: "Kyoung-Hoon Lee",               salary: 6100  },
  "peter malnati":                 { name: "Peter Malnati",                 salary: 6100  },
  "marcelo rozo":                  { name: "Marcelo Rozo",                  salary: 6100  },
  "danny willett":                 { name: "Danny Willett",                 salary: 6000  },
  "adam schenk":                   { name: "Adam Schenk",                   salary: 6000  },
  "jeffrey kang":                  { name: "Jeffrey Kang",                  salary: 6000  },
  "casey russell":                 { name: "Casey Russell",                 salary: 6000  },
  "paul waring":                   { name: "Paul Waring",                   salary: 6000  },
  "aaron wise":                    { name: "Aaron Wise",                    salary: 6000  },
  "charley hoffman":               { name: "Charley Hoffman",               salary: 6000  },
  "rafael campos":                 { name: "Rafael Campos",                 salary: 6000  },
};

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents (ø→o, é→e, etc.)
    .replace(/[^a-z0-9. ]/g, "")
    .trim();
}

function lookupDkSalary(espnName: string): { name: string; salary: number } | null {
  return DK_SALARIES[normalizeName(espnName)] ?? null;
}

export async function GET() {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?event=${EVENT_ID}`,
      { cache: "no-store" }
    );
    const data = await res.json();

    const event = data?.events?.[0];
    const competitors: { id: string; athlete: { fullName: string } }[] =
      event?.competitions?.[0]?.competitors ?? [];
    const state = event?.status?.type?.state ?? "pre";
    const tournamentStarted = state === "in" || state === "post";

    if (!tournamentStarted) {
      return NextResponse.json({ message: "Tournament not started yet — no check needed." });
    }

    // ESPN lookup maps
    const espnById = new Map(competitors.map((c) => [c.id, c.athlete.fullName]));
    const espnByNormalizedName = new Map(
      competitors.map((c) => [normalizeName(c.athlete.fullName), c.id])
    );

    // Our player ESPN ID set
    const ourEspnIds = new Set(GOLFERS.map((g) => g.espnId));
    const ourNormalizedNames = new Set(GOLFERS.map((g) => normalizeName(g.name)));

    // 1. ESPN players not in our list (need to add)
    const inEspnNotOurs: { espnId: string; espnName: string; dkSalary: number | null; dkName: string | null }[] = [];
    for (const [espnId, fullName] of espnById) {
      const inById = ourEspnIds.has(espnId);
      const inByName = ourNormalizedNames.has(normalizeName(fullName));
      if (!inById && !inByName) {
        const dk = lookupDkSalary(fullName);
        inEspnNotOurs.push({
          espnId,
          espnName: fullName,
          dkSalary: dk?.salary ?? null,
          dkName: dk?.name ?? null,
        });
      }
    }

    // 2. Our players not in ESPN (possible WD or late scratch)
    const inOursNotEspn = GOLFERS.filter((g) => {
      return !espnById.has(g.espnId) && !espnByNormalizedName.has(normalizeName(g.name));
    });

    const hasIssues = inEspnNotOurs.length > 0 || inOursNotEspn.length > 0;

    if (!hasIssues) {
      return NextResponse.json({ message: "All players match. No issues found." });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
    }

    const resend = new Resend(resendKey);

    const espnNotOursHtml = inEspnNotOurs.length === 0
      ? "<p>None ✅</p>"
      : `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
          <thead><tr><th>ESPN ID</th><th>ESPN Name</th><th>DK Salary (to add)</th></tr></thead>
          <tbody>
            ${inEspnNotOurs.map((p) => `
              <tr>
                <td>${p.espnId}</td>
                <td>${p.espnName}</td>
                <td>${p.dkSalary != null ? `$${p.dkSalary.toLocaleString()} as "${p.dkName}"` : "⚠️ Not found in DK list"}</td>
              </tr>`).join("")}
          </tbody>
        </table>`;

    const oursNotEspnHtml = inOursNotEspn.length === 0
      ? "<p>None ✅</p>"
      : `<ul>
          ${inOursNotEspn.map((g) => `<li><strong>${g.name}</strong> — ESPN ID: ${g.espnId}, salary: $${g.salary.toLocaleString()}</li>`).join("")}
        </ul>`;

    await resend.emails.send({
      from: "Masters Fantasy Golf <onboarding@resend.dev>",
      to: "joshstutler44@gmail.com",
      subject: `⚠️ Player field mismatch detected (${inEspnNotOurs.length} to add, ${inOursNotEspn.length} missing)`,
      html: `
        <h2>Masters Fantasy Golf — Field Mismatch Alert</h2>
        <p>The tournament is active. A comparison between ESPN's live field and your player list found discrepancies.</p>

        <h3>🔴 On ESPN but NOT in your list — add these players</h3>
        ${espnNotOursHtml}

        <h3>🟡 In your list but NOT on ESPN — possible withdrawal or late scratch</h3>
        ${oursNotEspnHtml}

        <p style="color:#666;font-size:12px;">This alert was sent automatically by the Masters Fantasy Golf app cron job.</p>
      `,
    });

    return NextResponse.json({
      message: "Alert sent.",
      inEspnNotOurs,
      inOursNotEspn: inOursNotEspn.map((g) => ({ name: g.name, espnId: g.espnId })),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
