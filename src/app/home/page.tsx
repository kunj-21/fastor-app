"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PromoCarousel } from "@/components/PromoCarousel";
import { PopularItemList } from "@/components/PopularItemList";
import { RestaurantList } from "@/components/RestaurantList";
import { bestSellers } from "@/data/menu";
import { icons } from "@/lib/assets";

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-spartan text-xl font-medium leading-none text-cocoa ${className}`}>{children}</h2>;
}

export default function HomePage() {
  const [view, setView] = useState<"items" | "restaurants">("items");

  return (
    <div className="pb-6">
      {/* Location bar */}
      <div className="h-[60px] w-full border-b border-divider px-5 pt-[5px] font-inter text-xs leading-normal text-black">
        <p className="opacity-40">Current Locations</p>
        <p className="mt-[7px] font-medium">Model Town, New Delhi</p>
      </div>

      {/* Greeting card + quick actions */}
      <div className="flex items-start justify-between px-5">
        <div className="flex h-[60px] w-[174px] items-center rounded-b-[20px] bg-card px-3">
          <p className="font-inter text-lg font-medium leading-normal text-black opacity-50">Karan</p>
        </div>
        <div className="mt-3 flex gap-[10px]">
          <button type="button" aria-label="Call" className="relative size-12 overflow-hidden rounded-lg bg-grad-call">
            <span className="absolute inset-[27.08%_27.15%_29.17%_29.17%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icons.call} alt="" className="block size-full max-w-none" />
            </span>
          </button>
          <button type="button" aria-label="Wallet" className="relative size-12 overflow-hidden rounded-lg bg-grad-wallet">
            <span className="absolute inset-[27.08%_25.17%_27.08%_27.08%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icons.wallet} alt="" className="block size-full max-w-none" />
            </span>
          </button>
        </div>
      </div>

      {/* Best Seller */}
      <section className="mt-9">
        <SectionTitle className="ml-7">Best Seller</SectionTitle>
        <ul className="mt-[14px] grid grid-cols-4 gap-[11px] px-7">
          {bestSellers.map((item) => (
            <li key={item.id}>
              <Link href="/product" aria-label={`${item.name}, ${item.price}`} className="relative block aspect-[71.68/108]">
                <div className="absolute inset-0 overflow-hidden rounded-[20px]">
                  {item.imageStyle ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="absolute max-w-none" style={item.imageStyle} />
                  ) : (
                    <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                  )}
                </div>
                <span className="absolute bottom-3 right-[-1.3px] flex h-4 min-w-[38px] items-center justify-center rounded-l-[30px] bg-orange px-0.5 pt-[3px] font-spartan text-xs capitalize leading-none text-white">
                  {item.price}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Promo banner */}
      <section className="mt-5" aria-label="Offers">
        <PromoCarousel />
      </section>

      {/* Popular section: Figma items by default, toggleable to Fastor live API */}
      <section className="mt-[49px]">
        <div className="flex items-center justify-between px-7">
          <SectionTitle>
            {view === "items" ? "Popular Items" : "Popular Restaurants"}
          </SectionTitle>
          <div className="flex items-center rounded-full bg-field p-1 text-[12px] font-spartan">
            <button
              type="button"
              onClick={() => setView("items")}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                view === "items"
                  ? "bg-orange text-white shadow-sm"
                  : "text-cocoa/60 hover:text-cocoa"
              }`}
            >
              Popular Items
            </button>
            <button
              type="button"
              onClick={() => setView("restaurants")}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                view === "restaurants"
                  ? "bg-orange text-white shadow-sm"
                  : "text-cocoa/60 hover:text-cocoa"
              }`}
            >
              Restaurants (API)
            </button>
          </div>
        </div>
        <div className="mt-[25px]">
          {view === "items" ? <PopularItemList /> : <RestaurantList />}
        </div>
      </section>
    </div>
  );
}
