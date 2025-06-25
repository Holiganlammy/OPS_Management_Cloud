// "use client";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { CheckCircle2, X } from "lucide-react";

// export default function SubmitSuccess() {
//     return (
//         <Alert className="w-96 bg-green-50 border-green-200 shadow-lg">
//             <CheckCircle2 className="h-4 w-4 text-green-600" />
//             <AlertTitle className="text-green-800">ลบข้อมูลสำเร็จ!</AlertTitle>
//             <AlertDescription className="text-green-700">
//                 ลบผู้ใช้ {user?.UserCode} เรียบร้อยแล้ว
//             </AlertDescription>
//             <button
//                 onClick={() => setShowSuccessAlert(false)}
//                 className="absolute top-2 right-2 text-green-600 hover:text-green-800"
//             >
//                 <X className="h-4 w-4" />
//             </button>
//         </Alert>
//     );
// }
// // 