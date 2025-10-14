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
    }

    if (status === "unauthenticated") {
      sessionRefreshService.stop();
    }
  }, [status, update]);
}