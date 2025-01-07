import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = { default: 1 }, gap = "4", children, ...props }, ref) => {
    const gridClass = cn(
      "grid",
      `gap-${gap}`,
      columns.default && `grid-cols-${columns.default}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.md && `md:grid-cols-${columns.md}`,
      columns.lg && `lg:grid-cols-${columns.lg}`,
      columns.xl && `xl:grid-cols-${columns.xl}`,
      className
    );

    return (
      <div className={gridClass} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";

export { Grid };
