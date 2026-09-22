import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const trustItems = [
  { value: `${siteConfig.experienceYears} Years`, label: "Teaching experience" },
  { value: siteConfig.qualifications[0], label: "Qualification supplied" },
  { value: siteConfig.qualifications[1], label: "Certification course" },
] as const;

export function TrustBar() {
  return (
    <section aria-label="Verified experience and qualifications" className="pb-16 sm:pb-20">
      <Container>
        <div className="grid overflow-hidden rounded-2xl border border-brand/10 bg-surface shadow-card sm:grid-cols-3">
          {trustItems.map((item) => (
            <div
              key={item.value}
              className="border-b border-brand/10 px-6 py-7 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <p className="font-display text-2xl font-semibold text-brand-strong sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

