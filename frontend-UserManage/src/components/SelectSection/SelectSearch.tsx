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
}

export default function CustomSelect<T extends FieldValues, K extends FieldPath<T>>({
  field,
  placeholder,
  formLabel,
  options = [],
  loadOptions,
  errorString,
}: CustomSelectProps<T, K>) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(undefined)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const isAsync = !!loadOptions

  const loadData = useCallback(
    async (input: string) => {
      let result: Option[] = []

      if (isAsync && loadOptions) {
        result = await loadOptions(input)
        setIsLoading(true)
      } else {
        result = options.filter((opt) =>
          opt.label.toLowerCase().includes(input.toLowerCase())
        )
        setIsLoading(true)
      }

      setFilteredOptions(result)
      setIsLoading(false)

      return result.length > 0
    },
    [isAsync, loadOptions, options]
  )

  const debouncedLoad = useMemo(() => debounce(loadData, 300), [loadData])

  useEffect(() => {
    if (open && searchValue === "") {
      debouncedLoad("") // initial load on open
    } else if (open) {
      debouncedLoad(searchValue)
    }
  }, [open, debouncedLoad, searchValue])

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  // 🔍 แก้ตรงนี้: auto set selectedOption จาก value
  useEffect(() => {
    const syncSet = () => {
      const matched = options.find((opt) => opt.value === field.value)
      if (matched) setSelectedOption(matched)
    }

    const asyncSet = async () => {
      if (loadOptions) {
        const opts = await loadOptions("")
        const matched = opts.find((opt) => opt.value === field.value)
        if (matched) setSelectedOption(matched)
      }
    }

    if (field.value && !selectedOption) {
      isAsync ? asyncSet() : syncSet()
    }
  }, [field.value, options, selectedOption, isAsync, loadOptions])

  const handleSelect = (optionValue: string) => {
    const newOption =
      filteredOptions.find((opt) => opt.value === optionValue) ??
      options.find((opt) => opt.value === optionValue)

    field.onChange(optionValue === field.value ? "" : optionValue)
    setSearchValue(optionValue === field.value ? "" : optionValue)
    setSelectedOption(optionValue === field.value ? undefined : newOption)
    setOpen(optionValue === field.value)
  }

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

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{formLabel}</FormLabel>
      <FormControl>
        <div className="relative w-full">
          <Popover open={open} onOpenChange={setOpen}>
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
            <PopoverContent
              style={{ width: triggerWidth }}
              className="p-0 mx-2"
              align="center"
            >
              <Command className="w-full">
                <CommandInput
                  placeholder={`ค้นหา ${formLabel}...`}
                  className="h-9"
                  onValueChange={setSearchValue}
                />
                <CommandEmpty>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-20">
                      <div className="flex flex-row items-center gap-4">
                        <div className="animate-spin h-5 w-5 border-4 border-gray-300 border-t-black rounded-full"></div>
                        <p>Loading...</p>
                      </div>
                    </div>
                  ) : (
                    "ไม่พบข้อมูล"
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {filteredOptions.map((option) => (
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
                      <span title={option.label}>{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
    </FormItem>
  )
}