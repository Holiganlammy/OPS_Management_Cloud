"use client"

import { useEffect, useMemo } from "react"
import { DataTable } from "@/components/DataTable/DataTable"
import { nacColumns } from "./Column";

interface Props {
  data: List_NAC[];
  fetchNac: () => void
  nacStatus: { nac_status_id: number; status_name: string; }[]
}

export default function NacTable({ data, fetchNac, nacStatus }: Props) {
  const columns = useMemo(
    () => nacColumns(fetchNac, data, nacStatus),
    [fetchNac, data, nacStatus]
  )

  useEffect(() => {
    fetchNac()
  }, [fetchNac])

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["nac_code", "name", "source_userid", "des_userid", "status_name"]}
        searchPlaceholder="ค้นหา..."
      />
    </div>
  )
}