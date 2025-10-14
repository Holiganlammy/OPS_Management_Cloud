// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/lib/store";
import { useAutoRefreshSession } from "@/hooks/useAutoRefreshSession";
import { useRefreshOnNavigation } from "@/hooks/useRefreshOnNavigation";
import { CheckSession } from "./CheckSession";
import { Suspense } from "react";
import PageLoading from "@/components/PageLoading";

// ⭐ Component สำหรับ Auto refresh (ไม่มี pathname)
function AutoRefreshWrapper({ children }: { children: React.ReactNode }) {
  useAutoRefreshSession();
  return <>{children}</>;
}


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        {/* ⭐ Auto refresh - ไม่ re-render */}
        <AutoRefreshWrapper>
          {/* ⭐ Navigation refresh - re-render ได้ แต่แยกออกมา */}
            <Suspense fallback={<PageLoading />}>
              <CheckSession>
                <div id="hero" className="w-full">
                  {children}
                </div>
              </CheckSession>
            </Suspense>
        </AutoRefreshWrapper>
      </ReduxProvider>
    </SessionProvider>
  );
}