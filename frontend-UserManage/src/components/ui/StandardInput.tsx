import { Input } from "@/components/ui/input"
import React from "react"
import { cn } from "@/lib/utils"
import { FormLabel } from "@/components/ui/form"

interface HorizontalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function HorizontalInput({
  label,
  className,
  ...props
}: HorizontalInputProps) {
  return (
    <div className="relative w-full">
      {/* prefix label ที่อยู่ด้านใน input */}
      <FormLabel className="absolute left-0 top-1/2 -translate-y-1/2 pl-2 pointer-events-none">{label} :</FormLabel>
      <Input
        {...props}
        className={cn(
          "pl-[90px] border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-black",
          className
        )}
      />
    </div>
  )
}
