"use client"
import PageLoading from "@/components/PageLoading"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

export function CheckSession({ children, mustCheck }: { children: React.ReactNode, mustCheck: boolean }) {
  const { data: session, status } = useSession({ 
    required: false,
    onUnauthenticated() {
      // ✅ Callback เมื่อ unauthenticated
      if (mustCheck) {
        window.location.href = '/login'
      }
    }
  })
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // ✅ เช็คว่า status เป็น unauthenticated
    if (mustCheck && status === "unauthenticated" && !hasRedirected.current) {
      hasRedirected.current = true
      signOut({ redirect: false }).then(() => {
        router.push("/login")
      })
    }

    if (status === "authenticated") {
      hasRedirected.current = false
    }
  }, [mustCheck, status, router])

  if (mustCheck && status === "loading") {
    return <PageLoading />
  }

  if (mustCheck && status === "unauthenticated") {
    return null
  }

  return <>{children}</>
}