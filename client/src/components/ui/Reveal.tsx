import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Stagger index. Kept short long cascades make a page feel slow. */
  index?: number;
  as?: "div" | "section" | "li" | "article";
}

const STAGGER_MS = 55;
const MAX_STAGGER_MS = 220;

/**
 * Scroll-in reveal driven by a CSS transition rather than a JS animation loop.
 *
 * CSS transitions run off the main thread, so these stay smooth while the
 * browser is still decoding hero images and hydrating routes which is exactly
 * when a page full of `whileInView` motion components starts dropping frames.
 *
 * Reveals fire once and never block interaction: the content is in the DOM and
 * clickable from the first frame, it just hasn't finished fading in.
 */
export default function Reveal({ children, className, index = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver, or reduced motion: show it immediately.
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      style={{
        transitionDelay: shown
          ? `${Math.min(index * STAGGER_MS, MAX_STAGGER_MS)}ms`
          : "0ms",
      }}
      className={cn(
        "transition-[opacity,transform] duration-500 ease-out will-change-[opacity,transform]",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className
      )}
    >
      {children}
    </Tag>
  );
}
