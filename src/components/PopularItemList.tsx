"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Divider } from "@/components/Divider";
import { popularItems, type PopularItem } from "@/data/menu";

const pill = "flex h-[26px] items-center justify-center whitespace-nowrap rounded-full px-3.5 font-spartan text-[13px] font-medium leading-none";

function Row({ item }: { item: PopularItem }) {
  const href = `/product?item=${encodeURIComponent(item.id)}`;

  return (
    <li className="flex">
      <Link href={href} aria-label={item.name} className="relative h-[108px] w-[71.68px] shrink-0 overflow-hidden rounded-[20px] bg-orange-2">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>
      <div className="ml-[13.3px] flex min-w-0 flex-1 flex-col justify-between py-1 text-cocoa">
        <div className="flex items-start justify-between gap-2">
          <Link href={href} className="truncate font-spartan text-xl font-medium leading-[18px]">
            {item.name}
          </Link>
          <p className="-mt-px shrink-0 font-spartan text-xl font-medium leading-[23px] text-orange">
            {item.price}
          </p>
        </div>
        <div className="flex justify-between gap-2 font-spartan text-sm font-light leading-[14px] text-cocoa/70">
          <span>{item.date}</span>
          <span className="shrink-0">{item.count}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`${pill} ${
              item.cancelVariant === "filled"
                ? "bg-orange text-white"
                : "bg-orange-2 text-orange"
            }`}
          >
            Cancel Order
          </button>
          <button
            type="button"
            className={`${pill} bg-orange-2 text-orange`}
          >
            Track Driver
          </button>
        </div>
      </div>
    </li>
  );
}

export function PopularItemList() {
  return (
    <ul className="pl-[26px] pr-7">
      {popularItems.map((item, i) => (
        <Fragment key={item.id}>
          {i > 0 && <Divider className="my-[19px] -mr-[2px] w-[calc(100%+2px)]" />}
          <Row item={item} />
        </Fragment>
      ))}
    </ul>
  );
}
