import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import type React from "react";

export const STATUS_OPTIONS = [
  {
    value: "new",
    label: "New",
    textColor: "text-blue-700",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
    hover: "hover:bg-blue-50",
  },
  {
    value: "contacted",
    label: "Contacted",
    textColor: "text-amber-700",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    hover: "hover:bg-amber-50",
  },
  {
    value: "converted",
    label: "Converted",
    textColor: "text-emerald-700",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
    hover: "hover:bg-emerald-50",
  },
] as const;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function StatusDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const current =
    STATUS_OPTIONS.find((o) => o.value === value) ?? STATUS_OPTIONS[0];

  // Close on outside click — but NOT when clicking inside the portal panel
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        (!dropRef.current || !dropRef.current.contains(e.target as Node))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Recalculate position on scroll/resize
  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setDropPos({ top: rect.bottom + 6, left: rect.left });
      }
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen((v) => !v);
  };

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full text-xs font-semibold border transition-shadow ${current.bg} cursor-pointer select-none`}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${current.dot}`} />
        {current.label}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel rendered via portal to escape overflow-hidden parents */}
      {open && dropPos &&
        createPortal(
          <div
            ref={dropRef}
            className="fixed z-[9999] w-36 bg-white rounded-xl border border-gray-200 shadow-xl py-1 overflow-hidden"
            style={{ top: dropPos.top, left: dropPos.left }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${opt.hover} ${opt.textColor}`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${opt.dot}`}
                  />
                  {opt.label}
                </span>
                {value === opt.value && (
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
