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
  console.log("data in table", data);

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["Code", "Name", "UserID", "OwnerID", "Reference",]}
        searchPlaceholder="ค้นหา..."
      />
    </div>
  )
}