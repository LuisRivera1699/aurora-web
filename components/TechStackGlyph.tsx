import { getTechGlyph } from "@/lib/tech-icons";

export function TechStackGlyph({ id, label }: { id: string; label: string }) {
  const g = getTechGlyph(id);
  if (g.kind === "fallback") {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-xs font-bold shadow-inner ring-1 ring-white/15 md:h-16 md:w-16"
          style={{ backgroundColor: `${g.color}28`, color: g.color }}
          aria-hidden
        >
          <span className="font-display text-sm font-bold tracking-tight md:text-base">
            {g.abbr}
          </span>
        </div>
        <span className="max-w-[6.5rem] text-xs leading-tight text-foreground-muted">
          {label}
        </span>
      </div>
    );
  }

  const { icon } = g;
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 md:h-16 md:w-16">
        <svg role="img" viewBox="0 0 24 24" className="h-8 w-8" aria-label={label}>
          <title>{label}</title>
          <path fill={`#${icon.hex}`} d={icon.path} />
        </svg>
      </div>
      <span className="max-w-[6.5rem] text-xs leading-tight text-foreground-muted">
        {label}
      </span>
    </div>
  );
}
