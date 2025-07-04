// app/dashboard/FilterForm.tsx
"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField } from "@/components/ui/form"
import Position from "@/app/(main)/users/users_list/MultiFilter/Position"
import Department from "@/app/(main)/users/users_list/MultiFilter/Department"
import Branch from "@/app/(main)/users/users_list/MultiFilter/Branch"

const SelectSchema = z.object({
  position: z.string(),
  department: z.string(),
  branch: z.string(),
  filter: z.string(),
})

type SelectType = z.infer<typeof SelectSchema>

interface FilterFormProps {
  filters: {
    position: string
    department: string
    branch: string
    filter: string
  }
  branches: Branch[]
  departments: department[]
  positions: position[]
  onFiltersChange: (filters: SelectType) => void

}

export default function FilterForm({ filters, onFiltersChange, branches, departments, positions }: FilterFormProps) {
  const form = useForm<SelectType>({
    resolver: zodResolver(SelectSchema),
    defaultValues: filters,
  })

  const [watchPosition, watchDepartment, watchBranch, watchFilter] = form.watch([
    "position",
    "department",
    "branch",
    "filter"
  ])

  useEffect(() => {
    const newFilters = {
      position: watchPosition || "",
      department: watchDepartment || "",
      branch: watchBranch || "",
      filter: watchFilter || "",
    }
    onFiltersChange(newFilters)
  }, [watchPosition, watchDepartment, watchBranch, watchFilter, onFiltersChange])

  // Update form when external filters change
  useEffect(() => {
    form.reset(filters)
  }, [filters, form])

  const onSubmit = (value: SelectType) => {
    console.log("Form submitted:", value)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 sm:justify-center gap-x-5 sm:flex sm:gap-x-0 mt-4 space-x-4 justify-end"
      >
        <FormField
          name="branch"
          control={form.control}
          render={({ field }) => (
            <Branch field={field} data_branch={branches} />
          )}
        />
        <FormField
          name="department"
          control={form.control}
          render={({ field }) => (
            <Department field={field} data_department={departments} />
          )}
        />
        <FormField
          name="position"
          control={form.control}
          render={({ field }) => (
            <Position field={field} data_position={positions} />
          )}
        />
      </form>
    </Form>
  )
}