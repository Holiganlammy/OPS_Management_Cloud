import { Input } from "@/components/ui/input";
import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FormLabel } from "@/components/ui/form";

interface HorizontalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function HorizontalInput({
  label,
  className,
  ...props
}: HorizontalInputProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [paddingLeft, setPaddingLeft] = useState(0);

  useLayoutEffect(() => {
    if (labelRef.current) {
      const width = labelRef.current.offsetWidth;
      setPaddingLeft(width + 12); // +12px เป็น margin ขวา
    }
  }, [label]);

  return (
    <div className="relative w-full">
      {/* prefix label ด้านใน input */}
      <FormLabel
        ref={labelRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 pl-2 pointer-events-none whitespace-nowrap"
      >
        {label} :
      </FormLabel>
      <Input
        {...props}
        className={cn(
          "border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-black",
          className
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
      />
    </div>
  );
}
