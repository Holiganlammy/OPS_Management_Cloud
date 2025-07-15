import React, { useEffect } from "react";
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import CustomSelect from "@/components/SelectSection/SelectSearch";
import HorizontalInput from "@/components/ui/StandardInput";
import { UseFormReturn } from "react-hook-form";
import { CombinedForm } from "@/app/(main)/fa_control/forms/schema/combinedSchema";

interface Props {
  form: UseFormReturn<CombinedForm>;
  userFetch: UserData[];
}

export default function HeaderDetails({
  form,
  userFetch
}: Props) {

  const [watchSourceUserCode] = form.watch(["source_usercode"])

  useEffect(() => {

    if (!watchSourceUserCode) {
      form.setValue("sourceFristName", "");
      form.setValue("sourceLastName", "");
      form.setValue("source_dep_owner", "");
      form.setValue("source_bu_owner", "");
      return;
    }

    const currentSourceUser = userFetch.find((res: UserData) => res.UserCode === watchSourceUserCode);
    if (currentSourceUser) {
      form.setValue("sourceFristName", currentSourceUser.fristName);
      form.setValue("sourceLastName", currentSourceUser.lastName);
      form.setValue("source_dep_owner", currentSourceUser.DepCode);
      form.setValue("source_bu_owner", currentSourceUser.BranchID === 901 ? "Center" : "Oil");
    }
  }, [watchSourceUserCode, userFetch]);

  return (
    <div className="border rounded overflow-hidden grid-cols-1">
      <div className="bg-zinc-700 text-white text-center py-2 font-semibold">
        หน่วยงานที่ส่งมอบ
      </div>
      <div className="p-4 space-y-2">
        {/* Row 1: Department + Business Unit */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="source_dep_owner"
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
              name="source_bu_owner"
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
            name="source_usercode"
            render={({ field }) => (
              <CustomSelect
                field={field}
                placeholder="ผู้ส่งมอบ"
                errorString={form.formState.errors.source_usercode ? true : false}
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
              name="sourceFristName"
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
              name="sourceLastName"
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
            name="source_date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <HorizontalInput
                    type="datetime-local"
                    label="วันที่ส่งมอบ"
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
            name="source_remark"
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
