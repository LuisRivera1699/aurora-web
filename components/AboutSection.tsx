import { about } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

export function AboutSection() {
  return (
    <section
      id={about.id}
      className="scroll-mt-24 border-t border-white/5 bg-surface-850 py-20 md:py-28"
      aria-labelledby={`${about.id}-heading`}
    >
      <div className="mx-auto max-w-6xl space-y-14 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle id={`${about.id}-heading`}>{about.title}</SectionTitle>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <Reveal delay={0.06}>
            <p className="text-base leading-relaxed text-foreground-muted md:text-lg">
              {about.mission}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base leading-relaxed text-foreground-muted md:text-lg">
              {about.vision}
            </p>
          </Reveal>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {about.stats.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={0.12 + i * 0.05} className="h-full">
                <div className="gradient-border-mask relative h-full overflow-hidden rounded-2xl bg-surface-card p-6 glow-hover">
                  <p className="font-display text-4xl font-bold text-foreground md:text-5xl">
                    <span className="gradient-text" aria-hidden>
                      {s.prefix}{" "}
                    </span>
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-foreground-muted">{s.label}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
