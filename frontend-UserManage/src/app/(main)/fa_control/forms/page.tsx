"use client";

import Header from "@/app/(main)/fa_control/forms/Header";
import Details from "@/app/(main)/fa_control/forms/Details";
import Footer from "@/app/(main)/fa_control/forms/components/footer/Footer";
import PageLoading from "@/components/PageLoading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getAutoData as FetchData } from "../../users/service/userService";
import { getAutoData as FetchAsset, fetchFormData, validateDateString } from "./service/faService";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/th";
import { getCombinedFormSchema, CombinedForm } from "@/app/(main)/fa_control/forms/schema/combinedSchema";
import dataConfig from "@/config/config";
import client from "@/lib/axios/interceptors";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Status from "./components/approveStatus/Status";
import ChatAndfiles from "./components/chat&files/main";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

export default function AssetCreatePage() {
  const searchParams = useSearchParams();
  const nac_type = searchParams.get("nac_type") || "1";
  const nac_codeParam = searchParams.get("nac_code") || "";
  const schema = getCombinedFormSchema(nac_type);
  const { data: session } = useSession();
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(false);
  const [userFetch, setUserFetch] = useState<UserData[]>([]);
  const [assets, setAssets] = useState<DataAsset[]>([]);
  const [approve, setApprove] = useState<ApproveList[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<CombinedForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      usercode: session?.user.UserCode,
      nac_code: undefined,
      nac_type: Number(nac_type),
      status_name: undefined,
      nac_status: 0,
      source_dep_owner: undefined,
      source_bu_owner: undefined,
      source_usercode: undefined,
      source_userid: undefined,
      source_name: undefined,
      source_date: dayjs().format("YYYY-MM-DD HH:mm"),
      source_approve_usercode: undefined,
      source_approve_userid: undefined,
      source_approve_date: undefined,
      source_remark: undefined,
      des_dep_owner: undefined,
      des_bu_owner: undefined,
      des_usercode: undefined,
      des_userid: undefined,
      des_name: undefined,
      des_date: dayjs().format("YYYY-MM-DD HH:mm"),
      des_approve_usercode: undefined,
      des_approve_userid: undefined,
      des_approve_date: undefined,
      des_remark: undefined,
      verify_by_usercode: undefined,
      verify_by_userid: undefined,
      verify_date: undefined,
      sum_price: 0,
      create_by: undefined,
      create_date: undefined,
      account_aprrove_usercode: undefined,
      account_aprrove_id: undefined,
      account_aprrove_date: undefined,
      real_price: 0,
      realPrice_Date: undefined,
      finance_aprrove_usercode: undefined,
      finance_aprrove_id: undefined,
      finance_aprrove_date: undefined,
      desFristName: undefined,
      desLastName: undefined,
      sourceFristName: undefined,
      sourceLastName: undefined,
      details: [
        {
          nac_code: undefined,
          nacdtl_assetsCode: undefined,
          nacdtl_assetsName: undefined,
          nacdtl_assetsSeria: undefined,
          nacdtl_assetsPrice: 0,
          OwnerCode: undefined,
          nacdtl_assetsDtl: undefined,
          nacdtl_image_1: "",
          nacdtl_image_2: "",
          nacdtl_bookV: 0,
          nacdtl_PriceSeals: 0,
          nacdtl_assetsExVat: 0,
          nacdtl_profit: 0,
        },
      ],
    },
  });

  const isFormLocked = !!form.watch("source_approve_userid") || "";

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  const details = form.watch("details");
  const totalPrice = details.reduce((sum, item) => {
    const price = parseFloat(item.nacdtl_assetsPrice as any) || 0;
    return sum + price;
  }, 0);

  const totalPriceSeal = details.reduce((sum, item) => {
    const price = parseFloat(item.nacdtl_PriceSeals as any) || 0;
    return sum + price;
  }, 0);

  const onSubmit = async (dataForm: CombinedForm) => {
    const isUpdate = !!dataForm.nac_code;

    if (!!dataForm && isFormLocked) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถบันทึกข้อมูลได้",
        text: "เนื่องจากมีการเปลี่ยนแปลงข้อมูลหลังการอนุมัติ",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...dataForm,
      nac_status: 1,
      usercode: session?.user.UserCode,
      nac_code: dataForm.nac_code,
      update_by: session?.user.UserCode || "SYSTEM",
      update_date: dayjs().format("YYYY-MM-DD HH:mm"),
      source_approve_date: validateDateString(dataForm.source_approve_date),
      des_approve_date: validateDateString(dataForm.des_approve_date),
      verify_date: validateDateString(dataForm.verify_date),
      create_date: validateDateString(dataForm.create_date),
      account_aprrove_date: validateDateString(dataForm.account_aprrove_date),
      realPrice_Date: validateDateString(dataForm.realPrice_Date),
      finance_aprrove_date: validateDateString(dataForm.finance_aprrove_date),
    };

    try {
      const response = await client.post("/FA_ControlNew_Create_NAC", payload, {
        headers: dataConfig().header,
      });



      const nacCodeResponse = response?.data?.[0]?.nac_code;


      if (nacCodeResponse) {
        const payloadDetails = { ...dataForm, nac_status: 1, nac_code: nacCodeResponse };
        await createDetailItems(payloadDetails);

        Swal.fire({
          icon: "success",
          title: isUpdate ? "อัปเดตข้อมูลสำเร็จ" : "สร้างข้อมูลสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        }).then(async () => {
          if (session?.user) {
            setIsSubmitting(false);
            router.replace(`/fa_control/forms?nac_type=${nac_type}&nac_code=${nacCodeResponse}`);
          }
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถบันทึกข้อมูลได้",
        text: JSON.stringify(error.response),
      });
    }
  };

  async function createDetailItems(payloadDetails: CombinedForm) {
    setIsSubmitting(true);
    // ตรวจสอบว่ามีรายละเอียดให้ส่งหรือไม่
    if (!Array.isArray(payloadDetails.details) || payloadDetails.details.length === 0 || !payloadDetails.nac_code) {
      Swal.fire({
        icon: "info",
        title: "ไม่มีรายการรายละเอียด",
        text: "ไม่พบรายการในรายละเอียดที่ต้องบันทึก",
      });
      return;
    }

    const requestData = payloadDetails.details.map((detail, index) => ({
      usercode: session?.user.UserCode || "SYSTEM",
      nac_code: payloadDetails.nac_code,
      nacdtl_row: index,
      nacdtl_assetsCode: detail.nacdtl_assetsCode ?? null,
      OwnerCode: detail.OwnerCode ?? null,
      nacdtl_assetsName: detail.nacdtl_assetsName ?? null,
      nacdtl_assetsSeria: detail.nacdtl_assetsSeria ?? null,
      nacdtl_assetsDtl: detail.nacdtl_assetsDtl ?? null,
      create_date: dayjs().format("YYYY-MM-DD HH:mm"),
      nacdtl_bookV: detail.nacdtl_bookV ?? null,
      nacdtl_PriceSeals: detail.nacdtl_PriceSeals ?? null,
      nacdtl_profit: detail.nacdtl_profit ?? null,
      nacdtl_image_1: detail.nacdtl_image_1 ?? null,
      nacdtl_image_2: detail.nacdtl_image_2 ?? null,
    }));

    try {
      for (const item of requestData) {
        await client.post("/FA_Control_Create_Detail_NAC", item, {
          headers: dataConfig().header,
        });
      }
      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        form.reset({
          ...form.getValues(),
          nac_code: payloadDetails.nac_code,
          details: payloadDetails.details
        });
        setIsSubmitting(false);
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "บันทึกรายละเอียดล้มเหลว",
        text: JSON.stringify(error.response),
      });
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        setIsChecking(true);

        const data = await FetchData();
        const users = data?.find((d) => d.key === "users")?.data || [];
        setUserFetch(users);

        const dataAsset = await FetchAsset();
        const assets = dataAsset?.find((d) => d.key === "assets")?.data || [];
        setAssets(assets);

        if (nac_codeParam && session?.user?.UserCode) {
          // โหลดข้อมูล NAC
          await fetchFormData(nac_codeParam, session.user.UserCode, form, Number(nac_type), setApprove);
        } else {
          form.reset({
            ...form.getValues(),
            usercode: session?.user.UserCode,
            nac_code: undefined,
            nac_type: Number(nac_type),
            status_name: undefined,
            nac_status: 0,
            source_dep_owner: undefined,
            source_bu_owner: undefined,
            source_usercode: undefined,
            source_userid: undefined,
            source_name: undefined,
            source_date: dayjs().format("YYYY-MM-DD HH:mm"),
            source_approve_usercode: undefined,
            source_approve_userid: undefined,
            source_approve_date: undefined,
            source_remark: undefined,
            des_dep_owner: undefined,
            des_bu_owner: undefined,
            des_usercode: undefined,
            des_userid: undefined,
            des_name: undefined,
            des_date: dayjs().format("YYYY-MM-DD HH:mm"),
            des_approve_usercode: undefined,
            des_approve_userid: undefined,
            des_approve_date: undefined,
            des_remark: undefined,
            verify_by_usercode: undefined,
            verify_by_userid: undefined,
            verify_date: undefined,
            sum_price: 0,
            create_by: undefined,
            create_date: undefined,
            account_aprrove_usercode: undefined,
            account_aprrove_id: undefined,
            account_aprrove_date: undefined,
            real_price: 0,
            realPrice_Date: undefined,
            finance_aprrove_usercode: undefined,
            finance_aprrove_id: undefined,
            finance_aprrove_date: undefined,
            desFristName: undefined,
            desLastName: undefined,
            sourceFristName: undefined,
            sourceLastName: undefined,
            details: [
              {
                nac_code: undefined,
                nacdtl_assetsCode: undefined,
                nacdtl_assetsName: undefined,
                nacdtl_assetsSeria: undefined,
                nacdtl_assetsPrice: 0,
                OwnerCode: undefined,
                nacdtl_assetsDtl: undefined,
                nacdtl_image_1: "",
                nacdtl_image_2: "",
                nacdtl_bookV: 0,
                nacdtl_PriceSeals: 0,
                nacdtl_assetsExVat: 0,
                nacdtl_profit: 0,
              },
            ],
          });
        }

      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: JSON.stringify(error.response) || "ไม่พบข้อมูลรหัสใบงานนี้",
        }).then(() => {
          router.replace(`/fa_control/forms?nac_type=${nac_type}`);
        });
      } finally {
        setIsChecking(false);
      }
    };

    init();
  }, [nac_codeParam, session?.user?.UserCode, form, nac_type]);

  const onInvalid = (errors: any) => {
    const messages = extractMessages(errors);

    Swal.fire({
      icon: "error",
      title: "ไม่สามารถบันทึกข้อมูลได้",
      html: `<b>จะต้องมีข้อมูล !!</b> <br/> ${messages.join("<br/>")}`,
    });
  };

  const extractMessages = (errors: any): string[] => {
    if (!errors) return [];

    const result: string[] = [];

    const walk = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return;

      for (const key in obj) {
        const value = obj[key];
        if (value?.message) {
          result.push(value.message);
        }
        if (typeof value === 'object') {
          walk(value);
        }
      }
    };

    walk(errors);
    return result;
  };

  async function UpdateNAC(payload: any) {
    setIsSubmitting(true);
    try {
      const response = await client.post("/FA_ControlNew_Create_NAC", payload, {
        headers: dataConfig().header,
      });

      const nacCodeResponse = response?.data?.[response?.data?.length - 1]?.nac_code;

      if (nacCodeResponse) {
        const payloadDetails = { ...payload, nac_status: 1, nac_code: nacCodeResponse };
        await createDetailItems(payloadDetails);
        Swal.fire({
          icon: "success",
          title: "อัปเดตข้อมูลสำเร็จ",
          text: `${response?.data?.[response?.data?.length - 1]?.comment}`,
          showConfirmButton: false,
          timer: 1500,
        }).then(async () => {
          if (session?.user) {
            await fetchFormData(nac_codeParam, session.user.UserCode, form, Number(nac_type), setApprove);
            setIsSubmitting(false);
          }
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถบันทึกข้อมูลได้",
        text: JSON.stringify(error.response),
      });
    }
  }

  const onUpdate = async (dataForm: CombinedForm, status: number) => {
    if (Number(dataForm.real_price) < totalPriceSeal && dataForm.nac_status === 12) {
      const result = await Swal.fire({
        title: "แจ้งเตือน",
        text: "ราคาขายจริงที่คุณระบุมีค่าน้อยกว่าราคาที่คุณตั้งใจ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ทำต่อ",
        cancelButtonText: "ยกเลิก",
      });

      if (!result.isConfirmed) return;
    }

    if (!session?.user) return;

    const CheckformI = [1, 2, 3].includes(Number(dataForm.nac_type));
    const CheckformII = [4, 5].includes(Number(dataForm.nac_type));

    const currentStatus = dataForm.nac_status;

    const basePayload = {
      ...dataForm,
      usercode: session?.user.UserCode,
      nac_status: status,
      nac_code: dataForm.nac_code,
      update_by: session?.user.UserCode,
      update_date: dayjs().format("YYYY-MM-DD HH:mm"),
      source_approve_date: validateDateString(dataForm.source_approve_date),
      des_approve_date: validateDateString(dataForm.des_approve_date),
      verify_date: validateDateString(dataForm.verify_date),
      create_date: validateDateString(dataForm.create_date),
      account_aprrove_date: validateDateString(dataForm.account_aprrove_date),
      realPrice_Date: validateDateString(dataForm.realPrice_Date),
      finance_aprrove_date: validateDateString(dataForm.finance_aprrove_date),
    };

    let extra = {};

    if (status === currentStatus || (status === 2 && currentStatus === 1)) {
      extra = {};
    } else if (CheckformI && status !== currentStatus) {
      if ([2, 3].includes(status) && currentStatus === 2) {
        extra = {
          verify_by_usercode: session.user.UserCode,
          verify_by_userid: session.user.userid,
          verify_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };
      } else if (status === 4 && currentStatus === 3) {
        extra = {
          source_approve_usercode: session.user.UserCode,
          source_approve_userid: session.user.userid,
          source_approve_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };
      } else if (status === 5 && currentStatus === 4) {
        extra = {
          des_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };
      } else if (status === 6 && currentStatus === 5) {
        extra = {
          account_aprrove_usercode: session.user.UserCode,
          account_aprrove_id: session.user.userid,
          account_aprrove_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };
      }
    } else if (CheckformII && status !== currentStatus) {
      if ([2, 3].includes(status) && currentStatus === 2) {
        extra = {
          verify_by_usercode: session.user.UserCode,
          verify_by_userid: session.user.userid,
          verify_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };
      } else if (status === 12 && currentStatus === 3) {
        extra = {
          source_approve_usercode: session.user.UserCode,
          source_approve_userid: session.user.userid,
          source_approve_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };
      } else if (status === 13 && currentStatus === 15) {
        extra = {
          account_aprrove_usercode: session.user.UserCode,
          account_aprrove_id: session.user.userid,
          account_aprrove_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };
      } else if (status === 6 && currentStatus === 13) {
        extra = {
          finance_aprrove_usercode: session.user.UserCode,
          finance_aprrove_id: session.user.userid,
          finance_aprrove_date: dayjs().format("YYYY-MM-DD HH:mm"),
        };
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "สถานะไม่ถูกต้อง",
        text: "ไม่สามารถเปลี่ยนสถานะได้จากขั้นตอนปัจจุบัน",
      });
      return;
    }

    const finalPayload = {
      ...basePayload,
      ...extra,
    };

    await UpdateNAC(finalPayload);
  };




  if (isChecking) return <PageLoading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 pt-12 flex items-center justify-center">
      <div className="container mx-auto p-8">
        <div className="flex justify-start p-2">
          <Status approve={approve} totalPrice={totalPrice} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>


            <Header
              nac_code={form.watch("nac_code") || "-"}
              form={form}
              userFetch={userFetch}
            />

            <Details
              nac_code={form.watch("nac_code") || "-"}
              form={form}
              userFetch={userFetch}
              assets={assets}
              fields={fields}
              append={append}
              remove={remove}
            />

            <Footer
              nac_code={form.watch("nac_code") || "-"}
              form={form}
              userFetch={userFetch}
              nac_type={nac_type}
            />

            <div className="flex justify-center pt-4 gap-4">
              {![6].includes(Number(form.watch("nac_status")) || 0) &&
                <Button
                  type="button"
                  onClick={() =>
                    onUpdate(form.getValues(), Number(form.watch("nac_status") || "0"))}
                  className="!bg-orange-600 hover:!bg-orange-700 text-white cursor-pointer"
                >
                  Update
                </Button>
              }

              {(!form.watch("nac_code")) && ![6].includes(Number(form.watch("nac_status")) || 0) &&
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">Submit</Button>
              }


              {(form.watch("nac_code")) &&
                ![6].includes(Number(form.watch("nac_status")) || 0) &&
                [1, 2, 3].includes(form.watch("nac_type") || 0) && ![2, 3].includes(form.watch("nac_status") || 0) &&
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  onClick={form.handleSubmit(() =>
                    onUpdate(
                      form.getValues(),
                      Number(form.watch("nac_status") || "0") === 1 && approve.find(approve => (approve.limitamount || 0) >= totalPrice) ? 2 :
                        Number(form.watch("nac_status") || "0") === 1 && !approve.find(approve => ((approve.limitamount || 0) >= totalPrice)) ? 3 :
                          Number(form.watch("nac_status") || "0") === 4 ? 5 :
                            Number(form.watch("nac_status") || "0") === 5 ? 6 : Number(form.watch("nac_status") || "0")
                    ), onInvalid)}
                >
                  Submit
                </Button>
              }

              {(form.watch("nac_code")) && [4, 5].includes(form.watch("nac_type") || 0) && ![2, 3].includes(form.watch("nac_status") || 0) &&
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  onClick={form.handleSubmit(() => {
                    const values = form.getValues();
                    const status = Number(form.watch("nac_status") || "0");
                    const realPrice = Number(form.watch("real_price")) || 0;
                    if (status === 1) return onUpdate(values, 11);
                    if (status === 11) return onUpdate(values, 2);
                    if (status === 12) {
                      if (realPrice < totalPriceSeal) return onUpdate(values, 3);
                      return onUpdate(values, 15);
                    }
                    if (status === 15) return onUpdate(values, 13);
                    if (status === 13) return onUpdate(values, 6);

                    return onUpdate(values, status);
                  }, onInvalid)}
                >
                  Submit
                </Button>
              }



              {[2, 3].includes(form.watch("nac_status") || 0) && (
                <>
                  {([1, 3].includes(session?.user.role_id || 0) || (approve.find(approve => approve.approverid === session?.user.UserCode)))
                    && (
                      <>
                        <Button
                          type="button"
                          onClick={form.handleSubmit(() => onUpdate(form.getValues(), 1), onInvalid)}
                          className="!bg-purple-600 hover:!bg-purple-700 text-white cursor-pointer">
                          Redo
                        </Button>

                        <Button
                          type="button"
                          onClick={() => onUpdate(form.getValues(), 17)}
                          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                          Reject
                        </Button>

                        <Button
                          type="button"
                          onClick={form.handleSubmit(() => {
                            const values = form.getValues();
                            const type = form.watch("nac_type")
                            const status = form.watch("nac_status")
                            const realPriceDate = form.watch("realPrice_Date")
                            const hasHigherLimit = approve.some(a => (a.limitamount ?? 0) > totalPrice);
                            const pendingApprovers = approve.filter(a => (a.limitamount ?? 0) < totalPrice && (a.status ?? 0) === 0);

                            // เคส Admin
                            if ([1].includes(session?.user.role_id || 0) && Number(status) === 2) {
                              return onUpdate(values, 3);
                            } else if ([1].includes(session?.user.role_id || 0) && [1, 2, 3].includes(Number(type)) && Number(status) === 3) {
                              return onUpdate(values, 4);
                            } else if ([1].includes(session?.user.role_id || 0) && [4, 5].includes(Number(type)) && Number(status) === 3) {
                              if (!realPriceDate || realPriceDate === "Invalid Date") return onUpdate(values, 12);
                              return onUpdate(values, 15);
                            }

                            // เคสปกติ
                            if (pendingApprovers.length === 0 && hasHigherLimit && [1, 2, 3].includes(Number(type))) {
                              return onUpdate(values, 4);
                            } else if (pendingApprovers.length === 0 && hasHigherLimit && [4, 5].includes(Number(type))) {
                              if (!realPriceDate || realPriceDate === "Invalid Date") return onUpdate(values, 12);
                              return onUpdate(values, 15);
                            } else if (pendingApprovers.length > 1) {
                              return onUpdate(values, 2);
                            } else if (pendingApprovers.length === 1) {
                              return onUpdate(values, 3);
                            }
                          }, onInvalid)}
                          className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        >
                          Approve
                        </Button>
                      </>
                    )}
                </>
              )}
            </div>
          </form>

          {form.watch("nac_code") &&
            <ChatAndfiles
              nac_code={form.watch("nac_code") || "-"}
              nac_status={form.watch("nac_status") || 0}
            />
          }

        </Form>

        {isSubmitting && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="flex flex-row items-center gap-4">
              <div className="text-white animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
              <p className="text-xl text-white">กำลังบันทึกข้อมูล...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}