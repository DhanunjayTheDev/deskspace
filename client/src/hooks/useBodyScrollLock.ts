import { useEffect } from "react";

/**
 * Freezes the page behind an overlay.
 *
 * `overflow: hidden` alone is not enough on iOS Safari keeps scrolling the
 * document under a fixed overlay. Pinning the body and restoring the offset on
 * release is the only approach that holds, and restoring scrollTop matters:
 * without it the page jumps to the top when a sheet closes.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    // Compensating for the scrollbar keeps desktop layout from shifting.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevPadding = body.style.paddingRight;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prevPadding;

      // Jump back without smooth-scrolling through the whole page.
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prevBehavior;
    };
  }, [locked]);
}
