"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField } from "@/components/ui/form"
import FilterForms from "../MultiFilter/FilterForms"

const FILTER_STORAGE_KEY = "CountAssetRow"

const SelectSchema = z.object({
  Code: z.string(),
  Name: z.string(),
  BranchID: z.string(),
  OwnerID: z.string(),
  Position: z.string(),
  typeCode: z.string(),
  filter: z.string(),
})

type SelectTypeAssetRow = z.infer<typeof SelectSchema>

interface FilterFormProps {
  filters: SelectTypeAssetRow
  filteredAssets: CountAssetRow[]
  onFiltersChange: (filters: SelectTypeAssetRow) => void
}

export default function FilterForm({
  filters,
  onFiltersChange,
  filteredAssets,
}: FilterFormProps) {
  const form = useForm<SelectTypeAssetRow>({
    resolver: zodResolver(SelectSchema),
    defaultValues: filters,
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      const newFilters: SelectTypeAssetRow = {
        Code: value.Code || "",
        Name: value.Name || "",
        BranchID: value.BranchID || "",
        OwnerID: value.OwnerID || "",
        Position: value.Position || "",
        typeCode: value.typeCode || "",
        filter: value.filter || "",
      }

      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(newFilters))
      onFiltersChange(newFilters)
    })

    return () => subscription.unsubscribe()
  }, [form.watch, onFiltersChange])

  useEffect(() => {
    const current = form.getValues()
    const hasChanged = JSON.stringify(current) !== JSON.stringify(filters)
    if (hasChanged) {
      form.reset(filters)
    }
  }, [filters, form])

  const onSubmit = (value: SelectTypeAssetRow) => {
    console.log("Form submitted:", value)
  }

  function getUniqueFieldValues(data: CountAssetRow[], fieldID: keyof CountAssetRow) {
    const seen = new Set<string>()
    const uniqueItems: CountAssetRow[] = []

    data.forEach((item) => {
      const val = item[fieldID]?.toString() ?? ""
      if (!seen.has(val)) {
        seen.add(val)
        uniqueItems.push(item)
      }
    })

    return uniqueItems
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4 justify-end"
      >
        <FormField
          name="Code"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              filteredAssets={getUniqueFieldValues(filteredAssets, "Code")}
              fieldName="เลขที่เอกสาร"
              fieldID="Code"
            />
          )}
        />
        <FormField
          name="Name"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              filteredAssets={getUniqueFieldValues(filteredAssets, "Name")}
              fieldName="หัวข้อรายการ"
              fieldID="Name"
            />
          )}
        />
        <FormField
          name="OwnerID"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              filteredAssets={getUniqueFieldValues(filteredAssets, "OwnerID")}
              fieldName="ผู้ถือครอง"
              fieldID="OwnerID"
            />
          )}
        />
        <FormField
          name="Position"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              filteredAssets={getUniqueFieldValues(filteredAssets, "Position")}
              fieldName="ตำแหน่ง"
              fieldID="Position"
            />
          )}
        />
      </form>
    </Form>
  )
}