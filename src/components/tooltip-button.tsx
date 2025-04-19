import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { type ReactNode } from 'react';

interface TooltipButtonProps extends ButtonProps {
  tooltipText?: string;
  icon?: ReactNode;
  label?: string;
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
  ({ className, tooltipText, icon, label, children, ...props }, ref) => {
    const btn = (
      <Button ref={ref} className={className} {...props}>
        {icon && <>{icon} </>}
        {label && <span>{label}</span>}
        {children}
      </Button>
    );

    if (!tooltipText) {
      return btn;
    }
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>{btn}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

TooltipButton.displayName = 'TooltipButton';

export { TooltipButton };
