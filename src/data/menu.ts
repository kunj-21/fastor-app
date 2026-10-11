import type { CSSProperties } from "react";
import { images } from "@/lib/assets";

export type BestSeller = {
  id: string;
  name: string;
  price: string;
  image: string;
  /** Custom crop from Figma (only the lasagna tile uses one). */
  imageStyle?: CSSProperties;
};

export const bestSellers: BestSeller[] = [
  { id: "sushi", name: "Sushi", price: "$103.0", image: images.sushi },
  { id: "curry", name: "Curry", price: "$50.0", image: images.curry },
  {
    id: "lasagna",
    name: "Lasagna",
    price: "$12.99",
    image: images.lasagna,
    imageStyle: { height: "120.9%", left: "-52.79%", top: "-7.01%", width: "182.16%" },
  },
  { id: "cupcake", name: "Cupcake", price: "$8.20", image: images.cupcake },
];

export type PopularItem = {
  id: string;
  name: string;
  price: string;
  date: string;
  count: string;
  image: string;
  /** Figma shows a filled "Cancel Order" on the first two rows, soft on the rest. */
  cancelVariant: "filled" | "soft";
};

// Copy and currency symbols are exactly as in the Figma file (it mixes ₹ and $).
export const popularItems: PopularItem[] = [
  { id: "shake-1", name: "Strawberry Shake", price: "₹20.00", date: "29 Nov, 01:20 pm", count: "2 items", image: images.strawberryShake, cancelVariant: "filled" },
  { id: "burger", name: "Chicken Burger", price: "₹20.00", date: "17 Oct, 01:20 pm", count: "1 item", image: images.chickenBurger, cancelVariant: "filled" },
  { id: "sushi-wave", name: "Sushi Wave", price: "$20.00", date: "22 Apr, 01:20 pm", count: "2 items", image: images.sushi, cancelVariant: "soft" },
  { id: "shake-2", name: "Strawberry Shake", price: "$20.00", date: "29 Nov, 01:20 pm", count: "1 items", image: images.strawberryShake2, cancelVariant: "soft" },
];

export type Portion = { id: string; label: string; price: number };

export const portions: Portion[] = [
  { id: "personal", label: "Personal (4 Slides)", price: 0 },
  { id: "medium", label: "Medium (8 Slides)", price: 3 },
  { id: "familiar", label: "Familiar (10 Slides)", price: 6 },
  { id: "jumbo", label: "Jumbo (12 Slides)", price: 10 },
];

export const promoSlides = Array.from({ length: 5 }, (_, i) => ({
  id: `promo-${i}`,
  title: "Experience our delicious new dish",
  offer: "30% OFF",
  image: images.pizza,
}));
