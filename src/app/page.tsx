"use client";

import { useState } from "react";
import ScenarioSelect from "@/components/ScenarioSelect";
import CrisisBoard from "@/components/CrisisBoard";
import CrisisResultPanel from "@/components/CrisisResultPanel";
import { getScenario } from "@/data/scenarios";
import { runCrisisSimulation } from "@/lib/crisisEngine";
import type { CrisisResult } from "@/types";

export default function Home() {
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [formationId, setFormationId] = useState<string>("");
  const [lineup, setLineup] = useState<Record<number, string>>({});
  const [result, setResult] = useState<CrisisResult | null>(null);

  const scenario = scenarioId ? getScenario(scenarioId) : null;

  function handleSelectScenario(id: string) {
    const s = getScenario(id);
    setScenarioId(id);
    setFormationId(s.koreaFormationId);
    setLineup(s.koreaLineup);
    setResult(null);
  }

  function handleRun(nextFormationId: string, nextLineup: Record<number, string>) {
    if (!scenario) return;
    setResult(runCrisisSimulation(scenario, nextFormationId, nextLineup));
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <header>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">내가 축구 감독이라면</p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">위기의 순간, 내가 감독이라면?</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          2026 월드컵 조별예선에서 대한민국이 실제로 실점해 0:1로 끌려가던 그 순간으로 돌아가,
          감독이 되어 전술을 바꿔 역전을 노려보세요. 승리·무승부·패배, 결과는 전술에 달렸습니다.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">위기 상황 선택</h2>
        <ScenarioSelect selectedId={scenarioId} onSelect={handleSelectScenario} />
      </section>

      {scenario && !result && (
        <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <CrisisBoard
            key={scenario.id}
            scenario={scenario}
            formationId={formationId}
            lineup={lineup}
            onFormationChange={(f, l) => {
              setFormationId(f);
              setLineup(l);
            }}
            onLineupChange={setLineup}
            onRun={handleRun}
          />
        </section>
      )}

      {scenario && result && (
        <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <CrisisResultPanel
            scenario={scenario}
            result={result}
            onRerun={() => handleRun(formationId, lineup)}
            onBackToBoard={() => setResult(null)}
          />
        </section>
      )}
    </div>
  );
}
