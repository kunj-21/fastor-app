"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Divider } from "@/components/Divider";
import { fetchRestaurants } from "@/lib/api";
import { images } from "@/lib/assets";
import type { Restaurant } from "@/lib/restaurant";

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; restaurants: Restaurant[] };

const pill = "flex h-[26px] items-center justify-center whitespace-nowrap rounded-full px-3 font-spartan text-[15px] leading-5 tracking-[-0.075px]";

const FALLBACK_IMAGES = [images.curry, images.sushi, images.pizza, images.lasagna, images.chickenBurger];

function Thumb({ src, alt, index = 0 }: { src: string | null; alt: string; index?: number }) {
  const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <div className="relative h-[108px] w-[71.68px] shrink-0 overflow-hidden rounded-[20px] bg-orange-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc(fallback)}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}

function Row({ r, index }: { r: Restaurant; index: number }) {
  const href = `/product?id=${encodeURIComponent(r.id)}`;
  const subtitle = r.locality || r.cuisines.slice(0, 2).join(", ") || r.address;
  return (
    <li className="flex">
      <Link href={href} aria-label={r.name}>
        <Thumb src={r.image} alt={r.name} index={index} />
      </Link>
      <div className="ml-[13.3px] flex min-w-0 flex-1 flex-col pt-5 text-cocoa">
        <div className="flex items-start justify-between gap-2">
          <Link href={href} className="truncate font-spartan text-xl font-medium leading-[18px]">
            {r.name}
          </Link>
          {r.costForTwo != null && (
            <p className="-mt-px shrink-0 font-spartan text-xl font-medium leading-[23px] text-orange">
              {r.currency}
              {r.costForTwo}
            </p>
          )}
        </div>
        <div className="mt-[9px] flex justify-between gap-2 font-spartan text-sm font-light leading-[14px]">
          <span className="truncate">{subtitle}</span>
          <span className="shrink-0">{r.costForTwo != null ? "for two" : ""}</span>
        </div>
        <div className="-mx-[2px] mt-[5px] flex justify-between gap-2">
          <Link href={href} className={`${pill} w-[110px] border border-orange bg-orange font-medium text-white`}>
            View Menu
          </Link>
          <span className={`${pill} w-[100px] bg-orange-2 text-orange`}>
            {r.rating != null ? `★ ${r.rating.toFixed(1)}` : "New"}
          </span>
        </div>
      </div>
    </li>
  );
}

function Skeleton() {
  return (
    <ul aria-busy className="pl-[26px] pr-7">
      {[0, 1, 2].map((i) => (
        <li key={i} className={`flex animate-pulse ${i ? "mt-[39px]" : ""}`}>
          <div className="h-[108px] w-[71.68px] shrink-0 rounded-[20px] bg-orange-2/60" />
          <div className="ml-[13.3px] flex flex-1 flex-col gap-3 pt-5">
            <div className="h-[18px] w-3/4 rounded bg-orange-2/60" />
            <div className="h-[14px] w-1/2 rounded bg-orange-2/60" />
            <div className="h-[26px] w-[110px] rounded-full bg-orange-2/60" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function RestaurantList() {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "loading" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    const res = await fetchRestaurants();
    if (res.ok) {
      setState({ kind: "ready", restaurants: res.restaurants });
    } else if (res.status === 401) {
      router.replace("/login");
    } else {
      setState({ kind: "error", message: res.message });
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (state.kind === "loading") return <Skeleton />;

  if (state.kind === "error") {
    return (
      <div className="mx-7 flex flex-col items-start gap-3 font-spartan text-cocoa">
        <p className="text-base font-light">{state.message}</p>
        <button type="button" onClick={load} className={`${pill} border border-orange bg-orange font-medium text-white`}>
          Try again
        </button>
      </div>
    );
  }

  if (!state.restaurants.length) {
    return <p className="mx-7 font-spartan text-base font-light text-cocoa">No restaurants found near you yet.</p>;
  }

  return (
    <ul className="pl-[26px] pr-7">
      {state.restaurants.map((r, i) => (
        <Fragment key={r.id}>
          {i > 0 && <Divider className="my-[19px] -mr-[2px] w-[calc(100%+2px)]" />}
          <Row r={r} index={i} />
        </Fragment>
      ))}
    </ul>
  );
}
