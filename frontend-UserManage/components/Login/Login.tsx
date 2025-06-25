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
import SuccessDialog from "@/components/SubmitAlert/SuccessDialog/Success";

function setSession(userData: UserData) {
    if (typeof window === 'undefined') return
    localStorage.setItem('user-session', JSON.stringify(userData))
}

function isAuthenticated() {
    if (typeof window === 'undefined') return false
    try {
        const session = localStorage.getItem('user-session')
        return session !== null
    } catch (error) {
        return false
    }
}

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [successDialog, setSuccessDialog] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/dashboard')
        }
    }, [router])

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
        setSuccessDialog(false);
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
                const userData = {
                    id: result.user?.id || Date.now(), 
                    loginname: values.loginname,
                    name: result.user?.name || values.loginname,
                    loginTime: new Date().toISOString(),
                    ...result.user
                };
                setSession(userData);
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(result.error || "Please check your credentials.");
                setTimeout(() => setShowError(true), 100);
                setIsLoading(false); 
            }
        } catch (error){
            setError("Network error. Please try again.");
            setTimeout(() => setShowError(true), 100);
            setIsLoading(false);
        }
    };

    const handleSuccessConfirm = () => {
        setSuccessDialog(false);
        router.push("/dashboard");
        router.refresh();
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
                        <AlertTitle>Login Failed</AlertTitle>
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
                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <Button className="w-full cursor-pointer" type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>

                {/* Success Dialog */}
                <SuccessDialog
                    open={successDialog}
                    onOpenChange={setSuccessDialog}
                    onConfirm={handleSuccessConfirm}
                    title="Login Successful!"
                    description="Welcome back! You will be redirected to your dashboard."
                    buttonText="Continue to Dashboard"
                />
            </form>
        </Form>
    );
}