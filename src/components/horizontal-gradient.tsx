import { cn } from "@/lib/utils";
import { useId } from "react";

export const HorizontalGradient = ({
  className,
  ...props
}: {
  className: string;
  [x: string]: any;
}) => {
  const id = useId();
  return (
    <svg
      width="1595"
      height="2"
      viewBox="0 0 1595 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute w-full object-contain",
        className,
      )}
      {...props}
    >
      <path
        d="M0 1H1594.5"
        stroke={`url(#line-path-gradient-${id})`}
        strokeDasharray="8 8"
      />

      <defs>
        <linearGradient
          id={`line-path-gradient-${id}`}
          x1="0"
          y1="1.5"
          x2="1594.5"
          y2="1.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.2" stopColor="var(--neutral-400)" />
          <stop offset="0.8" stopColor="var(--neutral-400)" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
