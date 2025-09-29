"use client"
import { SessionProvider } from "next-auth/react"


export const CustomProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider
            refetchInterval={5 * 60} // 10 minutes
            refetchOnWindowFocus={true}
            refetchWhenOffline={false}
        >
            {children}
        </SessionProvider>
    )
}