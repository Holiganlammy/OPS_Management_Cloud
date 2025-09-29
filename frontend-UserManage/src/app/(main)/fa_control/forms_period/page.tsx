"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/th";
import { useForm } from "react-hook-form";
import { PeroidForm } from "./schema/nacDtlSchema";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl, Form } from "@/components/ui/form";
import HorizontalInput from "@/components/ui/StandardInput";
import { RadioGroup, RadioGroupItem, } from "@/components/ui/radio-group"
import { useCallback, useEffect, useRef, useState } from "react";
import { getAutoData } from "../../users/service/userService";
import CustomSelect from "@/components/SelectSection/SelectSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import dataConfig from "@/config/config";
import client from "@/lib/axios/interceptors";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

function generateRandomString(length = 10) {
  let result = '';
  while (result.length < length) {
    result += Math.random().toString(36).substring(2); // ตัด "0."
  }
  return result.substring(0, length);
}

export default function AssetCreatePage() {
  const { data: session, status } = useSession({
  required: false,
});

  const [userFetch, setUserFetch] = useState<UserData[]>([])
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<department[]>([]);
  const [firstStep, setFirstStep] = useState<string>("0");
  const [secondStep, setSecondStep] = useState<string>("0");
  const prevSecondStep = useRef<string>("0");
  const router = useRouter();

  const form = useForm<PeroidForm>({
    defaultValues: {
      begindate: dayjs().format("YYYY-MM-DD HH:mm"),
      enddate: dayjs().format("YYYY-MM-DD HH:mm"),
      branchid: "",
      description: "",
      usercode: session?.user.UserCode || "SYSTEM",
      depcode: "",
      personID: "",
      keyID: generateRandomString(),
    },
  });

  const { handleSubmit, formState: { errors }, } = form;

  const onSubmit = async (data: PeroidForm) => {
    try {
      const {
        begindate,
        enddate,
        branchid,
        description,
        usercode,
        personID,
        keyID,
        depcode,
      } = data;

      const first = Number(firstStep);
      const second = Number(secondStep);

      const isEmpty = (value: any) =>
        value === undefined || value === null || value === "";

      let missingFields: string[] = [];

      if (first === 0 || (first === 1 && second === 0)) {
        if (isEmpty(begindate)) missingFields.push("วันที่เริ่มต้น");
        if (isEmpty(enddate)) missingFields.push("วันที่สิ้นสุด");
        if (isEmpty(branchid)) missingFields.push("สาขา");
        if (isEmpty(description)) missingFields.push("หมายเหตุ");
        if (isEmpty(usercode)) missingFields.push("ผู้ใช้งาน");
        if (isEmpty(keyID)) missingFields.push("keyID");
        if (depcode !== "") missingFields.push("แผนก (ต้องเป็นค่าว่าง)");
        if (personID !== "") missingFields.push("ผู้ใช้งานบุคคล (ต้องเป็นค่าว่าง)");

      } else if (first === 1 && (second === 1 || second === 3)) {
        if (isEmpty(begindate)) missingFields.push("วันที่เริ่มต้น");
        if (isEmpty(enddate)) missingFields.push("วันที่สิ้นสุด");
        if (isEmpty(branchid)) missingFields.push("สาขา");
        if (isEmpty(description)) missingFields.push("หมายเหตุ");
        if (isEmpty(usercode)) missingFields.push("ผู้ใช้งาน");
        if (isEmpty(personID)) missingFields.push("ผู้ใช้งานบุคคล");
        if (isEmpty(keyID)) missingFields.push("keyID");
        if (depcode !== "") missingFields.push("แผนก (ต้องเป็นค่าว่าง)");

      } else if (first === 1 && second === 2) {
        if (isEmpty(begindate)) missingFields.push("วันที่เริ่มต้น");
        if (isEmpty(enddate)) missingFields.push("วันที่สิ้นสุด");
        if (isEmpty(branchid)) missingFields.push("สาขา");
        if (isEmpty(description)) missingFields.push("หมายเหตุ");
        if (isEmpty(usercode)) missingFields.push("ผู้ใช้งาน");
        if (isEmpty(depcode)) missingFields.push("แผนก");
        if (isEmpty(keyID)) missingFields.push("keyID");
        if (personID !== "") missingFields.push("ผู้ใช้งานบุคคล (ต้องเป็นค่าว่าง)");
      }

      if (missingFields.length > 0) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง",
          text: `กรุณาระบุ ${missingFields.map(f => f).join("")}`,
          showConfirmButton: true,
        });
        return;
      }
      
      const responses = await client.post(dataConfig().http + "/createPeriod", data, {
        headers: dataConfig().header,
      });
      if (responses.status === 200) {
        Swal.fire({
          icon: "success",
          title: "ทำรายการสำเร็จ",
          text: "ทำการสร้างรอบตรวจนับทรัพย์สินแล้ว",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.replace(`/fa_control/list_period`);
        })
      }

    } catch (error) {
      console.error("Error creating periods:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการส่งข้อมูล",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };


  const fetchData = useCallback(async () => {
    if (session) {
      try {
        const userData = await getAutoData()
        setUserFetch(userData?.filter(data => data.key === 'users')[0].data || []);
        setBranches(userData?.filter(data => data.key === 'branch')[0].data.data || []);
        setDepartments(userData?.filter(data => data.key === 'department')[0].data.data || []);
      } catch (error) {
        console.error("Error fetching NAC:", error);
      }
    }
  }, [session]);

  useEffect(() => {
    if (firstStep === "1") {
      const prev = prevSecondStep.current;
      const current = secondStep;

      if (prev !== current) {
        // reset field ที่ไม่ใช้แล้ว
        if (prev === "2") {
          form.setValue("depcode", "");
        } else if (["1", "3"].includes(prev)) {
          form.setValue("personID", "");
        }

        if (current === "2") {
          form.setValue("personID", "");
        } else if (["1", "3"].includes(current)) {
          form.setValue("depcode", "");
        }
      }

      prevSecondStep.current = current;
    }
  }, [secondStep, firstStep, form]);

  useEffect(() => {
    fetchData();
    if (firstStep === "0" && secondStep === "0") {
      form.setValue("branchid", "0")
      form.setValue("personID", "")
      form.setValue("depcode", "")
    }
    if (firstStep === "1" && secondStep === "0") {
      form.setValue("branchid", "901")
      form.setValue("personID", "")
      form.setValue("depcode", "")
    }
  }, [fetchData, firstStep, secondStep])

  const handleFirstStepChange = (value: string) => {
    setFirstStep(value)
    setSecondStep("0")

    if (value === "0") {
      form.setValue("branchid", "0")
      form.setValue("personID", "")
      form.setValue("depcode", "")
    } else {
      form.setValue("branchid", "901")
      form.setValue("personID", "")
      form.setValue("depcode", "")
    }
  }

  const handleSecondStepChange = (value: string) => {
    setSecondStep(value)
    if (firstStep === "0" && value === "0") {
      form.setValue("branchid", "0")
      form.setValue("personID", "")
      form.setValue("depcode", "")
    } else if (firstStep === "1") {
      form.setValue("branchid", "901")
      form.setValue("personID", "")
      form.setValue("depcode", "")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="container mx-auto p-8">
        <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-xl bg-white shadow">
          <h2 className="text-2xl font-bold mb-6 text-zinc-700">สร้างฟอร์มระยะเวลาการตรวจนับทรัพย์สิน (Period)</h2>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-2 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="begindate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <HorizontalInput
                              type="datetime-local"
                              label="วันที่เริ่มต้น"
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
                      name="enddate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <HorizontalInput
                              type="datetime-local"
                              label="วันที่สิ้นสุด"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            rows={3}
                            className="flex-1"
                            placeholder="หมายเหตุ"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <RadioGroup
                    value={firstStep}
                    onValueChange={handleFirstStepChange}
                    className="flex flex-wrap gap-3"
                  >
                    {[{ id: "0", name: "CO (หน่วยงานสาขา)" }, { id: "1", name: "HO (สำนักงานใหญ่)" }].map((type) => (
                      <div key={type.id} className="flex items-center gap-2">
                        <RadioGroupItem value={type.id} id={`radio-${type.id}`} />
                        <Label htmlFor={`radio-${type.id}`} className="px-2">
                          {type.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex-1">
                  {firstStep === "0" && (
                    <Select value={secondStep} onValueChange={handleSecondStepChange}>
                      <SelectTrigger className="w-full text-base">
                        <SelectValue placeholder="กรุณาเลือกรูปแบบสาขา" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">CO ทุกสาขา</SelectItem>
                        <SelectItem value="1">ระบุเฉพาะบางสาขา</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex-1">
                  {firstStep === "1" && (
                    <Select value={secondStep} onValueChange={handleSecondStepChange}>
                      <SelectTrigger className="w-full text-base">
                        <SelectValue placeholder="กรุณาเลือกรูปแบบสาขา" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">HO ทั้งหมด</SelectItem>
                        <SelectItem value="1">แยกตามหน่วยงานส่วนกลาง</SelectItem>
                        <SelectItem value="2">แยกตามหน่วยงานแผนก</SelectItem>
                        <SelectItem value="3">แยกตามรายชื่อบุคคล</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex-1">
                  {firstStep === "0" && secondStep === "1" && (
                    <FormField
                      control={form.control}
                      name="branchid"
                      render={({ field }) => (
                        <CustomSelect
                          isMulti
                          field={{
                            ...field,
                            value: Array.isArray(field.value)
                              ? field.value.map((v: string) => v.trim())
                              : typeof field.value === "string"
                                ? field.value
                                  .split(",")
                                  .map((v) => v.trim())
                                  .filter(Boolean)
                                : [],
                            onChange: (values: string[] | string) => {
                              const arr = Array.isArray(values) ? values : values.split(",").filter(Boolean);
                              const formatted = arr.map((v) => v.trim()).join(", ");
                              field.onChange(formatted);
                            },
                          }}
                          placeholder="เลือกสาขา"
                          formLabel="สาขา"
                          options={Array.isArray(branches)
                            ? branches.map(b => ({
                              value: String(b.branchid),
                              label: b.name,
                            }))
                            : []}
                        />
                      )}
                    />
                  )}
                </div>

                <div className="flex-1">
                  {firstStep === "1" && ["2"].includes(secondStep) && (
                    <FormField
                      control={form.control}
                      name="depcode"
                      render={({ field }) => (
                        <CustomSelect
                          isMulti
                          field={{
                            ...field,
                            value: Array.isArray(field.value)
                              ? field.value.map((v: string) => v.trim())
                              : typeof field.value === "string"
                                ? field.value
                                  .split(",")
                                  .map((v) => v.trim())
                                  .filter(Boolean)
                                : [],
                            onChange: (values: string[] | string) => {
                              const arr = Array.isArray(values) ? values : values.split(",").filter(Boolean);
                              const formatted = arr.map((v) => v.trim()).join(", ");
                              field.onChange(formatted);
                            },
                          }}
                          placeholder="เลือก"
                          formLabel="สาขา"
                          options={departments?.map(dep => ({
                            value: String(dep.depcode),
                            label: `${dep.depcode}: ${dep.depname}`,
                          }))}
                        />
                      )}
                    />
                  )}
                </div>

                <div className="flex-1">
                  {firstStep === "1" && ["1"].includes(secondStep) && (
                    <FormField
                      control={form.control}
                      name="personID"
                      render={({ field }) => (
                        <CustomSelect
                          isMulti
                          field={{
                            ...field,
                            value: Array.isArray(field.value)
                              ? field.value
                              : typeof field.value === "string"
                                ? field.value.split(", ").filter(Boolean)
                                : [],
                            onChange: (values: string) => {
                              field.onChange(values)
                            },
                          }}
                          placeholder="เลือก"
                          formLabel="เลือกหน่วยงาน"
                          options={
                            secondStep === "1"
                              ? userFetch?.filter(u => u.UserType === "CENTER").map(u => ({
                                value: String(u.UserCode),
                                label: `${u.UserCode}: ${u.DepName}`,
                              })) || []
                              : userFetch?.filter(u => u.BranchID === 901 && u.UserType !== "CENTER").map(u => ({
                                value: String(u.UserCode),
                                label: `${u.UserCode}: ${u.fristName} ${u.lastName}`,
                              })) || []
                          }
                        />
                      )}
                    />
                  )}
                </div>

                <div className="flex-1">
                  {firstStep === "1" && ["3"].includes(secondStep) && (
                    <FormField
                      control={form.control}
                      name="personID"
                      render={({ field }) => (
                        <CustomSelect
                          isMulti
                          field={{
                            ...field,
                            value: Array.isArray(field.value)
                              ? field.value
                              : typeof field.value === "string"
                                ? field.value.split(", ").filter(Boolean)
                                : [],
                            onChange: (values: string) => {
                              field.onChange(values)
                            },
                          }}
                          placeholder="เลือก"
                          formLabel="เลือกผู้ใช้"
                          options={
                            secondStep === "1"
                              ? userFetch?.filter(u => u.UserType === "CENTER").map(u => ({
                                value: String(u.UserCode),
                                label: `${u.UserCode}: ${u.DepName}`,
                              })) || []
                              : userFetch?.filter(u => u.BranchID === 901 && u.UserType !== "CENTER").map(u => ({
                                value: String(u.UserCode),
                                label: `${u.UserCode}: ${u.fristName} ${u.lastName}`,
                              })) || []
                          }
                        />
                      )}
                    />
                  )}
                </div>

                {/* Submit */}
                <Button type="submit" className="mt-4 w-full">
                  บันทึกข้อมูล
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div >
  );
}