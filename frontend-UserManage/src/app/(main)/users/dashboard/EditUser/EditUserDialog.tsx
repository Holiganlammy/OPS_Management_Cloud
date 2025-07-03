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
import CustomSelect from "@/components/SelectSection/SelectSearch"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import SubmitSuccess from "@/components/SubmitAlert/AlertSubmitSuccess/SubmitSuccess"
import SubmitFailed from "@/components/SubmitAlert/AlertSubmitFailed/SubmitFailed"
import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';

const editSchema = z.object({
  Name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  loginname: z.string().min(2, "รหัสผู้ใช้ต้องมีอย่างน้อย 2 ตัวอักษร"),
  branchid: z.string().min(1, "กรุณาเลือกสาขา"),
  department: z.string().min(1, "กรุณาเลือกแผนก"),
  secid: z.string().optional(),
  positionid: z.string().min(1, "กรุณาเลือกตำแหน่ง"),
  empupper: z.string().optional(),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().optional().or(z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว"))
});

type EditForm = z.infer<typeof editSchema>
interface EditUserDialogProps {
  user: UserEdit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated?: () => void // callback เมื่ออัปเดตสำเร็จ
}

export default function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [branchApi, setBranchApi] = useState<Branch[]>([]);
  const [departmentApi, setDepartmentApi] = useState<Department[]>([]);
  const [sectionApi, setSectionApi] = useState<Section[]>([]);
  const [positionApi, setPositionApi] = useState<Position[]>([]);
  const [userApi, setUserApi] = useState<UserEdit[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [fullNameValue, setFullNameValue] = useState("");

  const form = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      Name: "",
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
  useEffect(() => {
    const fetchData = async (url: string, setter: (data: any[]) => void) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setter(data);
        } else if (data && Array.isArray(data.data)) {
          setter(data.data);
        } else {
          console.warn("API response is not an array:", data);
          setter([]);
        }
      } catch (error) {
        console.error("Error fetching", url, error);
        setter([]);
      }
    };

    if (open) {
      setIsDataLoading(true);
      // Promise.all([
      //   fetchData("/api/proxy/users", setUserApi),
      //   fetchData("/api/proxy/branch", setBranchApi),
      //   fetchData("/api/proxy/department", setDepartmentApi),
      //   fetchData("/api/proxy/section", setSectionApi),
      //   fetchData("/api/proxy/position", setPositionApi)
      // ]).finally(() => {
      //   setIsDataLoading(false);
      // });
    }
  }, [open]);

  useEffect(() => {
    if (user && open && !isDataLoading) {
      const displayName = user.Fullname.includes(':')
        ? user.Fullname.split(':')[1].trim()
        : user.Fullname;

      form.reset({
        Name: displayName,
        loginname: user.UserCode,
        branchid: user.BranchID.toString(),
        department: user.DepID.toString(),
        secid: user.SecID?.toString() || "",
        positionid: user.PositionID.toString(),
        empupper: user.EmpUpperID || "",
        email: user.Email,
        password: ""
      });
      // console.log(user)
    }
  }, [user, open, form, isDataLoading]);

  const onSubmit = async (values: EditForm) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const submitData = { ...values };
      if (!submitData.password || submitData.password.toString() === "") {
        delete submitData.password;
      }
      const response = await client.put(`/user/edit/${user.UserID}`, {
        headers: dataConfig().header
      });
      const data = await response.data;

      if (response.status === 200) {
        setFullNameValue(values.Name);
        onOpenChange(false);
        setShowSuccessAlert(true);
        if (onUserUpdated) {
          onUserUpdated();
        }
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      } else {
        console.error("Failed to update user:", data);
        setFullNameValue(values.Name);
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
        return;
      }

    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const FormSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(9)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[300px] sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลของ {user?.UserCode} ({user?.Fullname})
            </DialogDescription>
          </DialogHeader>
          {isDataLoading ? (
            <FormSkeleton />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ-นามสกุล</FormLabel>
                        <FormControl>
                          <Input placeholder="กรอกชื่อ-นามสกุล" {...field} />
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
                          <Input
                            placeholder="รหัสผู้ใช้"
                            {...field}
                            disabled
                            className="bg-gray-50"
                          />
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
                        options={branchApi.map(branch => ({
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
                        placeholder="เลือกแผนก"
                        formLabel="แผนก"
                        options={departmentApi.map(department => ({
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
                        placeholder="เลือกฝ่าย (หากมี)"
                        formLabel="ฝ่าย"
                        options={sectionApi.map(section => ({
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
                        options={positionApi.map(position => ({
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
                        placeholder="เลือกหัวหน้า (หากมี)"
                        formLabel="หัวหน้า"
                        options={userApi
                          .filter(u => u.UserID !== user?.UserID)
                          .map(userData => ({
                            value: userData.UserID,
                            label: `${userData.UserCode} - ${userData.Fullname.includes(':')
                              ? userData.Fullname.split(':')[1].trim()
                              : userData.Fullname}`
                          }))
                        }
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
                          <Input placeholder="กรอกอีเมล" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสผ่านใหม่</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="กรอกรหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นว่างไว้
                        </p>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Footer buttons */}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isLoading}>
                      ยกเลิก
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      {/* Success Toast Alert */}
      <SubmitSuccess
        showSuccessAlert={showSuccessAlert}
        fullNameValue={user?.Fullname ?? ""}
        setShowSuccessAlert={setShowSuccessAlert}
      />
      <SubmitFailed
        showErrorAlert={showErrorAlert}
        fullNameValue={fullNameValue}
        setShowErrorAlert={setShowErrorAlert}
      />
    </>
  )
}