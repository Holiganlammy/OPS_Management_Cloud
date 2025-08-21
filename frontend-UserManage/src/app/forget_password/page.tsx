"use client";
import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import caltexPicture from '@/image/caltex-picture2.jpeg';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import client from '@/lib/axios/interceptors';
import { headers } from 'next/headers';
import dataConfig from '@/config/config';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const router = useRouter();


  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setEmail('');
    router.push('/login');
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setEmail(values.email);
    // Simulate API call
    try{
      const response = await client.post('/forget-password', { Email: values.email }, {
        headers: dataConfig().header
      });

      const data = await response.data;
      if (data.success) {
        setTimeout(() => {
          setIsLoading(false);
          setIsSubmitted(true);
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to send reset email");
      }
    }catch(error){
      console.error("Error occurred while submitting form:", error);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {!isSubmitted ? (
            <>
              {/* Back Button */}
              <button
                onClick={handleBackToLogin}
                className="flex items-center text-gray-600 hover:text-black mb-8 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                กลับไปหน้าเข้าสู่ระบบ
              </button>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  ใส่อีเมลของคุณด้านล่างเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='block text-sm font-medium text-black mb-2'>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                            <input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !form.watch("email")}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              </Form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Check your email
              </h1>
              <p className="text-gray-600 mb-6">
                We sent a password reset link to<br />
                <span className="font-medium text-black">{email}</span>
              </p>
              <button
                onClick={handleBackToLogin}
                className="text-black font-medium hover:underline mr-4"
              >
                Back to Login
              </button>
              <button
                onClick={() => onSubmit({ email })}
                className="mt-4 text-black font-medium hover:underline"
              >
                Resend Email
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 bg-black relative overflow-hidden">
        {/* Geometric Pattern Overlay */}
        {/* Uncomment and adjust the following block if needed */}
        {/* <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute border border-white/20"
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  borderRadius: '50%',
                  top: `${20 + i * 8}%`,
                  left: `${10 + i * 5}%`,
                }}
              ></div>
            ))}
          </div>
        </div> */}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center p-12 text-center">
          <Image
            src={caltexPicture}
            alt="Caltex"
            className="w-full h-full object-cover"
            layout="fill"
            priority
          />
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 to-white/60"></div>
      </div>
    </div>
  );
}