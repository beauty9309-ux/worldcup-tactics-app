import type { Player, Position } from "@/types";

// Deterministic PRNG so secondary stats stay stable across renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  return h;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function deriveStats(position: Position, overall: number, seedKey: string) {
  const rng = mulberry32(hashSeed(seedKey));
  const jitter = () => Math.round((rng() - 0.5) * 8);
  const isDef = position === "CB" || position === "LB" || position === "RB" || position === "CDM";
  const isAtt = position === "ST" || position === "LW" || position === "RW" || position === "CF" || position === "CAM";
  const isGK = position === "GK";

  return {
    pace: clamp(overall + (isAtt ? 3 : isDef ? -5 : -1) + jitter(), 40, 99),
    shooting: clamp(overall + (isAtt ? 7 : isDef ? -18 : -6) + jitter(), 25, 99),
    passing: clamp(overall + (position === "CM" || position === "CAM" ? 5 : -3) + jitter(), 40, 99),
    dribbling: clamp(overall + (isAtt ? 5 : isDef ? -8 : 0) + jitter(), 35, 99),
    defending: clamp(isGK ? 20 : overall + (isDef ? 9 : isAtt ? -20 : -5) + jitter(), 20, 99),
    physical: clamp(overall + jitter(), 45, 99),
  };
}

interface RawPlayer {
  id: string;
  name: string;
  /** Real 2026 World Cup squad shirt number (source: openfootball/worldcup.json). */
  number: number;
  position: Position;
  overall: number;
}

function build(teamId: string, list: RawPlayer[]): Player[] {
  return list.map((p) => ({
    id: `${teamId}-${p.id}`,
    name: p.name,
    number: p.number,
    position: p.position,
    teamId,
    overall: p.overall,
    ...deriveStats(p.position, p.overall, `${teamId}-${p.id}`),
  }));
}

// Names, shirt numbers, positions are the real confirmed 2026 World Cup 26-man squad
// (source: openfootball/worldcup.json). On-pitch presence at the exact scenario moments
// (who started, who was subbed on/off) is drawn from Naver Sports match data — see
// `koreaSquadIds` per scenario in scenarios.ts for which subset is treated as "confirmed to
// have appeared in that specific match" vs. "real squad member, available as a bench option".
// Ability ratings (overall/pace/shooting/etc.) are estimated gameplay figures, not official data.
export const koreaPlayers = build("kor", [
  { id: "son", name: "손흥민", number: 7, position: "CAM", overall: 89 },
  { id: "kimminjae", name: "김민재", number: 4, position: "CB", overall: 87 },
  { id: "leekangin", name: "이강인", number: 19, position: "CAM", overall: 86 },
  { id: "hwangheechan", name: "황희찬", number: 11, position: "CAM", overall: 83 },
  { id: "hwanginbeom", name: "황인범", number: 6, position: "CM", overall: 82 },
  { id: "leejaesung", name: "이재성", number: 10, position: "CAM", overall: 81 },
  { id: "chogyusung", name: "조규성", number: 9, position: "ST", overall: 79 },
  { id: "kimseunggyu", name: "김승규", number: 1, position: "GK", overall: 79 },
  { id: "seolyoungwoo", name: "설영우", number: 22, position: "LM", overall: 79 },
  { id: "yanghyunjun", name: "양현준", number: 20, position: "LM", overall: 78 },
  { id: "johyunwoo", name: "조현우", number: 21, position: "GK", overall: 78 },
  { id: "baekseungho", name: "백승호", number: 8, position: "CM", overall: 78 },
  { id: "castrop", name: "옌스 카스트로프", number: 23, position: "CM", overall: 78 },
  { id: "ohhyeongyu", name: "오현규", number: 18, position: "ST", overall: 77 },
  { id: "leehanbeom", name: "이한범", number: 2, position: "CB", overall: 76 },
  { id: "kimmoonhwan", name: "김문환", number: 15, position: "RM", overall: 76 },
  { id: "baejunho", name: "배준호", number: 17, position: "RM", overall: 76 },
  { id: "kimjingyu", name: "김진규", number: 24, position: "CM", overall: 75 },
  { id: "leegihyeok", name: "이기혁", number: 3, position: "CB", overall: 75 },
  { id: "songbumkeun", name: "송범근", number: 12, position: "GK", overall: 75 },
  { id: "eomjisung", name: "엄지성", number: 25, position: "RW", overall: 75 },
  { id: "leetaeseok", name: "이태석", number: 13, position: "CM", overall: 74 },
  { id: "kimtaehyun", name: "김태현", number: 5, position: "CB", overall: 74 },
  { id: "parkjinseob", name: "박진섭", number: 16, position: "LB", overall: 74 },
  { id: "leedonggyeong", name: "이동경", number: 26, position: "CM", overall: 74 },
  { id: "chowije", name: "조위제", number: 14, position: "CB", overall: 73 },
]);

export const mexicoPlayers = build("mex", [
  { id: "jimenez", name: "라울 히메네스", number: 9, position: "ST", overall: 82 },
  { id: "quinones", name: "퀴뇨네스", number: 16, position: "RW", overall: 80 },
  { id: "romo", name: "로모", number: 7, position: "CM", overall: 81 },
  { id: "gallardo", name: "가야르도", number: 23, position: "RB", overall: 79 },
  { id: "lira", name: "리라", number: 6, position: "CM", overall: 79 },
  { id: "alvarado", name: "알바라도", number: 25, position: "LW", overall: 78 },
  { id: "alvarez", name: "알바레스", number: 4, position: "CB", overall: 78 },
  { id: "gutierrez", name: "구티에레스", number: 26, position: "CDM", overall: 78 },
  { id: "rangel", name: "랑헬", number: 1, position: "GK", overall: 78 },
  { id: "vazquez", name: "바스케스", number: 5, position: "CB", overall: 77 },
  { id: "sanchez", name: "산체스", number: 2, position: "LB", overall: 77 },
]);

export const southAfricaPlayers = build("rsa", [
  { id: "maseko", name: "마세코", number: 12, position: "CAM", overall: 80 },
  { id: "makgopa", name: "막고파", number: 17, position: "ST", overall: 77 },
  { id: "moremi", name: "체팡 모레미", number: 8, position: "CAM", overall: 76 },
  { id: "mofokeng", name: "모포켕", number: 10, position: "CAM", overall: 76 },
  { id: "sithole", name: "시톨레", number: 13, position: "CM", overall: 75 },
  { id: "appollis", name: "아폴리스", number: 7, position: "CAM", overall: 75 },
  { id: "mbatha", name: "음바타", number: 5, position: "CM", overall: 74 },
  { id: "modiba", name: "모디바", number: 6, position: "CB", overall: 74 },
  { id: "okon", name: "오콘", number: 21, position: "CB", overall: 74 },
  { id: "williams", name: "윌리엄스", number: 1, position: "GK", overall: 74 },
  { id: "mbokazi", name: "음보카지", number: 14, position: "CB", overall: 75 },
  { id: "mudau", name: "무다우", number: 20, position: "RB", overall: 73 },
]);

export const allScenarioPlayers = [...koreaPlayers, ...mexicoPlayers, ...southAfricaPlayers];

export function getScenarioPlayer(id: string): Player {
  const p = allScenarioPlayers.find((p) => p.id === id);
  if (!p) throw new Error(`Unknown scenario player: ${id}`);
  return p;
}
