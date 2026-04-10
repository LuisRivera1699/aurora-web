import type { SiteMessages } from "@/content/messages/types";
import { MotionCard } from "@/components/MotionCard";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

export function ServicesSection({ messages }: { messages: SiteMessages }) {
  const { services } = messages;
  return (
    <section
      id={services.id}
      className="scroll-mt-24 bg-surface-900 py-20 md:py-28"
      aria-labelledby={`${services.id}-heading`}
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:space-y-12 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle id={`${services.id}-heading`}>{services.title}</SectionTitle>
        </Reveal>

        <ul className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3 xl:gap-8">
          {services.items.map((item, i) => (
            <li key={item.title} className="flex min-w-0">
              <Reveal delay={0.05 * i} className="h-auto w-full lg:h-full">
                <MotionCard className="gradient-border-mask relative flex h-auto w-full flex-col overflow-hidden rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 md:p-8 lg:h-full lg:min-h-[22rem] glow-hover">
                  <div
                    className="pointer-events-none absolute bottom-0 left-0 top-0 w-1 rounded-l-3xl bg-gradient-to-b from-aurora-purple/80 to-aurora-blue/80"
                    aria-hidden
                  />
                  <div className="relative flex flex-col gap-4 pl-4 md:pl-5 lg:min-h-0 lg:flex-1">
                    <h3 className="font-display text-xl font-bold text-foreground md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-pretty text-sm leading-relaxed text-foreground-muted md:text-base lg:flex-1">
                      {item.description}
                    </p>
                  </div>
                </MotionCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
