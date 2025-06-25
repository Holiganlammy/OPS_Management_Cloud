import { Suspense } from "react";
import Login from "@/components/Login/Login";

export default function LoginPage() {
  return (
    <section className="bg-gray-300 dark:bg-gray-900">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Login
              </h1>
              <div>
                <Suspense fallback={<div>Loading...</div>}>
                  <Login />
                </Suspense>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
