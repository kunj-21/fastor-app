// Client-side calls to our own Next.js API routes.
import type { Restaurant } from "@/lib/restaurant";

type ApiResult<T = object> = ({ ok: true } & T) | { ok: false; message: string; status?: number };

async function request<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, init);
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.ok === false) {
      return { ok: false, message: json?.message ?? "Something went wrong. Please try again.", status: res.status };
    }
    return json as ApiResult<T>;
  } catch {
    return { ok: false, message: "Network error. Check your connection and try again." };
  }
}

const postJson = (url: string, body: unknown) =>
  request(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const registerPhone = (phone: string) => postJson("/api/auth/register", { phone });
export const loginWithOtp = (phone: string, otp: string) => postJson("/api/auth/login", { phone, otp });
export const logout = () => postJson("/api/auth/logout", {});
export const fetchRestaurants = () => request<{ restaurants: Restaurant[] }>("/api/restaurants", { cache: "no-store" });
