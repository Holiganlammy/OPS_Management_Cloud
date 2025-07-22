"use client";
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { CheckSession } from './CheckSession';
import { CustomProvider } from "./SessionProvider";
import StoreProvider from "./StoreProvider";
import PageLoading from '@/components/PageLoading';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNotSpecialRoute = !['/login', '/forgetPassword'].includes(pathname);

  return (
    <CustomProvider>
      <StoreProvider>
        <div id="hero" className="w-full">
          <React.Suspense fallback={<PageLoading />}>
            <CheckSession mustCheck={isNotSpecialRoute}>
              {children}
            </CheckSession>
          </React.Suspense>
        </div>
      </StoreProvider>
    </CustomProvider>
  );
}
