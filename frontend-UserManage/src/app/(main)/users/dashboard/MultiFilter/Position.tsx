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
import dataConfig from '@/config/config';
import client from '@/lib/axios/interceptors';

type SortField = ControllerRenderProps<SelectType, "position">;

interface PositionProps {
  field: SortField;
}

export default function Position({ field }: PositionProps) {
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState<position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setIsLoading(true);
        const response = await client.get(`/position`, {
          headers: dataConfig().header
        });
        const data = await response.data;
        setPositions(data.data || []);
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const selectedPosition = positions.find(
    (pos) => pos.positionid.toString() === field.value
  );

  const handleSelect = (positionId: string) => {
    field.onChange(positionId === field.value ? "" : positionId);
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
              <PopoverTrigger className="max-w-[140px] sm:w-[170px] md:max-w-[220px]" asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[170px] sm:w-[170px]  justify-between pr-8 text-left"
                >
                  <span className="truncate block min-w-0 flex-1">
                    {selectedPosition ? selectedPosition.position : "เลือกตำแหน่ง"}
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
            <PopoverContent
              className="min-w-[170px] sm:min-w-[220px] w-auto max-w-sm p-0"
              align="start"
            >
              <Command className="w-full">
                <CommandInput placeholder="ค้นหาตำแหน่ง..." className="h-9" />
                <CommandEmpty>
                  {isLoading ? "กำลังโหลด..." : "ไม่พบตำแหน่ง"}
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {positions.map((position) => (
                    <CommandItem
                      key={position.positionid}
                      value={position.position}
                      onSelect={() => handleSelect(position.positionid.toString())}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          field.value === position.positionid.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span title={position.position}>{position.position}</span>
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
