import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-primary-500 text-primary-foreground hover:bg-primary-600",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "text-gray-950 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-50",
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          variantClasses[variant]
        } ${className || ""}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };