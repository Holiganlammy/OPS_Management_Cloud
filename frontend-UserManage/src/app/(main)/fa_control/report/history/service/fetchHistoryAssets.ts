import client from "@/lib/axios/interceptors";
import dataConfig from "@/config/config";
import Swal from "sweetalert2";

export const fetchHistoryAssets = async (userCode: string): Promise<HistoryAssetType[]> => {
  try {
    const res = await client.post(
      "/store_FA_control_HistorysAssets",
      JSON.stringify({ userCode }),
      { headers: dataConfig().header }
    );

    return res.data; // assumption: res.data เป็น array ของ HistoryAssetType[]
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: error?.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
    });
    return [];
  }
};
