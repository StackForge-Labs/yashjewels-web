"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "default";
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, size = "default", disabled, ...props }, ref) => {
    const isChecked = checked;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          size === "default" ? "h-6 w-11" : "h-5 w-9",
          isChecked ? "bg-gold" : "bg-gray-200 dark:bg-gray-800",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <span
          className={cn(
            "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
            size === "default" ? "h-5 w-5" : "h-4 w-4",
            isChecked 
              ? (size === "default" ? "translate-x-5" : "translate-x-4") 
              : "translate-x-1"
          )}
        />
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
