"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { icons } from "@/lib/assets";
import { promoSlides } from "@/data/menu";

/** Figma "Frame 71" banner (323×128, radius 20) + 5-dot pager ("Group 187"). */
export function PromoCarousel() {
  const track = useRef<HTMLDivElement>(null);
  // Figma shows the middle dot active; start there.
  const [active, setActive] = useState(2);

  useEffect(() => {
    goTo(2, false);
  }, []);

  const goTo = (i: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div>
      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="no-scrollbar mx-7 flex snap-x snap-mandatory overflow-x-auto rounded-[20px]"
      >
        {promoSlides.map((s) => (
          <article key={s.id} className="relative h-32 w-full shrink-0 snap-center overflow-hidden rounded-[20px]">
            {/* Orange background shape */}
            <div className="absolute bottom-0 right-0 h-[141px] w-full">
              <div className="absolute inset-[0_-1.24%_-5.67%_-1.24%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icons.bannerShape} alt="" aria-hidden className="block size-full max-w-none" />
              </div>
            </div>
            {/* Pizza photo (212×141 at x=153 in a 323 frame) */}
            <div className="absolute left-[47.37%] top-0 h-[141px] w-[65.63%]">
              <Image src={s.image} alt="" fill sizes="220px" className="object-cover" />
            </div>
            {/* Decorative yellow rings */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icons.ringLg} alt="" aria-hidden width={55} height={55} className="absolute left-[32.82%] top-[-37px] size-[55px]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icons.ringSm} alt="" aria-hidden width={46} height={46} className="absolute left-[-14px] top-[105px] size-[46px]" />
            {/* Copy, centred on x = 24% of the card */}
            <p className="absolute left-[24%] top-[45px] w-[123px] -translate-x-1/2 -translate-y-1/2 text-center font-spartan text-base font-normal leading-normal text-font-2">
              {s.title}
            </p>
            <p className="absolute left-[24%] top-[86.5px] w-[127px] -translate-x-1/2 -translate-y-1/2 text-center font-spartan text-[32px] font-bold leading-normal text-font-2">
              {s.offer}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-[5px] flex justify-center gap-1 pl-[3px]" role="tablist" aria-label="Promotions">
        {promoSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1 w-5 rounded-xl transition-colors ${i === active ? "bg-orange" : "bg-yellow-2"}`}
          />
        ))}
      </div>
    </div>
  );
}
