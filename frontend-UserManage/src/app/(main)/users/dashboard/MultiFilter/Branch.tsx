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
import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';

type SortField = ControllerRenderProps<SelectType, "branch">;

interface BranchProps {
  field: SortField;
}

export default function Branch({ field }: BranchProps) {
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const response = await client.get(`/branch`, {
          headers: dataConfig().header
        });
        const data = await response.data;

        setBranches(data.data || []);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const selectedBranch = branches.find(
    (branch) => branch.branchid.toString() === field.value
  );

  const handleSelect = (branchId: string) => {
    field.onChange(branchId === field.value ? "" : branchId);
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
        <div className="relative">
          <FormLabel className="mb-2">
            Filter
          </FormLabel>
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
                    {selectedBranch ? selectedBranch.name : "เลือกสาขา"}
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
                <CommandEmpty>
                  {isLoading ? "กำลังโหลด..." : "ไม่พบสาขา"}
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {branches.map((branch) => (
                    <CommandItem
                      key={branch.branchid}
                      value={branch.name}
                      onSelect={() => handleSelect(branch.branchid.toString())}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          field.value === branch.branchid.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="" title={branch.name}>
                        {branch.name}
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
