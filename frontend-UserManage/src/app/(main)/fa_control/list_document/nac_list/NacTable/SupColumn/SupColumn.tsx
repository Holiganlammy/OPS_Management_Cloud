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
import { useState } from "react"
import DeleteUserDialog from "../../DeleteNac/Delete";

interface Props {
  nac: List_NAC;
  onUserFetched?: () => void
  branches: Branch[]
  list_nac: List_NAC[];
  departments: department[]
  positions: position[]
  sections: Section[]
}

export default function SupColumn({ nac, onUserFetched, list_nac, branches, departments, positions, sections }: Props) {
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
            onClick={() => navigator.clipboard.writeText(nac.nac_code || "")}
          >
            คัดลอกรหัสใบงาน
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>ดูรายละเอียด</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-red-600">
            ปิดใช้งานผู้ใช้
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        nac={nac}
        onUserDeleted={onUserFetched}
      />

    </>
  )
}