import { buttonStyles } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { secondaryCta, trialWhatsAppUrl } from "@/config/site";

export function FloatingWhatsApp() {
  return (
    <a
      href={trialWhatsAppUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact Prabha Yogashala on WhatsApp"
      className={buttonStyles({
        size: "md",
        className:
          "fixed bottom-5 right-5 z-40 size-13 px-0 shadow-action sm:bottom-7 sm:right-7 sm:size-auto sm:px-6",
      })}
    >
      <WhatsAppIcon className="size-5 sm:mr-2" />
      <span className="sr-only sm:not-sr-only">{secondaryCta}</span>
    </a>
  );
}

