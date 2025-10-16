// components/TokenManage/TokenMonitor.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertCircleIcon } from "lucide-react"
import { set } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

interface SessionToken {
  expires: string
  user: {
    Email: string
    UserCode: string
    UserID: number
    access_token: string
    fristName: string
    lastName: string
    img_profile: string
    role_id: number
    branchid: number
    depid: number
  }
}

export function TokenMonitor() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const publicPaths = ["/login", "/forget_password", "/reset-password", "/unauthorized", "/"]
    if (publicPaths.includes(pathname)) {
      return
    }

    if (status !== "authenticated" || !session) {
      return
    }

    console.log("[AUTH] 🔍 Session expires:", session.expires)

    const checkInterval = setInterval(() => {
      const token = session as SessionToken
      
      if (token.expires) {
        const expiresDate = new Date(token.expires)
        const expiresTime = expiresDate.getTime()
        const now = Date.now()
        
        const remaining = expiresTime - now
        const remainingSeconds = Math.floor(remaining / 1000)
        const remainingMinutes = Math.floor(remainingSeconds / 60)
        
        //  ถ้าหมดอายุแล้ว → แสดง dialog
        if (remaining <= 0) {
          console.log("[AUTH] ❌ Session expired, showing dialog...")
          setIsDialogOpen(true)
          clearInterval(checkInterval)
        } 
        //  ถ้าเหลือเวลาน้อยกว่า 5 นาที → แสดงแจ้งเตือน
        else if (remainingSeconds < 5 * 60) {
          setTimeRemaining(remainingMinutes)
          setShowWarning(true)
          setTimeout(() => {
            setShowWarning(false)
          }, 10000);
          console.warn(`[AUTH] ⚠️ Session expiring in ${remainingMinutes} minutes`)
        } else {
          setShowWarning(false)
        }
      }
    }, 10 * 1000)

    return () => {
      clearInterval(checkInterval)
    }
  }, [session, status, pathname])

  //  ฟังก์ชัน logout
  const handleLogout = async () => {
    setIsDialogOpen(false)
    await signOut({ 
      redirect: false
    })
  }

  return (
    <>
      {/*  แจ้งเตือนก่อนหมดอายุ */}
      {showWarning && (
        <div className='fixed right-7 bottom-5 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <Alert variant="default">
            <AlertCircleIcon className='items-center' />
            <AlertTitle className='text-lg font-semibold'>Session กำลังจะหมดอายุ</AlertTitle>
            <AlertDescription>
              <p>Session ของท่านกำลังจะหมดอายุ ในอีก 5 นาที</p>
              <ul className="list-inside list-disc text-sm">
                <li>กรุณาดำเนินการก่อนที่เซสชันจะหมดอายุ</li>
                <li>หากเซสชันหมดอายุ ท่านจะต้องล็อกอินใหม่อีกครั้ง</li>
                <li>เพื่อความปลอดภัยของข้อมูล กรุณาออกจากระบบเมื่อเลิกใช้งาน</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/*  Dialog เมื่อ session หมดอายุ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          className="sm:max-w-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-gray-400 dark:bg-black flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-black dark:text-black" />
              </div>
              <div>
                <DialogTitle className="text-xl">Session หมดอายุ</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  กรุณาเข้าสู่ระบบอีกครั้ง
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Session ของคุณหมดอายุแล้ว เพื่อความปลอดภัยของข้อมูล กรุณาเข้าสู่ระบบใหม่อีกครั้ง
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="w-full bg-black hover:bg-gray-700 text-white"
            >
              ตกลง - ออกจากระบบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}