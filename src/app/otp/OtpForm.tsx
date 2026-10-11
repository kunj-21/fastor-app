"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { icons } from "@/lib/assets";
import { loginWithOtp, registerPhone } from "@/lib/api";

const LENGTH = 6;
const RESEND_SECONDS = 30;

export function OtpForm() {
  const router = useRouter();
  const rawPhone = (useSearchParams().get("phone") ?? "").replace(/\D/g, "");
  const validPhone = rawPhone.length === 10;
  const phone = `+91 ${rawPhone.slice(0, 5)} ${rawPhone.slice(5)}`;
  const [code, setCode] = useState<string[]>(Array(LENGTH).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Landing here without a number (e.g. a refresh on /otp) → back to step 1.
  useEffect(() => {
    if (!validPhone) router.replace("/login");
  }, [validPhone, router]);

  const verify = async () => {
    if (!code.every(Boolean) || loading) return;
    setLoading(true);
    setError(null);
    const res = await loginWithOtp(rawPhone, code.join(""));
    if (res.ok) {
      router.replace("/home");
      router.refresh();
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  const resend = async () => {
    setSeconds(RESEND_SECONDS);
    setCode(Array(LENGTH).fill(""));
    setError(null);
    focus(0);
    const res = await registerPhone(rawPhone);
    if (!res.ok) setError(res.message);
  };

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const focus = (i: number) => inputs.current[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();

  const fill = (start: number, value: string) => {
    const chars = value.replace(/\D/g, "").slice(0, LENGTH - start).split("");
    if (!chars.length) return;
    setError(null);
    setCode((prev) => {
      const next = [...prev];
      chars.forEach((c, k) => (next[start + k] = c));
      return next;
    });
    focus(start + chars.length);
  };

  const complete = code.every(Boolean);

  const box = (i: number) => (
    <input
      key={i}
      ref={(el) => {
        inputs.current[i] = el;
      }}
      type="text"
      inputMode="numeric"
      autoComplete={i === 0 ? "one-time-code" : "off"}
      autoFocus={i === 0}
      aria-label={`Digit ${i + 1}`}
      maxLength={LENGTH}
      value={code[i]}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, "");
        if (!v) {
          setCode((p) => p.map((c, k) => (k === i ? "" : c)));
          return;
        }
        // Keep only the newly typed char when the box already had one.
        fill(i, v.length > 1 && code[i] ? v.slice(-1) : v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && !code[i]) {
          e.preventDefault();
          setCode((p) => p.map((c, k) => (k === i - 1 ? "" : c)));
          focus(i - 1);
        } else if (e.key === "ArrowLeft") focus(i - 1);
        else if (e.key === "ArrowRight") focus(i + 1);
      }}
      onPaste={(e) => {
        e.preventDefault();
        fill(i, e.clipboardData.getData("text"));
      }}
      aria-invalid={Boolean(error)}
      className={`h-12 w-9 rounded border bg-white text-center font-mulish text-xl font-semibold text-ink caret-brand-light outline-none focus:border-brand-light ${error ? "border-[#E5383B]" : "border-line"}`}
    />
  );

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-safe pt-6">
      <BackButton className="ml-px" />

      <header className="mt-[19px] flex flex-col gap-2">
        <h1 className="font-mulish text-2xl font-bold leading-8 text-ink">6-digit code</h1>
        <p className="font-mulish text-sm leading-[1.5] text-muted">
          Please enter the code we’ve sent to
          <br />
          <span className="font-bold text-ink">{phone}</span>
        </p>
      </header>

      <form
        className="flex flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          verify();
        }}
      >
        <div className="mt-[35px] flex flex-col items-start gap-3">
          <div className="flex items-center gap-[14px]">
            <div className="flex gap-[10px]">{[0, 1, 2].map(box)}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icons.otpDash} alt="" aria-hidden width={3.5} height={1.162} className="h-[1.162px] w-[3.5px]" />
            <div className="flex gap-[10px]">{[3, 4, 5].map(box)}</div>
          </div>

          <p className="font-mulish text-sm font-medium leading-[15px] tracking-[-0.28px] text-ink">
            I didn’t receive a code{" "}
            {seconds > 0 ? (
              <span className="font-bold text-brand-light">(00:{String(seconds).padStart(2, "0")})</span>
            ) : (
              <button
                type="button"
                onClick={resend}
                className="font-bold text-brand-light underline-offset-2 hover:underline"
              >
                Resend
              </button>
            )}
          </p>
          {error && (
            <p role="alert" className="font-mulish text-xs text-[#E5383B]">
              {error}
            </p>
          )}
        </div>

        <div className="mt-auto pt-10">
          <PrimaryButton type="submit" disabled={!complete || loading} aria-busy={loading}>
            {loading ? "Verifying…" : "Continue"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
