import React, { useEffect } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import CustomSelect from "@/components/SelectSection/SelectSearch";
import HorizontalInput from "@/components/ui/StandardInput";
import { UseFormReturn } from "react-hook-form";
import { CombinedForm } from "@/app/(main)/fa_control/forms/schema/combinedSchema";

interface Props {
  form: UseFormReturn<CombinedForm>;
  userFetch: UserData[];
  showReceiver: boolean;
}

export default function DesDetails({
  form,
  userFetch,
  showReceiver
}: Props) {

  const [watchDesceUserCode] = form.watch(["des_usercode"]);

  useEffect(() => {
    if (!watchDesceUserCode) {
      form.setValue("desFristName", "");
      form.setValue("desLastName", "");
      form.setValue("des_dep_owner", "");
      form.setValue("des_bu_owner", "");
      return;
    }

    const currentDesUser = userFetch.find((res: UserData) => res.UserCode === watchDesceUserCode);
    if (currentDesUser) {
      form.setValue("desFristName", currentDesUser.fristName);
      form.setValue("desLastName", currentDesUser.lastName);
      form.setValue("des_dep_owner", currentDesUser.DepCode);
      form.setValue("des_bu_owner", currentDesUser.BranchID === 901 ? "Center" : "Oil");
    }
  }, [watchDesceUserCode, userFetch]);


  if (!showReceiver) {
    return (
      <div className="border rounded overflow-hidden flex flex-col">
        <div className="bg-zinc-700 text-white text-center py-2 font-semibold">
          หน่วยงานที่รับมอบ
        </div>
        <div className="p-4 flex-grow flex items-center justify-center">
          <div className="font-bold text-2xl text-zinc-600">
            NONE
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded overflow-hidden grid-cols-1">
      <div className="bg-zinc-700 text-white text-center py-2 font-semibold">
        หน่วยงานที่รับมอบ
      </div>
      <div className="p-4 space-y-2">
        {/* Row 1: Department + Business Unit */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="des_dep_owner"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <HorizontalInput
                      label="DepCode"
                      readOnly
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="des_bu_owner"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <HorizontalInput
                      label="BU"
                      readOnly
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Row 2: ผู้ส่งมอบ (Autocomplete) */}
        <div>
          <FormField
            control={form.control}
            name="des_usercode"
            render={({ field }) => (
              <CustomSelect
                field={field}
                errorString={form.formState.errors.des_usercode ? true : false}
                placeholder="ผู้รับมอบ"
                formLabel=""
                options={userFetch.map(user => ({
                  value: user.UserCode,
                  label: `${user.UserCode} : ${user.fristName} ${user.lastName}`
                }))}
              />
            )}
          />
        </div>

        {/* Row 3: ชื่อจริง */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="desFristName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <HorizontalInput
                      label="FirstName"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="desLastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <HorizontalInput
                      label="LastName"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>


        {/* Row 4: วันที่ส่งมอบ */}
        <div>
          <FormField
            control={form.control}
            name="des_date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <HorizontalInput
                    type="datetime-local"
                    label="วันที่รับมอบ"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Row 6: หมายเหตุ */}
        <div>
          <FormField
            control={form.control}
            name="des_remark"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="หมายเหตุ"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
