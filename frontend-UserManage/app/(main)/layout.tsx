import SiteHeader from "@/components/site/SiteHeader";
import { getSessionToken, getSessionUser } from "@/lib/server-session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users in the application",
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const userSession = await getSessionUser();
  const token = await getSessionToken();
  if (!userSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in to view this page.</p>
          <a href="/login" className="text-blue-500 hover:underline mt-4 inline-block">Login</a>
        </div>
      </div>
    );
  }
  return (
    <>
      <SiteHeader user={userSession} />
      <main>
        <div className="pt-[50px]">
            {children}
        </div>
      </main>
    </>
  );
}