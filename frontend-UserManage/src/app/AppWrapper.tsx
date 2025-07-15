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
          <React.Suspense fallback={<>Loading...</>}>
            <CheckSession mustCheck={isNotSpecialRoute}>
              {children}
            </CheckSession>
          </React.Suspense>
        </div>
      </StoreProvider>
    </CustomProvider>
  );
}
