"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/components/ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:shadow-[0_0_0_4px_rgba(255,255,255,0.04)] disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.03]",
  {
    variants: {
      variant: {
        default:
          "bg-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] shadow-[0_10px_28px_rgba(0,0,0,0.18)] hover:opacity-95 hover:shadow-[0_14px_32px_rgba(37,99,235,0.26)]",
        destructive: "bg-red-600 text-white shadow-[0_10px_24px_rgba(220,38,38,0.18)] hover:bg-red-700 hover:shadow-[0_14px_30px_rgba(220,38,38,0.24)]",
        outline:
          "border border-[rgb(var(--border))] bg-transparent text-[rgb(var(--text))] hover:bg-[rgb(var(--surface))] hover:shadow-[0_12px_26px_rgba(0,0,0,0.08)]",
        secondary: "bg-[rgb(var(--surface))] text-[rgb(var(--text))] shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:opacity-95 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]",
        ghost: "text-[rgb(var(--text))] hover:bg-[rgb(var(--surface))]",
        link: "text-[rgb(var(--accent))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
