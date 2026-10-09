import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

const STORAGE_KEY = "deskplace-theme";

function systemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // Private mode / blocked storage. Falling back to the system preference is
    // better than failing to render.
    return null;
  }
}

/** Applied before paint by the inline script in index.html; kept in sync here. */
export function resolveInitialTheme(): Theme {
  return storedTheme() ?? systemTheme();
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  // Keeps the mobile browser chrome and iOS status bar in step with the page.
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.removeAttribute("media"));
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#111827" : "#ffffff";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  useEffect(() => {
    apply(theme);
  }, [theme]);

  // Follow the OS only while the user hasn't made an explicit choice.
  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (storedTheme()) return;
      setTheme(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const commit = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not fatal — the theme still applies for this session.
    }
    setTheme(next);
  }, []);

  /**
   * `origin` is the centre of the control that was pressed. The new theme is
   * wiped in as a circle growing from that point, so the switch reads as coming
   * from the button rather than the page blinking.
   *
   * Uses the View Transitions API where available; everywhere else it falls
   * back to the plain colour transition already on `body`.
   */
  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === "dark" ? "light" : "dark";

      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const startViewTransition = (
        document as Document & {
          startViewTransition?: (cb: () => void) => { ready: Promise<void> };
        }
      ).startViewTransition;

      if (!startViewTransition || reduced || !origin) {
        commit(next);
        return;
      }

      const transition = startViewTransition.call(document, () => {
        // The DOM has to be updated synchronously inside the callback, or the
        // API snapshots the old frame twice and nothing appears to change.
        flushSync(() => commit(next));
      });

      transition.ready.then(() => {
        const { x, y } = origin;
        // Radius to the furthest corner, so the circle always covers the page.
        const radius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          },
          {
            duration: 480,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [theme, commit]
  );

  return { theme, toggle };
}
