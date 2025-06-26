// import React, { useState, useEffect } from 'react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
// import z from 'zod';

// export default function ChangePassword() {
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showError, setShowError] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [isSuccess, setIsSuccess] = useState(false);

//   useEffect(() => {
//     if (error) {
//       setShowError(true);
//       const timer = setTimeout(() => {
//         setShowError(false);
//         setTimeout(() => setError(null), 300);
//       }, 8000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   const validateSchema = z.object({
//     currentPassword: z.string().min(1, "กรุณากรอกรหัสผ่านปัจจุบัน"),
//     newPassword: z
//       .string()
//       .min(1, "กรุณากรอกรหัสผ่านใหม่")
//       .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
//     confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่"),
//   }).refine((data) => data.newPassword !== data.currentPassword, {
//     message: "รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านเก่า",
//     path: ["newPassword"],
//   }).refine((data) => data.confirmPassword === data.newPassword, {
//     message: "รหัสผ่านใหม่ไม่ตรงกัน",
//     path: ["confirmPassword"],
//   });

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     // Real-time validation
//     const error = validateField(field, value);
//     setFieldErrors(prev => ({ ...prev, [field]: error }));
    
//     // Re-validate confirm password when new password changes
//     if (field === 'newPassword' && formData.confirmPassword) {
//       const confirmError = validateField('confirmPassword', formData.confirmPassword);
//       setFieldErrors(prev => ({ ...prev, confirmPassword: confirmError }));
//     }
//   };

//   type PasswordField = 'current' | 'new' | 'confirm';

//   const togglePasswordVisibility = (field: PasswordField) => {
//     setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
//   };

//   const validateForm = () => {
//     const errors = {
//       currentPassword: validateField('currentPassword', formData.currentPassword),
//       newPassword: validateField('newPassword', formData.newPassword),
//       confirmPassword: validateField('confirmPassword', formData.confirmPassword)
//     };
    
//     setFieldErrors(errors);
//     return !Object.values(errors).some(error => error !== '');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     setShowError(false);

//     try {
//       const response = await fetch('http://localhost:7777/api/change-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           currentPassword: formData.currentPassword,
//           newPassword: formData.newPassword
//         })
//       });

//       const result = await response.json();

//       if (result.success) {
//         setIsSuccess(true);
//         // Reset form
//         setFormData({
//           currentPassword: '',
//           newPassword: '',
//           confirmPassword: ''
//         });
//       } else {
//         setError(result.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน กรุณาลองใหม่อีกครั้ง');
//         setTimeout(() => setShowError(true), 100);
//       }
//     } catch (error) {
//       setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
//       setTimeout(() => setShowError(true), 100);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBackToDashboard = () => {
//     window.history.back();
//   };

//   const getPasswordStrength = (password: string) => {
//     if (password.length === 0) return { strength: 0, text: '', color: '' };
//     if (password.length < 6) return { strength: 1, text: 'อ่อน', color: 'text-red-600' };
//     if (password.length < 8) return { strength: 2, text: 'ปานกลาง', color: 'text-yellow-600' };
    
//     let score = 2;
//     if (/[A-Z]/.test(password)) score++;
//     if (/[a-z]/.test(password)) score++;
//     if (/[0-9]/.test(password)) score++;
//     if (/[^A-Za-z0-9]/.test(password)) score++;
    
//     if (score >= 5) return { strength: 4, text: 'แข็งแกร่งมาก', color: 'text-green-600' };
//     if (score >= 4) return { strength: 3, text: 'แข็งแกร่ง', color: 'text-green-500' };
//     return { strength: 2, text: 'ปานกลาง', color: 'text-yellow-600' };
//   };

//   const passwordStrength = getPasswordStrength(formData.newPassword);

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full">
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <CheckCircle className="w-8 h-8 text-green-600" />
//               </div>
              
//               <h1 className="text-2xl font-bold text-slate-900 mb-4">
//                 เปลี่ยนรหัสผ่านสำเร็จ
//               </h1>
              
//               <p className="text-slate-600 mb-8 leading-relaxed">
//                 รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว
//                 <br />
//                 กรุณาใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งต่อไป
//               </p>

//               <button
//                 onClick={handleBackToDashboard}
//                 className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 กลับไปหน้าหลัก
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Shield className="w-8 h-8 text-blue-600" />
//             </div>
            
//             <h1 className="text-2xl font-bold text-slate-900 mb-2">
//               เปลี่ยนรหัสผ่าน
//             </h1>
            
//             <p className="text-slate-600 leading-relaxed">
//               เพื่อความปลอดภัย กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่
//             </p>
//           </div>

