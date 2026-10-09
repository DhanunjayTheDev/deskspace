import Reveal from "./Reveal";
import { cn } from "../../lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  action?: React.ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className,
  action,
}: Props) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <Reveal
      className={cn(
        "mb-6 flex gap-6 sm:mb-10 lg:mb-14",
        centered ? "flex-col items-center text-center" : "items-end justify-between",
        className
      )}
    >
      <div className={cn(centered && "flex flex-col items-center")}>
        {eyebrow && (
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              dark ? "bg-white/10 text-brand/25" : "bg-brand-soft text-brand-soft-fg"
            )}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className={cn(
            "mt-3 text-2xl font-extrabold leading-[1.15] tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl",
            dark ? "text-white" : "text-fg"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-2 max-w-2xl text-[15px] leading-relaxed sm:mt-3 sm:text-lg",
              dark ? "text-subtle" : "text-muted"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
