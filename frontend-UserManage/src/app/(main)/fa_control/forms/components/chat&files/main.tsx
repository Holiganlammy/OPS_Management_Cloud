"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/th";
import { useEffect, useState } from "react";
import { CommentItem } from "./commentItem";
import { FileItem } from "./fileItem";
import { fetchChatAndFiles, uploadImageToCheckAPI } from "../../service/faService";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import dataConfig from "@/config/config";
import client from "@/lib/axios/interceptors";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

interface Props {
  nac_code: string;
  nac_status: number;
}

export default function ChatAndFiles({ nac_code, nac_status }: Props) {
  const { data: session } = useSession();
  const [fileItem, setFileItem] = useState<FileItemType[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ฟังก์ชันส่งข้อความใหม่
  const handleSendComment = async (text: string) => {
    try {
      const newPostCommnet = {
        nac_code: nac_code,
        usercode: session?.user.UserCode,
        comment: text,
      };

      const response = await client.post('/store_FA_control_comment', newPostCommnet, { headers: dataConfig().header });

      if (response.status === 200) {
        const newComment: IComment = {
          userid: session?.user.UserCode,
          comment: text ?? "",
          create_date: dayjs().format("YYYY-MM-DD HH:mm"),
          img_profile: session?.user.img_profile,
        };
        setComments((prev) => [...prev, newComment]);
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "ส่งข้อความไม่สำเร็จ",
        text: error.response.data.message || "เกิดข้อผิดพลาดในการส่งข้อความ",
      });
    }
  };

  const handleUploadFile = async (file: File, description: string) => {
    try {
      if (!session?.user?.UserCode) {
        throw new Error("ไม่พบข้อมูลผู้ใช้ (UserCode)");
      }

      // อัปโหลดไฟล์ไปยัง API ภายนอก
      const response = await uploadImageToCheckAPI(file, nac_code, "file");

      // เตรียมข้อมูลสำหรับเก็บ path ไฟล์แนบ
      if (response) {
        const fileMeta = {
          nac_code,
          linkpath: response.url,
          usercode: session.user.UserCode,
          description,
          create_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };

        const responsePath = await client.post("/stroe_FA_control_Path", fileMeta, {
          headers: dataConfig().header,
        });

        if (responsePath.status === 200) {
          Swal.fire({
            icon: "success",
            title: "อัปโหลดสำเร็จ",
            text: "ไฟล์แนบของคุณถูกบันทึกเรียบร้อยแล้ว",
          });

          // โหลดข้อมูลใหม่
          const result = await fetchChatAndFiles(nac_code);
          setFileItem(result?.filesData?.data ?? []);
        } else {
          throw new Error("ไม่สามารถบันทึก path ไฟล์ได้");
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "อัปโหลดไฟล์ไม่สำเร็จ",
        text: JSON.stringify(error.response) || "เกิดข้อผิดพลาด",
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const result = await fetchChatAndFiles(nac_code);
        const comments: IComment[] = result?.chatData?.data ?? [];
        const fileItemss: FileItemType[] = result?.filesData?.data ?? [];
        console.log(fileItemss);

        setFileItem(fileItemss);
        setComments(comments);
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error?.response?.data?.message ?? error?.message ?? "ไม่พบข้อมูลรหัสใบงานนี้",
        });
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [nac_code, nac_status]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-12 min-h-screen">
      {isLoading ? (
        <p className="text-gray-500 text-center">กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* ฝั่งซ้าย: Chat/Comment */}
          <div className="border bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 border-b border-gray-300 dark:border-zinc-700 pb-2">ไฟล์แนบ</h2>
            <FileItem fileItem={fileItem} onUpload={handleUploadFile} />
          </div>

          {/* ฝั่งขวา: Files */}
          <div className="border bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
            {/* หัวข้อมีกรอบด้านล่างแยกกับ body */}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 border-b border-gray-300 dark:border-zinc-700 pb-2">
              แชต/ความคิดเห็น
            </h2>

            <CommentItem comments={comments} onSend={handleSendComment} />
          </div>
        </div>
      )}
    </div>
  );
}
