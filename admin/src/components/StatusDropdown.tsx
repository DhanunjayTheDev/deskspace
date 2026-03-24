import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

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
  const ref = useRef<HTMLDivElement>(null);

  const current =
    STATUS_OPTIONS.find((o) => o.value === value) ?? STATUS_OPTIONS[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // don't open lead modal
          setOpen((v) => !v);
        }}
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

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1.5 left-0 w-36 bg-white rounded-xl border border-gray-200 shadow-xl py-1 overflow-hidden">
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
        </div>
      )}
    </div>
  );
}
