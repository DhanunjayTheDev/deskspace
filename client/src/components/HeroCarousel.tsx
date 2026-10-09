import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ArrowRight, Building2, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import SearchBar from "./SearchBar";
import { cn } from "../lib/utils";

interface Slide {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  stats: { label: string; value: string; icon: React.ElementType }[];
  ctaText: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
    eyebrow: "Premium workspaces in Hyderabad",
    title: "Find your perfect",
    highlight: "private office",
    subtitle:
      "Lockable, furnished offices for teams of 2–50+ in HITEC City, Gachibowli and the Financial District with 24/7 access and everything already set up.",
    stats: [
      { label: "Private offices", value: "250+", icon: Building2 },
      { label: "Avg. setup time", value: "24 hrs", icon: Clock },
      { label: "Satisfaction", value: "98%", icon: Star },
    ],
    ctaText: "Explore private offices",
    ctaLink: "/workspaces?type=Private Offices",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&h=1080&fit=crop",
    eyebrow: "Flexible by the month",
    title: "Discover",
    highlight: "coworking desks",
    subtitle:
      "Hot desks and dedicated desks across Madhapur, Kondapur and Banjara Hills built for focus, with the people and events that come with them.",
    stats: [
      { label: "Coworking seats", value: "3,500+", icon: Building2 },
      { label: "Community events", value: "20+/mo", icon: Star },
      { label: "Localities covered", value: "16", icon: Clock },
    ],
    ctaText: "Browse coworking",
    ctaLink: "/workspaces?type=Dedicated Desks",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&h=1080&fit=crop",
    eyebrow: "On demand",
    title: "Book premium",
    highlight: "meeting rooms",
    subtitle:
      "AV-equipped rooms by the hour for client meetings, interviews and workshops across the city. Pay for what you use.",
    stats: [
      { label: "Meeting rooms", value: "400+", icon: Building2 },
      { label: "Booking", value: "Hourly", icon: Clock },
      { label: "Confirmation", value: "Instant", icon: Star },
    ],
    ctaText: "Book a meeting room",
    ctaLink: "/workspaces?type=Meeting Rooms",
  },
];

const SLIDE_MS = 6000;
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 300;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const timer = useRef<number>();

  const go = useCallback((next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }, []);

  // Autoplay stops while the tab is hidden otherwise you return to a carousel
  // that silently advanced through every slide without you.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    timer.current = window.setTimeout(() => go(index + 1), SLIDE_MS);
    return () => window.clearTimeout(timer.current);
  }, [index, paused, reduceMotion, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    // A quick flick counts even if it barely moved waiting for a long drag
    // is what makes a carousel feel unresponsive on a phone.
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(index + 1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(index - 1);
  };

  const slide = slides[index];

  return (
    <section
      className="relative isolate overflow-hidden bg-ink-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured workspace types"
    >
      {/* Backdrop. Crossfade only a moving background behind text that also
          animates makes both harder to read. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: "linear" }}
        >
          <img
            src={slide.image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            decoding="async"
            // React 18 doesn't map the camelCase form onto the DOM attribute, so
            // it has to be spread in lowercase to actually reach the element.
            {...{ fetchpriority: slide.id === 1 ? "high" : "low" }}
          />
          {/* Flat scrim, not a gradient. One opacity value, legible everywhere,
              with a hairline grid over it for texture. */}
          <div className="absolute inset-0 bg-ink-950/70" />
          <div className="grid-lines absolute inset-0" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      {/* Swipe catcher.
          This used to wrap the whole hero, which meant Framer's drag took
          pointer capture over the search form and both CTAs — every tap inside
          them was swallowed and the search silently did nothing. It now sits
          behind the content instead, so a swipe across the empty parts of the
          hero still changes slides while everything interactive stays live. */}
      <motion.div
        aria-hidden="true"
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => setPaused(true)}
        onDragEnd={(e, info) => {
          onDragEnd(e, info);
          setPaused(false);
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 pt-header px-safe">
        <div className="mx-auto max-w-content px-4 pb-9 pt-7 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                {slide.eyebrow}
              </span>

              <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {slide.title}{" "}
                <span className="text-primary-300">{slide.highlight}</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                {slide.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={slide.ctaLink}
                  className="press inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-ink-900 transition-colors duration-160 ease-out md:hover:bg-primary-50"
                >
                  {slide.ctaText}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/workspaces"
                  className="press inline-flex h-12 items-center rounded-xl bg-white/15 px-6 text-sm font-semibold text-white transition-colors duration-160 ease-out md:hover:bg-white/25"
                >
                  View all spaces
                </Link>
              </div>

              <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6">
                {slide.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="text-xl font-extrabold text-white sm:text-2xl">
                      {stat.value}
                    </dd>
                    <dt className="mt-0.5 text-[11px] leading-tight text-white/60 sm:text-xs">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>

          {/* Search sits below the pitch, outside the animated block so it never
              flickers while slides change. */}
          <div className="mt-8 max-w-4xl sm:mt-10">
            <SearchBar onDark />
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex gap-2" role="tablist" aria-label="Choose slide">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}: ${s.highlight}`}
                  onClick={() => go(i)}
                  className="press h-8 py-3"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-250 ease-out",
                      i === index ? "w-8 bg-white" : "w-4 bg-white/40"
                    )}
                  />
                </button>
              ))}
            </div>

            <span className="text-xs font-medium tabular-nums text-white/50">
              {index + 1} / {slides.length}
            </span>

            <div className="ml-auto hidden gap-2 md:flex">
              <button
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="press flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-160 ease-out hover:bg-white/25"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="press flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-160 ease-out hover:bg-white/25"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
