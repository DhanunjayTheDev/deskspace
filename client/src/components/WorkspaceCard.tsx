import { memo } from "react";
import { Link } from "react-router-dom";
import { IndianRupee, MapPin, Users } from "lucide-react";
import type { Workspace } from "../types/workspace";
import { cn } from "../lib/utils";

interface Props {
  workspace: Workspace;
  className?: string;
  /** Compact variant used inside horizontal snap carousels on phones. */
  compact?: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop";

function WorkspaceCard({ workspace, className, compact }: Props) {
  const thumbnail = workspace.images[0] || FALLBACK_IMAGE;

  return (
    <Link
      to={`/workspaces/${workspace._id}`}
      className={cn(
        "press group block h-full overflow-hidden rounded-2xl bg-surface",
        "ring-1 ring-line shadow-card",
        // Hover lift is gated: on touch it would stick after a tap.
        "hover-lift md:hover:shadow-card-hover md:hover:ring-line-strong",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-elevated hover-zoom",
          compact ? "aspect-[16/10]" : "aspect-[4/3] sm:aspect-[16/10]"
        )}
      >
        <img
          src={thumbnail}
          alt={workspace.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />

        {workspace.isFeatured && (
          <span className="absolute left-3 top-3 rounded-lg bg-accent-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Featured
          </span>
        )}

        {!workspace.isAvailable && (
          <span className="absolute right-3 top-3 rounded-lg bg-ink-900/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Full
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-1 text-base font-bold tracking-tight text-fg sm:text-lg">
          {workspace.title}
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
          <span className="line-clamp-1">
            {workspace.area}, {workspace.city}
          </span>
        </p>

        {workspace.type?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {workspace.type.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-md bg-brand-soft px-2 py-1 text-[11px] font-semibold text-brand-soft-fg"
              >
                {t}
              </span>
            ))}
            {workspace.type.length > 2 && (
              <span className="rounded-md bg-elevated px-2 py-1 text-[11px] font-semibold text-muted">
                +{workspace.type.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <Users className="h-4 w-4 text-subtle" aria-hidden="true" />
            {workspace.seats} seats
          </span>
          <span className="flex items-baseline gap-0.5 font-bold text-fg">
            <IndianRupee className="h-4 w-4 self-center" aria-hidden="true" />
            {workspace.pricePerSeat.toLocaleString("en-IN")}
            <span className="text-xs font-medium text-subtle">/seat</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default memo(WorkspaceCard);
