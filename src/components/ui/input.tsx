import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "secondary"; // Add variant prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "default", ...props }, ref) => {
    // Define base styles and variant styles
    const baseStyles =
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
    const variantStyles = {
      default: "",
      secondary:
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    };

    return (
      <input
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant], // Apply variant styles
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
