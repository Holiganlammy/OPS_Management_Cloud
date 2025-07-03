"use client"
import * as React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CustomProvider } from "./SessionProvider";
import StoreProvider from "./StoreProvider";
import { CheckSession } from './CheckSession';
import { usePathname } from 'next/navigation';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()
  const isNotSpecialRoute = !['/forgetPassword', '/login'].includes(pathname);

  return (
    <html lang="en">
      <head>
        <title>New OPS</title>
        <meta name='new_ops' content='New OPS' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
