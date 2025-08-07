import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, RotateCcwKey  } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import client from '@/lib/axios/interceptors';
import dataConfig from '@/config/config';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  currentPassword: z.string().min(1, "กรุณากรอกรหัสผ่านปัจจุบัน"),
  userCode: z.string().min(1, "กรุณากรอก UserCode"),
  newPassword: z.string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .regex(/[A-Z]/, "รหัสผ่านต้องมีอย่างน้อย 1 ตัวอักษรใหญ่")
    .regex(/[0-9]/, "รหัสผ่านต้องมีอย่างน้อย 1 ตัวเลข")
    .regex(/[!@#$%^&*(),.?":{}|<>_-]/, "รหัสผ่านต้องมีอย่างน้อย 1 ตัวอักษรพิเศษ"),
  confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่")
  }).refine((data) => data.newPassword !== data.currentPassword, {
    message: "รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านเก่า",
    path: ["newPassword"],
  }).refine((data) => data.confirmPassword === data.newPassword, {
    message: "รหัสผ่านใหม่ไม่ตรงกัน",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function ChangePasswordDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void; }) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: session } = useSession();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      userCode: session?.user?.UserCode || ""
    },
    mode: "onChange",
    criteriaMode: "all"  
  });

  const watchedNewPassword = form.watch("newPassword");

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(null), 300);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setError(null);
    setShowError(false);

    try {
      console.log("Changing password with values:", values);
      const response = await client.post('/user/change-password', values, {
        headers: dataConfig().header
      });

      if (response.status === 200) {
          setIsSuccess(true);
          setTimeout(() => {
              setIsSuccess(false);
              setOpen(false);
              resetForm();
          }, 3000);
      } else {
          setError("รหัสผ่านปัจจุบันไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
          setTimeout(() => setShowError(true), 100);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
      setTimeout(() => setShowError(true), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password || password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'อ่อน', color: 'text-red-600' };
    if (password.length < 8) return { strength: 2, text: 'ปานกลาง', color: 'text-yellow-600' };

    let score = 2;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score >= 5) return { strength: 4, text: 'แข็งแกร่งมาก', color: 'text-green-600' };
    if (score >= 4) return { strength: 3, text: 'แข็งแกร่ง', color: 'text-green-500' };
    return { strength: 2, text: 'ปานกลาง', color: 'text-yellow-600' };
  };

  const passwordStrength = getPasswordStrength(watchedNewPassword);

  const resetForm = () => {
    form.reset();
    setError(null);
    setShowError(false);
    setIsSuccess(false);
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-xl text-green-600">
                เปลี่ยนรหัสผ่านสำเร็จ
              </DialogTitle>
              <DialogDescription className="text-slate-600 leading-relaxed">
                รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว
                <br />
                กรุณาใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งต่อไป
              </DialogDescription>
            </DialogHeader>

            <p className="text-sm text-slate-500">
              หน้าต่างจะปิดโดยอัตโนมัติในอีกสักครู่...
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="w-12 h-12 bg-gray-300S rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcwKey className="w-6 h-6 text-black" />
              </div>
              <DialogTitle className="text-center">เปลี่ยนรหัสผ่าน</DialogTitle>
              <DialogDescription className="text-center">
                เพื่อความปลอดภัย กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <div className="space-y-4">
                {error && (
                  <Alert
                    variant="destructive"
                    className={`transition-all duration-300 ease-in-out transform ${showError ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสผ่านปัจจุบัน</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.current ? "text" : "password"}
                            placeholder="กรอกรหัสผ่านปัจจุบัน"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสผ่านใหม่</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.new ? "text" : "password"}
                            placeholder="กรอกรหัสผ่านใหม่"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </FormControl>

                      {/* Password Strength Indicator */}
                      {watchedNewPassword && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strength === 1 ? 'w-1/4 bg-red-500' :
                                  passwordStrength.strength === 2 ? 'w-2/4 bg-yellow-500' :
                                    passwordStrength.strength === 3 ? 'w-3/4 bg-green-500' :
                                      passwordStrength.strength === 4 ? 'w-full bg-green-600' : 'w-0'
                                  }`}
                              ></div>
                            </div>
                            <span className={`text-xs font-medium ${passwordStrength.color}`}>
                              {passwordStrength.text}
                            </span>
                          </div>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ยืนยันรหัสผ่านใหม่</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.confirm ? "text" : "password"}
                            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">ข้อกำหนดรหัสผ่าน:</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${watchedNewPassword && watchedNewPassword.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      อย่างน้อย 8 ตัวอักษร
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${watchedNewPassword && /[A-Z]/.test(watchedNewPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      มีตัวพิมพ์ใหญ่
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${watchedNewPassword && /[0-9]/.test(watchedNewPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      มีตัวเลข
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${watchedNewPassword && /[^A-Za-z0-9]/.test(watchedNewPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      มีอักขระพิเศษ
                    </li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading || !form.formState.isValid}
                    className="flex-1"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    เปลี่ยนรหัสผ่าน
                  </Button>
                </div>
              </div>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}