import type { CrisisScenario } from "@/types";
import { koreaTeam, mexicoTeam, southAfricaTeam } from "./teams2026";

// Facts (competition, date, stadium, scorer, minute, lineups/substitutions at the moment of
// concession) are sourced from Naver Sports match records for the 2026 World Cup. Individual
// player ability ratings are estimated gameplay figures, not official data.
export const scenarios: CrisisScenario[] = [
  {
    id: "mexico-2026",
    shortTitle: "멕시코전 후반 5분, 이미 0:1로 끌려가는 상황",
    competition: "2026 FIFA 월드컵 조별예선 A조 2차전",
    matchDate: "2026-06-19",
    stadium: "에스타디오 과달라하라",
    koreaTeam,
    opponentTeam: mexicoTeam,
    concedeMinute: 50,
    scorerName: "로모",
    goalDescription:
      "후반 5분, 멕시코의 로모에게 실점해 0:1로 끌려가기 시작했습니다. 이 순간까지 대한민국은 선발 라인업 교체 없이 그대로 경기를 치렀습니다. 지금부터 40분, 전술을 바꿔 역전을 노릴 수 있을까요?",
    // No substitutions confirmed before the goal — squad = the starting XI only.
    koreaSquadIds: [
      "kor-kimseunggyu",
      "kor-leehanbeom",
      "kor-kimminjae",
      "kor-leegihyeok",
      "kor-kimmoonhwan",
      "kor-hwanginbeom",
      "kor-baekseungho",
      "kor-seolyoungwoo",
      "kor-leejaesung",
      "kor-leekangin",
      "kor-son",
    ],
    koreaFormationId: "3-4-2-1",
    koreaLineup: {
      0: "kor-kimseunggyu",
      1: "kor-leehanbeom",
      2: "kor-kimminjae",
      3: "kor-leegihyeok",
      4: "kor-kimmoonhwan",
      5: "kor-hwanginbeom",
      6: "kor-baekseungho",
      7: "kor-seolyoungwoo",
      8: "kor-leejaesung",
      9: "kor-leekangin",
      10: "kor-son",
    },
    opponentFormationId: "4-3-3",
    opponentLineup: {
      0: "mex-rangel",
      1: "mex-sanchez",
      2: "mex-alvarez",
      3: "mex-vazquez",
      4: "mex-gallardo",
      5: "mex-lira",
      6: "mex-gutierrez",
      7: "mex-romo",
      8: "mex-alvarado",
      9: "mex-jimenez",
      10: "mex-quinones",
    },
  },
  {
    id: "southafrica-2026",
    shortTitle: "남아공전 후반 18분, 이미 0:1로 끌려가는 상황",
    competition: "2026 FIFA 월드컵 조별예선 A조 3차전",
    matchDate: "2026-06-25",
    stadium: "몬테레이 스타디움",
    koreaTeam,
    opponentTeam: southAfricaTeam,
    concedeMinute: 63,
    scorerName: "마세코",
    assistName: "체팡 모레미",
    substitutionNote:
      "하프타임에 황희찬→손흥민, 백승호→김진규, 이태석→옌스 카스트로프 교체가 이미 반영된 상태입니다.",
    goalDescription:
      "62분 남아공이 아폴리스를 빼고 체팡 모레미를 투입한 직후, 63분 빠른 역습 상황에서 모레미의 어시스트를 받은 마세코가 박스 중앙에서 왼발 슛으로 실점을 만들며 0:1이 됐습니다. 지금부터 27분, 전술을 바꿔 역전을 노릴 수 있을까요?",
    // Post-halftime-sub XI, plus the 3 players confirmed subbed off at halftime (still valid
    // bench options since they're confirmed to have started this match).
    koreaSquadIds: [
      "kor-kimseunggyu",
      "kor-leehanbeom",
      "kor-kimminjae",
      "kor-leegihyeok",
      "kor-seolyoungwoo",
      "kor-kimjingyu",
      "kor-hwanginbeom",
      "kor-castrop",
      "kor-leekangin",
      "kor-son",
      "kor-ohhyeongyu",
      "kor-hwangheechan",
      "kor-baekseungho",
      "kor-leetaeseok",
    ],
    koreaFormationId: "3-4-2-1",
    koreaLineup: {
      0: "kor-kimseunggyu",
      1: "kor-leehanbeom",
      2: "kor-kimminjae",
      3: "kor-leegihyeok",
      4: "kor-seolyoungwoo",
      5: "kor-kimjingyu",
      6: "kor-hwanginbeom",
      7: "kor-castrop",
      8: "kor-leekangin",
      9: "kor-son",
      10: "kor-ohhyeongyu",
    },
    opponentFormationId: "4-2-3-1",
    opponentLineup: {
      0: "rsa-williams",
      1: "rsa-mudau",
      2: "rsa-okon",
      3: "rsa-mbokazi",
      4: "rsa-modiba",
      5: "rsa-mbatha",
      6: "rsa-sithole",
      7: "rsa-mofokeng",
      8: "rsa-maseko",
      9: "rsa-moremi",
      10: "rsa-makgopa",
    },
  },
];

export function getScenario(id: string): CrisisScenario {
  const s = scenarios.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown scenario: ${id}`);
  return s;
}
