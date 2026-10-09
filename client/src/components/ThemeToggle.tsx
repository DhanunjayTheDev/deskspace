import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

interface Props {
  className?: string;
  /** Rendered over the dark hero, where the header sits on the image. */
  onDark?: boolean;
}

/**
 * Sun and moon are stacked and crossfaded rather than swapped, so the control
 * never collapses to an empty box mid-transition. The rotation is what sells
 * it as one icon turning into the other instead of two icons trading places.
 */
export default function ThemeToggle({ className, onDark }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  // The new theme wipes in from the centre of this button.
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <button
      onClick={handleClick}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className={cn(
        "press relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full",
        "transition-colors duration-160 ease-out",
        onDark
          ? "bg-white/15 text-white md:hover:bg-white/25"
          : "bg-elevated text-fg md:hover:bg-line-strong",
        className
      )}
    >
      <Sun
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-300 ease-out",
          isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-300 ease-out",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        )}
        aria-hidden="true"
      />
    </button>
  );
}
