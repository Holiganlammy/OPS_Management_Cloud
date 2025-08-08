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
import EditUserDialog from "@/app/(main)/users/users_list/EditUser/EditUserDialog"
import DeleteUserDialog from "@/app/(main)/users/users_list/ChangeStatusUser/Delete"
import { useState } from "react"
import ActivateDialog from "../../ChangeStatusUser/Activate"
import { set } from "date-fns"

interface Props {
  user: UserData;
  onUserFetched?: () => void
  branches: Branch[]
  users: UserData[];
  departments: department[]
  positions: position[]
  sections: Section[]
}

export default function SupColumn({ user, onUserFetched, users, branches, departments, positions, sections }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)
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
          {user.Actived === true ? (
            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}>
              ปิดใช้งานผู้ใช้
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="text-green-600" onClick={() => setActivateOpen(true)}>
              เปิดใช้งานผู้ใช้
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        users={users}
        branches={branches}
        departments={departments}
        positions={positions}
        sections={sections}
        onUserUpdated={onUserFetched}
      />

      <ActivateDialog
        user={user}
        open={activateOpen}
        onOpenChange={setActivateOpen}
        onUserActivated={onUserFetched}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={user}
        onUserDeleted={onUserFetched}
      />

    </>
  )
}