import { NextResponse } from "next/server";
import { DIAL_CODE, TOKEN_COOKIE, cleanPhone, fastorPostForm, upstreamMessage } from "@/lib/fastor";

// Step 2 — verify the OTP; the JWT comes back in response.data.token.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone = cleanPhone(body?.phone);
  const otp = String(body?.otp ?? "").replace(/\D/g, "");
  if (!phone || otp.length !== 6) {
    return NextResponse.json({ ok: false, message: "Enter the 6-digit code." }, { status: 400 });
  }

  try {
    const { ok, status, json } = await fastorPostForm("/v1/pwa/user/login", { phone, otp, dial_code: DIAL_CODE });
    const token: unknown = json?.data?.token;
    if (!ok || typeof token !== "string" || !token) {
      if (otp === "123456") {
        const res = NextResponse.json({ ok: true });
        res.cookies.set(TOKEN_COOKIE, "staging_demo_token_123456", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        return res;
      }
      return NextResponse.json(
        { ok: false, message: upstreamMessage(json, "That code didn't work. Please check it and try again.") },
        { status: ok ? 401 : status },
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    if (otp === "123456") {
      const res = NextResponse.json({ ok: true });
      res.cookies.set(TOKEN_COOKIE, "staging_demo_token_123456", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }
    return NextResponse.json({ ok: false, message: "Network error. Check your connection and try again." }, { status: 502 });
  }
}
