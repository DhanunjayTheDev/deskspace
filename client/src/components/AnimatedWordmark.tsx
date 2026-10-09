import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

interface Props {
  text?: string;
  className?: string;
}

const STAGGER_MS = 45;

/**
 * Oversized wordmark that rises letter-by-letter when the footer scrolls into
 * view.
 *
 * Each letter sits in its own `overflow: hidden` box and starts translated
 * fully below it, so the letters look like they're being revealed from behind
 * an edge rather than fading in from nowhere.
 *
 * It only ever plays once, and the whole thing is `aria-hidden` with a single
 * readable label, so a screen reader hears "DeskPlace" instead of nine letters.
 */
export default function AnimatedWordmark({ text = "DeskPlace", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-color-scheme: reduce)").matches;
    if (
      reduced ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const letters = text.split("");

  return (
    <div
      ref={ref}
      className={cn("select-none", className)}
      role="img"
      aria-label={text}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex w-full items-end justify-between",
          // Scales with the viewport so the word always spans the footer edge
          // to edge, at any width, without a media query per breakpoint.
          "text-[clamp(2.75rem,13.5vw,11rem)] font-extrabold uppercase leading-[0.82]",
          "tracking-[-0.04em] text-white/10"
        )}
      >
        {letters.map((letter, i) => (
          <span key={`${letter}-${i}`} className="block overflow-hidden">
            <span
              className={cn(
                "group/letter block cursor-default transition-[transform,color] duration-700 ease-out",
                "md:hover:text-primary-400",
                shown ? "translate-y-0" : "translate-y-full"
              )}
              style={{ transitionDelay: shown ? `${i * STAGGER_MS}ms` : "0ms" }}
            >
              {letter}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
