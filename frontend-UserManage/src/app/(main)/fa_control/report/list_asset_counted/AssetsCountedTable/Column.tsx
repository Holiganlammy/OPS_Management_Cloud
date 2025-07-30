"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { useState } from "react";
import client from "@/lib/axios/interceptors"
import dataConfig from "@/config/config"
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { FilePickerV2 } from "./fileUpload";

export const nacColumns = (
  fetchAssetsCounted: () => void, data: CountAssetRow[]
): ColumnDef<CountAssetRow>[] => [
    {
      accessorKey: "Code",
      header: () => <div className="text-center whitespace-nowrap px-1">รหัสทรัพย์สิน</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.Code}
          </div>
        );
      },
    },
    {
      accessorKey: "Name",
      header: "ชื่อทรัพย์สิน",
      cell: ({ row }) => row.original.Name,
    },
    {
      accessorKey: "OwnerID",
      header: () => <div className="text-center whitespace-nowrap px-1">ผู้ถือครอง</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.OwnerID}
          </div>
        );
      },
    },
    {
      accessorKey: "Date",
      header: () => <div className="text-center whitespace-nowrap px-1">วันที่ตรวจนับ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {dayjs(row.original.Date).format('DD/MM/YYYY HH:mm') === "Invalid Date" ? "" : dayjs(row.original.Date).format('DD/MM/YYYY HH:mm')}
          </div>
        );
      },
    },
    {
      accessorKey: "EndDate_Success",
      header: () => <div className="text-center whitespace-nowrap px-1">วันที่NACล่าสุด</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {dayjs(row.original.EndDate_Success).format('DD/MM/YYYY HH:mm') === "Invalid Date" ? "" : dayjs(row.original.EndDate_Success).format('DD/MM/YYYY HH:mm')}
          </div>
        );
      },
    },
    {
      accessorKey: "UserID",
      header: () => <div className="text-center whitespace-nowrap px-1">ผู้ตรวจ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.UserID}
          </div>
        );
      },
    },
    {
      accessorKey: "detail",
      header: () => <div className="whitespace-nowrap px-1">สถานะล่าสุด</div>,
      cell: ({ row }) => row.original.detail,
    },
    {
      accessorKey: "Reference",
      header: () => <div className="whitespace-nowrap px-1">สถานะครั้งนี้</div>,
      cell: ({ row }) => row.original.detail,
    },
    {
      accessorKey: "comment",
      header: () => <div className="text-center whitespace-nowrap px-1">ความคิดเห็น</div>,
      cell: ({ row }) => {
        const [currentValue, setCurrentValue] = useState(row.original.comment ?? "");
        const [loading, setLoading] = useState(false);
        const { data: session } = useSession();

        const handleBlur = async () => {
          setLoading(true);

          const payload = {
            roundid: row.original.RoundID,
            code: row.original.Code,
            status: row.original.remarker === "ยังไม่ได้ตรวจนับ" ? 0 : 1,
            comment: currentValue,
            reference: row.original.Reference,
            image_1: row.original.ImagePath,
            image_2: row.original.ImagePath_2,
            userid: session?.user.userid,
          };

          try {
            await client.post("/FA_Control_UpdateDetailCounted", JSON.stringify(payload), {
              headers: dataConfig().header
            });
            setLoading(false);
          } catch (error: any) {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: error.response?.data?.message || "ไม่สามารถบันทึกความคิดเห็นได้",
            });
            setLoading(false);
          }
        };

        return (
          <textarea
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleBlur}
            disabled={loading}
            className="w-full px-2 py-1 border rounded text-sm resize-none"
            rows={2}
            placeholder="ใส่ความคิดเห็น"
          />
        );
      },
    },
    {
      accessorKey: "remarker",
      header: () => <div className="whitespace-nowrap px-1">ผลการตรวจนับ</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <Badge
              className="text-white"
              style={{
                backgroundColor: row.original.remarker === 'ตรวจนับแล้ว' ? 'green' :
                  row.original.remarker === 'ยังไม่ได้ตรวจนับ' ? 'orange' : 'red',
              }}
            >
              {row.original.remarker}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="whitespace-nowrap px-1 text-center">ImgPath</div>,
      cell: ({ row }) => {
        const [imgPath1, setImgPath1] = useState(row.original.ImagePath);
        const [imgPath2, setImgPath2] = useState(row.original.ImagePath_2);

        return (
          <div className="flex items-center justify-center gap-2">
            <FilePickerV2
              imageUrl={imgPath1 || ""}
              fieldName="ImagePath"
              original={row.original}
              onChange={(url) => {
                setImgPath1(url);
              }}
            />
            <FilePickerV2
              imageUrl={imgPath2 || ""}
              fieldName="ImagePath_2"
              original={row.original}
              onChange={(url) => {
                setImgPath2(url)
              }}
            />
          </div>
        );
      },
    }
  ]