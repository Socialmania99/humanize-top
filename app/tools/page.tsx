"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Directory } from "@/components/product/humanize";

function FilteredDirectory() {
  const query = useSearchParams();
  return (
    <Directory
      key={query.toString()}
      initialCategory={query.get("category") ?? "All"}
      initialAudience={query.get("audience") ?? "All"}
    />
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<Directory />}>
      <FilteredDirectory />
    </Suspense>
  );
}
