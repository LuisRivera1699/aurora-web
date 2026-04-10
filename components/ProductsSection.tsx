import type { SiteMessages } from "@/content/messages/types";
import { MotionCard } from "@/components/MotionCard";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

export function ProductsSection({ messages }: { messages: SiteMessages }) {
  const { products } = messages;
  return (
    <section
      id={products.id}
      className="scroll-mt-24 border-t border-white/5 bg-surface-850 py-20 md:py-28"
      aria-labelledby={`${products.id}-heading`}
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:space-y-12 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle id={`${products.id}-heading`}>{products.title}</SectionTitle>
        </Reveal>

        <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {products.items.map((item, i) => (
            <li key={item.title} className="flex min-w-0">
              <Reveal delay={0.04 * i} className="h-auto w-full sm:h-full">
                <MotionCard className="gradient-border-mask relative flex h-auto w-full flex-col overflow-hidden rounded-2xl bg-surface-card p-5 sm:h-full sm:min-h-[19rem] md:p-6 xl:min-h-[21rem] glow-hover">
                  <div
                    className="absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl bg-gradient-to-b from-aurora-purple/80 to-aurora-blue/80"
                    aria-hidden
                  />
                  <div className="relative flex flex-col gap-3 pl-4 sm:min-h-0 sm:flex-1 md:pl-5">
                    <h3 className="font-display text-lg font-bold text-foreground md:text-xl">
                      {item.title}
                    </h3>
                    <p className="text-pretty text-sm leading-relaxed text-foreground-muted md:text-base sm:flex-1">
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
