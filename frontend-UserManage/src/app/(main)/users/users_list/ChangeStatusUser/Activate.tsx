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
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';

interface ActivateDialogProps {
  user: UserEdit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserActivated?: () => void // callback เมื่อลบสำเร็จ
}

export default function ActivateDialog({ user, open, onOpenChange, onUserActivated }: ActivateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await client.put(`/user/activate/${user.UserID}`, {
        actived: "1"
      }, {
        headers: dataConfig().header
      });
      const data = await response.data;

      if (response.status === 200) {
        onOpenChange(false);
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          if (onUserActivated) {
            onUserActivated();
          }
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to delete user");
      }

    } catch (error: any) {
      console.error("Error deleting user:", error);
      setErrorMessage(error.message || "เกิดข้อผิดพลาดในการเปิดใช้งานผู้ใช้");
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Alert Dialog for Deleting User */}
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการเปิดใช้งานผู้ใช้</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะเปิดใช้งานผู้ใช้กลับคืน <strong>{user?.UserCode}</strong> ({user?.Fullname})?
              <br />
              การดำเนินการนี้จะทำให้ผู้ใช้สามารถเข้าสู่ระบบได้ แต่ข้อมูลยังคงอยู่ในระบบ
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "กำลังเปิดใช้งาน..." : "เปิดใช้งานผู้ใช้"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Toast Alert */}
      {showSuccessAlert && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
          <Alert className="w-96 bg-green-50 border-green-200 shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">เปิดใช้งานผู้ใช้สำเร็จ!</AlertTitle>
            <AlertDescription className="text-green-700">
              เปิดใช้งาน {user?.UserCode} กลับคืนเรียบร้อยแล้ว
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