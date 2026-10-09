import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronDown,
  LayoutGrid,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Users,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { localities } from "../data/workspaces";
import { cn } from "../lib/utils";

const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919666120770";
const telHref = `tel:${phoneNumber.startsWith("91") ? `+${phoneNumber}` : `+91${phoneNumber}`}`;
const displayNumber = `+91 ${phoneNumber.slice(-10, -5)} ${phoneNumber.slice(-5)}`;

// Titles must match `workspaceTypes` exactly — the filter compares by value.
const workspaceTypeLinks = [
  { title: "Private Offices", desc: "Lockable cabins for 2–50+", icon: Building2 },
  { title: "Dedicated Desks", desc: "Your own desk, 24/7 access", icon: LayoutGrid },
  { title: "Hot Desks", desc: "Flexible shared seating", icon: Users },
  { title: "Meeting Rooms", desc: "Bookable by the hour", icon: MessageSquare },
  { title: "Virtual Offices", desc: "Address & mail handling", icon: Mail },
  { title: "Event Spaces", desc: "Workshops and meetups", icon: Calendar },
];

const featuredLocalities = localities.slice(0, 8);

const simpleLinks = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const closeTimer = useRef<number>();
  const openTimer = useRef<number>();
  const navRef = useRef<HTMLDivElement>(null);

  // The pill sits over the hero on the home page and only takes on its own
  // surface once content scrolls beneath it.
  const overlaysHero = pathname === "/";

  useEffect(() => {
    if (!overlaysHero) {
      setScrolled(true);
      return;
    }
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [overlaysHero]);

  // A route change closes the panel; otherwise it hangs open over the new page.
  useEffect(() => {
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [megaOpen]);

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(openTimer.current);
    },
    []
  );

  // Hover intent. The short open delay stops the panel flashing as the pointer
  // crosses the trigger on its way elsewhere; the close delay lets you move
  // diagonally into the panel without it vanishing underneath you.
  const scheduleOpen = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setMegaOpen(true), 90);
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  }, []);

  const onDark = overlaysHero && !scrolled && !megaOpen;
  const workspacesActive = pathname.startsWith("/workspaces");

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-9 items-center gap-1 rounded-full px-3.5 text-sm font-medium",
      "transition-colors duration-160 ease-out",
      onDark
        ? active
          ? "bg-white/20 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
        : active
          ? "bg-brand-soft text-brand-soft-fg"
          : "text-muted hover:bg-elevated hover:text-fg"
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-safe px-safe">
      <div
        ref={navRef}
        className="relative mx-auto max-w-content px-3 sm:px-4 lg:px-6"
        style={{ paddingTop: "var(--nav-gap)" }}
        onMouseLeave={scheduleClose}
      >
        {/* The pill. Detached from the viewport edges so it reads as a floating
            control rather than browser chrome. */}
        <nav
          className={cn(
            "flex h-[3.25rem] items-center gap-2 rounded-full pl-3 pr-2 md:h-14 md:pl-4 md:pr-3",
            "transition-[background-color,box-shadow,border-color] duration-250 ease-out",
            onDark
              ? "border border-white/15 bg-white/10 backdrop-blur-xl"
              : "border border-line bar-blur shadow-card"
          )}
        >
          <Link
            to="/"
            className="press flex shrink-0 items-center gap-2"
            aria-label="DeskPlace home"
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-250 ease-out",
                onDark ? "bg-white text-ink-900" : "bg-brand text-white"
              )}
            >
              <Building2 className="h-4 w-4" />
            </span>
            <span
              className={cn(
                "text-base font-bold tracking-tight transition-colors duration-250 ease-out",
                onDark ? "text-white" : "text-fg"
              )}
            >
              DeskPlace
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="ml-2 hidden items-center gap-0.5 md:flex">
            <button
              onMouseEnter={scheduleOpen}
              onFocus={scheduleOpen}
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              aria-haspopup="true"
              className={linkClass(workspacesActive)}
            >
              Workspaces
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200 ease-out",
                  megaOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {simpleLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onMouseEnter={scheduleClose}
                aria-current={pathname.startsWith(l.to) ? "page" : undefined}
                className={linkClass(pathname.startsWith(l.to))}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle onDark={onDark} className="h-9 w-9" />

            <a
              href={telHref}
              className={cn(
                "press hidden h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold lg:inline-flex",
                "transition-colors duration-160 ease-out",
                onDark
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-elevated text-fg hover:bg-line-strong"
              )}
            >
              <Phone className="h-4 w-4" />
              {displayNumber}
            </a>

            {/* Phone: search + call only, since navigation lives in the tab bar. */}
            <Link
              to="/workspaces"
              aria-label="Search workspaces"
              className={cn(
                "press flex h-9 w-9 items-center justify-center rounded-full md:hidden",
                "transition-colors duration-160 ease-out",
                onDark ? "bg-white/15 text-white" : "bg-elevated text-fg"
              )}
            >
              <Search className="h-[17px] w-[17px]" />
            </Link>
            <a
              href={telHref}
              aria-label={`Call ${displayNumber}`}
              className="press flex h-9 w-9 items-center justify-center rounded-full bg-success-600 text-white md:hidden"
            >
              <Phone className="h-[17px] w-[17px]" />
            </a>

            <Link
              to="/workspaces"
              className={cn(
                "press hidden h-9 items-center rounded-full px-4 text-sm font-semibold md:inline-flex",
                "transition-colors duration-160 ease-out",
                onDark
                  ? "bg-white text-primary-700 hover:bg-primary-50"
                  : "bg-brand text-white hover:bg-brand-hover"
              )}
            >
              Find a desk
            </Link>
          </div>
        </nav>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
              initial={{ opacity: 0, y: -6, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.99 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: EASE_OUT }}
              // Scales out of the pill above it, not out of its own middle.
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-3 top-full z-50 mt-2 hidden overflow-hidden rounded-3xl border border-line bg-surface shadow-pop md:block lg:inset-x-6"
            >
              <div className="grid gap-8 p-6 lg:grid-cols-[1.4fr_1fr_0.9fr] lg:p-8">
                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-subtle">
                    By workspace type
                  </p>
                  <ul className="grid grid-cols-2 gap-1">
                    {workspaceTypeLinks.map((t) => (
                      <li key={t.title}>
                        <Link
                          to={`/workspaces?type=${encodeURIComponent(t.title)}`}
                          className="flex items-start gap-3 rounded-xl p-2.5 transition-colors duration-160 ease-out hover:bg-sunken"
                        >
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-soft-fg">
                            <t.icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-fg">
                              {t.title}
                            </span>
                            <span className="block truncate text-xs text-muted">
                              {t.desc}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-subtle">
                    By locality
                  </p>
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    {featuredLocalities.map((area) => (
                      <li key={area}>
                        <Link
                          to={`/workspaces?area=${encodeURIComponent(area)}`}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors duration-160 ease-out hover:bg-sunken hover:text-fg"
                        >
                          <MapPin
                            className="h-3.5 w-3.5 shrink-0 text-subtle"
                            aria-hidden="true"
                          />
                          <span className="truncate">{area}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/workspaces"
                    className="mt-3 inline-flex items-center gap-1.5 px-2.5 text-sm font-semibold text-brand transition-colors duration-160 ease-out hover:text-brand-hover"
                  >
                    All localities
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-sunken p-5">
                  <div>
                    <p className="text-base font-bold tracking-tight text-fg">
                      Not sure what fits?
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      Tell us your team size and budget — we'll shortlist three spaces
                      in Hyderabad the same day.
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                      "Hi, I need help shortlisting a workspace in Hyderabad."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-success-600 text-sm font-semibold text-white transition-colors duration-160 ease-out hover:bg-success-700"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
