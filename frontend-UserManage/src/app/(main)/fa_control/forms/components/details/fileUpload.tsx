import { Import, Eye, AlertCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { uploadImageToCheckAPI } from "@/app/(main)/fa_control/service/faService";
import SafeImage from "@/components/errorImage";

export function FilePicker({
  field,
  idx,
  nac_code,
  type,
  errorString,
}: {
  field: any;
  idx: number;
  nac_code: string;
  type: string;
  errorString: any;
}) {
  const id = `upload-${idx}-${field.name.split(".").pop()}`;
  const file = field.value as File | undefined;
  const [open, setOpen] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);


  const handleClick = () => {
    if (file) {
      setOpen(true);
    } else {
      document.getElementById(id)?.click();
    }
  };

  const handleRemove = () => {
    field.onChange("");
    setUploadedUrl(null);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* input ซ่อน */}
      {!file && (
        <input
          id={id}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file && nac_code && type) {
              const response = await uploadImageToCheckAPI(file, nac_code, type);
              if (response?.url) {
                setUploadedUrl(response.url);
                field.onChange(response.url);
              }
            }
          }}
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
                {errorString && <AlertCircle className="w-4 h-4 text-red-500" />}
                {!errorString && type && <Import className="w-4 h-4" />}
              </div>
            </label>
          </DialogTrigger>
        )}

        {uploadedUrl && (
          <DialogContent className="max-w-sm p-4 space-y-4">
            <DialogTitle className="text-center text-base font-semibold">
              แสดงรูปภาพ
            </DialogTitle>

            <SafeImage src={uploadedUrl || field.value} alt="nac image" />

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
