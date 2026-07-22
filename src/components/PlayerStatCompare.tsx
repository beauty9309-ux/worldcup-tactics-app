"use client";

import { useState } from "react";
import type { Player } from "@/types";

const METRICS: { key: keyof Player; label: string }[] = [
  { key: "pace", label: "스피드 (PAC)" },
  { key: "shooting", label: "슈팅 (SHO)" },
  { key: "passing", label: "패스 (PAS)" },
  { key: "dribbling", label: "드리블 (DRI)" },
  { key: "defending", label: "수비 (DEF)" },
  { key: "physical", label: "피지컬 (PHY)" },
];

export default function PlayerStatCompare({ roster }: { roster: Player[] }) {
  const [aId, setAId] = useState(roster[0]?.id ?? "");
  const [bId, setBId] = useState(roster[1]?.id ?? roster[0]?.id ?? "");

  const a = roster.find((p) => p.id === aId) ?? roster[0];
  const b = roster.find((p) => p.id === bId) ?? roster[0];

  if (!a || !b) return null;

  return (
    <div className="viz-root rounded-xl border p-4" style={{ borderColor: "var(--gridline)", background: "var(--surface-1)" }}>
      <h4 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        선수 스탯 비교
      </h4>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <select
          value={aId}
          onChange={(e) => setAId(e.target.value)}
          className="rounded-lg border px-2 py-1.5 text-sm"
          style={{ borderColor: "var(--gridline)", background: "var(--surface-1)", color: "var(--text-primary)" }}
        >
          {roster.map((p) => (
            <option key={p.id} value={p.id}>
              #{p.number} {p.name}
            </option>
          ))}
        </select>
        <select
          value={bId}
          onChange={(e) => setBId(e.target.value)}
          className="rounded-lg border px-2 py-1.5 text-sm"
          style={{ borderColor: "var(--gridline)", background: "var(--surface-1)", color: "var(--text-primary)" }}
        >
          {roster.map((p) => (
            <option key={p.id} value={p.id}>
              #{p.number} {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--series-1)" }} />
          <span style={{ color: "var(--text-primary)" }}>{a.name}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--series-2)" }} />
          <span style={{ color: "var(--text-primary)" }}>{b.name}</span>
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {METRICS.map((m) => (
          <div key={m.key}>
            <div className="mb-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              {m.label}
            </div>
            <div className="flex flex-col gap-1">
              <BarRow value={a[m.key] as number} color="var(--series-1)" />
              <BarRow value={b[m.key] as number} color="var(--series-2)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarRow({ value, color }: { value: number; color: string }) {
  const pct = Math.max(2, Math.min(100, value));
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--gridline)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-7 text-right text-xs tabular-nums" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}
