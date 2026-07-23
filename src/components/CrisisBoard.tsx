"use client";

import { useMemo } from "react";
import type { CrisisScenario } from "@/types";
import { formations } from "@/data/formations";
import { allScenarioPlayers } from "@/data/players2026";
import { getAIRecommendation, remapLineupToFormation } from "@/lib/crisisEngine";
import PitchBoard from "./PitchBoard";
import PlayerStatCompare from "./PlayerStatCompare";
import AICoachBubble from "./AICoachBubble";
import DecisionTimer from "./DecisionTimer";

const AVAILABLE_FORMATIONS = ["3-4-2-1", "4-2-3-1", "4-4-2", "4-3-3", "3-5-2", "5-3-2"];
const DECISION_SECONDS = 60;

export default function CrisisBoard({
  scenario,
  formationId,
  lineup,
  onFormationChange,
  onLineupChange,
  onRun,
}: {
  scenario: CrisisScenario;
  formationId: string;
  lineup: Record<number, string>;
  onFormationChange: (formationId: string, lineup: Record<number, string>) => void;
  onLineupChange: (lineup: Record<number, string>) => void;
  onRun: (formationId: string, lineup: Record<number, string>) => void;
}) {
  const koreaRoster = allScenarioPlayers.filter((p) => scenario.koreaSquadIds.includes(p.id));
  const opponentRoster = allScenarioPlayers.filter((p) => p.teamId === scenario.opponentTeam.id);
  const aiRecommendation = useMemo(() => getAIRecommendation(scenario), [scenario]);
  const recommendedFormation = formations.find((f) => f.id === aiRecommendation.formationId);

  function handleFormationChange(nextFormationId: string) {
    onFormationChange(nextFormationId, remapLineupToFormation(lineup, nextFormationId));
  }

  return (
    <div className="flex flex-col gap-4">
      <DecisionTimer seconds={DECISION_SECONDS} onExpire={() => onRun(formationId, lineup)} />

      <AICoachBubble
        lines={[
          "감독님.",
          `${scenario.concedeMinute}분, 이미 ${scenario.opponentTeam.name} ${scenario.scorerName}에게 실점해 0:1입니다.`,
          scenario.goalDescription,
          ...(scenario.substitutionNote ? [scenario.substitutionNote] : []),
          `제 분석으로는 ${recommendedFormation?.name} 포메이션의 역전 승리 확률이 가장 높습니다 (${aiRecommendation.winProbability}%). 추천을 따르시겠습니까, 아니면 감독님 판단을 믿으시겠습니까?`,
        ]}
      >
        <button
          type="button"
          onClick={() => handleFormationChange(aiRecommendation.formationId)}
          disabled={formationId === aiRecommendation.formationId}
          className="rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {formationId === aiRecommendation.formationId ? "AI 추천 적용됨" : "AI 추천 적용하기"}
        </button>
      </AICoachBubble>

      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">
          대한민국 포메이션
        </label>
        <select
          value={formationId}
          onChange={(e) => handleFormationChange(e.target.value)}
          className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink"
        >
          {AVAILABLE_FORMATIONS.map((id) => {
            const f = formations.find((f) => f.id === id)!;
            const tags = [
              id === scenario.koreaFormationId ? "실제 경기" : null,
              id === aiRecommendation.formationId ? "AI 추천" : null,
            ].filter(Boolean);
            return (
              <option key={id} value={id}>
                {f.name} {tags.length ? `(${tags.join(" · ")})` : ""}
              </option>
            );
          })}
        </select>
        <p className="mt-1 text-xs text-ink-muted">
          {formations.find((f) => f.id === formationId)?.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink">
            대한민국 — 탭하거나 드래그로 선수 교체
          </h4>
          <PitchBoard formationId={formationId} lineup={lineup} roster={koreaRoster} onChange={onLineupChange} />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink">
            {scenario.opponentTeam.name} (실제 선발, 고정)
          </h4>
          <PitchBoard
            formationId={scenario.opponentFormationId}
            lineup={scenario.opponentLineup}
            roster={opponentRoster}
            editable={false}
          />
        </div>
      </div>

      <PlayerStatCompare roster={koreaRoster} />

      <button
        type="button"
        onClick={() => onRun(formationId, lineup)}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        이 전술로 결과 산출하기
      </button>
    </div>
  );
}
