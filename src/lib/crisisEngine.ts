import type { AIRecommendation, CrisisResult, CrisisScenario, Player, Position } from "@/types";
import { getFormation } from "@/data/formations";
import { allScenarioPlayers } from "@/data/players2026";

const POSITION_FALLBACKS: Partial<Record<Position, Position[]>> = {
  GK: ["GK"],
  CB: ["CB", "LB", "RB", "CDM"],
  LB: ["LB", "CB", "LM"],
  RB: ["RB", "CB", "RM"],
  CDM: ["CDM", "CM", "CB"],
  CM: ["CM", "CDM", "CAM"],
  CAM: ["CAM", "CM", "LM", "RM"],
  LM: ["LM", "LW", "LB", "CM"],
  RM: ["RM", "RW", "RB", "CM"],
  LW: ["LW", "LM", "RW", "ST"],
  RW: ["RW", "RM", "LW", "ST"],
  ST: ["ST", "CF", "LW", "RW", "CAM"],
};

// Formation-based tactical modifiers applied to the base team ratings (gameplay heuristic).
const FORMATION_MODS: Record<string, { attack: number; midfield: number; defense: number }> = {
  "3-4-2-1": { attack: 0, midfield: 0, defense: 0 },
  "4-2-3-1": { attack: -2, midfield: 2, defense: 5 },
  "5-3-2": { attack: -6, midfield: -2, defense: 10 },
  "4-3-3": { attack: 6, midfield: 0, defense: -6 },
  "4-4-2": { attack: 2, midfield: -2, defense: 2 },
  "3-5-2": { attack: 0, midfield: 6, defense: -2 },
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// Korean subject particle (이/가) depends on whether the name's last syllable has a batchim
// (final consonant) — team names here are user-facing (opponent name), so pick the right one
// instead of leaving a literal "이(가)" in the sentence.
function withSubjectParticle(name: string): string {
  const lastCode = name.charCodeAt(name.length - 1);
  const hasBatchim = lastCode >= 0xac00 && lastCode <= 0xd7a3 && (lastCode - 0xac00) % 28 !== 0;
  return `${name}${hasBatchim ? "이" : "가"}`;
}

export function remapLineupToFormation(
  currentLineup: Record<number, string>,
  newFormationId: string
): Record<number, string> {
  const formation = getFormation(newFormationId);
  const roster = Object.values(currentLineup)
    .map((id) => allScenarioPlayers.find((p) => p.id === id))
    .filter((p): p is Player => !!p);

  const used = new Set<string>();
  const next: Record<number, string> = {};

  formation.slots.forEach((slot, idx) => {
    const candidates = roster
      .filter((p) => p.position === slot.role && !used.has(p.id))
      .sort((a, b) => b.overall - a.overall);
    if (candidates.length > 0) {
      next[idx] = candidates[0].id;
      used.add(candidates[0].id);
    }
  });

  formation.slots.forEach((slot, idx) => {
    if (next[idx]) return;
    const chain = POSITION_FALLBACKS[slot.role] ?? [slot.role];
    for (const pos of chain) {
      const candidates = roster
        .filter((p) => p.position === pos && !used.has(p.id))
        .sort((a, b) => b.overall - a.overall);
      if (candidates.length > 0) {
        next[idx] = candidates[0].id;
        used.add(candidates[0].id);
        break;
      }
    }
  });

  return next;
}

// The scenario starts right AFTER Korea has already conceded (score is 0-1). Every formation
// choice produces an expected-goals rate for both sides over the remaining minutes; win/draw/loss
// probabilities are the Poisson probability that Korea's additional goals (K) beat the
// opponent's tally, which already includes their 1 banked goal (1+O). Korea needs K >= O+2 to win.
function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poissonPMF(lambda: number, k: number): number {
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

const MAX_GOALS = 10;

function matchOutcomeProbabilities(expectedKorea: number, expectedOpp: number) {
  let win = 0;
  let draw = 0;
  let loss = 0;
  for (let k = 0; k <= MAX_GOALS; k++) {
    const pk = poissonPMF(expectedKorea, k);
    for (let o = 0; o <= MAX_GOALS; o++) {
      const p = pk * poissonPMF(expectedOpp, o);
      const oppFinal = 1 + o;
      if (k > oppFinal) win += p;
      else if (k === oppFinal) draw += p;
      else loss += p;
    }
  }
  return { win: win * 100, draw: draw * 100, loss: loss * 100 };
}

function expectedGoalsFor(scenario: CrisisScenario, formationId: string) {
  const mod = FORMATION_MODS[formationId] ?? { attack: 0, midfield: 0, defense: 0 };
  const kor = scenario.koreaTeam;
  const opp = scenario.opponentTeam;

  const adjAttack = kor.attackRating + mod.attack;
  const adjDefense = kor.defenseRating + mod.defense;
  const remainingMinutes = 90 - scenario.concedeMinute;
  const timeFactor = remainingMinutes / 90;

  // Trailing teams push forward, so Korea's baseline is set higher than the opponent's —
  // reflects both the "score effect" (chasing teams create more chances) and keeps a tactical
  // change feel consequential rather than a near-impossible comeback every time.
  const expectedKoreaGoals = clamp((1.6 + (adjAttack - opp.defenseRating) * 0.05) * timeFactor, 0.1, 4);
  const expectedOppGoals = clamp((0.8 + (opp.attackRating - adjDefense) * 0.05) * timeFactor, 0.1, 3.5);

  return { expectedKoreaGoals, expectedOppGoals, adjAttack, adjDefense, mod };
}

function winProbability(scenario: CrisisScenario, formationId: string): number {
  const { expectedKoreaGoals, expectedOppGoals } = expectedGoalsFor(scenario, formationId);
  const { win } = matchOutcomeProbabilities(expectedKoreaGoals, expectedOppGoals);
  return clamp(Math.round(win), 3, 85);
}

// One-line explanation of what changing from one formation to another actually trades off —
// used on the result screen to justify the "이 포메이션으로 재도전" advice instead of just
// asserting a formation is better.
export function formationShiftHint(fromFormationId: string, toFormationId: string): string {
  const fromMod = FORMATION_MODS[fromFormationId] ?? { attack: 0, midfield: 0, defense: 0 };
  const toMod = FORMATION_MODS[toFormationId] ?? { attack: 0, midfield: 0, defense: 0 };
  const attackDiff = toMod.attack - fromMod.attack;
  const defenseDiff = toMod.defense - fromMod.defense;
  if (attackDiff > 0 && defenseDiff <= 0) return "공격을 더 끌어올리는 대신 수비 부담을 감수하는 쪽";
  if (defenseDiff > 0 && attackDiff <= 0) return "수비를 더 단단히 하는 대신 공격 숫자를 줄이는 쪽";
  return "공격과 수비 균형을 다르게 가져가는 쪽";
}

// The AI coach's suggestion: whichever available formation maximizes the comeback-win
// probability for this scenario. Compared against the manager's (user's) actual choice afterward.
export function getAIRecommendation(scenario: CrisisScenario): AIRecommendation {
  let best: AIRecommendation = {
    formationId: scenario.koreaFormationId,
    winProbability: winProbability(scenario, scenario.koreaFormationId),
  };
  for (const formationId of Object.keys(FORMATION_MODS)) {
    const p = winProbability(scenario, formationId);
    if (p > best.winProbability) best = { formationId, winProbability: p };
  }
  return best;
}

function pickPlayerName(lineup: Record<number, string>, formationId: string, role: Position): string {
  const formation = getFormation(formationId);
  const idx = formation.slots.findIndex((s) => s.role === role);
  if (idx >= 0 && lineup[idx]) {
    const p = allScenarioPlayers.find((pl) => pl.id === lineup[idx]);
    if (p) return p.name;
  }
  return "선수";
}

function simulateGoalCount(expectedGoals: number): number {
  const slices = 8;
  const p = clamp(expectedGoals / slices, 0, 0.9);
  let goals = 0;
  for (let i = 0; i < slices; i++) if (Math.random() < p) goals++;
  return goals;
}

export function runCrisisSimulation(
  scenario: CrisisScenario,
  koreaFormationId: string,
  koreaLineup: Record<number, string>
): CrisisResult {
  const kor = scenario.koreaTeam;
  const opp = scenario.opponentTeam;
  const { expectedKoreaGoals, expectedOppGoals, adjAttack, adjDefense, mod } = expectedGoalsFor(
    scenario,
    koreaFormationId
  );

  const winPct = winProbability(scenario, koreaFormationId);
  const remainingMinutes = 90 - scenario.concedeMinute;

  const extraKoreaGoals = simulateGoalCount(expectedKoreaGoals);
  const extraOppGoals = simulateGoalCount(expectedOppGoals);

  const koreaGoals = extraKoreaGoals;
  const oppGoals = 1 + extraOppGoals;
  const outcome = koreaGoals > oppGoals ? "WIN" : koreaGoals === oppGoals ? "DRAW" : "LOSS";

  const timeline: CrisisResult["timeline"] = [
    {
      minute: scenario.concedeMinute,
      text: `이미 ${scenario.scorerName}에게 실점해 0:1로 끌려가는 상황에서, 지금부터 전술을 바꿔 승부를 겁니다.`,
    },
  ];

  const events: { minute: number; text: string }[] = [];
  for (let i = 0; i < extraKoreaGoals; i++) {
    const minute = scenario.concedeMinute + Math.round(((i + 1) / (extraKoreaGoals + 1)) * remainingMinutes);
    events.push({ minute, text: `${pickPlayerName(koreaLineup, koreaFormationId, "ST")}(대한민국) 득점!` });
  }
  for (let i = 0; i < extraOppGoals; i++) {
    const minute = scenario.concedeMinute + Math.round(((i + 1) / (extraOppGoals + 1)) * remainingMinutes);
    events.push({
      minute,
      text: `${pickPlayerName(scenario.opponentLineup, scenario.opponentFormationId, "ST")}(${scenario.opponentTeam.name}) 추가 득점`,
    });
  }
  events.sort((a, b) => a.minute - b.minute);
  timeline.push(...events);
  timeline.push({
    minute: 90,
    text:
      outcome === "WIN" ? "경기 종료 — 역전승!" : outcome === "DRAW" ? "경기 종료 — 무승부로 마무리" : "경기 종료 — 결국 패배",
  });

  const baselineWinPct = winProbability(scenario, scenario.koreaFormationId);
  const winDiff = winPct - baselineWinPct;
  const aiRecommendation = getAIRecommendation(scenario);
  const followedAI = koreaFormationId === aiRecommendation.formationId;

  const reasons: string[] = [];

  // Lead with the concrete cause of THIS run's scoreline (the random draw), before the
  // probability talk — that's what a player is actually asking when they see WIN/DRAW/LOSS
  // and don't recognize why, since the same formation can land differently each retry.
  reasons.push(
    extraKoreaGoals === extraOppGoals
      ? `이번 시뮬레이션에서는 대한민국과 ${opp.name} 모두 추가로 ${extraKoreaGoals}골씩 넣었습니다.`
      : `이번 시뮬레이션에서는 대한민국이 추가로 ${extraKoreaGoals}골, ${withSubjectParticle(opp.name)} 추가로 ${extraOppGoals}골을 넣어 최종 스코어가 갈렸습니다.`
  );

  if (winDiff > 0) {
    reasons.push(
      `실제 경기(${scenario.koreaFormationId}) 대비 역전 승리 확률이 ${baselineWinPct}%→${winPct}%로 ${winDiff}%p 올랐습니다.`
    );
  } else if (winDiff < 0) {
    reasons.push(
      `실제 경기(${scenario.koreaFormationId}) 대비 역전 승리 확률이 ${baselineWinPct}%→${winPct}%로 ${Math.abs(winDiff)}%p 떨어졌습니다.`
    );
  } else {
    reasons.push(`실제 경기와 동일한 역전 승리 확률(${winPct}%)입니다.`);
  }

  if (mod.attack !== 0) {
    reasons.push(
      `공격 레이팅 ${kor.attackRating}→${adjAttack}로 변화해, 상대 수비력(${opp.defenseRating})과의 격차가 ${adjAttack - opp.defenseRating}점입니다.`
    );
  }
  if (mod.defense !== 0) {
    reasons.push(
      `수비 레이팅 ${kor.defenseRating}→${adjDefense}로 변화해, 상대 공격력(${opp.attackRating})과의 격차가 ${opp.attackRating - adjDefense}점입니다.`
    );
  }
  if (mod.midfield > 0) reasons.push(`중원 숫자 우위로 공수 전환을 더 유리하게 가져갈 수 있습니다.`);

  return {
    winProbability: winPct,
    outcome,
    finalScore: { korea: koreaGoals, opponent: oppGoals },
    timeline,
    reasons,
    chosenFormationId: koreaFormationId,
    aiRecommendation,
    followedAI,
  };
}
