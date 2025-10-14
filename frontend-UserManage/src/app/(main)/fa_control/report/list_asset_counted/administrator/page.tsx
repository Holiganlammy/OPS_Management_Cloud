import AssetsCountedListAdmin from "./components/AssetsCountedListAdmin";
export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">รายงานการนับสินทรัพย์ (สำหรับผู้ดูแลระบบ)</h1>
      <AssetsCountedListAdmin />
    </div>
  );
}