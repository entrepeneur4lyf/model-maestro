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
    // Calculate dynamic gap based on screen size
    const dynamicGap = React.useMemo(() => {
      if (typeof window === 'undefined') return gap;
      const width = window.innerWidth;
      // iPhone 15 Pro specific optimizations
      if (width >= 393 && width <= 430) {
        return '3';
      }
      return gap;
    }, [gap]);

    const gridClass = cn(
      "grid",
      `gap-${dynamicGap}`,
      columns.default && `grid-cols-${columns.default}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.md && `md:grid-cols-${columns.md}`,
      columns.lg && `lg:grid-cols-${columns.lg}`,
      columns.xl && `xl:grid-cols-${columns.xl}`,
      className
    );

    return (
      <div 
        className={gridClass} 
        ref={ref} 
        {...props}
        style={{
          ...props.style,
          // Ensure minimum touch target size of 44x44 pixels for iOS
          '--min-touch-target': '44px',
          gap: `var(--gap-${dynamicGap}, 1rem)`,
        }}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";

export { Grid };