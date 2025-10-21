// hooks/useAutoRefreshSession.ts
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { sessionRefreshService } from "@/lib/sessionRefreshService";

export function useAutoRefreshSession() {
  const { update, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      sessionRefreshService.start(async () => {
        await update();
      });
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.body.removeAttribute('data-scroll-locked');
      }, 100);
    }

    if (status === "unauthenticated") {
      sessionRefreshService.stop();
    }
  }, [status, update]);
}