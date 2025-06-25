import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditUserDialog from "../../EditUser/EditUserDialog"
import DeleteUserDialog from "@/components/DeleteUser/Delete"
import { useState } from "react"
export default function SupColumn({ user , onUserFetched }: { user: UserData; onUserFetched?: () => void }) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    return (
        <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Action Menu</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.UserID)}
            >
              คัดลอก User ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.Email)}
            >
              คัดลอกอีเมล
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>ดูรายละเอียด</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>แก้ไขข้อมูล</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-red-600">
              ปิดใช้งานผู้ใช้
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <EditUserDialog open={editOpen} onOpenChange={setEditOpen} user={user} />
        <DeleteUserDialog open={deleteOpen} onOpenChange={setDeleteOpen} user={user} onUserDeleted={onUserFetched} />
        </>
    )
}