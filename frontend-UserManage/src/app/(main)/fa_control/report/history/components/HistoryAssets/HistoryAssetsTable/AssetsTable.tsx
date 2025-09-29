"use client"

import { useEffect, useMemo } from "react"
import { DataTable } from "@/components/DataTable/DataTable"
import { HistoryAssetColumns } from "./Column";

interface Props {
  data: HistoryAssetType[];
  fetchHistoryAssets: () => void
}

export default function HistoryAssetsTable({ data, fetchHistoryAssets }: Props) {
  const columns = useMemo(
    () => HistoryAssetColumns(fetchHistoryAssets, data),
    [fetchHistoryAssets, data]
  )

  useEffect(() => {
    fetchHistoryAssets()
  }, [fetchHistoryAssets])

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["nac_code", "nacdtl_assetsCode", "nacdtl_assetsName", "nacdtl_assetsPrice", "OwnerID", "nacdtl_date_asset","account_aprrove_id"]}
        searchPlaceholder="ค้นหา..."
      />
    </div>
  )
}