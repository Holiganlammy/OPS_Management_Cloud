"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField } from "@/components/ui/form"
import FilterForms from "../MultiFilter/FilterForms"

const FILTER_STORAGE_KEY = "nac_filters"

const SelectSchema = z.object({
  nac_code: z.string(),
  name: z.string(),
  source_userid: z.string(),
  des_userid: z.string(),
  status_name: z.string(),
  filter: z.string(),
})

type SelectTypeNAC = z.infer<typeof SelectSchema>

interface FilterFormProps {
  filters: SelectTypeNAC
  nacFetch: List_NAC[]
  onFiltersChange: (filters: SelectTypeNAC) => void
}

export default function FilterForm({
  filters,
  onFiltersChange,
  nacFetch,
}: FilterFormProps) {
  const form = useForm<SelectTypeNAC>({
    resolver: zodResolver(SelectSchema),
    defaultValues: filters,
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      const newFilters: SelectTypeNAC = {
        nac_code: value.nac_code || "",
        name: value.name || "",
        source_userid: value.source_userid || "",
        des_userid: value.des_userid || "",
        status_name: value.status_name || "",
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

  const onSubmit = (value: SelectTypeNAC) => {
    console.log("Form submitted:", value)
  }

  function getUniqueFieldValues(data: List_NAC[], fieldID: keyof List_NAC) {
    const seen = new Set<string>()
    const uniqueItems: List_NAC[] = []

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
        className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-4 justify-end"
      >
        <FormField
          name="nac_code"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              nacFetch={getUniqueFieldValues(nacFetch, "nac_code")}
              fieldName="เลขที่เอกสาร"
              fieldID="nac_code"
            />
          )}
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              nacFetch={getUniqueFieldValues(nacFetch, "name")}
              fieldName="หัวข้อรายการ"
              fieldID="name"
            />
          )}
        />
        <FormField
          name="source_userid"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              nacFetch={getUniqueFieldValues(nacFetch, "source_userid")}
              fieldName="ผู้ส่งมอบ"
              fieldID="source_userid"
            />
          )}
        />
        <FormField
          name="des_userid"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              nacFetch={getUniqueFieldValues(nacFetch, "des_userid")}
              fieldName="ผู้รับมอบ"
              fieldID="des_userid"
            />
          )}
        />
        <FormField
          name="status_name"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              nacFetch={getUniqueFieldValues(nacFetch, "status_name")}
              fieldName="สถานะเอกสาร"
              fieldID="status_name"
            />
          )}
        />
      </form>
    </Form>
  )
}