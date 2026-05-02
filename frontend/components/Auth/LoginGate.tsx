"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getGlowGuideUser, gatedPath } from "@/lib/session";

export function LoginGate() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (getGlowGuideUser()) return;
    const query = window.location.search.replace(/^\?/, "");
    const destination = query ? `${pathname}?${query}` : pathname;
    router.replace(gatedPath(destination));
  }, [pathname, router]);

  return null;
}
