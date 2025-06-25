"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { userColumns } from "@/components/DataTable/Column"
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