"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField } from "@/components/ui/form"
import FilterForms from "../MultiFilter/FilterForms"

const FILTER_STORAGE_KEY = "period_filters"

const SelectSchema = z.object({
  BranchID: z.string(),
  Description: z.string(),
  personID: z.string(),
  DepCode: z.string(),
  Code: z.string(),
  filter: z.string(),
})

type SelectTypePeriod = z.infer<typeof SelectSchema>

interface FilterFormProps {
  filters: SelectTypePeriod
  periodFetch: Period[]
  onFiltersChange: (filters: SelectTypePeriod) => void
}

export default function FilterForm({
  filters,
  onFiltersChange,
  periodFetch,
}: FilterFormProps) {
  const form = useForm<SelectTypePeriod>({
    resolver: zodResolver(SelectSchema),
    defaultValues: filters,
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      const newFilters: SelectTypePeriod = {
        BranchID: value.BranchID || "",
        Description: value.Description || "",
        personID: value.personID || "",
        DepCode: value.DepCode || "",
        Code: value.Code || "",
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

  const onSubmit = (value: SelectTypePeriod) => {
    console.log("Form submitted:", value)
  }

  function getUniqueFieldValues(data: Period[], fieldID: keyof Period) {
    const seen = new Set<string>()
    const uniqueItems: Period[] = []

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
          name="Description"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              periodFetch={getUniqueFieldValues(periodFetch, "Description")}
              fieldName="คำอธิบาย"
              fieldID="Description"
            />
          )}
        />
        <FormField
          name="personID"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              periodFetch={getUniqueFieldValues(periodFetch, "personID")}
              fieldName="บุคคล"
              fieldID="personID"
            />
          )}
        />
        <FormField
          name="DepCode"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              periodFetch={getUniqueFieldValues(periodFetch, "DepCode")}
              fieldName="DepCode"
              fieldID="DepCode"
            />
          )}
        />
        <FormField
          name="Code"
          control={form.control}
          render={({ field }) => (
            <FilterForms
              field={field}
              periodFetch={getUniqueFieldValues(periodFetch, "Code")}
              fieldName="Location"
              fieldID="Code"
            />
          )}
        />
      </form>
    </Form>
  )
}