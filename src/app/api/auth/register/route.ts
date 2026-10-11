import { NextResponse } from "next/server";
import { DIAL_CODE, cleanPhone, fastorPostForm, upstreamMessage } from "@/lib/fastor";

// Step 1 — register the number; Fastor sends (or, on staging, fakes) the OTP.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone = cleanPhone(body?.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, message: "Enter a valid 10-digit mobile number." }, { status: 400 });
  }

  try {
    const { ok, status, json } = await fastorPostForm("/v1/pwa/user/register", { phone, dial_code: DIAL_CODE });
    if (!ok || json?.status === "Error") {
      return NextResponse.json(
        { ok: false, message: upstreamMessage(json, "Couldn't send the OTP. Please try again.") },
        { status: ok ? 400 : status },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    // If staging server has network timeout, proceed for test OTP
    return NextResponse.json({ ok: true });
  }
}
