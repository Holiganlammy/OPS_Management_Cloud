"use client"

import { useMemo } from "react"
import { userColumns } from "@/app/(main)/users/users_list/UserTable/Column"
import { DataTable } from "@/components/DataTable/DataTable"

interface Props {
  data: UserData[];
  fetchUsers: () => void
  branches: Branch[]
  departments: department[]
  positions: position[]
  sections: Section[]
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<React.SetStateAction<{
    pageIndex: number
    pageSize: number
  }>>
  onPageChange?: (newPage: number) => void
  onPageSizeChange?: (newSize: number) => void
  Loading?: boolean;
}

export default function UserTable({
  data,
  fetchUsers,
  branches,
  departments,
  positions,
  sections,
  pagination,
  setPagination,
  onPageChange,
  onPageSizeChange,
  Loading
}: Props) {
  const columns = useMemo(
    () => userColumns(fetchUsers, data, branches, departments, positions, sections),
    [fetchUsers, data, branches, departments, positions, sections]
  )
  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
    } else {
      setPagination((prev) => ({ ...prev, pageIndex: newPage }))
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize)
    } else {
      setPagination((prev) => ({ ...prev, pageSize: newSize, pageIndex: 0 }))
    }
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["UserCode", "Fullname", "Email", "Position", "DepName"]}
        searchPlaceholder="ค้นหา..."
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={pagination}
        Loading={Loading}
      />
    </div>
  )
}