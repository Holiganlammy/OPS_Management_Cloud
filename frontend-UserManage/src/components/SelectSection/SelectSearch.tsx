"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import {
  useEffect,
  useState,
  MouseEvent,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect
} from "react"
import debounce from "lodash.debounce"
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"
import { useDebounce } from "use-debounce"
type Option = {
  label: string
  value: string
  [key: string]: any
}

type SortField<T extends FieldValues, K extends FieldPath<T>> =
  ControllerRenderProps<T, K>

interface CustomSelectProps<T extends FieldValues, K extends FieldPath<T>> {
  field: SortField<T, K>
  placeholder: string
  formLabel: string
  options?: Option[]
  loadOptions?: (input: string) => Promise<Option[]>
  errorString?: boolean
  isMulti?: boolean;
}

export default function CustomSelect<T extends FieldValues, K extends FieldPath<T>>({
  field,
  placeholder,
  formLabel,
  options = [],
  loadOptions,
  errorString,
  isMulti,
}: CustomSelectProps<T, K>) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [selectedOption, setSelectedOption] = useState<Option | Option[] | undefined>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(200);
  const [debouncedSearchValue] = useDebounce(searchValue, 300)

  const isAsync = !!loadOptions

  useEffect(() => {
    if (isAsync && loadOptions) {
      loadOptions("").then(setFilteredOptions);
    }
  }, [isAsync, loadOptions]);

  useEffect(() => {
    if (!open) return;

    loadData(debouncedSearchValue)
  }, [debouncedSearchValue, open])

  useEffect(() => {
    if (!open) return;

    if (debouncedSearchValue.trim() !== "") {
      setVisibleCount(filteredOptions.length)
    } else {
      setVisibleCount(Math.min(filteredOptions.length, 200))
    }
  }, [debouncedSearchValue, filteredOptions.length, open])

  useEffect(() => {
    if (debouncedSearchValue.trim() === "" && options.length > 0) {
      setFilteredOptions(options.slice(0, visibleCount)) // fallback option set
    }
  }, [debouncedSearchValue, options, visibleCount])

  const loadData = useCallback(
    async (input: string) => {
      setIsLoading(true)

      let result: Option[] = []

      if (isAsync && loadOptions) {
        result = await loadOptions(input)
      } else {
        result = options.filter((opt) =>
          opt.label.toLowerCase().includes(input.toLowerCase())
        )
      }

      setFilteredOptions(result)
      setIsLoading(false)

      return result.length > 0
    },
    [isAsync, loadOptions, options]
  )
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleCount((prev) => prev + 100); // โหลดเพิ่มทีละ 100
    }
  };
    const debouncedLoadRef = useRef<ReturnType<typeof debounce>>(undefined);

    useEffect(() => {
      debouncedLoadRef.current = debounce((input: string) => {
        loadData(input);
      }, 300);

      return () => {
        debouncedLoadRef.current?.cancel(); // cleanup debounce ถ้า component unmount
      };
    }, [loadData]);

  useEffect(() => {
    if (open && searchValue === "") {
      debouncedLoadRef.current?.("")
    } else if (open) {
      debouncedLoadRef.current?.(searchValue)
    }
  }, [open, searchValue])

  useEffect(() => {
    if (open && !isAsync && filteredOptions.length === 0) {
      setFilteredOptions(options); // sync mode preload
    }
  }, [open, isAsync, filteredOptions.length, options]);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  useEffect(() => {
    const valueList: string[] = Array.isArray(field.value)
      ? field.value
      : typeof field.value === "string"
        ? (field.value as string).split(", ")
        : [];

    const syncSet = () => {
      const matched = options.filter((opt) => valueList.includes(opt.value));
      if (matched.length > 0) setSelectedOption(isMulti ? matched : matched[0]);
    };

    const asyncSet = async () => {
      if (loadOptions) {
        const opts = await loadOptions(field.value || "");
        const matched = opts.filter((opt) => valueList.includes(opt.value));
        if (matched.length > 0) setSelectedOption(isMulti ? matched : matched[0]);
      }
    };

    if (field.value && !selectedOption) {
      isAsync ? asyncSet() : syncSet();
    }
  }, [field.value, options, selectedOption, isAsync, loadOptions, isMulti]);

  const handleSelect = (optionValue: string) => {
    if (!optionValue) return;

    const selected = filteredOptions.find((opt) => opt.value === optionValue);
    if (!selected) return;

    if (isMulti) {
      let newSelectedOption: Option[] = [];

      if (Array.isArray(selectedOption)) {
        const exists = selectedOption.some((opt) => opt.value === optionValue);

        if (exists) {
          newSelectedOption = selectedOption.filter((opt) => opt.value !== optionValue);
        } else {
          newSelectedOption = [...selectedOption, selected];
        }
      } else {
        newSelectedOption = [selected];
      }

      setSelectedOption(newSelectedOption);
      const newValue = newSelectedOption.map((opt) => opt.value).join(",");
      field.onChange(newValue);
      setSearchValue("");
    } else {
      const newValue = field.value === optionValue ? "" : optionValue;
      setSelectedOption(field.value === optionValue ? undefined : selected);
      field.onChange(newValue);
      setOpen(field.value === optionValue);
      setSearchValue("");
    }
  };

  const handleClear = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    field.onChange("")
    setSelectedOption(undefined)
    setSearchValue("")
    if (open && isAsync) {
      loadData("")
    }
  }
  const filteredResult = searchValue
  ? filteredOptions
  : filteredOptions.slice(0, visibleCount);
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{formLabel}</FormLabel>
      <FormControl>
        <div className="relative w-full">
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <div className="relative w-full">
              <PopoverTrigger asChild>
                <Button
                  ref={triggerRef}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between pr-8 text-left",
                    errorString && "border-red-600 focus:outline-none focus:ring-red-0 focus:border-red"
                  )}
                >
                  <span className={cn("truncate block min-w-0 flex-1", errorString && "text-red-600")}>
                    {isMulti
                      ? Array.isArray(selectedOption)
                        ? selectedOption.map((o: Option) => o.label).join(", ")
                        : placeholder
                      : !Array.isArray(selectedOption) && selectedOption
                        ? selectedOption.label
                        : placeholder}
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
              style={{ width: triggerWidth }}
              className="p-0 mx-2"
              align="center"
            >
              <Command className="w-full" shouldFilter={false}>
                <CommandInput
                  placeholder={`ค้นหา ${formLabel}...`}
                  className="h-9"
                  value={searchValue}
                  onValueChange={(val) => {
                    setSearchValue(val ?? "");
                  }}
                />
                {isLoading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">ไม่พบข้อมูล</div>
                ) : null}
                <CommandGroup onScroll={handleScroll} className="max-h-[300px] overflow-y-auto">
                  {filteredResult.length > 0 ? (
                    filteredResult.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            (isMulti && Array.isArray(selectedOption) && selectedOption.some((s) => s.value === option.value)) ||
                              (!isMulti && field.value === option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span title={option.label}>{option.label}</span>
                      </CommandItem>
                    ))
                  ) : null}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
    </FormItem>
  )
}