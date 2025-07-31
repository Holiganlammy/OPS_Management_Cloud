"use client"

import { useEffect, useMemo } from "react"
import { DataTable } from "@/components/DataTable/DataTable"
import { nacColumns } from "./Column";

interface Props {
  data: CountAssetRow[];
  fetchAssetsCounted: () => void
}

export default function AssetsCountedTable({ data, fetchAssetsCounted }: Props) {
  const columns = useMemo(
    () => nacColumns(fetchAssetsCounted, data),
    [fetchAssetsCounted, data]
  )

  useEffect(() => {
    fetchAssetsCounted()
  }, [fetchAssetsCounted])

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["Code", "Name", "BranchID", "OwnerID", "Position", "typeCode",]}
        searchPlaceholder="ค้นหา..."
      />
    </div>
  )
}