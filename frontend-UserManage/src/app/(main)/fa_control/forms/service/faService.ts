import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import Swal from 'sweetalert2';

export async function getAutoData(usercode?: string) {
  const urls = {
    assets: '/AssetsAll_Control',
  };

  const fetchMultipleUrls = async (urls: { [key: string]: string }) => {
    try {
      const response = await Promise.all(
        Object.entries(urls).map(async ([key, url]) => {
          const res = await client.post(
            dataConfig().http + url,
            { BranchID: 901, usercode: usercode },
            { headers: dataConfig().header }
          );
          return { key, data: res.data };
        })
      );
      return response;
    } catch (error) {
      return [];
    }
  };

  return await fetchMultipleUrls(urls);
}


export const fetchFormData = async (
  nac_code: string,
  usercode: string,
  form: any,
  nac_type: number,
  setApprove: React.Dispatch<React.SetStateAction<ApproveList[]>>
) => {
  const dataHeader = await client.post(
    "/FA_control_select_headers",
    { nac_code },
    { headers: dataConfig().header }
  );

  if (!Array.isArray(dataHeader.data) || dataHeader.data.length === 0) {
    throw new Error("ไม่พบข้อมูล Header");
  }

  const header = dataHeader.data[0];

  if (nac_type !== header.nac_type) {
    throw new Error("ประเภทใบงานไม่ตรงกัน");
  }

  const dataApprove = await client.post(
    "/FA_Control_execDocID",
    { usercode, nac_code },
    { headers: dataConfig().header }
  );

  if (dataApprove.data) {
    setApprove(dataApprove.data)
  }


  const dataDetail = await client.post(
    "/FA_Control_select_dtl",
    { nac_code },
    { headers: dataConfig().header }
  );

  if (!Array.isArray(dataDetail.data)) {
    throw new Error("ไม่พบข้อมูลรายละเอียด");
  }

  form.reset({
    ...header,
    nac_type: nac_type,
    source_date: dayjs(header.source_date).format("YYYY-MM-DD HH:mm"),
    source_approve_date: dayjs(header.source_approve_date).format("YYYY-MM-DD HH:mm"),
    des_date: dayjs(header.des_date).format("YYYY-MM-DD HH:mm"),
    des_approve_date: dayjs(header.des_approve_date).format("YYYY-MM-DD HH:mm"),
    verify_date: dayjs(header.verify_date).format("YYYY-MM-DD HH:mm"),
    create_date: dayjs(header.create_date).format("YYYY-MM-DD HH:mm"),
    account_aprrove_date: dayjs(header.account_aprrove_date).format("YYYY-MM-DD HH:mm"),
    realPrice_Date: dayjs(header.realPrice_Date).format("YYYY-MM-DD HH:mm"),
    finance_aprrove_date: dayjs(header.finance_aprrove_date).format("YYYY-MM-DD HH:mm"),
    details: dataDetail.data,
  });
};

export function validateDateString(dateStr: string | null | undefined) {
  if (!dateStr || isNaN(Date.parse(dateStr))) {
    return null; // ส่ง null ไป ไม่ให้ validation ล้ม
  }
  return dayjs(dateStr).format("YYYY-MM-DDTHH:mm:ss"); // ส่ง ISO format
}

export function validateNumberString(input: string | null | undefined): number | null {
  if (typeof input !== 'string') return null;

  const trimmed = input.trim();

  if (trimmed === '') return null;

  const parsed = Number(trimmed);

  if (isNaN(parsed)) return null;

  return parsed;
}


export async function uploadImageToCheckAPI(file: File, nac_code: string, type: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("nac_code", nac_code);
  formData.append("type", type); // เช่น 'nacdtl_image_1'

  try {
    const response = await client.post("/check_files_NewNAC", formData, { headers: dataConfig().headerUploadFile });
    return response.data;
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "อัปโหลดไฟล์ล้มเหลว",
      text: JSON.stringify(error.response),
    });
  }
}

export const fetchChatAndFiles = async (nac_code: string) => {
  try {
    const chatData = await client.post('/qureyNAC_comment', { nac_code }, { headers: dataConfig().header })
    const filesData = await client.post('/qureyNAC_path', { nac_code }, { headers: dataConfig().header })

    return { chatData, filesData };
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "โหลดข้อมูลไม่สำเร็จ",
      text: JSON.stringify(error.response),
    });
  }
}