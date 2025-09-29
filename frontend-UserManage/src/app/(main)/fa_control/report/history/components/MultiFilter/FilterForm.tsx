"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
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

type SortField = ControllerRenderProps<any, any>;

interface Props {
  field: SortField;
  filteredAssets: FilterAssetType[];
  fieldName: string;
  fieldID: keyof FilterAssetType;
}

export default function FilterFormsMulti({
  field,
  filteredAssets,
  fieldName,
  fieldID,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedValues: string[] = field.value || [];

  const toggleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v: string) => v !== value)
      : [...selectedValues, value];

    field.onChange(newValues);
  };

  const uniqueValues = new Set<string>();
  const uniqueItems = filteredAssets.filter((res) => {
    const val = res[fieldID]?.toString() ?? "";
    if (uniqueValues.has(val)) return false;
    uniqueValues.add(val);
    return true;
  });

  return (
    <FormItem>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-between truncate"
            >
              {selectedValues.length > 0
                ? `${fieldName} (${selectedValues.length})`
                : fieldName}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align="start">
            <Command>
              <CommandInput placeholder={`ค้นหา ${fieldName}...`} className="h-9" />
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {uniqueItems.map((res) => {
                  const val = res[fieldID]?.toString() ?? "";
                  return (
                    <CommandItem
                      key={`${fieldID}-${val}`}
                      value={val}
                      onSelect={() => toggleSelect(val)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValues.includes(val)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span title={val}>{val}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
    </FormItem>
  );
}
