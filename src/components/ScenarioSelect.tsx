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
          className={`flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors ${
            selectedId === s.id
              ? "border-accent bg-accent/[0.06]"
              : "border-rule hover:border-ink-muted"
          }`}
        >
          <div className="flex items-center gap-2 text-2xl">
            {s.koreaTeam.flag} <span className="text-sm italic text-ink-muted">vs</span> {s.opponentTeam.flag}
          </div>
          <h3 className="font-semibold text-ink">{s.shortTitle}</h3>
          <p className="text-xs text-ink-muted">
            {s.competition} · {s.matchDate} · {s.stadium}
          </p>
        </button>
      ))}
    </div>
  );
}
