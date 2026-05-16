import { lazy, Suspense, useEffect, useState } from "react";

const Inner = lazy(() => import("./branch-map-inner"));

export function BranchMap({ subscriberFilter = "all" }: { subscriberFilter?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[560px] w-full animate-pulse rounded-xl bg-muted" />;
  return (
    <Suspense fallback={<div className="h-[560px] w-full animate-pulse rounded-xl bg-muted" />}>
      <Inner subscriberFilter={subscriberFilter} />
    </Suspense>
  );
}
