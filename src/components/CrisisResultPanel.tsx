import type { CrisisResult, CrisisScenario, MatchOutcome } from "@/types";
import { formations } from "@/data/formations";

const OUTCOME_LABEL: Record<MatchOutcome, string> = {
  WIN: "역전승!",
  DRAW: "무승부",
  LOSS: "패배",
};

const OUTCOME_COLOR_VAR: Record<MatchOutcome, string> = {
  WIN: "var(--status-good)",
  DRAW: "var(--status-warning)",
  LOSS: "var(--status-critical)",
};

export default function CrisisResultPanel({
  scenario,
  result,
  onRerun,
  onBackToBoard,
}: {
  scenario: CrisisScenario;
  result: CrisisResult;
  onRerun: () => void;
  onBackToBoard: () => void;
}) {
  const chosenName = formations.find((f) => f.id === result.chosenFormationId)?.name ?? result.chosenFormationId;
  const aiName = formations.find((f) => f.id === result.aiRecommendation.formationId)?.name ?? result.aiRecommendation.formationId;
  const diff = result.winProbability - result.aiRecommendation.winProbability;
  const verdict = result.followedAI
    ? "AI 추천을 그대로 따르셨습니다."
    : diff > 0
    ? `감독님의 판단(${chosenName})이 AI 추천보다 더 좋았습니다! (+${diff}%p)`
    : diff < 0
    ? `AI 추천(${aiName})을 따랐다면 역전 확률이 ${Math.abs(diff)}%p 더 높았을 것입니다.`
    : "감독님의 선택과 AI 추천의 역전 확률이 같았습니다.";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">AI 코치의 평가</p>
        <p className="mt-1 font-semibold">{verdict}</p>
        <p className="mt-1 text-xs opacity-80">
          AI 추천: {aiName} (역전 확률 {result.aiRecommendation.winProbability}%) · 감독님의 선택: {chosenName} (역전 확률{" "}
          {result.winProbability}%)
        </p>
      </div>

      <div className="viz-root rounded-xl border p-4" style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {scenario.concedeMinute}분 이후 역전 승리 확률
          </h3>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
            style={{ background: OUTCOME_COLOR_VAR[result.outcome] }}
          >
            {OUTCOME_LABEL[result.outcome]}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--gridline)" }}>
          <div className="h-full" style={{ width: `${result.winProbability}%`, background: "var(--series-1)" }} />
        </div>
        <div className="mt-1 flex justify-between text-xs tabular-nums" style={{ color: "var(--text-secondary)" }}>
          <span>역전 확률 {result.winProbability}%</span>
          <span>이번 시도: {OUTCOME_LABEL[result.outcome]}</span>
        </div>
      </div>

      <div className="viz-root rounded-xl border p-4" style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          재시뮬레이션 최종 스코어 (실제 결과: {scenario.koreaTeam.name} 0 : 1 {scenario.opponentTeam.name})
        </h3>
        <div className="flex items-center justify-center gap-4 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          <span>{scenario.koreaTeam.name}</span>
          <span style={{ color: "var(--series-1)" }}>{result.finalScore.korea}</span>
          <span className="text-base font-normal" style={{ color: "var(--text-muted)" }}>
            :
          </span>
          <span style={{ color: "var(--series-2)" }}>{result.finalScore.opponent}</span>
          <span>{scenario.opponentTeam.name}</span>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">전술 변경 분석</h3>
        <ul className="flex flex-col gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-blue-500">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">경기 타임라인</h3>
        <ul className="flex flex-col gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          {result.timeline.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-10 shrink-0 tabular-nums text-zinc-400">{t.minute}&apos;</span>
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRerun}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          같은 전술로 다시 시뮬레이션
        </button>
        <button
          type="button"
          onClick={onBackToBoard}
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          전술 다시 짜기
        </button>
      </div>
    </div>
  );
}
