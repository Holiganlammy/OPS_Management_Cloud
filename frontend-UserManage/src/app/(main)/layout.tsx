import SiteHeader from "@/components/NavSideBar/NavSideBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SiteHeader />
      {children}
    </div>
  );
}
