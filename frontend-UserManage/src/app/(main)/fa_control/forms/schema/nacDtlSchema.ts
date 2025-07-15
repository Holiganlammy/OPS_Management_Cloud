import { z } from "zod";

// Schema สำหรับรายละเอียดทรัพย์สิน
export const nacDtlItemSchema = z.object({
  nac_code: z.string().optional().nullable(),
  nacdtl_row: z.number().optional().nullable(),
  nacdtl_assetsCode: z.string().optional().nullable(),
  OwnerCode: z.string().optional().nullable(),
  nacdtl_assetsName: z.string().optional().nullable(),
  nacdtl_assetsSeria: z.string().optional().nullable(),
  nacdtl_assetsDtl: z.string().optional().nullable(),
  nacdtl_date_asset: z.string().optional().nullable(),
  nacdtl_assetsPrice: z.number().optional().nullable(),
  nacdtl_bookV: z.number().optional().nullable(),
  nacdtl_PriceSeals: z.number().optional().nullable(),
  nacdtl_assetsExVat: z.number().optional().nullable(),
  nacdtl_profit: z.number().optional().nullable(),
  nacdtl_image_1: z.string().optional().nullable(),
  nacdtl_image_2: z.string().optional().nullable(),
})

export const nacDtlFormSchema = z.array(nacDtlItemSchema);

export type NAC_DTLForm = z.infer<typeof nacDtlItemSchema>;
