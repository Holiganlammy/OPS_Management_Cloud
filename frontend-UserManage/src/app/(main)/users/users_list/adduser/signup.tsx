"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import CustomSelect from "@/components/SelectSection/SelectSearch"
import SubmitFailed from "@/components/SubmitAlert/AlertSubmitFailed/SubmitFailed"
import SubmitSuccess from "@/components/SubmitAlert/AlertSubmitSuccess/SubmitSuccess"
import dataConfig from "@/config/config"
import client from "@/lib/axios/interceptors"

const signupSchema = z.object({
  Firstname: z.string().min(2, "ชื่อ ต้องมีอย่างน้อย 2 ตัวอักษร"),
  Lastname: z.string().min(2, "นามสกุล ต้องมีอย่างน้อย 2 ตัวอักษร"),
  loginname: z.string().min(2, "ชื่อผู้ใช้ต้องมีอย่างน้อย 2 ตัวอักษร"),
  branchid: z.string().min(1, "ต้องระบุสาขา"),
  department: z.string().min(1, "ต้องระบุแผนก"),
  secid: z.string(),
  positionid: z.string().min(1, "ต้องระบุตำแหน่ง"),
  empupper: z.string().optional(),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .regex(/[A-Z]/, "รหัสผ่านต้องมีอักษรตัวใหญ่อย่างน้อย 1 ตัว")
    .regex(/[!@#$%^&*(),.?":{}|<>_\-]/, "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว (เช่น !@# หรือ _-)")
});
type SignupForm = z.infer<typeof signupSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: () => void
  branches: Branch[]
  users: UserData[];
  departments: department[]
  positions: position[]
  sections: Section[]
}

export default function Signup({
  open,
  onOpenChange,
  onUserCreated,
  branches,
  users,
  departments,
  positions,
  sections
}: Props) {
  const [fullNameValue, setFullNameValue] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      Firstname: "",
      Lastname: "",
      loginname: "",
      branchid: "",
      department: "",
      secid: "",
      positionid: "",
      empupper: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: SignupForm) => {
    try {
      const dataToSend = {
        ...values,
        Name: `${values.Firstname} ${values.Lastname}`
      };
      const response = await client.post("/user/create", dataToSend, { headers: dataConfig().header });
      const data = await response.data;
      if (data.success) {
        setFullNameValue(`${values.Firstname} ${values.Lastname}`);
        onOpenChange?.(false);
        setShowSuccessAlert(true);

        if (onUserCreated) onUserCreated();

        form.reset({
          Firstname: "",
          Lastname: "",
          loginname: "",
          branchid: "",
          department: "",
          secid: "",
          positionid: "",
          empupper: "",
          email: "",
          password: ""
        });

        setTimeout(() => setShowSuccessAlert(false), 5000);
      } else {
        console.error("Error creating user:", data);
        setFullNameValue(`${values.Firstname} ${values.Lastname}`);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 5000);
      }
    } catch (error: any) {
      if (
        error?.response?.status === 409 &&
        error?.response?.data?.duplicate === true
      ) {
        setShowDuplicateAlert(true);
        setTimeout(() => setShowDuplicateAlert(false), 5000);
      } else {
        console.error("Error signing up:", error);
        setFullNameValue(`${values.Firstname} ${values.Lastname}`);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 5000);
      }
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[0px] sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>สร้างผู้ใช้</DialogTitle>
            <DialogDescription>
              "กรอกโปรไฟล์ของคุณที่นี่ คลิก 'บันทึก' เมื่อทำเสร็จแล้ว"
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="Firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อ</FormLabel>
                      <FormControl>
                        <Input placeholder="กรุณากรอกชื่อ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>นามสกุล</FormLabel>
                      <FormControl>
                        <Input placeholder="กรุณากรอก นามสกุล" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  control={form.control}
                  name="loginname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสผู้ใช้</FormLabel>
                      <FormControl>
                        <Input placeholder="กรุณากรอกรหัสผู้ใช้" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Branch ID */}
                <FormField
                  control={form.control}
                  name="branchid"
                  render={({ field }) => (
                    <CustomSelect
                      field={field}
                      placeholder="เลือกสาขา"
                      formLabel="สาขา"
                      options={branches.map(branch => ({
                        value: branch.branchid.toString(),
                        label: branch.name
                      }))}
                    />
                  )}
                />

                {/* Department ID */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <CustomSelect
                      field={field}
                      placeholder="เลือกฝ่าย"
                      formLabel="ฝ่าย"
                      options={departments.map(department => ({
                        value: department.depid.toString(),
                        label: department.name
                      }))}
                    />
                  )}
                />

                {/* Section ID */}
                <FormField
                  control={form.control}
                  name="secid"
                  render={({ field }) => (
                    <CustomSelect
                      field={field}
                      placeholder="เลือกแผนก (หากมี)"
                      formLabel="แผนก (หากมี)"
                      options={sections.filter((section, index, self) =>
                        index === self.findIndex(s => s.name === section.name)
                      ).map(section => ({
                        value: section.secid.toString(),
                        label: section.codename
                      }))}
                    />
                  )}
                />

                {/* Position ID */}
                <FormField
                  control={form.control}
                  name="positionid"
                  render={({ field }) => (
                    <CustomSelect
                      field={field}
                      placeholder="เลือกตำแหน่ง"
                      formLabel="ตำแหน่ง"
                      options={positions.map(position => ({
                        value: position.positionid.toString(),
                        label: position.position
                      }))}
                    />
                  )}
                />

                {/* Empupper */}
                <FormField
                  control={form.control}
                  name="empupper"
                  render={({ field }) => (
                    <CustomSelect
                      field={field}
                      placeholder="เลือกหัวหน้า"
                      formLabel="หัวหน้า"
                      options={users.map(user => ({
                        value: user.UserID.toString(),
                        label: user.Fullname
                      }))}
                    />
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล</FormLabel>
                      <FormControl>
                        <Input placeholder="กรุณากรอกอีเมล" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel>รหัสผ่าน</FormLabel>
                      <FormControl>
                        <Input placeholder="กรุณากรอกรหัสผ่าน" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-1">
                        รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร, มีอักษรตัวใหญ่อย่างน้อย 1 ตัว และมีอักขระพิเศษอย่างน้อย 1 ตัว (เช่น !@# หรือ _-)
                      </p>
                    </FormItem>
                  )}
                />
              {/* Footer buttons */}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <SubmitSuccess showSuccessAlert={showSuccessAlert} setShowSuccessAlert={setShowSuccessAlert} fullNameValue={fullNameValue} />
      <SubmitFailed showErrorAlert={showErrorAlert} fullNameValue={fullNameValue} setShowErrorAlert={setShowErrorAlert} />
      <SubmitFailed showErrorAlert={showDuplicateAlert} errorDuplicate={true} Usercode={form.getValues("loginname")} setShowErrorAlert={setShowDuplicateAlert} />
    </>
  )
}