//           {/* Form */}
//           <div className="space-y-4">
//             {error && (
//               <Alert 
//                 variant="destructive" 
//                 className={`transition-all duration-300 ease-in-out transform ${
//                   showError ? 'opacity-100' : 'opacity-0'
//                 }`}
//               >
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {/* Current Password */}
//             <div>
//               <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-900 mb-2">
//                 รหัสผ่านปัจจุบัน
//               </label>
//               <div className="relative">
//                 <input
//                   id="currentPassword"
//                   type={showPasswords.current ? "text" : "password"}
//                   value={formData.currentPassword}
//                   onChange={(e) => handleInputChange('currentPassword', e.target.value)}
//                   placeholder="กรอกรหัสผ่านปัจจุบัน"
//                   className={`w-full pl-12 pr-12 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     fieldErrors.currentPassword ? 'border-red-300' : 'border-slate-300'
//                   }`}
//                 />
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <button
//                   type="button"
//                   onClick={() => togglePasswordVisibility('current')}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
//                 >
//                   {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {fieldErrors.currentPassword && (
//                 <p className="mt-1 text-sm text-red-600">{fieldErrors.currentPassword}</p>
//               )}
//             </div>

//             {/* New Password */}
//             <div>
//               <label htmlFor="newPassword" className="block text-sm font-medium text-slate-900 mb-2">
//                 รหัสผ่านใหม่
//               </label>
//               <div className="relative">
//                 <input
//                   id="newPassword"
//                   type={showPasswords.new ? "text" : "password"}
//                   value={formData.newPassword}
//                   onChange={(e) => handleInputChange('newPassword', e.target.value)}
//                   placeholder="กรอกรหัสผ่านใหม่"
//                   className={`w-full pl-12 pr-12 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     fieldErrors.newPassword ? 'border-red-300' : 'border-slate-300'
//                   }`}
//                 />
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <button
//                   type="button"
//                   onClick={() => togglePasswordVisibility('new')}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
//                 >
//                   {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
              
//               {/* Password Strength Indicator */}
//               {formData.newPassword && (
//                 <div className="mt-2">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="flex-1 bg-slate-200 rounded-full h-2">
//                       <div 
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                           passwordStrength.strength === 1 ? 'w-1/4 bg-red-500' :
//                           passwordStrength.strength === 2 ? 'w-2/4 bg-yellow-500' :
//                           passwordStrength.strength === 3 ? 'w-3/4 bg-green-500' :
//                           passwordStrength.strength === 4 ? 'w-full bg-green-600' : 'w-0'
//                         }`}
//                       ></div>
//                     </div>
//                     <span className={`text-sm font-medium ${passwordStrength.color}`}>
//                       {passwordStrength.text}
//                     </span>
//                   </div>
//                 </div>
//               )}
              
//               {fieldErrors.newPassword && (
//                 <p className="mt-1 text-sm text-red-600">{fieldErrors.newPassword}</p>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-900 mb-2">
//                 ยืนยันรหัสผ่านใหม่
//               </label>
//               <div className="relative">
//                 <input
//                   id="confirmPassword"
//                   type={showPasswords.confirm ? "text" : "password"}
//                   value={formData.confirmPassword}
//                   onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                   placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
//                   className={`w-full pl-12 pr-12 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     fieldErrors.confirmPassword ? 'border-red-300' : 'border-slate-300'
//                   }`}
//                 />
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <button
//                   type="button"
//                   onClick={() => togglePasswordVisibility('confirm')}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
//                 >
//                   {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {fieldErrors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
//               )}
//             </div>

//             {/* Password Requirements */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h4 className="text-sm font-medium text-blue-900 mb-2">ข้อกำหนดรหัสผ่าน:</h4>
//               <ul className="text-sm text-blue-800 space-y-1">
//                 <li className="flex items-center gap-2">
//                   <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
//                   อย่างน้อย 8 ตัวอักษร
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
//                   มีตัวพิมพ์ใหญ่
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
//                   มีตัวเลข
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
//                   มีอักขระพิเศษ
//                 </li>
//               </ul>
//             </div>

//             <button 
//               onClick={handleSubmit}
//               disabled={isLoading || Object.values(fieldErrors).some(error => error !== '')}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//               เปลี่ยนรหัสผ่าน
//             </button>
//           </div>

//           {/* Back Button */}
//           <div className="mt-6 text-center">
//             <button
//               onClick={handleBackToDashboard}
//               className="text-slate-600 hover:text-slate-900 font-medium flex items-center justify-center gap-2 mx-auto transition-colors duration-200 text-sm"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               ยกเลิก
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }