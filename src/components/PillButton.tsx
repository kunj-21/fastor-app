import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "filled" | "soft" };

/** Figma "Main Button": h26, radius 100, League Spartan 15/20, tracking -0.075px. */
export function PillButton({ variant = "soft", className = "", children, ...props }: Props) {
  const look =
    variant === "filled"
      ? "border border-orange bg-orange font-medium text-white"
      : "bg-orange-2 font-normal text-orange";
  return (
    <button
      type="button"
      {...props}
      className={`flex h-[26px] items-center justify-center whitespace-nowrap rounded-full px-3 font-spartan text-[15px] leading-5 tracking-[-0.075px] ${look} ${className}`}
    >
      {children}
    </button>
  );
}
