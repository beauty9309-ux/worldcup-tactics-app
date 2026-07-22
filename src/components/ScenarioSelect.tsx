import type { CrisisScenario } from "@/types";
import { scenarios } from "@/data/scenarios";

export default function ScenarioSelect({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {scenarios.map((s: CrisisScenario) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors ${
            selectedId === s.id
              ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
              : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          }`}
        >
          <div className="flex items-center gap-2 text-2xl">
            {s.koreaTeam.flag} <span className="text-sm text-zinc-400">vs</span> {s.opponentTeam.flag}
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{s.shortTitle}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {s.competition} · {s.matchDate} · {s.stadium}
          </p>
        </button>
      ))}
    </div>
  );
}
