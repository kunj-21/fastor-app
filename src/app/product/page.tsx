import { Suspense } from "react";
import { ProductView } from "./ProductView";

export default function ProductPage() {
  return (
    <Suspense>
      <ProductView />
    </Suspense>
  );
}
