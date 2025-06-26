import SiteHeader from "@/components/site/SiteHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users in the application",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="pt-[50px]">
          {children}
        </div>
      </main>
    </>
  );
}