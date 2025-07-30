"use client"

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable"
import { nacColumns } from "./Column";

interface Props {
  data: Period[];
  fetchPeriod: () => void
}

export default function NacTable({ data, fetchPeriod }: Props) {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [draftRows, setDraftRows] = useState<Record<number, Partial<Period>>>({});

  const columns = useMemo(() =>
    nacColumns(fetchPeriod, data, editingRowId, setEditingRowId, draftRows, setDraftRows),
    [fetchPeriod, data, editingRowId, draftRows]);

  useEffect(() => {
    fetchPeriod();
  }, [fetchPeriod]);

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["BranchID", "Description", "personID", "DepCode", "Code"]}
        searchPlaceholder="ค้นหา..."
      />
    </div>
  );
}