import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { 
  ExclamationTriangleIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  TicketIcon 
} from '@heroicons/react/24/outline';

interface TicketOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  color: string;
}

const ticketOptions: TicketOption[] = [
  {
    id: "incident",
    title: "Crear un Incidente",
    description: "Reporta problemas técnicos, errores o fallas del sistema",
    icon: ExclamationTriangleIcon,
    url: "https://lapis-meteor-2d3.notion.site/21c5111e997d80d2b6e6c721a78519ae?pvs=105",
    color: "text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
  },
  {
    id: "feedback",
    title: "Enviar Comentarios y Sugerencias",
    description: "Comparte tu opinión y sugerencias para mejorar la plataforma",
    icon: ChatBubbleLeftRightIcon,
    url: "https://lapis-meteor-2d3.notion.site/21c5111e997d80158fbee3881f388c12?pvs=105",
    color: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200"
  },
  {
    id: "feature",
    title: "Solicitar Nueva Característica",
    description: "Propón nuevas funcionalidades o mejoras para el sistema",
    icon: SparklesIcon,
    url: "https://lapis-meteor-2d3.notion.site/21c5111e997d806b9be1e1ca7dfe7eb7?pvs=105",
    color: "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200"
  }
];

interface TicketCatalogProps {
  trigger?: React.ReactNode;
}

export function TicketCatalog({ trigger }: TicketCatalogProps) {
  const [open, setOpen] = React.useState(false);

  const handleOptionClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm"
      className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
    >
      <TicketIcon className="w-4 h-4" />
      Levantar Ticket
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <TicketIcon className="w-5 h-5 text-gray-600" />
            Centro de Soporte Cliquealo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <p className="text-sm text-gray-600 mb-6">
            Selecciona el tipo de solicitud que deseas realizar:
          </p>
          
          {ticketOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.url)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${option.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">
                      {option.title}
                    </h3>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Serás redirigido a Notion para completar tu solicitud
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}