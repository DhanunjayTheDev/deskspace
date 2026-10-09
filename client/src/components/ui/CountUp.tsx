import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface Props {
  /** Full display value, e.g. "12,000+", "98%", "24 hrs". */
  value: string;
  className?: string;
  durationMs?: number;
}

// Splits "12,000+" into ["", 12000, "+"] so any prefix/suffix survives the
// animation and only the digits are interpolated.
function parse(value: string) {
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;
  return { prefix, target, suffix, decimals: (digits.split(".")[1] || "").length };
}

// Strong ease-out: most of the distance is covered immediately, so the number
// reads as landing rather than crawling.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Counts up to its value the first time it scrolls into view.
 *
 * Runs on `requestAnimationFrame` rather than a transition because it animates
 * text content, not a style. Non-numeric values and reduced-motion users get
 * the final string immediately.
 */
export default function CountUp({ value, className, durationMs = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parse(value);
  const [display, setDisplay] = useState(() => (parsed ? `${parsed.prefix}0${parsed.suffix}` : value));

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / durationMs, 1);
      const current = parsed.target * easeOut(t);
      setDisplay(
        `${parsed.prefix}${current.toLocaleString("en-IN", {
          minimumFractionDigits: parsed.decimals,
          maximumFractionDigits: parsed.decimals,
        })}${parsed.suffix}`
      );
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, durationMs, parsed?.target]);

  return (
    // `tabular-nums` keeps every digit the same width, so the label underneath
    // doesn't jiggle as the number climbs.
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
      <span className="sr-only">{value}</span>
    </span>
  );
}
