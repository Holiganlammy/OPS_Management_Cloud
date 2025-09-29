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
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectGroup } from "@radix-ui/react-select";

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
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.detail}
          </div>
        );
      },
    },
    {
      accessorKey: "Reference",
      header: () => <div className="whitespace-nowrap text-center px-1">สถานะครั้งนี้</div>,
      cell: ({ row }) => {
        const [value, setValue] = useState(row.original.Reference || "none");
        const [loading, setLoading] = useState(false);
        const { data: session, status } = useSession({
  required: false,
});

        const handleChange = async (newValue: string) => {
          setValue(newValue);
          setLoading(true);

          const payload = {
            roundid: row.original.RoundID,
            code: row.original.Code,
            status: row.original.remarker === "ยังไม่ได้ตรวจนับ" ? 0 : 1,
            comment: row.original.comment ?? "",
            reference: newValue,
            image_1: row.original.ImagePath,
            image_2: row.original.ImagePath_2,
            userid: session?.user.UserID,
            UserBranch: String(session?.user.branchid ?? "")
          };

          try {
            await client.post("/FA_Control_UpdateDetailCounted", JSON.stringify(payload), {
              headers: dataConfig().header
            });

            Swal.fire({
              icon: "success",
              title: "เปลี่ยนสถานะสำเร็จ",
              text: `สถานะของ '${row.original.Code}' ถูกเปลี่ยนเป็น "${newValue}" แล้ว`,
              timer: 2000,
              showConfirmButton: false,
            });

            fetchAssetsCounted(); // Refresh table data
            setLoading(false);
          } catch (error: any) {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: error.response?.data?.message || "ไม่สามารถบันทึก Reference ได้",
            });
            setLoading(false);
          }
        };

        const getStatusColor = (status: string) => {
          switch (status) {
            case "สภาพดี":
              return "text-green-600 bg-green-50 border-green-200";
            case "ชำรุดรอซ่อม":
              return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "รอตัดชำรุด":
              return "text-red-600 bg-red-50 border-red-200";
            case "QR Code ไม่สมบูรณ์ (สภาพดี)":
              return "text-blue-600 bg-blue-50 border-blue-200";
            case "QR Code ไม่สมบูรณ์ (ชำรุดรอซ่อม)":
              return "text-orange-600 bg-orange-50 border-orange-200";
            case "QR Code ไม่สมบูรณ์ (รอตัดชำรุด)":
              return "text-purple-600 bg-purple-50 border-purple-200";
            default:
              return "text-gray-600 bg-gray-50 border-gray-200";
          }
        };

        return (
          <div className="flex justify-center w-full">
            <Select value={value} onValueChange={handleChange} disabled={loading}>
              <SelectTrigger 
                className={`
                  w-full max-w-[180px] h-8 text-xs border 
                  ${getStatusColor(value)}
                  ${loading ? 'opacity-50' : ''}
                `}
              >
                <SelectValue placeholder="เลือกสถานะ" />
              </SelectTrigger>

              <SelectContent className="text-xs max-w-[220px]">
                <SelectGroup>
                  <SelectLabel className="text-xs py-1 px-2">เลือกสถานะ</SelectLabel>
                  
                  <SelectItem value="none" className="text-xs py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span>none</span>
                    </div>
                  </SelectItem>
                  
                  <SelectItem value="สภาพดี" className="text-xs py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>สภาพดี</span>
                    </div>
                  </SelectItem>
                  
                  <SelectItem value="ชำรุดรอซ่อม" className="text-xs py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>ชำรุดรอซ่อม</span>
                    </div>
                  </SelectItem>
                  
                  <SelectItem value="รอตัดชำรุด" className="text-xs py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>รอตัดชำรุด</span>
                    </div>
                  </SelectItem>
                  
                  <SelectItem value="QR Code ไม่สมบูรณ์ (สภาพดี)" className="text-xs py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>QR Code ไม่สมบูรณ์ (สภาพดี)</span>
                    </div>
                  </SelectItem>
                  
                  <SelectItem value="QR Code ไม่สมบูรณ์ (ชำรุดรอซ่อม)" className="text-xs py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span>QR Code ไม่สมบูรณ์ (ชำรุดรอซ่อม)</span>
                    </div>
                  </SelectItem>
                  
                  <SelectItem value="QR Code ไม่สมบูรณ์ (รอตัดชำรุด)" className="text-xs py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>QR Code ไม่สมบูรณ์ (รอตัดชำรุด)</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: () => <div className="text-center whitespace-nowrap px-1">ความคิดเห็น</div>,
      cell: ({ row }) => {
        const [currentValue, setCurrentValue] = useState(row.original.comment ?? "");
        const [loading, setLoading] = useState(false);
        const { data: session, status } = useSession({
  required: false,
});

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
            userid: session?.user.UserID,
            UserBranch: session?.user.branchid,
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
      header: () => <div className="whitespace-nowrap px-1 text-center">ผลการตรวจนับ</div>,
      cell: ({ row }) => {
        const initialValue = row.original.remarker || "ยังไม่ได้ตรวจนับ";
        const [value, setValue] = useState(initialValue);
        const [loading, setLoading] = useState(false);
        const { data: session, status } = useSession({
  required: false,
});

        const handleChange = async (selected: string) => {
          setValue(selected);
          setLoading(true);

          const payload = {
            roundid: row.original.RoundID,
            code: row.original.Code,
            status: selected === "ยังไม่ได้ตรวจนับ" ? 0 : 1,
            comment: row.original.comment ?? "",
            reference: row.original.Reference,
            image_1: row.original.ImagePath,
            image_2: row.original.ImagePath_2,
            userid: session?.user.UserID,
            UserBranch: String(session?.user.branchid ?? "")
          };

          try {
            await client.post("/FA_Control_UpdateDetailCounted", JSON.stringify(payload), {
              headers: dataConfig().header
            });

            Swal.fire({
              icon: "success",
              title: "อัปเดตสถานะสำเร็จ",
              text: `สถานะของ '${row.original.Code}' ถูกเปลี่ยนเป็น "${selected}" แล้ว`,
              timer: 2000,
              showConfirmButton: false,
            });

            fetchAssetsCounted();
            setLoading(false);
          } catch (error: any) {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: error.response?.data?.message || "ไม่สามารถบันทึกผลการตรวจนับได้",
            });
            setLoading(false);
          }
        };

        const getBadgeColor = (status: string) => {
          if (status === "ตรวจนับแล้ว") return "#10b981"; // green-500
          if (status === "ยังไม่ได้ตรวจนับ") return "#f59e0b"; // amber-500
          if (status === "ต่างสาขา") return "#ef4444"; // red-500
          return "#6b7280"; // gray-500
        };

        return (
          <div className="flex justify-center">
            <Badge
              className="relative px-2 py-0.5 text-sm rounded-md text-white min-w-[90px] h-8 justify-center"
              style={{ backgroundColor: getBadgeColor(value) }}
            >
              <Select value={value} onValueChange={handleChange} disabled={loading}>
                <SelectTrigger
                  className="bg-transparent text-white text-xs border-none focus:ring-0 px-0 w-full h-5"
                >
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>

                <SelectContent className="text-black text-xs min-w-[120px]">
                  <SelectGroup>
                    <SelectLabel className="text-xs py-1">สถานะ</SelectLabel>
                    <SelectItem value="ยังไม่ได้ตรวจนับ" className="text-xs py-1">ยังไม่ได้ตรวจนับ</SelectItem>
                    <SelectItem value="ตรวจนับแล้ว" className="text-xs py-1">ตรวจนับแล้ว</SelectItem>
                    <SelectItem value="ต่างสาขา" className="text-xs py-1">ต่างสาขา</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-md">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </Badge>
          </div>
        );
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