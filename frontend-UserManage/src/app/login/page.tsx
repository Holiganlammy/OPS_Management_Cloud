import Login from "@/app/login/LoginComponents/Login";

export default function LoginPage() {
  return (
    <section className="bg-gray-300 dark:bg-gray-900">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <Login />
        </div>
      </div>
    </section>
  );
}
