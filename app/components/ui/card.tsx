import * as React from "react";

// Card container component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 ${
          className || ""
        }`}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// Card header component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

// Card title component
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-2xl font-semibold leading-none tracking-tight ${
          className || ""
        }`}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

// Card content component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-6 pt-0 ${className || ""}`}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

// Card footer component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center p-6 pt-0 ${className || ""}`}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };