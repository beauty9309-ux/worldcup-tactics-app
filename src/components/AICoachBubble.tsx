export default function AICoachBubble({
  lines,
  children,
}: {
  lines: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-200 text-lg dark:bg-amber-900">
        🧑‍💼
      </div>
      <div className="flex-1 text-sm text-amber-900 dark:text-amber-200">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">AI 코치</p>
        <div className="flex flex-col gap-1">
          {lines.map((line, i) => (
            <p key={i} className={i === 0 ? "font-semibold" : ""}>
              {line}
            </p>
          ))}
        </div>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
