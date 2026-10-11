"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { registerPhone } from "@/lib/api";

/** Display as "12345 - 67890", matching the Figma "- 00000" placeholder split. */
function formatPhone(digits: string) {
  return digits.length > 5 ? `${digits.slice(0, 5)} - ${digits.slice(5)}` : digits;
}

export default function LoginPage() {
  const router = useRouter();
  const [digits, setDigits] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = digits.length === 10;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    const res = await registerPhone(digits);
    if (res.ok) {
      router.push(`/otp?phone=${digits}`);
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-safe pt-6">
      <BackButton className="ml-1" />

      <header className="mt-4 flex flex-col gap-2 pl-px">
        <h1 className="font-mulish text-2xl font-bold leading-8 text-ink">Sign Up to Fastor</h1>
        <p className="max-w-[327px] font-mulish text-sm leading-[1.5] text-muted">
          Let us know your mobile number and we will send you an OTP for verification.
        </p>
      </header>

      <form
        className="flex flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="mt-12 flex h-12 w-full items-center rounded-lg border border-line bg-field pl-5 pr-4">
          <span className="w-[42px] shrink-0 font-mulish text-base font-bold leading-3 text-ink">+91</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            autoFocus
            aria-label="Mobile number"
            placeholder="00000 - 00000"
            value={formatPhone(digits)}
            onChange={(e) => {
              setDigits(e.target.value.replace(/\D/g, "").slice(0, 10));
              setError(null);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "phone-error" : undefined}
            className="min-w-0 flex-1 bg-transparent font-mulish text-base font-medium leading-3 text-ink caret-brand-light outline-none placeholder:text-placeholder"
          />
        </label>
        {error && (
          <p id="phone-error" role="alert" className="mt-2 font-mulish text-xs text-[#E5383B]">
            {error}
          </p>
        )}

        <div className="mt-auto flex flex-col items-center gap-2 pt-10">
          <PrimaryButton type="submit" disabled={!valid || loading} aria-busy={loading}>
            {loading ? "Sending OTP…" : "Get OTP"}
          </PrimaryButton>
          <p className="font-mulish text-[10px] leading-[1.5] text-muted">
            By clicking, I accept the <span className="font-medium text-ink">Terms &amp; Conditions</span> and{" "}
            <span className="font-medium text-ink">Privacy Policy</span>
          </p>
        </div>
      </form>
    </div>
  );
}
