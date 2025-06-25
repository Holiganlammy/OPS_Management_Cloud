// components/LogoutButton.tsx - ปุ่ม Logout
'use client'
import { useRouter } from 'next/navigation'
import { removeSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = () => {
        removeSession()
        router.push('/')
        router.refresh()
    }

    return (
        <Button 
            onClick={handleLogout}
            variant="destructive"
        >
            Logout
        </Button>
    )
}