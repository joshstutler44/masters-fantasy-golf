// Mock live scores — replace with a real golf API when available.
// Score = strokes relative to par (negative = under par, positive = over par)
export type GolferScore = {
  id: string;
  score: number | null; // null = not yet started / withdrawn
  position: string;
};

export const MOCK_SCORES: Record<string, GolferScore> = {
  scheffler:  { id: "scheffler",  score: -10, position: "1" },
  mcilroy:    { id: "mcilroy",    score: -8,  position: "2" },
  rahm:       { id: "rahm",       score: -7,  position: "3" },
  koepka:     { id: "koepka",     score: -5,  position: "T4" },
  fleetwood:  { id: "fleetwood",  score: -5,  position: "T4" },
  morikawa:   { id: "morikawa",   score: -4,  position: "T6" },
  thomas:     { id: "thomas",     score: -3,  position: "T7" },
  fowler:     { id: "fowler",     score: -2,  position: "T9" },
  hovland:    { id: "hovland",    score: -2,  position: "T9" },
  zalatoris:  { id: "zalatoris",  score: -1,  position: "11" },
  niemann:    { id: "niemann",    score: 0,   position: "T12" },
  burns:      { id: "burns",      score: 1,   position: "T14" },
  cantlay:    { id: "cantlay",    score: 1,   position: "T14" },
  lowry:      { id: "lowry",      score: 2,   position: "T17" },
  kim:        { id: "kim",        score: 2,   position: "T17" },
  matsuyama:  { id: "matsuyama",  score: 3,   position: "T20" },
  schauffele: { id: "schauffele", score: 3,   position: "T20" },
  finau:      { id: "finau",      score: 4,   position: "T22" },
  henley:     { id: "henley",     score: 4,   position: "T22" },
  english:    { id: "english",    score: 5,   position: "T24" },
  hoge:       { id: "hoge",       score: 6,   position: "T26" },
  mcnealy:    { id: "mcnealy",    score: 6,   position: "T26" },
  straka:     { id: "straka",     score: 7,   position: "T28" },
  taylor:     { id: "taylor",     score: 7,   position: "T28" },
  young:      { id: "young",      score: 8,   position: "T30" },
  theegala:   { id: "theegala",   score: 9,   position: "31" },
  wu:         { id: "wu",         score: 10,  position: "T32" },
  power:      { id: "power",      score: 10,  position: "T32" },
  mccarthy:   { id: "mccarthy",   score: 12,  position: "34" },
  harman:     { id: "harman",     score: 14,  position: "35" },
};

export function formatScore(score: number | null): string {
  if (score === null) return "—";
  if (score === 0) return "E";
  return score > 0 ? `+${score}` : `${score}`;
}
