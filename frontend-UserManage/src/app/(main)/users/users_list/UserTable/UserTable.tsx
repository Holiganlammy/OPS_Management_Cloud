"use client"

import { useEffect, useMemo } from "react"
import { userColumns } from "@/app/(main)/users/users_list/UserTable/Column"
import { DataTable } from "@/components/DataTable/DataTable"

interface Props {
  data: UserData[];
  fetchUsers: () => void
  branches: Branch[]
  departments: department[]
  positions: position[]
  sections: Section[]
}

export default function UserTable({ data, fetchUsers, branches, departments, positions, sections }: Props) {
  const columns = useMemo(
    () => userColumns(fetchUsers, data, branches, departments, positions, sections),
    [fetchUsers, data, branches, departments, positions, sections]
  )

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["UserCode", "Fullname", "Email", "Position", "DepName"]}
        searchPlaceholder="ค้นหา..."
      />
    </div>
  )
}