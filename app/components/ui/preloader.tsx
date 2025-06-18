import { useEffect, useState } from "react";
import { useNavigation } from "@remix-run/react";

export function Preloader() {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading") {
      setIsVisible(true);
    } else {
      // Duración de 800ms antes de ocultar (más rápido)
      const timer = setTimeout(() => setIsVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Spinner minimalista negro con efecto blur */
          .minimal-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid transparent;
            border-top: 3px solid #000000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            filter: blur(0.5px);
            position: relative;
          }
          
          .minimal-spinner::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border: 2px solid transparent;
            border-top: 2px solid rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            animation: spin 1.5s linear infinite reverse;
            filter: blur(1px);
          }
          
          .minimal-spinner::after {
            content: '';
            position: absolute;
            top: 6px;
            left: 6px;
            right: 6px;
            bottom: 6px;
            border: 1px solid transparent;
            border-top: 1px solid rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            filter: blur(0.3px);
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Animación de entrada suave */
          .fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: scale(0.8);
              filter: blur(10px);
            }
            100% {
              opacity: 1;
              transform: scale(1);
              filter: blur(0);
            }
          }
          
          /* Efecto de resplandor sutil */
          .glow-effect {
            box-shadow:
              0 0 20px rgba(0, 0, 0, 0.1),
              0 0 40px rgba(0, 0, 0, 0.05),
              0 0 60px rgba(0, 0, 0, 0.02);
          }
        `
      }} />
      
      <div className="fade-in">
        <div className="minimal-spinner glow-effect"></div>
      </div>
    </div>
  );
}