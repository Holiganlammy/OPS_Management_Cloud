"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useState, MouseEvent } from "react"

type Option = {
  label: string
  value: string
}
type SortField<T extends FieldValues, K extends FieldPath<T>> = ControllerRenderProps<T, K>;
interface CustomSelectProps<T extends FieldValues, K extends FieldPath<T>> {
  field: SortField<T, K>;
  placeholder: string
  formLabel: string
  options: Option[]
}

export default function CustomSelect<T extends FieldValues, K extends FieldPath<T>>({
  field,
  placeholder,
  formLabel,
  options
}: CustomSelectProps<T, K>) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(option => option.value === field.value);

  const handleSelect = (optionValue: string) => {
    field.onChange(optionValue === field.value ? "" : optionValue);
    setOpen(false);
  };

  const handleClear = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    field.onChange("");
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{formLabel}</FormLabel>
      <FormControl>
        <div className="relative">
          <Popover open={open} onOpenChange={setOpen}>
            <div className="relative">
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[170px] sm:w-full justify-between pr-8 text-left"
                >
                  <span className="truncate block min-w-0 flex-1">
                    {selectedOption ? selectedOption.label : placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              {field.value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 z-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <PopoverContent className="min-w-[170px] sm:min-w-[220px] w-auto max-w-sm p-0" align="start">
              <Command className="w-full">
                <CommandInput placeholder={`ค้นหา ${formLabel}...`} className="h-9" />
                <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          field.value === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="" title={option.label}>
                        {option.label}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}