
"use client";

import { UseFormReturn } from "react-hook-form";
import { CombinedForm } from "@/app/(main)/fa_control/forms/schema/combinedSchema";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  nac_code: string;
  form: UseFormReturn<CombinedForm>;
  userFetch: UserData[];
  nac_type: string;
}

export default function Footer({ nac_code, form, userFetch, nac_type }: Props) {
  const showReceiver = nac_type === "1" || nac_type === "2" || nac_type === "3";

  return (
    <section className="bg-white border text-sm grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 items-stretch">
      {/* "กรอกราคาขาย" ให้ span 5 column */}
      {!showReceiver &&
        <div className="rounded overflow-hidden flex col-span-5">
          <div className="text-left text-red-500 p-2 py-4 py-2 font-semibold w-full max-w-3/4">
            กรอกราคาขายจริง:
          </div>
          <div className="flex flex-col md:flex-row gap-4 px-4 py-2">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="real_price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="text-right cursor-default"
                        value={(field.value ?? 0).toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        placeholder=""
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="realPrice_Date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                        placeholder=""
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      }
      <div className="border rounded overflow-hidden flex flex-col">
        <div className="bg-zinc-700 text-white text-left p-2 font-semibold">
          ผู้ทำรายการ: {form.watch("create_by")} {(form.watch("create_date") === "Invalid Date" || !form.watch("create_date")) ? "" : `[${form.watch("create_date")}]`}
        </div>
      </div>
      <div className="border rounded overflow-hidden flex flex-col">
        <div className="bg-zinc-700 text-white text-left p-2 font-semibold">
          ผู้ตรวจสอบ: {form.watch("verify_by_usercode")} {(form.watch("verify_date") === "Invalid Date" || !form.watch("verify_date")) ? "" : `[${form.watch("verify_date")}]`}
        </div>
      </div>
      <div className="border rounded overflow-hidden flex flex-col">
        <div className="bg-zinc-700 text-white text-left p-2 font-semibold">
          ผู้อนุมัติ: {form.watch("source_approve_usercode")} {(form.watch("source_approve_date") === "Invalid Date" || !form.watch("source_approve_date")) ? "" : `[${form.watch("source_approve_date")}]`}
        </div>
      </div>
      <div className="border rounded overflow-hidden flex flex-col">
        <div className="bg-zinc-700 text-white text-left p-2 font-semibold">
          บัญชี: {form.watch("account_aprrove_usercode")} {(form.watch("account_aprrove_date") === "Invalid Date" || !form.watch("account_aprrove_date")) ? "" : `[${form.watch("account_aprrove_date")}]`}
        </div>
      </div>
      <div className="border rounded overflow-hidden flex flex-col">
        <div className="bg-zinc-700 text-white text-left p-2 font-semibold">
          การเงิน: {form.watch("finance_aprrove_usercode")} {(form.watch("finance_aprrove_date") === "Invalid Date" || !form.watch("finance_aprrove_date")) ? "" : `[${form.watch("finance_aprrove_date")}]`}
        </div>
      </div>
    </section>
  )
}