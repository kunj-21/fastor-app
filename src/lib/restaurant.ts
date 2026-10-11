// Shared restaurant shape + a defensive normaliser for the Fastor list response.
// The field names below follow Fastor's restaurant API; anything missing falls back
// gracefully. Hit /api/restaurants?debug=1 after login to see the raw payload.

export type Restaurant = {
  id: string;
  name: string;
  image: string | null;
  address: string;
  locality: string;
  cuisines: string[];
  rating: number | null;
  reviews: number | null;
  costForTwo: number | null;
  currency: string;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : parseFloat(str(v));
  return Number.isFinite(n) ? n : null;
};

export function normalizeRestaurant(r: any, index: number): Restaurant {
  const images: any[] = Array.isArray(r?.images) ? r.images : [];
  const firstImage = images.map((i) => (typeof i === "string" ? i : i?.url)).find(Boolean);
  const cuisines = (Array.isArray(r?.cuisines) ? r.cuisines : [])
    .map((c: any) => (typeof c === "string" ? c : c?.cuisine_name ?? c?.name))
    .filter((c: unknown): c is string => typeof c === "string" && c.length > 0);

  return {
    id: str(r?.restaurant_id ?? r?.id) || String(index),
    name: str(r?.restaurant_name ?? r?.name) || "Restaurant",
    image: firstImage ?? (str(r?.image ?? r?.logo) || null),
    address: str(r?.location?.location_address ?? r?.address_complete ?? r?.address),
    locality: str(r?.location?.location_locality ?? r?.location?.city_name ?? r?.locality),
    cuisines,
    rating: num(r?.rating?.restaurant_avg_rating ?? r?.rating?.rating ?? r?.rating),
    reviews: num(r?.rating?.count_reviews ?? r?.reviews),
    costForTwo: num(r?.avg_cost_for_two ?? r?.cost_for_two),
    currency: str(r?.currency?.symbol) || "₹",
  };
}

/** The list may come back as a bare array or wrapped in { data: [...] } or { data: { results: [...] } }. */
export function extractList(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data?.results)) return json.data.results;
  if (Array.isArray(json?.data?.restaurants)) return json.data.restaurants;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.results)) return json.results;
  if (Array.isArray(json?.restaurants)) return json.restaurants;
  return [];
}
