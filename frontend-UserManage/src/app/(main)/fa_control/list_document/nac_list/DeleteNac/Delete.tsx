import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface DeleteUserDialogProps {
  nac: List_NAC | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserDeleted?: () => void // callback เมื่อลบสำเร็จ
}

export default function DeleteUserDialog({ nac, open, onOpenChange, onUserDeleted }: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async () => {
    if (!nac) return;
    // setIsLoading(true);
    // try {
    //   const response = await client.put(`/user/delete/${nac.nac_code}`, {
    //     headers: dataConfig().header
    //   });
    //   const data = await response.data;

    //   if (response.status === 200) {
    //     onOpenChange(false);
    //     setShowSuccessAlert(true);
    //     if (onUserDeleted) {
    //       onUserDeleted();
    //     }
    //     setTimeout(() => {
    //       setShowSuccessAlert(false);
    //     }, 5000);
    //   } else {
    //     throw new Error(data.message || "Failed to delete user");
    //   }

    // } catch (error: any) {
    //   console.error("Error deleting user:", error);
    //   setErrorMessage(error.message || "เกิดข้อผิดพลาดในการลบผู้ใช้");
    //   setShowErrorAlert(true);
    //   setTimeout(() => {
    //     setShowErrorAlert(false);
    //   }, 5000);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <>
      {/* Alert Dialog for Deleting User */}
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบผู้ใช้</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบใบงาน <strong>{nac?.nac_code}</strong>?
              <br />
              การดำเนินการนี้จะทำให้ผู้ใช้ไม่สามารถดูเอกสารได้ แต่ข้อมูลยังคงอยู่ในระบบ
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "กำลังลบ..." : "ลบผู้ใช้"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Toast Alert */}
      {showSuccessAlert && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
          <Alert className="w-96 bg-green-50 border-green-200 shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">ลบข้อมูลสำเร็จ!</AlertTitle>
            <AlertDescription className="text-green-700">
              ลบเอกสาร {nac?.nac_code} เรียบร้อยแล้ว
            </AlertDescription>
            <button
              onClick={() => setShowSuccessAlert(false)}
              className="absolute top-2 right-2 text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </div>
      )}
      {/* Error Toast Alert */}
      {showErrorAlert && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
          <Alert variant="destructive" className="w-96 shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>เกิดข้อผิดพลาด!</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{errorMessage}</p>
              <ul className="list-inside list-disc text-sm">
                <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
                <li>ลองใหม่อีกครั้ง</li>
                <li>หากยังไม่ได้ กรุณาติดต่อผู้ดูแลระบบ</li>
              </ul>
            </AlertDescription>
            <button
              onClick={() => setShowErrorAlert(false)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </div>
      )}
    </>
  )
}