// app/components/ui/checkbox.tsx
"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "./utils";

/**
 * ✅ FIX FINAL
 * - حذف کامل @radix-ui/react-checkbox (چون نصب نیست)
 * - بدون تغییر API مصرف‌کننده
 * - بدون تغییر ساختار پروژه
 * - سازگار با Tailwind v4
 * - آماده copy-paste
 */

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <label className="relative inline-flex items-center">
      <input
        type="checkbox"
        className={cn(
          "peer h-4 w-4 appearance-none rounded-[4px] border border-gray-300 bg-white",
          "checked:border-blue-600 checked:bg-blue-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      <CheckIcon
        className="pointer-events-none absolute left-[2px] top-[2px] h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
      />
    </label>
  );
}

export { Checkbox };
