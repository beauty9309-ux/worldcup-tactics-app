"use client";

import { useEffect, useState } from "react";

export default function DecisionTimer({
  seconds,
  onExpire,
}: {
  seconds: number;
  onExpire: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const urgent = secondsLeft <= 10;

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-lg font-bold tabular-nums ${
        urgent
          ? "border-accent bg-accent/[0.08] text-accent"
          : "border-rule bg-paper-panel text-ink"
      }`}
    >
      <span>⏱</span>
      <span>
        {mm}:{ss}
      </span>
      <span className="text-xs font-normal opacity-70">안에 결정하세요</span>
    </div>
  );
}
