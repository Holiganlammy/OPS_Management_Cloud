"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Save, Trash2 } from "lucide-react"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import dataConfig from "@/config/config"
import client from "@/lib/axios/interceptors"
import Swal from "sweetalert2"
import { useState } from "react"

export const nacColumns = (
  fetchPeriod: () => void, data: Period[]
): ColumnDef<Period>[] => [
    {
      accessorKey: "PeriodID",
      header: () => <div className="text-center whitespace-nowrap px-1">ID</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.PeriodID}
          </div>
        );
      },
    },
    {
      accessorKey: "Description",
      header: "หัวข้อรายการ",
      cell: ({ row }) => row.original.Description,
    },
    {
      accessorKey: "BeginDate",
      header: () => <div className="text-center whitespace-nowrap px-1">วันที่เริ่มต้น</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {dayjs(row.original.BeginDate).format('DD/MM/YYYY HH:mm')}
          </div>
        );
      },
    },
    {
      accessorKey: "EndDate",
      header: () => <div className="text-center whitespace-nowrap px-1">วันที่สิ้นสุด</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {dayjs(row.original.EndDate).format('DD/MM/YYYY HH:mm')}
          </div>
        );
      },
    },
    {
      accessorKey: "BranchID",
      header: () => <div className="text-center whitespace-nowrap px-1">หน่วยงาน</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {Number(row.original.BranchID) === 901 ? "HO" : "CO"}
          </div>
        );
      },
    },
    {
      accessorKey: "personID",
      header: () => <div className="text-center whitespace-nowrap px-1">Location NAC</div>,
      cell: ({ row }) => {
        if (Number(row.original.BranchID) === 901) {
          if (row.original.personID && row.original.DepCode) {
            return (
              <div className="flex justify-center items-center">
                {row.original.personID}
              </div>
            );
          } else if (row.original.DepCode && !row.original.personID) {
            return (
              <div className="flex justify-center items-center">
                {row.original.DepCode}
              </div>
            );
          }
        } else if (Number(row.original.BranchID) !== 901 && !row.original.DepCode && !row.original.personID) {
          return (
            <div className="flex justify-center items-center">
              {row.original.Code}
            </div>
          );;
        }
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center whitespace-nowrap px-1">Status</div>,
      cell: ({ row }) => {
        const nac = row.original;
        const isClosed = dayjs(nac.EndDate).isBefore(dayjs());
        const statusText = isClosed ? 'ปิดการใช้งานแล้ว' : 'เปิดการใช้งาน';
        const statusColor = isClosed ? 'red' : 'green';
        return (
          <div className="flex justify-center items-center">
            <Badge style={{ backgroundColor: statusColor }}>
              {statusText}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "Actions",
      header: () => <div className="text-center whitespace-nowrap px-1">Action</div>,
      cell: ({ row }) => {
        const data = row.original;
        const { data: session } = useSession();
        const [editing, setEditing] = useState(false);

        const handleView = async () => {
          setEditing(true);
          try {
            const rowEdit = {
              PeriodID: data.PeriodID,
              Description: data.Description,
              BeginDate: data.BeginDate,
              EndDate: data.EndDate,
              BranchID: data.BranchID,
              DepCode: data.DepCode,
              personID: data.personID,
              Code: data.Code,
              usercode: session?.user.UserCode,
            };

            const response = await client.post(
              "/FA_Period_update_period",
              rowEdit,
              { headers: dataConfig().header }
            );

            if (response.status === 200) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "แก้ไขข้อมูลเรียบร้อยแล้ว",
              });
              fetchPeriod(); // รีเฟรชตาราง
              setEditing(false);
            }
          } catch (error: any) {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: JSON.stringify(error.response),
            });
          }
        };

        const handleDelete = async () => {
          const result = await Swal.fire({
            title: "แจ้งเตือน",
            text: `คุณกำลังยกเลิก ${data.Description}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ทำต่อ",
            cancelButtonText: "ยกเลิก",
          });

          if (result.isConfirmed) {
            try {
              const response = await client.post(
                "/deletePeriod",
                { PeriodID: data.PeriodID },
                { headers: dataConfig().header }
              );
              if (response.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: "สำเร็จ",
                  text: "ลบข้อมูลเรียบร้อยแล้ว",
                });
                fetchPeriod();
              }
            } catch (error: any) {
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: JSON.stringify(error.response.data.message),
              });
            }
          }
        };

        return (
          <div className="flex items-center justify-center gap-4">
            <button
              className="bg-orange cursor-pointer"
              onClick={handleView}
              title="Edit"
              disabled={editing}
            >
              <Save className="h-4 w-4 text-blue-700" />
            </button>

            <button
              className="cursor-pointer"
              onClick={handleDelete}
              title="Cancel"
            >
              <Trash2 className="h-4 w-4 text-red-700" />
            </button>
          </div>
        );
      }
    }
  ]