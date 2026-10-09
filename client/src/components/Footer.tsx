import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedWordmark from "./AnimatedWordmark";

const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919666120770";
const telHref = `tel:${phoneNumber.startsWith("91") ? `+${phoneNumber}` : `+91${phoneNumber}`}`;
const displayNumber = `+91 ${phoneNumber.slice(-10, -5)} ${phoneNumber.slice(-5)}`;

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Browse Workspaces", to: "/workspaces" },
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Workspace Types",
    links: [
      { label: "Private Offices", to: "/workspaces?type=Private+Offices" },
      { label: "Dedicated Desks", to: "/workspaces?type=Dedicated+Desks" },
      { label: "Meeting Rooms", to: "/workspaces?type=Meeting+Rooms" },
      { label: "Virtual Offices", to: "/workspaces?type=Virtual+Offices" },
    ],
  },
  {
    title: "Localities",
    links: [
      { label: "HITEC City", to: "/workspaces?area=HITEC+City" },
      { label: "Gachibowli", to: "/workspaces?area=Gachibowli" },
      { label: "Madhapur", to: "/workspaces?area=Madhapur" },
      { label: "Banjara Hills", to: "/workspaces?area=Banjara+Hills" },
    ],
  },
];

export default function Footer() {
  return (
    // Always dark, in both themes — so it uses literal ink values rather than
    // the theme tokens, which would turn the text dark-on-dark in light mode.
    <footer className="mt-auto bg-ink-950 text-ink-400 px-safe">
      <div className="mx-auto max-w-content px-4 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-y-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand spans the full width on phones so the columns below pair up */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:pr-8">
            <Link to="/" className="press mb-4 inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-white">DeskPlace</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed">
              Premium coworking spaces, private offices and meeting rooms across
              Hyderabad verified, transparently priced, and ready when you are.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href={telHref}
                className="flex items-center gap-2.5 transition-colors duration-160 ease-out md:hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary-400" />
                {displayNumber}
              </a>
              <a
                href="mailto:hello@deskplace.in"
                className="flex items-center gap-2.5 transition-colors duration-160 ease-out md:hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary-400" />
                hello@deskplace.in
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                Cyber Towers, HITEC City, Hyderabad
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-160 ease-out md:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-col items-center gap-3 border-t sm:mt-12 border-ink-800 pt-8 text-sm sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} DeskPlace. All rights reserved.</p>
          <p className="text-ink-500">Built for people who need a desk today.</p>
        </div>
      </div>

      {/* Oversized wordmark, clipped at the page edge so the letters sit on the
          fold rather than floating above it. */}
      <div className="overflow-hidden px-4 pb-2 sm:px-6 lg:px-8">
        <AnimatedWordmark className="mx-auto max-w-content" />
      </div>
    </footer>
  );
}
