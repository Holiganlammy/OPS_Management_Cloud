import SiteHeader from "@/components/site/SiteHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New OPS",
  description: "New OPS",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SiteHeader />
      <div className="pt-[50px]">
        {children}
      </div>
    </main>
  );
}
