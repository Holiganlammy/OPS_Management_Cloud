
"use client";

import { UseFormReturn } from "react-hook-form";
import { CombinedForm } from "@/app/(main)/fa_control/forms/schema/combinedSchema";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateNumberString } from "../../service/faService";

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <div className="col-span-2 text-left text-red-500 p-2 py-4 py-2 font-semibold">
              กรอกราคาขายจริง:
            </div>
            <div>
              <div className="col-span-1 flex flex-col md:flex-row gap-4 px-4 py-2">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="real_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="decimal"
                            step="0.01"
                            min={0}
                            className="text-right"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const raw = e.target.value;
                              if (/^\d*\.?\d{0,2}$/.test(raw)) {
                                field.onChange(raw);
                              }
                            }}
                            onBlur={(e) => {
                              const validated = validateNumberString(e.target.value);
                              field.onChange(validated); // แปลง string → number (หรือ null ถ้าไม่ valid)
                            }}
                            placeholder="0.00"
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
                            type="datetime-local"
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
          </div>
        </div>
      }
      <div className="rounded overflow-hidden flex col-span-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 w-full">
          {[
            {
              label: "ผู้ทำรายการ",
              user: form.watch("create_by"),
              date: form.watch("create_date"),
            },
            {
              label: "ผู้ตรวจสอบ",
              user: form.watch("verify_by_usercode"),
              date: form.watch("verify_date"),
            },
            {
              label: "ผู้อนุมัติ",
              user: form.watch("source_approve_usercode"),
              date: form.watch("source_approve_date"),
            },
            {
              label: "บัญชี",
              user: form.watch("account_aprrove_usercode"),
              date: form.watch("account_aprrove_date"),
            },
            {
              label: "การเงิน",
              user: form.watch("finance_aprrove_usercode"),
              date: form.watch("finance_aprrove_date"),
            },
          ].map(({ label, user, date }, index) => (
            <div
              key={index}
              className="border rounded overflow-hidden flex flex-col min-h-[80px]"
            >
              <div className="bg-zinc-700 text-white text-left p-2 font-semibold h-full flex items-center">
                {label}: {user}{" "}
                {date && date !== "Invalid Date" ? ` [${date}]` : ""}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}