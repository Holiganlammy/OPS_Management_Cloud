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
import { FormControl, FormItem } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

type SortField = ControllerRenderProps<SelectType, "department">;

interface DepartmentProps {
  field: SortField;
}

export default function Department({ field }: DepartmentProps) {
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:7777/api/department`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setDepartments(data.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter(
    (dep) => dep.depcode.startsWith("101") || dep.depcode.startsWith("201")
  );

  const selectedDepartment = filteredDepartments.find(
    (dep) => dep.depid.toString() === field.value
  );

  const handleSelect = (depid: string) => {
    field.onChange(depid === field.value ? "" : depid);
    setOpen(false);
  };

  const handleClear = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    field.onChange("");
  };

  return (
    <FormItem>
      <FormControl>
        <div className="relative mt-5.5">
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
                    {selectedDepartment ? selectedDepartment.name : "เลือกฝ่าย"}
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
                <CommandInput
                  placeholder="ค้นหาฝ่าย..."
                  className="h-9"
                />
                <CommandEmpty>
                  {isLoading ? "กำลังโหลด..." : "ไม่พบฝ่าย"}
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {filteredDepartments.map((department) => (
                    <CommandItem
                      key={department.depid}
                      value={department.name}
                      onSelect={() => handleSelect(department.depid.toString())}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          field.value === department.depid.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="" title={department.name}>
                        {department.name}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
    </FormItem>
  );
}