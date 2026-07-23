"use client";

import { useState } from "react";
import type { Player } from "@/types";
import { getFormation } from "@/data/formations";

type MoveSource = { type: "slot"; idx: number } | { type: "bench"; playerId: string };

function sameSource(a: MoveSource, b: MoveSource) {
  if (a.type !== b.type) return false;
  if (a.type === "slot" && b.type === "slot") return a.idx === b.idx;
  if (a.type === "bench" && b.type === "bench") return a.playerId === b.playerId;
  return false;
}

function applyMove(current: Record<number, string>, source: MoveSource, targetIdx: number) {
  const next = { ...current };
  if (source.type === "slot") {
    if (source.idx === targetIdx) return next;
    const a = next[source.idx];
    const b = next[targetIdx];
    next[targetIdx] = a;
    if (b === undefined) delete next[source.idx];
    else next[source.idx] = b;
  } else {
    next[targetIdx] = source.playerId;
  }
  return next;
}

export default function PitchBoard({
  formationId,
  lineup,
  roster,
  onChange,
  editable = true,
}: {
  formationId: string;
  lineup: Record<number, string>;
  roster: Player[];
  onChange?: (next: Record<number, string>) => void;
  editable?: boolean;
}) {
  const formation = getFormation(formationId);
  const [dragSlot, setDragSlot] = useState<number | null>(null);
  const [selected, setSelected] = useState<MoveSource | null>(null);
  const playerMap = new Map(roster.map((p) => [p.id, p]));
  const assignedIds = new Set(Object.values(lineup));
  const bench = roster.filter((p) => !assignedIds.has(p.id));

  // Tap-to-swap: works with touch (native HTML5 drag-and-drop below doesn't fire on mobile).
  // Tap a slot/bench player, then tap a second one to swap/assign; tapping the same one again cancels.
  function handleTap(target: MoveSource) {
    if (!editable || !onChange) return;
    if (!selected) {
      setSelected(target);
      return;
    }
    if (sameSource(selected, target)) {
      setSelected(null);
      return;
    }
    if (target.type === "slot") {
      onChange(applyMove(lineup, selected, target.idx));
    } else if (selected.type === "slot") {
      onChange(applyMove(lineup, target, selected.idx));
    } else {
      setSelected(target);
      return;
    }
    setSelected(null);
  }

  function handleDropOnSlot(targetIdx: number, e: React.DragEvent) {
    e.preventDefault();
    if (!editable || !onChange) return;
    const data = e.dataTransfer.getData("text/plain");
    if (data.startsWith("slot:")) {
      onChange(applyMove(lineup, { type: "slot", idx: Number(data.slice(5)) }, targetIdx));
    } else if (data.startsWith("bench:")) {
      onChange(applyMove(lineup, { type: "bench", playerId: data.slice(6) }, targetIdx));
    }
    setDragSlot(null);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[2/3] w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-emerald-900/30"
        style={{
          background:
            "repeating-linear-gradient(to top, #2f9e44, #2f9e44 10%, #37a94c 10%, #37a94c 20%)",
        }}
      >
        <div className="absolute inset-2 rounded border border-white/40" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" />

        {formation.slots.map((slot, idx) => {
          const player = lineup[idx] ? playerMap.get(lineup[idx]) : undefined;
          const isSelected = selected?.type === "slot" && selected.idx === idx;
          return (
            <button
              key={idx}
              type="button"
              draggable={editable && !!player}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", `slot:${idx}`);
                setDragSlot(idx);
              }}
              onDragOver={(e) => editable && e.preventDefault()}
              onDrop={(e) => handleDropOnSlot(idx, e)}
              onClick={() => handleTap({ type: "slot", idx })}
              className={`absolute flex w-14 -translate-x-1/2 translate-y-1/2 flex-col items-center gap-0.5 ${
                editable ? "cursor-pointer active:cursor-grabbing" : ""
              } ${dragSlot === idx ? "opacity-50" : ""}`}
              style={{ left: `${slot.x}%`, bottom: `${slot.y}%` }}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-paper text-xs font-bold text-ink shadow ${
                  isSelected ? "ring-2 ring-accent ring-offset-1" : ""
                }`}
              >
                {player ? player.number : slot.label}
              </div>
              <div className="max-w-16 truncate rounded bg-black/60 px-1 text-[10px] leading-tight text-white">
                {player ? player.name : slot.label}
              </div>
            </button>
          );
        })}
      </div>

      {editable && bench.length > 0 && (
        <div>
          <h4 className="mb-1 text-xs font-semibold text-ink-muted">
            벤치 (탭하거나 드래그해서 선수 교체)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {bench.map((p) => {
              const isSelected = selected?.type === "bench" && selected.playerId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", `bench:${p.id}`)}
                  onClick={() => handleTap({ type: "bench", playerId: p.id })}
                  className={`cursor-pointer rounded-md border bg-paper px-2 py-1 text-xs text-ink shadow-sm active:cursor-grabbing ${
                    isSelected ? "border-accent ring-2 ring-accent" : "border-rule"
                  }`}
                >
                  #{p.number} {p.name} <span className="text-ink-muted">({p.position})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
