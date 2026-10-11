import type { ButtonHTMLAttributes } from "react";

/** Figma "Button For Becho APP": 334×48, #FF5701, radius 10, Mulish SemiBold 16, tracking 1.25px. */
export function PrimaryButton({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`flex h-12 w-full items-center justify-center rounded-[10px] bg-brand font-mulish text-base font-semibold leading-none tracking-[1.25px] text-white transition-opacity disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
