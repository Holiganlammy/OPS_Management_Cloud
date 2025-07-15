import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { CombinedForm } from "@/app/(main)/fa_control/forms/schema/combinedSchema";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { DataAsset } from "../../../service/type";

type Props = {
  nac_code: string;
  form: UseFormReturn<CombinedForm>;
  userFetch: UserData[];
  assets: DataAsset[];
  fields: FieldArrayWithId<CombinedForm, "details", "id">[];
  append: UseFieldArrayAppend<CombinedForm, "details">;
  remove: UseFieldArrayRemove;
  showReceiver: boolean
}

export default function SumDetails({ nac_code, form, userFetch, assets, fields, append, remove, showReceiver }: Props) {
  if (!form) return null;

  useEffect(() => {
    const details = form.watch("details");
    if (!details) return;
    details.forEach((item, index) => {
      const matched = assets.find((res: DataAsset) => res.Code === item.nacdtl_assetsCode);
      if (matched) {
        form.setValue(`details.${index}.nacdtl_assetsName`, matched.Name || "");
        form.setValue(`details.${index}.nacdtl_assetsSeria`, matched.SerialNo || "");
        form.setValue(`details.${index}.nacdtl_assetsPrice`, matched.Price || 0);
        form.setValue(`details.${index}.OwnerCode`, matched.OwnerCode);
        form.setValue(`details.${index}.nacdtl_date_asset`, matched.CreateDate || "");
        form.setValue(`details.${index}.nacdtl_assetsDtl`, matched.Details);
      }
    });
  }, [form.watch("details"), assets]);

  const details = form.watch("details");
  const totalPrice = details.reduce((sum, item) => {
    const price = parseFloat(item.nacdtl_assetsPrice as any) || 0;
    return sum + price;
  }, 0);

  const totalBV = details.reduce((sum, item) => {
    const price = parseFloat(item.nacdtl_bookV as any) || 0;
    return sum + price;
  }, 0);

  const totalPriceSeale = details.reduce((sum, item) => {
    const price = parseFloat(item.nacdtl_PriceSeals as any) || 0;
    return sum + price;
  }, 0);

  const totalExVat = details.reduce((sum, item) => {
    const price = parseFloat(item.nacdtl_PriceSeals as any) * (100 / 107) || 0;
    return sum + price;
  }, 0);

  const totalProfit = details.reduce((sum, item) => {
    const price = (parseFloat(item.nacdtl_PriceSeals as any) * (100 / 107)) - parseFloat(item.nacdtl_bookV as any) || 0;
    return sum + price;
  }, 0);

  return (
    <tr className="bg-white border-t">
      <td className="p-2 whitespace-nowrap w-[15%]">
        <Input
          type="text"
          readOnly
          value="รวมทั้งหมด"
          className="text-left font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          tabIndex={-1}
        />
      </td>
      <td className="hidden md:table-cell p-2 whitespace-nowrap"></td>
      <td className="p-2 whitespace-nowrap w-[15%]"></td>
      {showReceiver && <td className="hidden md:table-cell p-2 whitespace-nowrap"></td>}
      <td className="p-2 whitespace-nowrap"></td>
      {showReceiver && <td className="hidden md:table-cell p-2 whitespace-nowrap"></td>}
      <td className="p-2 whitespace-nowrap text-center">
        <Input
          type="text"
          readOnly
          value={totalPrice?.toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          className="text-right font-semibold cursor-default"
          tabIndex={-1}
        />
      </td>
      {!showReceiver &&
        <>
          <td className="hidden md:table-cell p-2 whitespace-nowrap">
            <Input
              type="text"
              readOnly
              value={totalBV?.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              className="text-right font-semibold cursor-default"
              tabIndex={-1}
            />
          </td>
          <td className="hidden md:table-cell p-2 whitespace-nowrap">
            <Input
              type="text"
              readOnly
              value={totalPriceSeale?.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              className="text-right font-semibold cursor-default"
              tabIndex={-1}
            />
          </td>
          <td className="hidden md:table-cell p-2 whitespace-nowrap">
            <Input
              type="text"
              readOnly
              value={totalExVat?.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              className="text-right font-semibold cursor-default"
              tabIndex={-1}
            />
          </td>
          <td className="hidden md:table-cell p-2 whitespace-nowrap">
            <Input
              type="text"
              readOnly
              value={totalProfit?.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              className="text-right font-semibold cursor-default"
              tabIndex={-1}
            />
          </td>
        </>
      }
      <td className="p-2 whitespace-nowrap text-center"></td>
      <td className="p-2 whitespace-nowrap text-center" />
    </tr>
  );
}
