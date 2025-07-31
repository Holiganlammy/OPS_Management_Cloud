import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleX, X } from "lucide-react";

interface SubmitFailedProps {
  showErrorAlert: boolean;
  setShowErrorAlert: (show: boolean) => void;
  title?: string;
  message?: string;
  fullNameValue?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  autoHide?: boolean;
  autoHideDelay?: number;
}

export default function SubmitFailed({
    showErrorAlert, 
    fullNameValue, 
    setShowErrorAlert,
    title = "เกิดข้อผิดพลาด!",
    message,
    position = 'bottom-right',
    autoHide = false,
    autoHideDelay = 3000

  }: SubmitFailedProps) {
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
    if (fullNameValue) return `ไม่สามารถลงทะเบียนผู้ใช้ ${fullNameValue} ได้ กรุณาลองใหม่อีกครั้ง`;
    return "เกิดข้อผิดพลาดในการดำเนินการ";
  };
  // Auto hide functionality
  if (autoHide && showErrorAlert) {
    setTimeout(() => {
      setShowErrorAlert(false);
    }, autoHideDelay);
  }
  return (
    showErrorAlert && (
      <div className={`fixed z-[49] animate-in duration-300 ${getPositionClass()}`}>
        <Alert className="w-96 bg-red-50 border-red-200 shadow-lg">
        <CircleX className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">{title}</AlertTitle>
        <AlertDescription className="text-red-700 whitespace-normal">
            {getDisplayMessage()}
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