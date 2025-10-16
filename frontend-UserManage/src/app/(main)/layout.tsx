// app/(main)/layout.tsx
// "use client"

// import { useSession, signOut } from "next-auth/react"
// import { useRouter, usePathname } from "next/navigation"
// import { useEffect, useState, useRef } from "react"
// import SiteHeader from "@/components/NavSideBar/NavSideBar"
// import client from "@/lib/axios/interceptors"
// import dataConfig from "@/config/config"

// export default function MainLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const pathname = usePathname()
//   const [isChecking, setIsChecking] = useState(true)
//   const [isAllowed, setIsAllowed] = useState(false)
//   const checkStarted = useRef(false)

//   useEffect(() => {
//     if (checkStarted.current) return
//     checkStarted.current = true

//     async function checkAccess() {
//       if (status === "loading") {
//         setIsChecking(true)
//         return
//       }

//       //  เช็ค token error
//       if (session?.error === "TokenExpired") {
//         console.log("[AUTH] Token expired, logging out")
//         await signOut({ redirect: true, callbackUrl: "/login" })
//         return
//       }

//       // หน้า public
//       const publicPaths = ["/", "/home"]
//       const currentPath = pathname.split("?")[0]
      
//       if (publicPaths.includes(currentPath)) {
//         setIsAllowed(true)
//         setIsChecking(false)
//         return
//       }

//       // ไม่มี session
//       if (!session?.user?.UserID) {
//         router.replace(`/login?redirect=${pathname}`)
//         return
//       }

//       try {
//         const response = await client.post(
//           `/Apps_List_Menu`,
//           { UserID: session.user.UserID },
//           { headers: dataConfig().header }
//         )

//         const menus = response.data || []
//         const allowedPaths = menus
//           .filter((m: any) => m.path !== null && m.path !== undefined && m.path !== "")
//           .map((m: any) => m.path.split("?")[0])

//         const hasAccess = allowedPaths.some((path: string) => 
//           currentPath === path || currentPath.startsWith(path + "/")
//         )

//         if (hasAccess) {
//           setIsAllowed(true)
//           setIsChecking(false)
//         } else {
//           router.replace("/unauthorized")
//         }
//       } catch (error: any) {
//         //  ถ้า API return 401 → interceptor จะ logout ให้
//         console.error("Error checking access:", error)
        
//         // ถ้าไม่ใช่ 401 ให้ไป unauthorized
//         if (error.response?.status !== 401) {
//           router.replace("/unauthorized")
//         }
//       }
//     }

//     checkAccess()
//   }, [session, status, pathname, router])

//   useEffect(() => {
//     checkStarted.current = false
//     setIsChecking(true)
//     setIsAllowed(false)
//   }, [pathname])

//   if (status === "loading" || isChecking || !isAllowed) {
//     return (
//       <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative">
//             <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-purple-600"></div>
//             <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full border-4 border-purple-600/20"></div>
//           </div>
//           <div className="flex flex-col items-center gap-2">
//             <p className="text-sm font-medium text-foreground">Verifying access</p>
//             <p className="text-xs text-muted-foreground animate-pulse">Please wait...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <SiteHeader>
//       {children}
//     </SiteHeader>
//   )
// }

import SiteHeader from "@/components/NavSideBar/NavSideBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SiteHeader>
      {children}
      </SiteHeader>
    </div>
  );
}
