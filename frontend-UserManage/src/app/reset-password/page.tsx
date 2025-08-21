"use client"

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2, X, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import client from '@/lib/axios/interceptors'
import dataConfig from '@/config/config'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import SubmitFailed from '@/components/SubmitAlert/AlertSubmitFailed/SubmitFailed'
import SubmitSuccess from '@/components/SubmitAlert/AlertSubmitSuccess/SubmitSuccess'


export default function ResetPasswordPage() {
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | ''>('')
  const [token, setToken] = useState('')
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [userID, setUserID] = useState<string>("")
  const [showSamePasswordAlert, setShowSamePasswordAlert] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false);
  const searchParams = useSearchParams()
  const router = useRouter()

  const formSchema = z.object({
    UserID: z.string(),
    token: z.string(),
    newPassword: z.string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .regex(/[A-Z]/, "รหัสผ่านต้องมีอย่างน้อย 1 ตัวอักษรใหญ่")
      .regex(/[a-z]/, "รหัสผ่านต้องมีอย่างน้อย 1 ตัวอักษรเล็ก")
      .regex(/[0-9]/, "รหัสผ่านต้องมีอย่างน้อย 1 ตัวเลข")
      .regex(/[!@#$%^&*(),.?":{}|<>_-]/, "รหัสผ่านต้องมีอย่างน้อย 1 ตัวอักษรพิเศษ"),
    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่")
  }).refine((data) => data.confirmPassword === data.newPassword, {
    message: "รหัสผ่านใหม่ไม่ตรงกัน",
    path: ["confirmPassword"],
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      UserID: userID,
      token: token,
    },
  });

  // Watch form values for validation display
  const watchedPassword = form.watch("newPassword");
  const watchedConfirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setToken(urlToken)
      validateToken(urlToken)
    } else {
      setMessage('Invalid or missing reset token')
      setMessageType('error')
      setTokenValid(false)
    }
  }, [searchParams])

  const validateToken = async (token: string) => {
    try {
      const response = await client.post('/validate-reset-token', { token }, {
        headers: dataConfig().header
      })
      const data = await response.data

      if (data.success === true) {
        setTokenValid(true)
        setUserID(data.UserID)
      } else {
        setTokenValid(false)
        setMessage(data.message || 'Invalid or expired token')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Token validation error:', error)
      setTokenValid(false)
      setMessage('Invalid or expired token')
      setMessageType('error')
    }
  }

  useEffect(() => {
    if (userID && token) {
      form.reset({
        ...form.getValues(),
        UserID: userID,
        token: token,
      });
    }
  }, [userID, token, form]);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8
    const hasUpper = /[A-Z]/.test(pass)
    const hasLower = /[a-z]/.test(pass)
    const hasNumber = /\d/.test(pass)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_-]/.test(pass)

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    }
  }

  const passwordValidation = validatePassword(watchedPassword || "")
  const passwordsMatch = watchedPassword === watchedConfirmPassword && watchedPassword !== ''

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setMessage('')
    setShowSamePasswordAlert(false)

    try {
      const response = await client.post('/reset-password', values, {
        headers: dataConfig().header,
      })

      const data = await response.data

      if (data.success) {
        setMessage('Password reset successfully! Redirecting to login...')
        setMessageType('success')
        setDisableSubmit(true);
        setTimeout(() => {
          router.push('/login')
          setDisableSubmit(false)
        }, 3000)
      } else {
        // Check if it's the same password error
        if (data.samePassword === true) {
          setShowSamePasswordAlert(true)
          setMessage(data.message || 'รหัสผ่านใหม่ไม่สามารถเป็นรหัสเดิมได้')
          setMessageType('warning')
          
          // Auto hide after 5 seconds
          setTimeout(() => {
            setShowSamePasswordAlert(false)
            setMessage('')
            setMessageType('')
          }, 5000)
        } else {
          setMessage(data.message || 'Failed to reset password')
          setErrorMessage(data.error || 'Failed to reset password')
          setShowErrorAlert(true)
          setTimeout(() => {
            setShowErrorAlert(false)
          }, 3000);
          setMessageType('error')
        }
      }
    } catch (error: any) {
      console.error('Reset password error:', error)
      setMessage(error.response.data.message)
      // setShowErrorAlert(true)
      setTimeout(() => {
        // setShowErrorAlert(false)
        setMessage('')
      }, 7000);
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-700">Validating Token</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Please wait while we verify your reset link...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Invalid Token</CardTitle>
            <CardDescription>
              The reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {message || 'Please request a new password reset link'}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Link href="/forgot-password" className="w-full">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
          <CardDescription>
            กรุณาใส่รหัสผ่านใหม่ของคุณด้านล่าง
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 mb-4">
              {/* Same Password Warning Alert */}
              {showSamePasswordAlert && (
                <Alert className="border-amber-200 bg-amber-50">
                  <RefreshCcw className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800 font-semibold">
                    ไม่สามารถใช้รหัสผ่านเดิมได้
                  </AlertTitle>
                  <AlertDescription className="text-amber-800">
                    รหัสผ่านใหม่ไม่สามารถเป็นรหัสเดิมที่คุณใช้อยู่ได้ กรุณาเลือกรหัสผ่านใหม่ที่แตกต่างจากเดิม
                  </AlertDescription>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 text-amber-600 hover:text-amber-800"
                    onClick={() => {
                      setShowSamePasswordAlert(false)
                      setMessage('')
                      setMessageType('')
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Alert>
              )}

              {/* Other Message Alerts */}
              {message && messageType !== 'warning' && (
                <Alert className={messageType === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                  {messageType === 'error' ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertDescription className={messageType === 'error' ? 'text-red-800' : 'text-green-800'}>
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Requirements */}
              {watchedPassword && (
                <div className="text-sm space-y-1">
                  <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordValidation.minLength ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    อย่างน้อย 8 ตัวอักษร
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordValidation.hasUpper ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    ตัวอักษรใหญ่ 1 ตัว
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordValidation.hasLower ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    ตัวอักษรเล็ก 1 ตัว
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordValidation.hasNumber ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    ตัวเลข 1 ตัว
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordValidation.hasSpecial ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    ตัวอักษรพิเศษ 1 ตัว
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Match Indicator */}
              {watchedConfirmPassword && (
                <div className={`flex items-center gap-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {passwordsMatch ? 'รหัสผ่านตรงกัน' : 'รหัสผ่านไม่ตรงกัน'}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !passwordValidation.isValid || !passwordsMatch || disableSubmit}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'กำลังรีเซ็ตรหัสผ่าน...' : 'รีเซ็ตรหัสผ่าน'}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
    <SubmitSuccess
      showSuccessAlert={messageType === 'success'}
      setShowSuccessAlert={(show) => {
        if (!show) {
          setMessageType('')
          setMessage('')
        }
      }}
      title="ดำเนินการสำเร็จ!"
      message={message}
      position="bottom-right"
      autoHide={true}
      autoHideDelay={3000}
    />
    <SubmitFailed
      message={errorMessage}
      showErrorAlert={showErrorAlert}
      setShowErrorAlert={setShowErrorAlert}
      title="เกิดข้อผิดพลาด!"
      position="bottom-right"
    />
    </>
  )
}