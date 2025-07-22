"use client";

import { useState, useEffect, MouseEvent } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

type SortField = ControllerRenderProps<SelectTypeNAC>;

interface Props {
  field: SortField;
  nacFetch: List_NAC[];
  fieldName: string;
  fieldID: keyof List_NAC;
}

export default function FilterForms({ field, nacFetch, fieldName, fieldID }: Props) {
  const [open, setOpen] = useState(false);


  const selectedItem = nacFetch.find(
    (res) => res[fieldID]?.toString() === field.value
  );

  const handleSelect = (value: string) => {
    field.onChange(value === field.value ? "" : value);
    setOpen(false);
  };

  const handleClear = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    field.onChange("");
  };

  const uniqueValues = new Set<string>();
  const uniqueItems = nacFetch.filter((res) => {
    const val = res[fieldID]?.toString() ?? "";
    if (uniqueValues.has(val)) {
      return false; // ถ้าค่าซ้ำ ให้ตัดออก
    }
    uniqueValues.add(val);
    return true; // เก็บแค่ค่าแรกที่เจอ
  });

  return (
    <FormItem>
      <FormControl>
        <div className="relative">
          <Popover open={open} onOpenChange={setOpen}>
            <div className="relative">
              <PopoverTrigger className="max-w-[140px] sm:max-w-[170px] md:max-w-[220px]" asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[170px] sm:w-[220px] justify-between pr-8 text-left"
                >
                  <span className="truncate block min-w-0 flex-1">
                    {selectedItem?.[fieldID]?.toString() || fieldName}
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
                <CommandInput placeholder="ค้นหาสาขา..." className="h-9" />
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {uniqueItems.map((res, index) => {
                    const value = res[fieldID]?.toString() ?? "";
                    return (
                      <CommandItem
                        key={`${fieldID}-${value}`}
                        value={value}
                        onSelect={() => handleSelect(value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span title={value}>
                          {res[fieldID]?.toString() ?? value}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
    </FormItem>
  );
}
