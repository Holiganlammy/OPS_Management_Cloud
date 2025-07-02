"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon, Eye, EyeOff, Loader2 } from "lucide-react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (error){
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
                setTimeout(() => setError(null), 300);
            }, 10000)
            return () => clearTimeout(timer);
        }
    }, [error])

    const formSchema = z.object({
        loginname: z.string().min(2, "Username must be 2+ characters"),
        password: z.string().min(8, "Password must be 8+ characters")
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
            const params = new URLSearchParams({
                loginname: values.loginname,
                password: values.password
            });
            const response = await fetch(`http://localhost:7777/api/login?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const result = await response.json();
            if (result.success) {
            await fetch('/api/auth/set-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accessToken: result.access_token,
                    user: {
                        userid: result.user.userid,
                        username: result.user.UserCode,
                        name: result.user.name,
                        email: result.user.Email,
                        branchid: result.user.branchid,
                        depid: result.user.depid,
                        depcode: result.user.depcode,
                        depname: result.user.depname,
                        secid: result.user.secid,
                        seccode: result.user.seccode,
                        secname: result.user.secname,
                        positionid: result.user.positionid,
                        positioncode: result.user.positioncode,
                        positionname: result.user.positionname,
                        img_profile: result.user.img_profile,
                    }
                })
            })
                router.push("/users/dashboard");
                router.refresh();
            } else {
                setError(result.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง");
                setTimeout(() => setShowError(true), 100);
                setIsLoading(false); 
            }
        } catch (error){
            setError("Network error. Please try again.");
            setTimeout(() => setShowError(true), 100);
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <Alert 
                        variant="destructive" 
                        className={`transition-all duration-300 ease-in-out transform ${
                            showError 
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
    );
}