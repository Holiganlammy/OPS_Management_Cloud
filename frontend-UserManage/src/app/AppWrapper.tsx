"use client";
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { CheckSession } from './CheckSession';
import { CustomProvider } from "./SessionProvider";
import StoreProvider from "./StoreProvider";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNotSpecialRoute = !['/login', '/forgetPassword'].includes(pathname);

  return (
    <CustomProvider>
      <StoreProvider>
        <div id="hero" className="w-full">
          <CheckSession mustCheck={isNotSpecialRoute}>
            <React.Suspense fallback={<>Loading...</>}>
              {children}
            </React.Suspense>
          </CheckSession>
        </div>
      </StoreProvider>
    </CustomProvider>
  );
}
