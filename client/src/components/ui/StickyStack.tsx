import { cn } from "../../lib/utils";

export interface StickyStackCard {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

interface Props {
  items: StickyStackCard[];
  className?: string;
}

/**
 * Cards that stack as the page scrolls.
 *
 * This is `position: sticky` and nothing else — no scroll listener, no rAF
 * loop, no smooth-scroll library rewriting the page's scroll position. The
 * browser pins each card on the compositor, so it stays smooth while images
 * are still decoding and it costs nothing when the section is off screen.
 *
 * Each card sticks a little lower than the one before it (`top` grows with the
 * index), which is what leaves the previous card's header visible as a ledge
 * once it's been covered.
 */
export default function StickyStack({ items, className }: Props) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((item, i) => (
        <li
          key={item.id}
          className="sticky"
          style={{
            // Clears the floating header, then steps down per card.
            top: `calc(var(--safe-top) + var(--nav-gap) * 2 + var(--nav-h) + ${i * 18 + 16}px)`,
            // Later cards paint over earlier ones.
            zIndex: i + 1,
            marginBottom: i === items.length - 1 ? 0 : "1.25rem",
          }}
        >
          <article
            className={cn(
              "flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-lg border border-line bg-surface p-6",
              "shadow-[0_16px_48px_-20px_rgb(var(--shadow)/0.24)] sm:min-h-[17rem] sm:p-9"
            )}
          >
            <div className="flex items-start justify-between gap-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-line-strong text-brand">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">
                {item.eyebrow}
              </span>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-3xl leading-[1.05] tracking-tight text-fg sm:text-4xl">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted">{item.desc}</p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
