// app/therapy/page.tsx
import { Suspense } from "react";
import Therapy from "./therapy.client";

export default function TherapyPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Therapy />
    </Suspense>
  );
}
