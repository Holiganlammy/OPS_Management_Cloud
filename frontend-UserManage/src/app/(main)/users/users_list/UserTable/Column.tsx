"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import SupColumn from "@/app/(main)/users/users_list/UserTable/SupColumn/SupColumn"
import { Badge } from "@/components/ui/badge"

export const userColumns = (
  fetchUsers: () => void,
  data: UserData[],
  branches: Branch[],
  departments: department[],
  positions: position[],
  sections: Section[]
): ColumnDef<UserData>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "UserCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            รหัสผู้ใช้
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("UserCode")}</div>
      ),
      meta: {
        displayName: "รหัสผู้ใช้"
      }
    },
    {
      accessorKey: "Fullname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ชื่อ-นามสกุล
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const fullname = row.getValue("Fullname") as string
        // แยกส่วน code ออกจากชื่อ (เช่น "PAB:Pison Anekboonyapirom" -> "Pison Anekboonyapirom")
        const displayName = fullname.includes(':') ? fullname.split(':')[1] : fullname
        return <div className="max-w-[200px] truncate">{displayName}</div>
      },
      meta: {
        displayName: "ชื่อ-นามสกุล"
      }
    },
    {
      accessorKey: "Email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            อีเมล
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="lowercase max-w-[180px] truncate">
          {row.getValue("Email")}
        </div>
      ),
      meta: {
        displayName: "อีเมล"
      }
    },
    {
      accessorKey: "BranchName",
      header: "สาขา",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("BranchName")}</div>
      ),
      meta: {
        displayName: "สาขา"
      }
    },
    {
      accessorKey: "DepCode",
      header: "รหัสแผนก",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("DepCode")}</div>
      ),
      meta: {
        displayName: "แผนก"
      }
    },
    {
      accessorKey: "DepName",
      header: "แผนก",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("DepName")}</div>
      ),
      meta: {
        displayName: "แผนก"
      }
    },
    {
      accessorKey: "Position",
      header: "ตำแหน่ง",
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate">{row.getValue("Position")}</div>
      ),
      meta: {
        displayName: "ตำแหน่ง"
      }
    },
    {
      accessorKey: "Actived",
      header: "สถานะ",
      cell: ({ row }) => {
        const isActive = row.getValue("Actived") as boolean
        return (
          <Badge className={`${isActive ? " bg-green-400" : " bg-red-600"}`} variant={isActive ? "default" : "default"}>
            {isActive ? "ใช้งาน" : "ไม่ใช้งาน"}
          </Badge>
        )
      },
      meta: {
        displayName: "สถานะ"
      }
    },
    {
      accessorKey: "EmpUpper",
      header: "หัวหน้า",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("EmpUpper")}</div>
      ),
      meta: {
        displayName: "หัวหน้า"
      }
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return (
          <SupColumn
            user={user}
            onUserFetched={fetchUsers}
            users={data}
            branches={branches}
            departments={departments}
            positions={positions}
            sections={sections}
          />
        )
      },
    },

  ]