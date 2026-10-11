import { icons } from "@/lib/assets";

/** 1px divider exported from Figma ("Line 2/3"), stretched to the content width. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={icons.divider} alt="" aria-hidden className={`block h-px w-full ${className}`} />
  );
}
