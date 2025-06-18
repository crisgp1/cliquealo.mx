import { useEffect, useState } from "react";
import { useNavigation } from "@remix-run/react";

export function Preloader() {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (navigation.state === "loading") {
      setIsVisible(true);
      setProgress(0);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    } else {
      setProgress(100);
      const timer = setTimeout(() => setIsVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Sophisticated Black Background */
          .sophisticated-bg {
            background: linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #000000 50%, #0a0a0a 75%, #000000 100%);
            background-size: 400% 400%;
            animation: sophisticatedFlow 12s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }
          
          .sophisticated-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:
              radial-gradient(circle at 30% 20%, rgba(255,255,255,0.008) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.008) 0%, transparent 50%),
              linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.003) 50%, transparent 52%);
            animation: subtleShimmer 15s ease-in-out infinite;
          }
          
          @keyframes sophisticatedFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes subtleShimmer {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          
          /* Elegant Entrance Animation */
          .sophisticated-entrance {
            animation: sophisticatedEntrance 1.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          @keyframes sophisticatedEntrance {
            0% {
              opacity: 0;
              transform: translateY(60px) scale(0.7);
              filter: blur(20px);
            }
            40% {
              opacity: 0.3;
              transform: translateY(20px) scale(0.9);
              filter: blur(8px);
            }
            70% {
              opacity: 0.7;
              transform: translateY(-3px) scale(1.01);
              filter: blur(2px);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }
          
          /* Sophisticated Logo */
          .sophisticated-logo {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 120px;
          }
          
          .logo-circle {
            width: 4px;
            height: 4px;
            background: rgba(255,255,255,0.9);
            border-radius: 50%;
            position: absolute;
            animation: logoOrbit 6s linear infinite;
            box-shadow: 0 0 10px rgba(255,255,255,0.4);
          }
          
          .logo-circle:nth-child(1) {
            animation-delay: 0s;
            transform: rotate(0deg) translateX(45px);
          }
          
          .logo-circle:nth-child(2) {
            animation-delay: -1.5s;
            transform: rotate(90deg) translateX(45px);
          }
          
          .logo-circle:nth-child(3) {
            animation-delay: -3s;
            transform: rotate(180deg) translateX(45px);
          }
          
          .logo-circle:nth-child(4) {
            animation-delay: -4.5s;
            transform: rotate(270deg) translateX(45px);
          }
          
          @keyframes logoOrbit {
            0% {
              transform: rotate(0deg) translateX(45px) scale(1);
              opacity: 0.4;
            }
            25% {
              transform: rotate(90deg) translateX(45px) scale(1.5);
              opacity: 1;
            }
            50% {
              transform: rotate(180deg) translateX(45px) scale(1);
              opacity: 0.4;
            }
            75% {
              transform: rotate(270deg) translateX(45px) scale(1.5);
              opacity: 1;
            }
            100% {
              transform: rotate(360deg) translateX(45px) scale(1);
              opacity: 0.4;
            }
          }
          
          .logo-center {
            width: 12px;
            height: 12px;
            background: rgba(255,255,255,0.95);
            border-radius: 50%;
            animation: centerGlow 2.5s ease-in-out infinite;
            box-shadow: 0 0 25px rgba(255,255,255,0.5);
          }
          
          @keyframes centerGlow {
            0%, 100% {
              transform: scale(1);
              opacity: 0.95;
              box-shadow: 0 0 25px rgba(255,255,255,0.5);
            }
            50% {
              transform: scale(1.4);
              opacity: 1;
              box-shadow: 0 0 40px rgba(255,255,255,0.8);
            }
          }
          
          /* Elegant Brand Typography */
          .sophisticated-brand {
            color: rgba(255,255,255,0.98);
            font-size: 36px;
            font-weight: 100;
            letter-spacing: 10px;
            text-transform: uppercase;
            margin-top: 30px;
            text-align: center;
            animation: brandFade 3s ease-in-out infinite;
            text-shadow: 0 0 30px rgba(255,255,255,0.2);
          }
          
          @keyframes brandFade {
            0%, 100% {
              opacity: 0.8;
              letter-spacing: 10px;
              transform: translateY(0);
            }
            50% {
              opacity: 1;
              letter-spacing: 12px;
              transform: translateY(-2px);
            }
          }
          
          /* Sophisticated Loading Animation */
          .loading-dots {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 50px;
            gap: 12px;
          }
          
          .loading-dot {
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.8);
            border-radius: 50%;
            animation: dotPulse 1.8s ease-in-out infinite;
            box-shadow: 0 0 15px rgba(255,255,255,0.3);
          }
          
          .loading-dot:nth-child(1) { animation-delay: 0s; }
          .loading-dot:nth-child(2) { animation-delay: 0.15s; }
          .loading-dot:nth-child(3) { animation-delay: 0.3s; }
          .loading-dot:nth-child(4) { animation-delay: 0.45s; }
          .loading-dot:nth-child(5) { animation-delay: 0.6s; }
          
          @keyframes dotPulse {
            0%, 80%, 100% {
              transform: scale(1);
              opacity: 0.4;
            }
            40% {
              transform: scale(1.8);
              opacity: 1;
              box-shadow: 0 0 25px rgba(255,255,255,0.6);
            }
          }
          
          /* Enhanced Progress Indicator */
          .sophisticated-progress {
            width: 280px;
            height: 1px;
            background: rgba(255,255,255,0.15);
            margin-top: 40px;
            position: relative;
            overflow: hidden;
            border-radius: 0.5px;
          }
          
          .sophisticated-progress-bar {
            height: 100%;
            background: rgba(255,255,255,0.6);
            transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 0 15px rgba(255,255,255,0.4);
            border-radius: 0.5px;
          }
          
          /* Enhanced Status Text */
          .sophisticated-status {
            color: rgba(255,255,255,0.7);
            font-size: 12px;
            font-weight: 200;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-top: 35px;
            animation: statusBreathe 2.5s ease-in-out infinite;
          }
          
          @keyframes statusBreathe {
            0%, 100% {
              opacity: 0.5;
              transform: translateY(0);
            }
            50% {
              opacity: 0.9;
              transform: translateY(-1px);
            }
          }
          
          /* Ambient Particles */
          .ambient-particle {
            position: absolute;
            width: 1px;
            height: 1px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            animation: ambientFloat 12s ease-in-out infinite;
          }
          
          .ambient-particle:nth-child(1) {
            top: 15%;
            left: 20%;
            animation-delay: 0s;
            animation-duration: 15s;
          }
          
          .ambient-particle:nth-child(2) {
            top: 70%;
            right: 25%;
            animation-delay: 3s;
            animation-duration: 12s;
          }
          
          .ambient-particle:nth-child(3) {
            bottom: 20%;
            left: 30%;
            animation-delay: 6s;
            animation-duration: 18s;
          }
          
          .ambient-particle:nth-child(4) {
            top: 30%;
            right: 15%;
            animation-delay: 9s;
            animation-duration: 14s;
          }
          
          .ambient-particle:nth-child(5) {
            bottom: 60%;
            left: 15%;
            animation-delay: 12s;
            animation-duration: 16s;
          }
          
          @keyframes ambientFloat {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0;
            }
            20% {
              opacity: 0.2;
            }
            50% {
              transform: translateY(-30px) translateX(15px);
              opacity: 0.4;
            }
            80% {
              opacity: 0.2;
            }
          }
        `
      }} />
      
      {/* Sophisticated Background */}
      <div className="absolute inset-0 sophisticated-bg">
        {/* Ambient particles */}
        <div className="ambient-particle"></div>
        <div className="ambient-particle"></div>
        <div className="ambient-particle"></div>
        <div className="ambient-particle"></div>
        <div className="ambient-particle"></div>
      </div>
      
      <div className="sophisticated-entrance relative z-10">
        <div className="flex flex-col items-center">
          
          {/* Minimalist Logo */}
          <div className="sophisticated-logo">
            <div className="logo-circle"></div>
            <div className="logo-circle"></div>
            <div className="logo-circle"></div>
            <div className="logo-circle"></div>
            <div className="logo-center"></div>
          </div>
          
          {/* Elegant Brand Name */}
          <div className="sophisticated-brand">
            Cliquéalo
          </div>
          
          {/* Sophisticated Loading Dots */}
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          
          {/* Minimal Progress Bar */}
          <div className="sophisticated-progress">
            <div
              className="sophisticated-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Refined Status Text */}
          <div className="sophisticated-status">
            Cargando
          </div>
          
        </div>
      </div>
    </div>
  );
}