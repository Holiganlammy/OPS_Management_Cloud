import { Import, Eye, XCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { uploadImageToCheckAPI } from "@/app/(main)/fa_control/forms/service/faService";
import SafeImage from "@/components/errorImage";
import client from "@/lib/axios/interceptors"
import dataConfig from "@/config/config"
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

interface FilePickerProps {
  imageUrl?: string;
  fieldName: "ImagePath" | "ImagePath_2";
  original: CountAssetRow;
  onChange: (url: string) => void;
}

export function FilePickerV2({
  imageUrl,
  fieldName,
  original,
  onChange,
}: FilePickerProps) {
  const id = `upload-${original.Code}-${fieldName}`;
  const [open, setOpen] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(imageUrl);
  const file = imageUrl as File | undefined;
  const { data: session, status } = useSession({
  required: false,
});

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const response = await uploadImageToCheckAPI(file, original.Code || "", fieldName);
      if (response?.url) {
        setUploadedUrl(response.url);
        onChange(response.url);
        const payload = {
          roundid: original.RoundID,
          code: original.Code,
          status: original.remarker === "ยังไม่ได้ตรวจนับ" ? 0 : 1,
          comment: original.comment,
          reference: original.Reference,
          image_1: fieldName === "ImagePath" ? response.url : original.ImagePath,
          image_2: fieldName === "ImagePath_2" ? response.url : original.ImagePath_2,
          userid: session?.user.UserID,
        };
        
        try {
          await client.post("/FA_Control_UpdateDetailCounted", JSON.stringify(payload), {
            headers: dataConfig().header
          });
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.response?.data?.message || "ไม่สามารถบันทึกความคิดเห็นได้",
          });
        }
      }
    }
  };

  const handleRemove = () => {
    onChange(""); // clear image
    setUploadedUrl(undefined);
    setOpen(false);
  };

  const handleClick = () => {
    if (id) {
      if (file) {
        setOpen(true);
      } else {
        document.getElementById(id)?.click();
      }
    }
  };

  if (id) {
    return (
      <div className="flex items-center gap-2">
        {/* input ซ่อน */}
        {!file && (
          <input
            id={id}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
        )}

        {file && (
          <button
            type="button"
            onClick={handleClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors ${file ? "bg-emerald-100" : "bg-red-100"
              } cursor-pointer`}
            title={file ? "ดูรูปภาพ" : "อัปโหลดรูปภาพ"}
          >
            {file ? <Eye className="w-4 h-4 text-green-600" /> : <Import className="w-4 h-4 text-red-700" />}
          </button>
        )}

        {/* ถ้ามีไฟล์: กดเพื่อดูรูป | ถ้ายังไม่มี: กดเพื่อเลือก */}
        <Dialog open={open} onOpenChange={setOpen}>
          {!file && (
            <DialogTrigger asChild>
              <label htmlFor={id} className="cursor-pointer">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors">
                  <Import className="w-4 h-4" />
                </div>
              </label>
            </DialogTrigger>
          )}

          {uploadedUrl && (
            <DialogContent className="max-w-sm p-4 space-y-4">
              <DialogTitle className="text-center text-base font-semibold">
                แสดงรูปภาพ
              </DialogTitle>

              <SafeImage src={uploadedUrl} alt="nac image" />

              <div className="text-center text-sm text-gray-700">
                {uploadedUrl.split("/").pop()}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                >
                  ลบไฟล์นี้
                </button>
              </div>
            </DialogContent>
          )}

        </Dialog>
      </div >
    );
  }
}
