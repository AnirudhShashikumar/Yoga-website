import { ButtonLink, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { primaryCta, secondaryCta, trialWhatsAppUrl } from "@/config/site";

type ConversionCTAProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function ConversionCTA({
  eyebrow = "Your next step",
  title = "Begin with a conversation and a trial class.",
  description = "Share your experience level, preferred practice format, and broad timing preference. No account is required to enquire.",
}: ConversionCTAProps) {
  return (
    <section className="pb-16 sm:pb-20 lg:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-strong px-7 py-12 text-white shadow-floating sm:px-10 lg:px-16 lg:py-16">
          <div aria-hidden="true" className="absolute -right-24 -top-32 size-96 rounded-full bg-brand/70 blur-3xl" />
          <div className="relative grid items-end gap-9 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-soft">
                {eyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href="/book" variant="inverse" size="lg">
                {primaryCta}
              </ButtonLink>
              <a
                href={trialWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({
                  variant: "secondary",
                  size: "lg",
                  className: "border-white/25 bg-white/10 text-white hover:bg-white/15",
                })}
              >
                <WhatsAppIcon className="mr-2 size-5" />
                {secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
