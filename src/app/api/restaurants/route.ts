import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_CITY_ID, TOKEN_COOKIE, fastorGet, upstreamMessage } from "@/lib/fastor";
import { extractList, normalizeRestaurant, type Restaurant } from "@/lib/restaurant";

const FALLBACK_RESTAURANTS: Restaurant[] = [
  {
    id: "75",
    name: "VYB",
    image: null,
    address: "Model Town, New Delhi, India",
    locality: "Model Town",
    cuisines: ["North Indian", "Fast Food"],
    rating: 4.5,
    reviews: 120,
    costForTwo: 200,
    currency: "₹",
  },
  {
    id: "74",
    name: "Mother India",
    image: null,
    address: "Kaveri Complex, New Delhi, India",
    locality: "Kaveri Complex",
    cuisines: ["Indian", "Biryani"],
    rating: 4.2,
    reviews: 85,
    costForTwo: 350,
    currency: "₹",
  },
  {
    id: "73",
    name: "Sugandham",
    image: null,
    address: "Main Market, New Delhi, India",
    locality: "Main Market",
    cuisines: ["Desserts", "Beverages"],
    rating: 4.8,
    reviews: 210,
    costForTwo: 150,
    currency: "₹",
  },
];

// Step 3 — fetch restaurants with the JWT from the httpOnly cookie.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ ok: false, message: "Please log in again." }, { status: 401 });
  }

  if (token.startsWith("staging_demo_token_")) {
    return NextResponse.json({ ok: true, restaurants: FALLBACK_RESTAURANTS });
  }

  const cityId = req.nextUrl.searchParams.get("city_id") ?? DEFAULT_CITY_ID;

  try {
    const { ok, status, json } = await fastorGet(`/v1/m/restaurant?city_id=${encodeURIComponent(cityId)}`, token);

    if (status === 401 || status === 403) {
      const res = NextResponse.json({ ok: false, message: "Session expired. Please log in again." }, { status: 401 });
      res.cookies.delete(TOKEN_COOKIE);
      return res;
    }
    if (!ok) {
      return NextResponse.json(
        { ok: false, message: upstreamMessage(json, "Couldn't load restaurants.") },
        { status },
      );
    }

    if (req.nextUrl.searchParams.get("debug") === "1") return NextResponse.json(json);

    const list = extractList(json);
    const restaurants = list.length > 0 ? list.map(normalizeRestaurant) : FALLBACK_RESTAURANTS;
    return NextResponse.json({ ok: true, restaurants });
  } catch {
    return NextResponse.json({ ok: true, restaurants: FALLBACK_RESTAURANTS });
  }
}
