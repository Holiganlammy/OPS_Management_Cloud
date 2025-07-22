"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { BookText, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";
import dayjs from "dayjs"
import client from "@/lib/axios/interceptors"
import dataConfig from "@/config/config"
import { useSession } from "next-auth/react"
import Swal from "sweetalert2"

export function getStatusColor(nac_status: number): string {
  const statusColors: Record<number, string> = {
    1: '#1E90FF',
    2: '#6495ED',
    3: '#FF69B4',
    4: '#00CED1',
    5: '#6A5ACD',
    6: '#008000',
    7: '#FFA500',
    8: '#F0E68C',
    11: '#F4A460',
    12: '#DDA0DD',
    13: '#6A5ACD',
    14: '#708090',
    15: '#6A5ACD',
    18: '#6A5ACD',
  };

  return statusColors[nac_status] ?? '#DC143C'; // default: สีแดง
}

export const nacColumns = (
  fetchNac: () => void, data: List_NAC[],
): ColumnDef<List_NAC>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nac_code",
      header: "เลขที่เอกสาร",
    },
    {
      accessorKey: "name",
      header: "หัวข้อรายการ",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "create_date",
      header: () => <div className="text-center whitespace-nowrap px-1">วันที่สร้างเอกสาร</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {dayjs(row.original.create_date).format('DD/MM/YYYY HH:mm')}
          </div>
        );
      },
    },
    {
      accessorKey: "create_by",
      header: () => <div className="text-center whitespace-nowrap px-1">ผู้ทำรายการ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.create_by}
          </div>
        );
      },
    },
    {
      accessorKey: "source_userid",
      header: () => <div className="text-center whitespace-nowrap px-1">ผู้ส่งมอบ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.source_userid}
          </div>
        );
      },
    },
    {
      accessorKey: "des_userid",
      header: () => <div className="text-center whitespace-nowrap px-1">ผู้รับมอบ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.des_userid}
          </div>
        );
      },
    },
    {
      accessorKey: "status_name",
      header: () => <div className="text-center whitespace-nowrap px-1">Status</div>,
      cell: ({ row }) => {
        const statusName = row.original.status_name;
        const statusColor = getStatusColor(row.original.nac_status || 0);
        return (
          <div className="flex justify-center items-center">
            <Badge
              className="text-white"
              style={{
                backgroundColor: statusColor,
              }}
            >
              {statusName}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "userid_approver",
      header: () => (
        <div className="text-center whitespace-nowrap px-1">
          Agency
        </div>
      ),
      cell: ({ row }) => {
        const s = row.original;
        const value =
          s.nac_status === 4 || s.nac_status === 14
            ? s.des_userid
            : s.nac_status === 12
              ? s.source_userid
              : s.userid_approver;

        return (
          <div className="text-center whitespace-nowrap px-1">
            {value}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center whitespace-nowrap px-1">Action</div>,
      cell: ({ row }) => {
        const data = row.original;
        const router = useRouter();
        const { data: session } = useSession();

        const handleView = () => {
          const type = data.workflowtypeid;
          const code = data.nac_code;
          if (type && code) {
            router.replace(`/fa_control/forms?nac_type=${type}&nac_code=${code}`);
          }
        };

        const handleDelete = async () => {
          const result = await Swal.fire({
            title: "แจ้งเตือน",
            text: `คุณกำลังจะลำการยกเลิกเอกสารเลขที่ ${data.nac_code}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ทำต่อ",
            cancelButtonText: "ยกเลิก",
          });
          if (result.isConfirmed) {
            try {
              const response = await client.post("/store_FA_control_drop_NAC", { usercode: session?.user.UserCode, nac_code: data.nac_code }, {
                headers: dataConfig().header,
              });
              if (response.status === 200) {
                fetchNac()
              }
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถยกเลิกรายการได้",
              });
            }
          };
        };

        return (
          <div className="flex items-center justify-center gap-4">
            <button
              className="cursor-pointer"
              onClick={handleView}
              title="View"
            >
              <BookText className="h-4 w-4 text-purple-700" />
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