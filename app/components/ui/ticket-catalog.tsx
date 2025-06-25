import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import {
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  TicketIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

// Estilos CSS personalizados para animaciones
const customStyles = `
  .animation-delay-150 {
    animation-delay: 150ms;
  }
  .animation-delay-300 {
    animation-delay: 300ms;
  }
  
  @keyframes wave {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  
  .wave-animation {
    animation: wave 1.5s ease-out infinite;
  }
  
  .wave-animation:nth-child(2) {
    animation-delay: 0.3s;
  }
  
  .wave-animation:nth-child(3) {
    animation-delay: 0.6s;
  }
  
  @keyframes dots {
    0%, 20% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  .loading-dots span:nth-child(1) { animation: dots 1.4s infinite; }
  .loading-dots span:nth-child(2) { animation: dots 1.4s infinite 0.2s; }
  .loading-dots span:nth-child(3) { animation: dots 1.4s infinite 0.4s; }
`;

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
    color: "text-red-600 bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border-red-200 hover:border-red-300"
  },
  {
    id: "feedback",
    title: "Enviar Comentarios y Sugerencias",
    description: "Comparte tu opinión y sugerencias para mejorar la plataforma",
    icon: ChatBubbleLeftRightIcon,
    url: "https://lapis-meteor-2d3.notion.site/21c5111e997d80158fbee3881f388c12?pvs=105",
    color: "text-blue-600 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200 hover:border-blue-300"
  },
  {
    id: "feature",
    title: "Solicitar Nueva Característica",
    description: "Propón nuevas funcionalidades o mejoras para el sistema",
    icon: SparklesIcon,
    url: "https://lapis-meteor-2d3.notion.site/21c5111e997d806b9be1e1ca7dfe7eb7?pvs=105",
    color: "text-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300"
  }
];

interface TicketCatalogProps {
  trigger?: React.ReactNode;
}

export function TicketCatalog({ trigger }: TicketCatalogProps) {
  const [open, setOpen] = React.useState(false);
  const [loadingState, setLoadingState] = React.useState<'idle' | 'loading' | 'success' | 'waves'>('idle');
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);

  const handleOptionClick = (url: string, optionId: string) => {
    setLoadingState('loading');
    setSelectedOption(optionId);
    
    // Fase 1: Loading (1.2s)
    setTimeout(() => {
      setLoadingState('success');
      
      // Fase 2: Success check (0.8s)
      setTimeout(() => {
        setLoadingState('waves');
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Fase 3: Waves y cierre (1.5s)
        setTimeout(() => {
          setOpen(false);
          setLoadingState('idle');
          setSelectedOption(null);
        }, 1500);
      }, 800);
    }, 1200);
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 border-blue-200 hover:border-indigo-300 text-blue-700 hover:text-indigo-800 transition-all duration-500 ease-out hover:shadow-lg hover:shadow-blue-200/50 hover:scale-105 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-indigo-100/50 to-purple-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
      <TicketIcon className="w-4 h-4 transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110 relative z-10" />
      <span className="font-medium relative z-10 transition-all duration-300 ease-out">Levantar Ticket</span>
    </Button>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-gray-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <TicketIcon className="w-5 h-5 text-blue-600 animate-pulse" />
            Centro de Soporte Cliquealo
          </DialogTitle>
        </DialogHeader>
        
        {loadingState !== 'idle' ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Estado de carga */}
              {loadingState === 'loading' && (
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              {/* Estado de éxito */}
              {loadingState === 'success' && (
                <div className="relative">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center transform animate-bounce">
                    <CheckIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
              
              {/* Estado de ondas */}
              {loadingState === 'waves' && (
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-8 h-8 text-white" />
                  </div>
                  {/* Ondas concéntricas */}
                  <div className="absolute inset-0 w-16 h-16 border-4 border-blue-400 rounded-full wave-animation"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-purple-400 rounded-full wave-animation"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-400 rounded-full wave-animation"></div>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-2">
              {loadingState === 'loading' && (
                <>
                  <p className="text-sm font-medium text-gray-900 flex items-center justify-center gap-2">
                    Preparando tu solicitud
                    <span className="loading-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">Un momento por favor</p>
                </>
              )}
              
              {loadingState === 'success' && (
                <>
                  <p className="text-sm font-medium text-green-700">¡Solicitud lista! ✅</p>
                  <p className="text-xs text-green-600">Abriendo Notion...</p>
                </>
              )}
              
              {loadingState === 'waves' && (
                <>
                  <p className="text-sm font-medium text-blue-700">¡Redirigiendo! 🚀</p>
                  <p className="text-xs text-blue-600">Ya casi terminamos</p>
                </>
              )}
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${
                loadingState === 'loading' ? 'w-1/3 bg-blue-500' :
                loadingState === 'success' ? 'w-2/3 bg-green-500' :
                'w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500'
              }`}></div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mt-4">
              <p className="text-sm text-gray-600 mb-6 text-center">
                ✨ Selecciona el tipo de solicitud que deseas realizar:
              </p>
              
              {ticketOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option.url, option.id)}
                    disabled={loadingState !== 'idle'}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg hover:shadow-current/20 hover:scale-[1.02] transform group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${option.color}`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <IconComponent className="w-6 h-6 drop-shadow-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 transition-colors duration-200">
                          {option.title}
                        </h3>
                        <p className="text-xs opacity-80 leading-relaxed transition-all duration-200 group-hover:opacity-100 group-hover:text-current">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 bg-gradient-to-r from-transparent via-gray-50 to-transparent">
              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                <span className="animate-bounce">🚀</span>
                <span>Serás redirigido a Notion para completar tu solicitud</span>
                <span className="animate-bounce animation-delay-150">✨</span>
              </p>
            </div>
          </>
        )}
        </DialogContent>
      </Dialog>
    </>
  );
}