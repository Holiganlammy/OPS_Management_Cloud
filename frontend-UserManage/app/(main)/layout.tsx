import SiteHeader from "@/components/site/SiteHeader";

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