import { Phone } from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";

interface Props {
  phoneNumber: string;
  formattedPhone: string;
}

const waMessage = "Hi, I'm interested in learning more about DeskPlace workspaces.";

/**
 * Desktop-only quick actions. On phones these duplicate the header call button
 * and would sit on top of the tab bar, so they are hidden there.
 *
 * No entrance animation: these are present on nearly every page view, and an
 * element that pops in on every navigation gets old by the third page.
 */
export default function FloatingActions({ phoneNumber, formattedPhone }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden flex-col gap-3 md:flex">
      <a
        href={`tel:${formattedPhone}`}
        title="Call us"
        aria-label="Call us"
        className="press pointer-events-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-surface text-fg shadow-pop ring-1 ring-line-strong transition-colors duration-160 ease-out hover:bg-sunken"
      >
        <Phone className="h-5 w-5" />
      </a>

      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
        className="press pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-600 text-white shadow-pop transition-colors duration-160 ease-out hover:bg-success-700"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
