import ForgotPasswordComponent from "@/components/Login/ForgetPassword/Forget";
export default function ForgotPassword() {
    return (
        <section className="bg-gray-300 dark:bg-gray-900">
        <div>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Reset Password
                </h1>
                <div>
                <ForgotPasswordComponent />
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}