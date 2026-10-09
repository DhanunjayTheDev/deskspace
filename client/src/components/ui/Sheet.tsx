import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { X } from "lucide-react";
import { useIsPhone } from "../../hooks/useMediaQuery";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { cn } from "../../lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  /** Pinned to the bottom of the sheet, outside the scroll area. */
  footer?: React.ReactNode;
  className?: string;
  showClose?: boolean;
}

// A deliberate flick, in px/s. Below this the drag distance decides instead, so
// a slow drag past the threshold still dismisses and a fast flick always does.
const FLICK_VELOCITY = 350;
const DISTANCE_THRESHOLD = 110;

// iOS drawer curve (Ionic). Exit is quicker than enter: the user has already
// decided by then, and waiting on a closing sheet is what feels slow.
const SHEET_EASE = [0.32, 0.72, 0, 1] as const;

export default function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  showClose = true,
}: Props) {
  const isPhone = useIsPhone();
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useBodyScrollLock(open);

  // Escape closes; focus moves in on open and returns to the trigger on close.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const id = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])'
      );
      // Focusing an input on a phone throws up the keyboard over the sheet.
      if (focusable && !isPhone) focusable.focus();
      else panelRef.current?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(id);
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose, isPhone]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISTANCE_THRESHOLD || info.velocity.y > FLICK_VELOCITY) {
      onClose();
    }
  };

  const panel = isPhone ? (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[70] flex max-h-[90dvh] flex-col",
        "rounded-t-3xl bg-surface shadow-sheet outline-none",
        className
      )}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : { duration: 0.32, ease: SHEET_EASE }
      }
      drag={reduceMotion ? false : "y"}
      dragConstraints={{ top: 0, bottom: 0 }}
      // Upward drag isn't blocked, it's resisted hitting an invisible wall
      // reads as broken, friction reads as physical.
      dragElastic={{ top: 0.02, bottom: 0.6 }}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Grabber. The whole header area drags, not just this bar. */}
      <div className="flex shrink-0 cursor-grab justify-center pt-3 pb-1 active:cursor-grabbing">
        <div className="h-1.5 w-10 rounded-full bg-line-strong" />
      </div>

      {(title || showClose) && (
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-2 pb-3">
          <div className="min-w-0">
            {title && (
              <h2 className="text-lg font-bold tracking-tight text-fg">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-muted">{description}</p>
            )}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="press -mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated text-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
        {children}
      </div>

      {footer && (
        <div className="shrink-0 border-t border-line bg-surface px-5 py-4">{footer}</div>
      )}
    </motion.div>
  ) : (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cn(
        "fixed left-1/2 top-1/2 z-[70] flex max-h-[85vh] w-[min(32rem,calc(100vw-2rem))] flex-col",
        "rounded-3xl bg-surface shadow-pop outline-none",
        className
      )}
      // A modal isn't anchored to a trigger, so it scales from its own centre.
      // Starting at 0.96 rather than 0 nothing appears out of nothing.
      initial={{ opacity: 0, scale: 0.96, x: "-50%", y: "-50%" }}
      animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
      exit={{ opacity: 0, scale: 0.98, x: "-50%", y: "-50%" }}
      transition={
        reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: SHEET_EASE }
      }
    >
      {(title || showClose) && (
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div className="min-w-0">
            {title && (
              <h2 className="text-xl font-bold tracking-tight text-fg">{title}</h2>
            )}
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated text-muted md:hover:bg-line-strong"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
        {children}
      </div>

      {footer && (
        <div className="shrink-0 border-t border-line px-6 py-4">{footer}</div>
      )}
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[65] bg-ink-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            onClick={onClose}
          />
          {panel}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
