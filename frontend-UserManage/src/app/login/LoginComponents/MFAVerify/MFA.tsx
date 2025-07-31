"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Shield, Smartphone, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import client from "@/lib/axios/interceptors";
import dataConfig from "@/config/config";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type MfaDialogProps = {
  showMfaDialog: boolean;
  setShowMfaDialog: (value: boolean) => void;
  redirectPath: string;
  userLogin: string;
  otpExpiresAt: number | null;
};

export default function MfaDialog({
  showMfaDialog,
  setShowMfaDialog,
  redirectPath,
  userLogin,
  otpExpiresAt
}: MfaDialogProps) {
  const [otpCode, setOtpCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpExpiresAtState, setOtpExpiresAtState] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const router = useRouter();

  const formSchema = z.object({
    trustDevice: z.boolean(),
  });
  type FormSchema = z.infer<typeof formSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trustDevice: false,
    }
  });

  useEffect(() => {
    if (otpExpiresAt) {
      setOtpExpiresAtState(otpExpiresAt);
      setRemainingSeconds(Math.max(Math.ceil((otpExpiresAt - Date.now()) / 1000), 0));
    }
  }, [otpExpiresAt]);

  useEffect(() => {
    if (!otpExpiresAtState) return;

    const updateRemaining = () => {
      const secondsLeft = Math.max(Math.ceil((otpExpiresAtState - Date.now()) / 1000), 0);
      setRemainingSeconds(secondsLeft);
    };

    updateRemaining()

    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresAtState]);

  const handleVerifyOTP = async () => {
    setIsVerifying(true);
    setMfaError("");

    try {
      const trustDevice = form.getValues("trustDevice");
      console.log("Trust Device:", trustDevice);
      const res = await signIn("credentials", {
        redirect: false,
        otpCode,
        usercode: userLogin,
        trustDevice
      });
      if (!res?.ok || res.error === "OTP_INVALID") {
        setMfaError("OTP ไม่ถูกต้อง หรือหมดอายุ");
        setOtpCode("");
        return;
      }

      if (res?.ok && !res?.error) {
        setShowMfaDialog(false);
        router.push(redirectPath);
      } else {
        setMfaError("เข้าสู่ระบบไม่สำเร็จ");
        setOtpCode("");
      }

    } catch (error) {
      console.error("OTP verification failed:", error);
      setMfaError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await client.post("/resend-otp", { usercode: userLogin }, {
        headers: dataConfig().header,
      });

      const data = await res.data;

      if (data.success) {
        setOtpCode("");
        setRemainingSeconds(0);
        setOtpExpiresAtState(data.expiresAt);
        setMfaError("");
      } else {
        setMfaError("ไม่สามารถส่งรหัสใหม่ได้ กรุณาลองอีกครั้ง");
      }
    } catch (err) {
      console.error("Resend OTP failed:", err);
      setMfaError("เกิดข้อผิดพลาดในการส่งรหัสใหม่");
    }
  };

  const isComplete = otpCode.length === 6;

  return (
    <Dialog open={showMfaDialog} onOpenChange={setShowMfaDialog}>
      <DialogContent className="sm:max-w-md mx-auto bg-white border border-gray-200">

        <DialogHeader className="text-center space-y-4 pb-2">
          {/* <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div> */}

          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              ยืนยันตัวตน
            </DialogTitle>
            <p className="text-gray-600 mt-2 text-sm">
              กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมลของคุณ
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* User info card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ผู้ใช้งาน</p>
                <p className="font-semibold text-gray-900">{userLogin}</p>
              </div>
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={(val) => {
                  setOtpCode(val);
                  if (mfaError) setMfaError("");
                }}
                className="gap-3"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-white"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-white"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-white"
                  />
                </InputOTPGroup>
                <InputOTPSeparator className="text-gray-400">
                  <div className="w-2 h-0.5 bg-gray-400 rounded"></div>
                </InputOTPSeparator>
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-white"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-white"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-12 text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 bg-white"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center">
              <div className="flex gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-1 rounded-full transition-all duration-200 ${i < otpCode.length
                      ? 'bg-gray-900'
                      : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Error message */}
          {mfaError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{mfaError}</p>
            </div>
          )}

          {/* Success state for complete OTP */}
          {isComplete && !mfaError && !isVerifying && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700 text-sm font-medium">รหัส OTP ครบถ้วนแล้ว</p>
            </div>
          )}

          {/* Verify button */}
          <Button
            className={`w-full h-12 rounded-lg font-semibold text-white transition-all duration-300 ${isComplete && !isVerifying
              ? 'bg-gray-900 hover:bg-gray-800 active:bg-gray-700'
              : 'bg-gray-300 cursor-not-allowed'
              } ${isVerifying ? 'animate-pulse' : ''}`}
            onClick={handleVerifyOTP}
            disabled={!isComplete || isVerifying}
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                กำลังตรวจสอบ...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                ยืนยันรหัส OTP
              </div>
            )}
          </Button>
          <div className="flex justify-center">
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="trustDevice"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormControl>
                        <Checkbox
                          id="trustDevice"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl> */}
                      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-black has-[[aria-checked=true]]:bg-gray-200 dark:has-[[aria-checked=true]]:border-gray-400 dark:has-[[aria-checked=true]]:bg-gray-950">
                        <Checkbox
                          defaultChecked
                          id="trustDevice"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white dark:data-[state=checked]:border-black dark:data-[state=checked]:bg-black"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm leading-none font-medium">
                            Trust Device
                          </p>
                          <p className="text-muted-foreground text-sm">
                            เลือกตัวเลือกนี้หากคุณต้องการให้ระบบจดจำอุปกรณ์นี้เพื่อไม่ต้องยืนยัน MFA ในครั้งถัดไป
                          </p>
                        </div>
                      </Label>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          {/* Help text */}
          <div className="text-center space-y-2">
            {remainingSeconds > 0 && (
              <p className="text-xs text-gray-500">
                รหัส OTP จะหมดอายุใน {Math.floor(remainingSeconds / 60) >= 1 ? `${Math.floor(remainingSeconds / 60)} นาที ${remainingSeconds % 60} วินาที` : `${remainingSeconds % 60} วินาที`}
              </p>
            )}
            {remainingSeconds <= 240 && (
              <>
                <button onClick={handleResendOTP} className="text-xs text-gray-700 hover:text-gray-900 underline transition-colors cursor-pointer">
                  ส่งรหัสใหม่อีกครั้ง
                </button>
                <p className="text-xs text-gray-500">
                  ไม่ได้รับรหัส OTP? ตรวจสอบในกล่องข้อความอีเมลของคุณหรือตรวจสอบว่าอุปกรณ์ของคุณเชื่อมต่ออินเทอร์เน็ตอยู่ หรือไม่
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}