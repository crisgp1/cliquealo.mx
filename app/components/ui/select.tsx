import * as React from "react";

// Context for the select component
const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>({});

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Main Select component
export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);

  const handleValueChange = React.useCallback((newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
    setInternalOpen(false);
  }, [onValueChange]);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  return (
    <SelectContext.Provider
      value={{
        value: value !== undefined ? value : internalValue,
        onValueChange: handleValueChange,
        open: open !== undefined ? open : internalOpen,
        onOpenChange: handleOpenChange,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

// Select trigger component
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(SelectContext);

    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-primary-500 ${
          className || ""
        }`}
        onClick={() => onOpenChange?.(!open)}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 opacity-50 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

// Select value component
interface SelectValueProps {
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SelectValue({ placeholder, className, children }: SelectValueProps) {
  const { value } = React.useContext(SelectContext);

  return (
    <span className={`flex-grow truncate ${className || ""}`}>
      {children || value || placeholder}
    </span>
  );
}

// Select content component
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { open } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <div className="relative z-50">
      <div className="fixed inset-0" onClick={() => {
        const { onOpenChange } = React.useContext(SelectContext);
        onOpenChange?.(false);
      }}></div>
      <div
        className={`absolute left-0 top-full mt-1 w-full rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 ${
          className || ""
        }`}
      >
        <div className="max-h-[--radix-select-content-available-height] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Select item component
interface SelectItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: string;
}

export const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(SelectContext);
    const isSelected = selectedValue === value;

    return (
      <li
        ref={ref}
        className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 ${
          isSelected ? "bg-gray-100 dark:bg-gray-800" : ""
        } ${className || ""}`}
        onClick={() => onValueChange?.(value)}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </span>

        <span className="truncate">{children}</span>
      </li>
    );
  }
);
SelectItem.displayName = "SelectItem";