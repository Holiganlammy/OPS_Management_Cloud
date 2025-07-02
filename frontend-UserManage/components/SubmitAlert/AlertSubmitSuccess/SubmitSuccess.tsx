"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, X } from "lucide-react";
import { useState } from "react";

export default function SubmitSuccess({ showSuccessAlert, setShowSuccessAlert, fullNameValue }: { showSuccessAlert: boolean; setShowSuccessAlert: (show: boolean) => void; fullNameValue: string }) {
  return (
    showSuccessAlert && (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
        <Alert className="w-96 bg-green-50 border-green-200 shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">ลงทะเบียนสำเร็จ!</AlertTitle>
          <AlertDescription className="text-green-700">
            ผู้ใช้ {fullNameValue} ได้ลงทะเบียนเรียบร้อยแล้ว
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