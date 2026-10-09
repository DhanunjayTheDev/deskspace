import { useEffect, useState } from "react";

/**
 * Subscribes to a media query. Reads synchronously on first render so the very
 * first paint already matches the viewport a layout that corrects itself one
 * frame later is exactly the flicker that gives a web app away on a phone.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True below Tailwind's `md` breakpoint where the phone layout applies. */
export function useIsPhone(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/** True for devices with a real pointer, where hover states are trustworthy. */
export function useHasHover(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
