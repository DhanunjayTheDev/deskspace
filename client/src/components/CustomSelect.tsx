import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { useIsPhone } from "../hooks/useMediaQuery";
import Sheet from "./ui/Sheet";
import { cn } from "../lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}

interface Pos {
  top: number;
  left: number;
  width: number;
  /** Which edge the panel grows from, so it scales out of its trigger. */
  origin: "top" | "bottom";
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  icon,
  className = "",
  triggerClassName = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const isPhone = useIsPhone();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /** The portalled dropdown panel, which lives outside `rootRef` in the DOM. */
  const panelRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    const panelHeight = Math.min(options.length * 44 + 52, 280);
    // Flip above the trigger when there isn't room beneath it.
    const flip = below < panelHeight && rect.top > below;

    setPos({
      top: flip ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      origin: flip ? "bottom" : "top",
    });
  }, [options.length]);

  useEffect(() => {
    if (!open || isPhone) return;
    measure();

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      // The panel is portalled to document.body, so it is NOT a descendant of
      // rootRef. Testing rootRef alone treated every option as an outside
      // click: the menu closed on pointerdown and the option's click landed on
      // a node that had already been unmounted, so nothing was ever selected.
      const insideTrigger = rootRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (!insideTrigger && !insidePanel) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, isPhone, measure]);

  const select = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  const optionRow = (opt: string, isSelected: boolean, muted = false) => (
    <button
      key={opt || "__any"}
      type="button"
      onClick={() => select(opt)}
      className={cn(
        "press-sm flex w-full items-center justify-between gap-3 rounded-lg px-3 text-left transition-colors duration-160 ease-out",
        isPhone ? "min-h-[48px] py-3 text-base" : "min-h-[40px] py-2 text-sm",
        muted ? "text-muted" : "text-fg",
        isSelected ? "bg-brand-soft font-semibold text-brand-soft-fg" : "md:hover:bg-sunken"
      )}
    >
      <span className="truncate">{opt || placeholder}</span>
      {isSelected && <Check className="h-4 w-4 shrink-0 text-brand" />}
    </button>
  );

  const list = (
    <div className={cn("flex flex-col", isPhone ? "gap-0.5 pb-2" : "gap-0.5 p-1.5")}>
      {optionRow("", !value, true)}
      {options.map((opt) => optionRow(opt, value === opt))}
    </div>
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-12 w-full items-center gap-2 rounded-xl border border-line-strong bg-surface pr-3 text-left",
          "transition-colors duration-160 ease-out md:hover:border-line-strong",
          "focus-visible:border-brand",
          icon ? "pl-10" : "pl-3",
          triggerClassName
        )}
      >
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle">
            {icon}
          </span>
        )}
        <span
          className={cn("truncate text-sm", value ? "text-fg" : "text-subtle")}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 shrink-0 text-subtle transition-transform duration-200 ease-out",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Phone: a picker sheet, the way a native select behaves. */}
      {isPhone ? (
        <Sheet open={open} onClose={() => setOpen(false)} title={label ?? placeholder}>
          {list}
        </Sheet>
      ) : (
        open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            role="listbox"
            style={{
              position: "fixed",
              left: pos.left,
              width: Math.max(pos.width, 180),
              ...(pos.origin === "top"
                ? { top: pos.top }
                : { top: pos.top, transform: "translateY(-100%)" }),
              // Scale out of the trigger edge, not out of the panel's middle.
              transformOrigin: pos.origin === "top" ? "top center" : "bottom center",
            }}
            className={cn(
              "z-[80] max-h-[280px] overflow-y-auto overscroll-contain rounded-xl",
              "border border-line-strong bg-surface shadow-pop",
              "motion-safe:pop-in"
            )}
          >
            {list}
          </div>,
          document.body
        )
      )}
    </div>
  );
}
