// Server-only helpers for the Fastor staging API (from the Postman "react dev task" collection).
import "server-only";

export const FASTOR_BASE = process.env.FASTOR_API_BASE ?? "https://staging.fastor.ai";
export const TOKEN_COOKIE = "fastor_token";
export const DIAL_CODE = "+91";
export const DEFAULT_CITY_ID = process.env.FASTOR_CITY_ID ?? "118";

type UpstreamResult = { ok: boolean; status: number; json: any };

async function parse(res: Response): Promise<UpstreamResult> {
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON body */
  }
  return { ok: res.ok, status: res.status, json };
}

/** POST as application/x-www-form-urlencoded, as the Postman collection does. */
export async function fastorPostForm(path: string, fields: Record<string, string>) {
  const res = await fetch(`${FASTOR_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams(fields).toString(),
    cache: "no-store",
  });
  return parse(res);
}

export async function fastorGet(path: string, token: string) {
  const res = await fetch(`${FASTOR_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  return parse(res);
}

/** Best-effort human message from an upstream error body. */
export function upstreamMessage(json: any, fallback: string): string {
  const m = json?.error_message ?? json?.message ?? json?.error ?? json?.data?.message;
  return typeof m === "string" && m.trim() ? m : fallback;
}

/** A phone number is 10 digits for +91. */
export function cleanPhone(value: unknown): string | null {
  const d = String(value ?? "").replace(/\D/g, "");
  return d.length === 10 ? d : null;
}
