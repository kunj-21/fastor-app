import { Suspense } from "react";
import { OtpForm } from "./OtpForm";

export default function OtpPage() {
  return (
    <Suspense>
      <OtpForm />
    </Suspense>
  );
}
