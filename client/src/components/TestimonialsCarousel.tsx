import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "../lib/utils";

export interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  company: string;
  photo: string;
  quote: string;
  rating: number;
}

interface Props {
  items: TestimonialItem[];
  autoplayMs?: number;
}

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 300;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// Enter from the side you're travelling towards, exit to the side you came
// from. Spatial consistency is what makes the swipe feel like it moved a thing
// rather than swapping two unrelated cards.
const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28 }),
};

export default function TestimonialsCarousel({ items, autoplayMs = 6000 }: Props) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const timer = useRef<number>();

  const count = items.length;

  const goTo = useCallback(
    (next: number, dir?: number) => {
      const wrapped = ((next % count) + count) % count;
      setState(([current]) => [
        wrapped,
        dir ?? (wrapped === current ? 0 : wrapped > current ? 1 : -1),
      ]);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Advancing while the tab is in the background just burns through the set.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    timer.current = window.setTimeout(next, autoplayMs);
    return () => window.clearTimeout(timer.current);
  }, [index, paused, reduceMotion, count, autoplayMs, next]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) next();
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) prev();
  };

  if (count === 0) return null;
  const item = items[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      {/* Fixed-height stage so the surrounding page never reflows as quotes of
          different lengths swap in. */}
      <div className="relative min-h-[19rem] sm:min-h-[16rem]">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.blockquote
            key={item._id}
            custom={direction}
            variants={reduceMotion ? undefined : variants}
            initial={reduceMotion ? { opacity: 0 } : "enter"}
            animate={reduceMotion ? { opacity: 1 } : "center"}
            exit={reduceMotion ? { opacity: 0 } : "exit"}
            transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: EASE_OUT }}
            drag={reduceMotion || count < 2 ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            dragMomentum={false}
            onDragStart={() => setPaused(true)}
            onDragEnd={(e, info) => {
              onDragEnd(e, info);
              setPaused(false);
            }}
            className="absolute inset-0 flex cursor-grab flex-col rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line active:cursor-grabbing sm:p-8"
          >
            <Quote
              className="h-7 w-7 shrink-0 text-brand/25"
              aria-hidden="true"
            />

            <p className="mt-4 flex-1 text-base leading-relaxed text-fg sm:text-lg sm:leading-relaxed">
              {item.quote}
            </p>

            <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <img
                src={item.photo}
                alt=""
                loading="lazy"
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-fg">{item.name}</p>
                <p className="truncate text-xs text-muted">
                  {item.role}
                  {item.company ? ` · ${item.company}` : ""}
                </p>
              </div>
              <div
                className="ml-auto flex shrink-0 gap-0.5"
                aria-label={`Rated ${item.rating} out of 5`}
              >
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent-400 text-accent-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="press hidden h-10 w-10 items-center justify-center rounded-full bg-surface text-fg ring-1 ring-line-strong transition-colors duration-160 ease-out md:flex md:hover:bg-elevated"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Avatar picker doubles as the position indicator. */}
        <div className="flex items-center gap-2">
          {items.map((t, i) => {
            const active = i === index;
            return (
              <button
                key={t._id}
                onClick={() => goTo(i)}
                aria-label={`Show testimonial from ${t.name}`}
                aria-current={active}
                className="press rounded-full p-0.5"
              >
                <img
                  src={t.photo}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "h-9 w-9 rounded-full object-cover transition-all duration-250 ease-out",
                    active
                      ? "scale-110 ring-2 ring-brand ring-offset-2 ring-offset-surface"
                      : "opacity-50 grayscale md:hover:opacity-80"
                  )}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={next}
          aria-label="Next testimonial"
          className="press hidden h-10 w-10 items-center justify-center rounded-full bg-surface text-fg ring-1 ring-line-strong transition-colors duration-160 ease-out md:flex md:hover:bg-elevated"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Autoplay progress. Linear, because it maps to elapsed time any other
          curve would make the bar lie about when the slide changes. Keyed on
          index so it restarts cleanly, and paused with the timer. */}
      {!reduceMotion && count > 1 && (
        <div className="mx-auto mt-5 h-0.5 w-32 overflow-hidden rounded-full bg-line-strong">
          <div
            key={`${index}-${paused}`}
            className="h-full w-full origin-left bg-brand"
            style={{
              animation: `testimonial-progress ${autoplayMs}ms linear forwards`,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        Testimonial {index + 1} of {count}
      </span>
    </div>
  );
}
