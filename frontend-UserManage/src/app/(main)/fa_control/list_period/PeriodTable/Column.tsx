"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import dataConfig from "@/config/config";
import client from "@/lib/axios/interceptors";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const nacColumns = (
  fetchPeriod: () => void,
  data: Period[],
  editingRowId: number | null,
  setEditingRowId: React.Dispatch<React.SetStateAction<number | null>>,
  draftRows: Record<number, Partial<Period>>,
  setDraftRows: React.Dispatch<React.SetStateAction<Record<number, Partial<Period>>>>
): ColumnDef<Period>[] => {

  const handleFieldChange = (
    rowId: number,
    field: keyof Period,
    value: any
  ) => {
    setDraftRows(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value
      }
    }));
  };

  return [
    {
      accessorKey: "PeriodID",
      header: () => <div className="text-center whitespace-nowrap px-1">ID</div>,
      cell: ({ row }) => <div className="flex justify-center items-center">{row.original.PeriodID}</div>,
    },
    {
      accessorKey: "Description",
      header: "หัวข้อรายการ",
      cell: ({ row }) => {
        const rowId = row.original.PeriodID;
        const isEditing = editingRowId === rowId;
        const value = editingRowId !== null ? draftRows[editingRowId]?.Description ?? row.original.Description : row.original.Description;

        return isEditing ? (
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => {
              if (rowId !== null) {
                handleFieldChange(rowId, "Description", e.target.value)
              }
            }}
            autoFocus
            className="border rounded px-2 py-1 w-full"
          />
        ) : (
          <div>
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "BeginDate",
      header: () => <div className="text-center whitespace-nowrap px-1">วันที่เริ่มต้น</div>,
      cell: ({ row }) => {
        const rowId = row.original.PeriodID;
        const isEditing = editingRowId === rowId;
        const value = editingRowId !== null ? draftRows[editingRowId]?.BeginDate ?? row.original.BeginDate : row.original.BeginDate;

        return isEditing ? (
          <input
            type="datetime-local"
            value={dayjs(value).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => {
              if (rowId !== null) {
                handleFieldChange(rowId, "BeginDate", new Date(e.target.value))
              }
            }}
            className="border rounded px-2 py-1 w-full"
          />
        ) : (
          <div className="flex justify-center items-center">
            {dayjs(value).format("DD/MM/YYYY HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "EndDate",
      header: () => <div className="text-center whitespace-nowrap px-1">วันที่สิ้นสุด</div>,
      cell: ({ row }) => {
        const rowId = row.original.PeriodID;
        const isEditing = editingRowId === rowId;
        const value = editingRowId !== null ? draftRows[editingRowId]?.EndDate ?? row.original.EndDate : row.original.EndDate;

        return isEditing ? (
          <input
            type="datetime-local"
            value={dayjs(value).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => {
              if (rowId !== null) {
                handleFieldChange(rowId, "EndDate", new Date(e.target.value))
              }
            }}
            className="border rounded px-2 py-1 w-full"
          />
        ) : (
          <div className="flex justify-center items-center">
            {dayjs(value).format("DD/MM/YYYY HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "BranchID",
      header: () => <div className="text-center whitespace-nowrap px-1">หน่วยงาน</div>,
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          {Number(row.original.BranchID) === 901 ? "HO" : "CO"}
        </div>
      ),
    },
    {
      accessorKey: "personID",
      header: () => <div className="text-center whitespace-nowrap px-1">Location NAC</div>,
      cell: ({ row }) => {
        const { BranchID, personID, DepCode, Code } = row.original;
        if (Number(BranchID) === 901) {
          return (
            <div className="flex justify-center items-center">
              {DepCode || "-"}
            </div>
          );
        }
        return (
          <div className="flex justify-center items-center">
            {Code || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center whitespace-nowrap px-1">Status</div>,
      cell: ({ row }) => {
        const isClosed = dayjs(row.original.EndDate).isBefore(dayjs());
        return (
          <div className="flex justify-center items-center">
            <Badge style={{ backgroundColor: isClosed ? "red" : "green" }}>
              {isClosed ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "Actions",
      header: () => <div className="text-center whitespace-nowrap px-1">Action</div>,
      cell: ({ row }) => {
        const { data: session } = useSession();
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const [localDraft, setLocalDraft] = useState<Partial<Period>>(row.original);

        const handleFieldChange = (field: keyof Period, value: any) => {
          setLocalDraft(prev => ({ ...prev, [field]: value }));
        };

        const handleDelete = async () => {
          const confirm = await Swal.fire({
            title: "แจ้งเตือน",
            text: `คุณกำลังลบ ${row.original.Description}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่ใช่",
          });

          if (confirm.isConfirmed && row.original.PeriodID) {
            try {
              const res = await client.post("/deletePeriod", { PeriodID: row.original.PeriodID }, {
                headers: dataConfig().header,
              });
              if (res.status === 200) {
                Swal.fire({ icon: "success", title: "ลบแล้ว", showConfirmButton: false, timer: 1500 });
                fetchPeriod();
              }
            } catch (error: any) {
              Swal.fire({ icon: "error", title: "ผิดพลาด", text: JSON.stringify(error.response.data.message) });
            }
          }
        };

        const handleSave = async () => {
          setLoading(true);
          try {
            const isChanged = (original: Period, draft: Partial<Period>) => {
              for (const key in draft) {
                const typedKey = key as keyof Period;
                if (draft[typedKey] !== undefined && draft[typedKey] !== original[typedKey]) {
                  return true;
                }
              }
              return false;
            };

            const original = row.original;
            const draft = localDraft;

            if (!isChanged(original, draft)) {
              setOpen(false);
              setLoading(false);
              return;
            }

            const payload = {
              ...original,
              ...draft,
              usercode: session?.user.UserCode,
            };

            const response = await client.post("/FA_Period_update_period", payload, {
              headers: dataConfig().header,
            });

            if (response.status === 200) {
              Swal.fire({ icon: "success", title: "สำเร็จ", text: "แก้ไขข้อมูลเรียบร้อยแล้ว" });
              fetchPeriod();
              setOpen(false);
            }
          } catch (error: any) {
            Swal.fire({ icon: "error", title: "ผิดพลาด", text: JSON.stringify(error.response) });
          } finally {
            setLoading(false);
          }
        };

        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex justify-center gap-4">
              <DialogTrigger asChild>
                <button className="cursor-pointer">
                  <Edit className="w-4 h-4 text-zinc-700" />
                </button>
              </DialogTrigger>
              <button onClick={handleDelete} disabled={loading} className="cursor-pointer">
                <Trash2 className="w-4 h-4 text-red-700" />
              </button>
            </div>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>แก้ไขรายการ</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <label className="font-medium">หัวข้อรายการ</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={localDraft.Description ?? ""}
                    onChange={(e) => handleFieldChange("Description", e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-medium">วันที่เริ่มต้น</label>
                  <input
                    type="datetime-local"
                    className="border rounded px-2 py-1 w-full"
                    value={dayjs(localDraft.BeginDate).format("YYYY-MM-DDTHH:mm")}
                    onChange={(e) => handleFieldChange("BeginDate", new Date(e.target.value))}
                  />
                </div>
                <div>
                  <label className="font-medium">วันที่สิ้นสุด</label>
                  <input
                    type="datetime-local"
                    className="border rounded px-2 py-1 w-full"
                    value={dayjs(localDraft.EndDate).format("YYYY-MM-DDTHH:mm")}
                    onChange={(e) => handleFieldChange("EndDate", new Date(e.target.value))}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button disabled={loading} onClick={handleSave}>
                  บันทึก
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  ยกเลิก
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
    }
  ];
};