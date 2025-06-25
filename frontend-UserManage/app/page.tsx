"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// import { refreshSession } from "@/lib/auth"
export default function Home(){
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)
  
    useEffect(() => {
      const sessionStr = localStorage.getItem('user-session')
      if (!sessionStr) {
        router.replace("/login") 
      } else {
        try {
          const session = JSON.parse(sessionStr)
          const now = Date.now()
  
          if (session.expireTime && session.expireTime > now) {
            // refreshSession() 
            setIsChecking(false)
          } else {
            // หมดอายุ
            localStorage.removeItem('user-session')
            router.replace("/login")
          }
        } catch {
          localStorage.removeItem('user-session')
          router.replace("/login")
        }
      }
    }, [router])
  
    if (isChecking) return null
  return(
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      <p>This is the main page of the application.</p>
    </div>
  )
}