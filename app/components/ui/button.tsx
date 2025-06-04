import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "error";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";
    
    // Map variant to Tailwind classes
    const variantClasses = {
      default: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900 shadow-sm",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm",
      ghost: "hover:bg-gray-100 text-gray-700",
      link: "text-primary-600 underline-offset-4 hover:underline",
      success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
      error: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    // Map size to Tailwind classes
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none";
    
    // Combine classes
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`;

    return (
      <Comp
        className={buttonClasses}
        ref={asChild ? undefined : ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };