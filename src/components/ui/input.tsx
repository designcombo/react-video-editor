import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex h-8 w-full rounded-md border border-input bg-background-7 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0099ff] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
      },
      size: {
        default: 'h-10',
        sm: 'h-9',
        xs: 'h-[30px] text-xs font-medium',
        lg: 'h-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
>;

export interface InputProps
  extends NativeInputProps,
    VariantProps<typeof inputVariants> {
  size?: 'sm' | 'lg' | 'default' | 'xs';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input, inputVariants };
