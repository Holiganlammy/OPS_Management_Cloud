import { z } from "zod";
import { nacDtlFormSchema } from "./nacDtlSchema";

// 1. สร้าง base schema
const baseNacSchema = z.object({
  usercode: z.string().optional().nullable(),
  nac_code: z.string().optional().nullable(),
  nac_type: z.number().optional().nullable(),
  status_name: z.string().optional().nullable(),
  nac_status: z.number().optional().nullable(),
  source_dep_owner: z.string().min(1, "DepCode ผู้ส่งมอบ"),
  source_bu_owner: z.string().min(1, "BU ผู้ส่งมอบ"),
  source_usercode: z.string().min(1, "กรุณาเลือกผู้ส่งมอบ"),
  source_userid: z.string().optional().nullable(),
  source_name: z.string().optional().nullable(),
  source_date: z.string().optional().nullable(),
  source_approve_usercode: z.string().optional().nullable(),
  source_approve_userid: z.string().optional().nullable(),
  source_approve_date: z.string().optional().nullable(),
  source_remark: z.string().optional().nullable(),
  des_dep_owner: z.string().optional().nullable(),
  des_bu_owner: z.string().optional().nullable(),
  des_usercode: z.string().optional().nullable(),
  des_userid: z.string().optional().nullable(),
  des_name: z.string().optional().nullable(),
  des_date: z.string().optional().nullable(),
  des_approve_usercode: z.string().optional().nullable(),
  des_approve_userid: z.string().optional().nullable(),
  des_approve_date: z.string().optional().nullable(),
  des_remark: z.string().optional().nullable(),
  verify_by_usercode: z.string().optional().nullable(),
  verify_by_userid: z.string().optional().nullable(),
  verify_date: z.string().optional().nullable(),
  sum_price: z.number().optional().nullable(),
  create_by: z.string().optional().nullable(),
  create_date: z.string().optional().nullable(),
  account_aprrove_usercode: z.string().optional().nullable(),
  account_aprrove_id: z.string().optional().nullable(),
  account_aprrove_date: z.string().optional().nullable(),
  real_price: z.number().optional().nullable(),
  realPrice_Date: z.string().optional().nullable(),
  finance_aprrove_usercode: z.string().optional().nullable(),
  finance_aprrove_id: z.string().optional().nullable(),
  finance_aprrove_date: z.string().optional().nullable(),
  desFristName: z.string().optional().nullable(),
  desLastName: z.string().optional().nullable(),
  sourceFristName: z.string().min(1, "ชื่อผู้ส่งมอบ"),
  sourceLastName: z.string().min(1, "นามสกุลผู้ส่งมอบ"),
});

// 2. ฟังก์ชันสร้าง schema แบบรวม และ validation เงื่อนไขเพิ่มเติม
export const getCombinedFormSchema = (nacType: string) =>
  baseNacSchema
    .merge(z.object({ details: nacDtlFormSchema }))
    .superRefine((data, ctx) => {
      const isTypeRequiredI = nacType === "1" || nacType === "2";
      const isTypeRequiredII = nacType === "4" || nacType === "5";
      const hasVerifier = data.verify_by_userid?.trim();
      const hasApprover = data.source_approve_userid?.trim();

      if (isTypeRequiredII && (hasVerifier || hasApprover)) {
        if (!data.real_price || !data.realPrice_Date) {
          ctx.addIssue({
            path: ["real_price"],
            code: z.ZodIssueCode.custom,
            message: "ขายจริงและวันที่ขายจริง",
          });
        }
      }

      if (isTypeRequiredI) {
        if (!data.des_usercode) {
          ctx.addIssue({
            path: ["des_usercode"],
            code: z.ZodIssueCode.custom,
            message: "ผู้รับมอบ",
          });

          ctx.addIssue({
            path: ["desFristName"],
            code: z.ZodIssueCode.custom,
            message: "ชื่อผู้รับมอบ",
          });

          ctx.addIssue({
            path: ["desLastName"],
            code: z.ZodIssueCode.custom,
            message: "นามสกุลผู้รับมอบ",
          });

          ctx.addIssue({
            path: ["des_dep_owner"],
            code: z.ZodIssueCode.custom,
            message: "DepCode ผู้รับมอบ",
          });

          ctx.addIssue({
            path: ["des_bu_owner"],
            code: z.ZodIssueCode.custom,
            message: "BU ผู้รับมอบ",
          });
        }
      }

      const requiresBV = data.nac_status === 11 && (data.nac_type === 4 || data.nac_type === 5);
      const requiresSealPrice = (data.nac_type === 4 || data.nac_type === 5);
      const requires = (data.nac_type === 1 || data.nac_type === 2 || data.nac_type === 3);

      if (requires && Array.isArray(data.details)) {
        data.details.forEach((item, index) => {
          if (!item.nacdtl_assetsCode) {
            ctx.addIssue({
              path: ["details", index, "nacdtl_assetsCode"],
              code: z.ZodIssueCode.custom,
              message: "รหัสทรัพย์สิน",
            });
          } else if (!item.nacdtl_image_1 && data.nac_type === 1) {
            ctx.addIssue({
              path: ["details", index, "nacdtl_image_1"],
              code: z.ZodIssueCode.custom,
              message: `รูปภาพที่ 1 ${item.nacdtl_assetsCode}`,
            });

            ctx.addIssue({
              path: ["details", index, "nacdtl_image_2"],
              code: z.ZodIssueCode.custom,
              message: `รูปภาพที่ 2 ${item.nacdtl_assetsCode}`,
            });
          } else if (!item.nacdtl_image_1) {
            ctx.addIssue({
              path: ["details", index, "nacdtl_image_1"],
              code: z.ZodIssueCode.custom,
              message: `รูปภาพที่ 1 ${item.nacdtl_assetsCode}`,
            });
          }
        });
      }

      if (requiresSealPrice && Array.isArray(data.details)) {
        data.details.forEach((item, index) => {
          if (!item.nacdtl_assetsCode) {
            ctx.addIssue({
              path: ["details", index, "nacdtl_assetsCode"],
              code: z.ZodIssueCode.custom,
              message: "รหัสทรัพย์สิน",
            });
          }
        });
      } else if (requiresBV && Array.isArray(data.details)) {
        data.details.forEach((item, index) => {
          if (!item.nacdtl_bookV || item.nacdtl_bookV < 0) {
            ctx.addIssue({
              path: ["details", index, "nacdtl_bookV"],
              code: z.ZodIssueCode.custom,
              message: "ราคาของรายการ",
            });
          }
        });
      }
    });

// 3. export type
export type CombinedForm = z.infer<ReturnType<typeof getCombinedFormSchema>>;
