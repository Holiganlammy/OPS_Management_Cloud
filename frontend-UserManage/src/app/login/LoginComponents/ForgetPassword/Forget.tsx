"use client";
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(null), 300);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateEmail = (email: string) => {
    if (!email) return "กรุณากรอกอีเมล";
    if (!/\S+@\S+\.\S+/.test(email)) return "กรุณากรอกอีเมลให้ถูกต้อง";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowError(false);

    try {
      const response = await client.post(`/forgot-password`, JSON.stringify({ email }), {
        headers: dataConfig().header
      });
      const data = await response.data;

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.error || "ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => window.history.back();
  const handleResend = () => {
    setIsSubmitted(false);
    setEmail("");
    setEmailError("");
    setError(null);
    setShowError(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-300 flex items-center justify-center">
      <div className="w-full max-w-[640px] flex justify-center">
        <div className="bg-white rounded-xl shadow-lg max-w-[450px] p-10 border border-gray-200 w-full">
          {isSubmitted ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">เช็คอีเมลของคุณ</h2>
              <p className="text-gray-600 text-sm mb-6">
                เราส่งลิงก์รีเซ็ตรหัสผ่านไปยัง:
                <br />
                <span className="font-medium">{email}</span>
              </p>
              <button
                onClick={handleBack}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition font-medium mb-3"
              >
                กลับเข้าสู่ระบบ
              </button>
              <button
                onClick={handleResend}
                className="w-full border border-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-100 transition font-medium"
              >
                ส่งใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-gray-700" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">รีเซ็ตรหัสผ่าน</h1>
                <p className="text-sm text-gray-600">
                  ป้อนอีเมลของคุณ แล้วเราจะส่งลิงก์สำหรับรีเซ็ตให้
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className={`mb-4 ${showError ? "opacity-100" : "opacity-0"} transition-opacity`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(validateEmail(e.target.value));
                    }}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black ${emailError ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="your@email.com"
                  />
                  {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !!emailError}
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  ส่งลิงก์รีเซ็ตรหัสผ่าน
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleBack}
                  className="text-sm text-gray-500 hover:text-gray-800 transition flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  กลับไปเข้าสู่ระบบ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
