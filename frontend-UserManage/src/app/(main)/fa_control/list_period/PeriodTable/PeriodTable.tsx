"use client"

import { useEffect, useMemo } from "react"
import { DataTable } from "@/components/DataTable/DataTable"
import { nacColumns } from "./Column";

interface Props {
  data: Period[];
  fetchPeriod: () => void
}

export default function NacTable({ data, fetchPeriod }: Props) {
  const columns = useMemo(
    () => nacColumns(fetchPeriod, data),
    [fetchPeriod, data]
  )

  useEffect(() => {
    fetchPeriod()
  }, [fetchPeriod])

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