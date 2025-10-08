"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField } from "@/components/ui/form"
import FilterForms from "../MultiFilter/FilterForm"

const SelectSchema = z.object({
  nac_code: z.array(z.string()).optional(),
  nacdtl_assetsCode: z.array(z.string()).optional(),
  name: z.array(z.string()).optional(),
  source_approve_userid: z.array(z.string()).optional(),
});

type SelectTypeAssetRow = z.infer<typeof SelectSchema>

interface FilterFormProps {
  filters: SelectTypeAssetRow
  filteredAssets: HistoryAssetType[]
  onFiltersChange: (filters: SelectTypeAssetRow) => void
}

export default function HistoryFilterForm({
  filters,
  onFiltersChange,
  filteredAssets,
}: FilterFormProps) {
  const form = useForm<SelectTypeAssetRow>({
    resolver: zodResolver(SelectSchema),
    defaultValues: filters,
  })

  // เพิ่ม: subscribe การเปลี่ยนแปลงของ form
  useEffect(() => {
    const subscription = form.watch((value) => {
      onFiltersChange(value as SelectTypeAssetRow)
    })
    return () => subscription.unsubscribe()
  }, [form, onFiltersChange])

  useEffect(() => {
    const current = form.getValues()
    const hasChanged = JSON.stringify(current) !== JSON.stringify(filters)
    if (hasChanged) {
      form.reset(filters)
    }
  }, [filters, form])

  const onSubmit = (value: SelectTypeAssetRow) => {
    console.log("Form submitted:", value)
    onFiltersChange(value)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4 justify-end"
      >
        <FormField
          name="nac_code"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              filteredAssets={filteredAssets}
              fieldName="เลข NAC"
              fieldID="nac_code"
            />
          )}
        />

        <FormField
          name="nacdtl_assetsCode"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              filteredAssets={filteredAssets}
              fieldName="รหัสทรัพย์สิน"
              fieldID="nacdtl_assetsCode"
            />
          )}
        />

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              filteredAssets={filteredAssets}
              fieldName="หัวข้อรายการ"
              fieldID="name"
            />
          )}
        />

        <FormField
          name="source_approve_userid"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              filteredAssets={filteredAssets}
              fieldName="ผู้อนุมัติ"
              fieldID="source_approve_userid"
            />
          )}
        />
      </form>
    </Form>
  )
}