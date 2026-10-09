import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "dark"
  | "white";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl " +
  "transition-[transform,background-color,color,border-color] duration-160 ease-out " +
  "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none " +
  "select-none whitespace-nowrap";

// Flat fills only. Hover shifts one step on the ramp; there is no gradient and
// no tinted shadow anywhere in this set.
const variants: Record<Variant, string> = {
  primary: "bg-brand text-white md:hover:bg-brand-hover",
  secondary: "bg-brand-soft text-brand-soft-fg md:hover:bg-primary-100",
  outline:
    "bg-surface text-fg border border-line-strong md:hover:bg-sunken md:hover:border-line-strong",
  ghost: "bg-transparent text-muted md:hover:bg-elevated md:hover:text-fg",
  success: "bg-success-600 text-white md:hover:bg-success-700",
  dark: "bg-ink-900 text-white md:hover:bg-ink-800",
  // Literally white, not the themed surface: this variant only ever sits on a
  // brand-filled or photographic panel, where it must stay light in both themes.
  white: "bg-white text-primary-700 md:hover:bg-primary-50",
};

// Touch targets stay at 44px or taller on every size but `sm`.
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
  icon: "h-12 w-12 p-0",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: never; href?: never };

type LinkProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    to: string;
    href?: never;
  };

type AnchorProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: never };

type Props = ButtonProps | LinkProps | AnchorProps;

const Button = forwardRef<HTMLElement, Props>(function Button(
  { variant = "primary", size = "md", fullWidth, className, children, ...rest },
  ref
) {
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  if ("to" in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest as LinkProps;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        className={classes}
        {...linkRest}
      >
        {children}
      </Link>
    );
  }

  if ("href" in rest && rest.href !== undefined) {
    const anchorRest = rest as AnchorProps;
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonProps;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={buttonRest.type ?? "button"}
      className={classes}
      {...buttonRest}
    >
      {children}
    </button>
  );
});

export default Button;
