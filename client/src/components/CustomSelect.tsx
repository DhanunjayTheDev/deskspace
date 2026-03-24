import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder = "Select...", icon, className = "", triggerClassName = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
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

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen((v) => !v);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center gap-2 pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all text-left ${triggerClassName}`}
      >
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            {icon}
          </span>
        )}
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 ml-auto flex-shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && dropPos &&
        createPortal(
          <div
            className="fixed z-[9999] bg-white rounded-xl border border-gray-200 shadow-xl py-1 overflow-hidden"
            style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width, minWidth: 160 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                onChange("");
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {placeholder}
              {!value && <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />}
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onChange(opt);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                {opt}
                {value === opt && <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
