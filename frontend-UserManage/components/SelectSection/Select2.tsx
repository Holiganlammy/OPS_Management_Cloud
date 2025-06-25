"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { CircleX, Search } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";

type SortField<T extends FieldValues, K extends FieldPath<T>> = ControllerRenderProps<T, K>;
interface ComponentProps<T extends FieldValues, K extends FieldPath<T>> {
    field: SortField<T, K>;
    placeholder?: string;
    label?: string;
    formLabel?: string;
    options?: { value: string; label: string }[];
}

function onSortClearClick<T extends FieldValues, K extends FieldPath<T>>(
    event: MouseEvent<SVGSVGElement | globalThis.MouseEvent>,
    field: SortField<T, K>
) {
    event.stopPropagation();
    field.onChange(null);
}

export default function CustomSelect<T extends FieldValues, K extends FieldPath<T>>({
    field,
    placeholder = "Select an option",
    label = "Options",
    formLabel = "Select Field",
    options = [
        { value: "pineapple", label: "Pineapple" },
        { value: "pineapple2", label: "Pineapple2" },
        { value: "pineapple3", label: "Pineapple3" },
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "orange", label: "Orange" },
        { value: "grape", label: "Grape" },
        { value: "default", label: "Default" }
    ]
}: ComponentProps<T, K>) {
    const [open, setOpen] = useState(false);
    const [isSelected, setIsSelected] = useState<boolean>(field.value !== 'default' && !!field.value);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false); // เพิ่ม state สำหรับตรวจสอบว่าใช้ keyboard หรือไม่
    const inputRef = useRef<HTMLInputElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (open && inputRef.current && document.contains(inputRef.current)) {
            const focusInput = () => {
                if (inputRef.current && document.contains(inputRef.current)) {
                    inputRef.current.focus();
                }
            };

            const timeoutId = setTimeout(focusInput, 10);
            return () => clearTimeout(timeoutId);
        }
    }, [open, searchTerm]);

    useEffect(() => {
        setHighlightedIndex(-1);
        if (filteredOptions.length === 1) {
            setHighlightedIndex(0);
        }
    }, [searchTerm, filteredOptions.length]);

    // เพิ่ม useEffect สำหรับ scroll เมื่อใช้ keyboard navigation
    // useEffect(() => {
    //     if (isKeyboardNavigation && highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
    //         itemRefs.current[highlightedIndex]?.scrollIntoView({
    //             behavior: 'smooth',
    //             block: 'nearest'
    //         });
    //     }
    // }, [highlightedIndex, isKeyboardNavigation]);

    const handleValueChange = (value: string | null) => {
        field.onChange(value === 'default' ? null : value);
        setIsSelected(value !== 'default' && !!value);
        setOpen(false);
        setSearchTerm("");
        setIsKeyboardNavigation(false); // reset keyboard navigation state
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!open) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setIsKeyboardNavigation(true); // เปิดใช้ keyboard navigation
                setHighlightedIndex(prev => 
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setIsKeyboardNavigation(true); // เปิดใช้ keyboard navigation
                setHighlightedIndex(prev => 
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;
            case 'Enter':
                event.preventDefault();
                if (filteredOptions.length === 1) {
                    handleValueChange(filteredOptions[0].value);
                } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    handleValueChange(filteredOptions[highlightedIndex].value);
                }
                break;
            case 'Escape':
                event.preventDefault();
                setOpen(false);
                setSearchTerm("");
                setIsKeyboardNavigation(false);
                break;
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            setSearchTerm("");
            setHighlightedIndex(-1);
            setIsKeyboardNavigation(false);
        }
    };

    const handleMouseEnter = (index: number) => {
        if (!isKeyboardNavigation) {
            setHighlightedIndex(index);
        }
    };

    const handleMouseMove = () => {
        if (isKeyboardNavigation) {
            setIsKeyboardNavigation(false);
        }
    };

    return (
        <FormItem>
            <FormLabel>{formLabel}</FormLabel>
            <FormControl>
                <Select 
                    defaultValue={field.value} 
                    onValueChange={handleValueChange} 
                    value={field.value} 
                    onOpenChange={handleOpenChange} 
                    open={open}
                >
                    <div className="relative flex items-center w-[120px] sm:w-full">
                        <SelectTrigger
                            className={`relative ${isSelected ? 'chevron-hidden' : ''} w-full rounded-l-md text-xs font-medium h-10 focus:ring-0 ${open || field.value !== "default" && field.value !== "" ? "visibility-hidden border-[1px]" : ""}`}
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        {isSelected && (
                            <CircleX
                                className="absolute right-2 h-4 w-4 cursor-pointer text-red-500"
                                onClick={event => onSortClearClick(event, field)}
                            />
                        )}
                    </div>
                    <SelectContent onMouseMove={handleMouseMove}> {/* เพิ่ม onMouseMove */}
                        <SelectGroup>
                            <div className="flex items-center px-3 pb-2">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <Input
                                    ref={inputRef}
                                    placeholder={`Search ${label.toLowerCase()}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={(e) => {
                                        e.preventDefault();
                                        setTimeout(() => {
                                            if (open && inputRef.current) {
                                                inputRef.current.focus();
                                            }
                                        }, 0);
                                    }}
                                    className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>
                            <SelectLabel>
                                {label} {filteredOptions.length > 0 && `(${filteredOptions.length} found)`}
                            </SelectLabel>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <SelectItem 
                                        key={option.value} 
                                        value={option.value}
                                        ref={(el) => {
                                            itemRefs.current[index] = el;
                                        }}
                                        className={highlightedIndex === index ? "bg-accent" : ""}
                                        onMouseEnter={() => handleMouseEnter(index)} // ใช้ function ใหม่
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                    No options found
                                </div>
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}