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
          ? "border-red-400 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
          : "border-zinc-300 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
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
