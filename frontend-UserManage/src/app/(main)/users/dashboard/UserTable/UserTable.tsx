"use client"

import { useEffect,  useMemo } from "react"
import { userColumns } from "@/app/(main)/users/dashboard/UserTable/Column"
import { DataTable } from "@/components/DataTable/DataTable"

export default function UserTable({ data, fetchUsers }: { data: UserData[]; fetchUsers: () => void }) {
  const columns = useMemo(() => userColumns(fetchUsers), [fetchUsers])
  
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["UserCode", "Fullname", "Email" , "Position" , "Depname"]}
        searchPlaceholder="ค้นหา..."
      />
    </div>
  )
}