"use client";

import Image from "next/image";
import logoPure from "@/image/Picture1.png";
import { useSearchParams } from "next/navigation";
import SourceDetails from "./components/header/SourceDetails";
import DesDetails from "./components/header/DesDetails";
import { UseFormReturn } from "react-hook-form";
import { CombinedForm } from "@/app/(main)/fa_control/forms/schema/combinedSchema";

interface Props {
  nac_code: string;
  form: UseFormReturn<CombinedForm>;
  userFetch: UserData[];
}

const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return '#1E90FF'; // DodgerBlue
    case 2:
      return '#6495ED'; // CornflowerBlue
    case 3:
      return '#FF69B4'; // HotPink
    case 4:
      return '#00CED1'; // DarkTurquoise
    case 5:
      return '#6A5ACD'; // SlateBlue
    case 6:
      return '#008000'; // Green
    case 7:
      return '#FFA500'; // Orange
    case 8:
      return '#F0E68C'; // Khaki
    case 11:
      return '#F4A460'; // SandyBrown
    case 12:
      return '#DDA0DD'; // Plum
    case 13:
      return '#6A5ACD'; // SlateBlue
    case 14:
      return '#708090'; // SlateGray
    case 15:
      return '#6A5ACD'; // SlateBlue
    case 18:
      return '#6A5ACD'; // SlateBlue
    default:
      return '#DC143C'; // Crimson for unknown statuses
  }
};

const nacTypeLabels: Record<string, string> = {
  "1": "เพิ่มบัญชีทรัพย์สิน",
  "2": "โยกย้ายทรัพย์สิน",
  "3": "เปลี่ยนแปลงรายละเอียดบัญชีทรัพย์สิน",
  "4": "ตัดบัญชีทรัพย์สิน",
  "5": "ขายบัญชีทรัพย์สิน",
};

export default function Header({ nac_code, form, userFetch }: Props) {
  const searchParams = useSearchParams();
  const nacType = searchParams.get("nac_type") || "1";
  const label = nacTypeLabels[nacType] || "เพิ่มบัญชีทรัพย์สิน";

  const showReceiver = nacType === "1" || nacType === "2" || nacType === "3";

  return (
    <div>

      {form.watch("status_name") && (
        <div className="flex justify-end">
          <div
            className="inline-block border rounded p-4 py-2 shadow text-md text-white font-medium"
            style={{
              minWidth: "200px",
              textAlign: "right",
              borderTopLeftRadius: '100%',
              borderBottomLeftRadius: '0%',
              backgroundColor: getStatusColor(form.watch("nac_status") ?? 0)
            }}
          >
            {form.watch("status_name")}
          </div>
        </div>
      )}

      <div className="bg-white border rounded p-4 shadow flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* โลโก้เพียวไทย */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Image
            src={logoPure}
            alt="Company Logo"
            width={120}
            height={120}
            priority={false}
            className="object-contain"
          />
        </div>

        {/* ข้อความหัวเรื่อง */}
        <div className="flex-1 text-center">
          <div className="text-lg font-bold text-gray-800">
            PURE THAI ENERGY CO., LTD.
          </div>
          <div className="text-sm text-gray-600">
            เปลี่ยนแปลงรายการทรัพย์สินถาวร (Notice of Asset Change - NAC)
          </div>
        </div>

        {/* กล่องสี่เหลี่ยม: รหัสเอกสาร */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="border rounded px-4 py-2 text-sm text-gray-600 bg-gray-50 shadow-inner">
            <span className="font-semibold">เลขที่เอกสาร:</span> {nac_code}
          </div>
        </div>
      </div>

      {/* Department Section */}
      <section className="bg-white border grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 items-stretch">
        {/* กล่อง 1: ประเภท NAC */}
        <div className="border rounded overflow-hidden flex flex-col">
          <div className="bg-zinc-700 text-white text-center py-2 font-semibold">
            ประเภทการเปลี่ยนแปลง
          </div>
          <div className="p-4 flex-grow flex items-center justify-center">
            <div className="font-bold text-xl text-primary text-center">{label}</div>
          </div>
        </div>

        {/* ผู้ส่งมอบ */}
        <SourceDetails form={form} userFetch={userFetch} />

        {/* ผู้รับมอบ */}
        <DesDetails form={form} userFetch={userFetch} showReceiver={showReceiver} />
      </section>


    </div>
  );
}
