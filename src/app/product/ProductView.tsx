"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Divider } from "@/components/Divider";
import { PrimaryButton } from "@/components/PrimaryButton";
import { popularItems, portions } from "@/data/menu";
import { fetchRestaurants } from "@/lib/api";
import { icons, images } from "@/lib/assets";
import type { Restaurant } from "@/lib/restaurant";

// Copy from the Figma frame, used when no restaurant id is given.
const DESIGN = {
  title: "Lorem ipsum dolor sit amet",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  price: 14,
  currency: "₹",
};

export function ProductView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const itemId = searchParams.get("item");

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [qty, setQty] = useState(3);
  const [portion, setPortion] = useState("jumbo");
  const [added, setAdded] = useState(false);

  const matchedItem = itemId ? popularItems.find((p) => p.id === itemId) : null;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetchRestaurants().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        const found = res.restaurants.find((r) => r.id === id) ?? null;
        setRestaurant(found);
        if (!found) setError("This restaurant is no longer available.");
      } else if (res.status === 401) {
        router.replace("/login");
      } else {
        setError(res.message);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const title = matchedItem?.name ?? restaurant?.name ?? DESIGN.title;
  const body = matchedItem
    ? `${matchedItem.name} · Freshly prepared and delivered fast.`
    : restaurant
    ? [restaurant.cuisines.join(", "), restaurant.address].filter(Boolean).join(" · ") || "Freshly prepared, delivered fast."
    : DESIGN.body;
  const basePrice = restaurant?.costForTwo ?? DESIGN.price;
  const currency = restaurant?.currency ?? DESIGN.currency;
  const selected = portions.find((p) => p.id === portion)!;
  const total = (basePrice + selected.price) * qty;

  return (
    <div className="flex min-h-dvh flex-col pb-safe pl-[23px] pr-[29px] pt-[44px] text-cocoa">
      <BackButton className="-mt-[34px] mb-[10px] ml-px" />

      {/* Hero: Figma source photo rotated 90° inside a 323×223 frame */}
      <div className="relative ml-px aspect-[323/223] w-full overflow-hidden rounded-[36px] bg-orange-2 [container-type:size]">
        {loading ? (
          <div className="absolute inset-0 animate-pulse bg-orange-2" />
        ) : matchedItem?.image ? (
          <Image src={matchedItem.image} alt={matchedItem.name} fill priority sizes="360px" className="object-cover" />
        ) : restaurant?.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.image}
            alt={restaurant.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[100cqw] w-[100cqh] flex-none rotate-90 overflow-hidden rounded-[36px]">
              <Image src={images.pizza} alt="Pepperoni pizza" fill priority sizes="360px" className="object-cover" />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 font-spartan text-sm text-orange">
          {error}
        </p>
      )}

      <Divider className="mt-3" />

      {/* Price + quantity stepper ("Frame 60") */}
      <div className="flex h-12 items-center justify-between">
        <p className="font-spartan text-2xl font-bold capitalize leading-[26px] text-orange">
          {currency}
          {basePrice.toFixed(2)}
        </p>
        <div className="-mr-[4.7px] flex items-center">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-[26.31px] disabled:opacity-50" disabled={qty <= 1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icons.minus} alt="" className="block size-full" />
          </button>
          <span aria-live="polite" className="w-[35.71px] text-center font-spartan text-[24.43px] leading-normal">
            {qty}
          </span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))} className="size-[26.31px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icons.plus} alt="" className="block size-full" />
          </button>
        </div>
      </div>

      <Divider />

      <h1 className="ml-px mt-[16px] font-spartan text-xl font-medium leading-normal">{title}</h1>
      <p className="ml-px mt-[3px] font-spartan text-base font-light leading-[0.95] tracking-[-0.48px]">{body}</p>

      {/* Portion picker */}
      <fieldset className="mt-[29px]">
        <legend className="font-spartan text-xl font-medium leading-[18px]">Personal portion</legend>
        <div className="mt-[17px] flex flex-col gap-[17px]">
          {portions.map((p) => {
            const checked = p.id === portion;
            return (
              <label key={p.id} className="flex h-[15px] cursor-pointer items-center font-spartan">
                <input type="radio" name="portion" value={p.id} checked={checked} onChange={() => setPortion(p.id)} className="sr-only" />
                <span className="whitespace-nowrap text-sm font-light leading-[14px]">{p.label}</span>
                <span aria-hidden className="mx-[3px] flex-1 border-t border-dashed border-orange/40" />
                <span className="text-xs font-light leading-normal">
                  ${p.price.toFixed(2)}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={checked ? icons.radioFilled : icons.radioEmpty} alt="" aria-hidden width={15} height={15} className="ml-2 size-[15px] shrink-0" />
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="-ml-[3px] -mr-[1px] mt-auto pt-10">
        <PrimaryButton
          onClick={() => {
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          disabled={loading}
          aria-label={`Add ${qty} to cart, total ${currency}${total.toFixed(2)}`}
        >
          {added ? "Added ✓" : "Add to cart"}
        </PrimaryButton>
      </div>
    </div>
  );
}
