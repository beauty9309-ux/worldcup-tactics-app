export default function AICoachBubble({
  lines,
  children,
}: {
  lines: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="border-l-[3px] border-accent bg-paper-panel py-3 pl-4 pr-4 text-sm text-ink">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">AI 코치</p>
      <div className="flex flex-col gap-1 leading-relaxed">
        {lines.map((line, i) => (
          <p key={i} className={i === 0 ? "font-semibold" : ""}>
            {line}
          </p>
        ))}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
