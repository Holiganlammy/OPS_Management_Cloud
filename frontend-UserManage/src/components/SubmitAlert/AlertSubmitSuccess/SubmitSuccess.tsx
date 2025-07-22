"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, X } from "lucide-react";

interface SubmitSuccessProps {
  showSuccessAlert: boolean;
  setShowSuccessAlert: (show: boolean) => void;
  title?: string;
  message?: string;
  fullNameValue?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  autoHide?: boolean;
  autoHideDelay?: number;
}

export default function SubmitSuccess({ 
  showSuccessAlert, 
  setShowSuccessAlert, 
  title = "ดำเนินการสำเร็จ!",
  message,
  fullNameValue,
  position = 'bottom-right',
  autoHide = false,
  autoHideDelay = 3000
}: SubmitSuccessProps) {

  const getPositionClass = () => {
    switch (position) {
      case 'bottom-left': return 'bottom-4 left-4 slide-in-from-left-full';
      case 'top-right': return 'top-4 right-4 slide-in-from-right-full';
      case 'top-left': return 'top-4 left-4 slide-in-from-left-full';
      default: return 'bottom-4 right-4 slide-in-from-right-full';
    }
  };

  const getDisplayMessage = () => {
    if (message) return message;
    if (fullNameValue) return `ผู้ใช้ ${fullNameValue} ได้ลงทะเบียนเรียบร้อยแล้ว`;
    return "การดำเนินการเสร็จสิ้น";
  };

  // Auto hide functionality
  if (autoHide && showSuccessAlert) {
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, autoHideDelay);
  }

  return (
    showSuccessAlert && (
      <div className={`fixed z-50 animate-in duration-300 ${getPositionClass()}`}>
        <Alert className="w-96 bg-green-50 border-green-200 shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">{title}</AlertTitle>
          <AlertDescription className="text-green-700">
            {getDisplayMessage()}
          </AlertDescription>
          <button
            onClick={() => setShowSuccessAlert(false)}
            className="absolute top-2 right-2 text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </div>
    )
  )
}