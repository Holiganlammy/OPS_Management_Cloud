"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon, Eye, EyeOff, Loader2 } from "lucide-react"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link";
import { signIn } from 'next-auth/react';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/home';

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(null), 300);
      }, 10000)
      return () => clearTimeout(timer);
    }
  }, [error])

  const formSchema = z.object({
    loginname: z.string().min(1, "Username must be 2+ characters"),
    password: z.string().min(1, "Password must be 8+ characters")
  });

  type FormLogin = z.infer<typeof formSchema>;

  const form = useForm<FormLogin>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginname: "",
      password: ""
    }
  });

  const onSubmit = async (values: FormLogin) => {
    setIsLoading(true);
    setError(null);
    setShowError(false);
    try {
      const res = await signIn("credentials", {
        loginname: values.loginname,
        password: values.password,
        redirect: false,
      })
      if (res?.error) {
        if (res.status == 401) {
          throw new Error('Invalid credentials');
        }
        throw new Error('api fail');
      } else {
        router.push(redirectPath);
      }
    } catch (error) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      setTimeout(() => setShowError(true), 100);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        User Manage Login
      </h1>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className={`transition-all duration-300 ease-in-out transform ${showError
                  ? 'opacity-100'
                  : 'opacity-0'
                  }`}
              >
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>เข้าสู่ระบบล้มเหลว</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="loginname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute top-1/2 right-2 -translate-y-1/2 p-1 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Link href="/password_reset" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link>
            </div>
            <Button className="w-full cursor-pointer" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}