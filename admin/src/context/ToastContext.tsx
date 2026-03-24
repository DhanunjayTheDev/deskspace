import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

const DURATION = 3000;   // visible for 3 s
const EXIT_MS  = 320;    // exit animation duration

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  removing: boolean;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error:   (msg: string) => void;
  info:    (msg: string) => void;
  warning: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: CheckCircle2,
  error:   XCircle,
  info:    Info,
  warning: AlertTriangle,
};

const STYLES: Record<ToastType, { wrap: string; icon: string; bar: string }> = {
  success: { wrap: "bg-white border-emerald-300 text-emerald-900", icon: "text-emerald-500", bar: "bg-emerald-400" },
  error:   { wrap: "bg-white border-red-300 text-red-900",         icon: "text-red-500",     bar: "bg-red-400"     },
  info:    { wrap: "bg-white border-blue-300 text-blue-900",        icon: "text-blue-500",    bar: "bg-blue-400"    },
  warning: { wrap: "bg-white border-amber-300 text-amber-900",     icon: "text-amber-500",   bar: "bg-amber-400"   },
};

/* Inject keyframes once into <head> */
const STYLE_ID = "deskspace-toast-styles";
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes toast-in {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes toast-out {
      from { transform: translateX(0);    opacity: 1; }
      to   { transform: translateX(115%); opacity: 0; }
    }
    @keyframes toast-progress {
      from { width: 100%; }
      to   { width: 0%;   }
    }
    .toast-enter { animation: toast-in  0.32s cubic-bezier(.22,.61,.36,1) both; }
    .toast-exit  { animation: toast-out ${EXIT_MS}ms cubic-bezier(.55,0,1,.45) both; }
    .toast-bar   {
      animation: toast-progress ${DURATION}ms linear both;
      animation-fill-mode: forwards;
    }
  `;
  document.head.appendChild(el);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  useEffect(() => { injectStyles(); }, []);

  const startExit = useCallback((id: string) => {
    // mark as removing (triggers exit animation)
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, removing: true } : t));
    // actually remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_MS);
  }, []);

  const add = useCallback((type: ToastType, message: string) => {
    const id = String(++counterRef.current);
    setToasts((prev) => [...prev, { id, type, message, removing: false }]);
    setTimeout(() => startExit(id), DURATION);
  }, [startExit]);

  const value: ToastContextValue = {
    success: (msg) => add("success", msg),
    error:   (msg) => add("error",   msg),
    info:    (msg) => add("info",    msg),
    warning: (msg) => add("warning", msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 w-[340px] pointer-events-none"
          aria-live="polite"
          aria-atomic="false"
        >
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type];
            const s = STYLES[toast.type];
            return (
              <div
                key={toast.id}
                className={`${toast.removing ? "toast-exit" : "toast-enter"} pointer-events-auto rounded-xl border shadow-lg overflow-hidden ${s.wrap}`}
              >
                {/* Main content */}
                <div className="flex items-start gap-3 px-4 pt-3 pb-2.5">
                  <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${s.icon}`} />
                  <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
                  <button
                    onClick={() => startExit(toast.id)}
                    className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity ml-1"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Progress bar */}
                {!toast.removing && (
                  <div className="h-0.5 w-full bg-gray-100">
                    <div className={`h-full toast-bar ${s.bar}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
