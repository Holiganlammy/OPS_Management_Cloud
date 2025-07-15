"use client";

import { useSearchParams } from "next/navigation";
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { CombinedForm } from "@/app/(main)/fa_control/forms/schema/combinedSchema";
import AssetTable from "./components/details/AssetTable";
import { DataAsset } from "../service/type";

type Props = {
  nac_code: string;
  form: UseFormReturn<CombinedForm>;
  userFetch: UserData[];
  assets: DataAsset[];
  fields: FieldArrayWithId<CombinedForm, "details", "id">[];
  append: UseFieldArrayAppend<CombinedForm, "details">;
  remove: UseFieldArrayRemove;
};

export default function Details({ nac_code, form, userFetch, assets, fields, append, remove, }: Props) {
  const searchParams = useSearchParams();
  const nacType = searchParams.get("nac_type") || "1";
  const showReceiver = nacType === "1" || nacType === "2" || nacType === "3";

  if (!form) return null;

  return (
    <div>
      <AssetTable
        nac_code={nac_code}
        form={form}
        userFetch={userFetch}
        assets={assets}
        fields={fields}
        append={append}
        remove={remove}
        showReceiver={showReceiver}
      />
    </div>
  );
}
