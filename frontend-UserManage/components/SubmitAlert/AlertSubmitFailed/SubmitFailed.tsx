import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleX, X } from "lucide-react";

export default function SubmitFailed({ showErrorAlert, fullNameValue, setShowErrorAlert }: { showErrorAlert: boolean; fullNameValue: string; setShowErrorAlert: (show: boolean) => void }) {
  return (
    showErrorAlert && (
      <div className="fixed bottom-4 right-4 z-[49] animate-in slide-in-from-right-full duration-300">
        <Alert className="w-96 bg-red-50 border-red-200 shadow-lg">
          <CircleX className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">เกิดข้อผิดพลาด!</AlertTitle>
          <AlertDescription className="text-red-700 whitespace-normal">
            ไม่สามารถลงทะเบียนผู้ใช้ {fullNameValue} ได้ กรุณาลองใหม่อีกครั้ง
          </AlertDescription>
          <button
            onClick={() => setShowErrorAlert(false)}
            className="absolute top-2 right-2 cursor-pointer text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </Alert>
      </div>
    )
  );
}