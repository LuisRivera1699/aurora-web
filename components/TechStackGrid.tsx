import type { SiteMessages } from "@/content/messages/types";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { TechStackMarquee } from "@/components/TechStackMarquee";

export function TechStackGrid({ messages }: { messages: SiteMessages }) {
  const { techStack } = messages;
  return (
    <section
      id={techStack.id}
      className="scroll-mt-24 bg-surface-900 py-20 md:py-28"
      aria-labelledby={`${techStack.id}-heading`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-12 max-w-3xl md:mb-14">
            <SectionTitle id={`${techStack.id}-heading`} align="center">
              {techStack.title}
            </SectionTitle>
          </div>
        </Reveal>
      </div>

      <TechStackMarquee items={techStack.items} />
    </section>
  );
}
