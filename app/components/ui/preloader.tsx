import { useEffect, useState } from "react";
import { useNavigation } from "@remix-run/react";

export function Preloader() {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  useEffect(() => {
    let startTime: number;
    let intervalId: NodeJS.Timeout | undefined;

    if (navigation.state === "loading") {
      setIsVisible(true);
      setIsExiting(false);
      setLoadingTime(0);
      setShowSlowWarning(false);
      startTime = Date.now();

      // Contador de tiempo de carga
      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setLoadingTime(elapsed);
        
        // Mostrar advertencia después de 3 segundos
        if (elapsed > 3000) {
          setShowSlowWarning(true);
        }
      }, 100);
    } else {
      // Limpiar interval
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // Iniciar animación de salida
      setIsExiting(true);
      // Ocultar después de la animación
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
        setShowSlowWarning(false);
        setLoadingTime(0);
      }, 200);
      return () => clearTimeout(timer);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [navigation.state]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none ${isExiting ? 'preloader-exit' : 'preloader-enter'}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Animaciones de entrada y salida */
          .preloader-enter {
            animation: fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          
          .preloader-exit {
            animation: fadeOutScale 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes fadeOutScale {
            from {
              opacity: 1;
              transform: scale(1);
            }
            to {
              opacity: 0;
              transform: scale(0.9);
            }
          }
          
          /* Spinner rápido */
          .fast-spinner {
            width: 24px;
            height: 24px;
            border: 2px solid transparent;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Animación de advertencia */
          .warning-pulse {
            animation: warningPulse 1.5s ease-in-out infinite;
          }
          
          @keyframes warningPulse {
            0%, 100% {
              background-color: rgba(239, 68, 68, 0.1);
              border-color: rgba(239, 68, 68, 0.3);
            }
            50% {
              background-color: rgba(239, 68, 68, 0.2);
              border-color: rgba(239, 68, 68, 0.5);
            }
          }
          
          /* Efecto de backdrop blur sutil */
          .backdrop-blur-light {
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }
          
          /* Animación de texto deslizante */
          .slide-text {
            animation: slideText 0.3s ease-out;
          }
          
          @keyframes slideText {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
      
      <div className={`
        bg-white/95 backdrop-blur-light border rounded-2xl shadow-xl p-4 flex flex-col items-center gap-3 min-w-[200px] max-w-[300px] mx-4
        ${showSlowWarning ? 'warning-pulse border-red-300' : 'border-gray-200'}
      `}>
        <div className="flex items-center gap-3">
          <div className={`fast-spinner flex-shrink-0 ${showSlowWarning ? 'border-top-red-500' : ''}`}></div>
          <span className="text-sm text-gray-700 font-medium">
            {showSlowWarning ? 'Conectando...' : 'Cargando...'}
          </span>
        </div>
        
        {showSlowWarning && (
          <div className="slide-text text-center">
            <p className="text-xs text-red-600 font-medium mb-1">
              ⚠️ Conexión lenta detectada
            </p>
            <p className="text-xs text-gray-500">
              Tu internet podría estar fallando
            </p>
          </div>
        )}
        
        {/* Barra de progreso visual basada en tiempo */}
        <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              showSlowWarning ? 'bg-red-400' : 'bg-blue-400'
            }`}
            style={{
              width: `${Math.min((loadingTime / 5000) * 100, 100)}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}