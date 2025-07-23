import { z } from "zod";

export const periodSchema = z.object({
  begindate: z.string(),
  enddate: z.string(),
  branchid: z.string(),
  description: z.string(),
  usercode: z.string(),
  depcode: z.string().optional().nullable(),
  personID: z.string().optional().nullable(),
  keyID: z.string().optional().nullable(),
})

export type PeroidForm = z.infer<typeof periodSchema>;
