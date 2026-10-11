"use client";

import { useRouter } from "next/navigation";
import { icons } from "@/lib/assets";

/** Orange back arrow — Figma "u:arrow-down-left", 24×24. */
export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      className={`relative size-6 shrink-0 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icons.back} alt="" width={24} height={24} className="block size-6" />
    </button>
  );
}
