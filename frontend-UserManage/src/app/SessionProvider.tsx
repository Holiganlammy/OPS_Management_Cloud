"use client"
import { SessionProvider } from "next-auth/react"


export const CustomProvider = ({ children }: { children: React.ReactNode }) => {
    return (<SessionProvider>{children}</SessionProvider>)
}