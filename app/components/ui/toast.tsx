import { Toaster as SonnerToaster, toast } from "sonner";

interface ToasterProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  richColors?: boolean;
  closeButton?: boolean;
}

export function Toaster({
  position = "top-right",
  richColors = false,
  closeButton = true,
}: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      expand={false}
      visibleToasts={3}
      duration={3000}
      style={{ 
        top: '1rem',
        right: '1rem',
        bottom: 'auto',
        left: 'auto',
        zIndex: 9999,
        position: 'fixed'
      }}
      className="toaster group !fixed !top-4 !right-4 !bottom-auto !left-auto !z-[9999]"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        classNames: {
          toast: "!bg-white !text-gray-900 !border-gray-200 !shadow-lg !rounded-xl !p-3",
          title: "!text-gray-900 !font-medium !text-sm",
          description: "!text-gray-600 !text-sm",
          success: "!bg-green-50 !text-green-800 !border-green-200",
          error: "!bg-red-50 !text-red-800 !border-red-200",
          warning: "!bg-yellow-50 !text-yellow-800 !border-yellow-200",
          info: "!bg-blue-50 !text-blue-800 !border-blue-200",
        },
      }}
    />
  );
}

// Exportar toast para usar en toda la app
export { toast };