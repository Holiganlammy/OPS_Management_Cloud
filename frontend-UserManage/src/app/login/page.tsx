import Login from "@/app/login/LoginComponents/Login";
import Image from "next/image";
import caltexPicture from "@/image/caltex-picture.jpg";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Right Side - Image */}
      <div className="w-1/2 bg-black relative overflow-hidden">
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center">
          <Image
            src={caltexPicture}
            alt="Caltex"
            className="w-full h-full object-cover"
            fill
            priority
          />
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 to-white/60"></div>
      </div>

      {/* Left Side - Login Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Login />
        </div>
      </div>
    </div>
  );
}