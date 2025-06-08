// app/components/ui/lottie-player.tsx
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useLottiePreload } from '~/hooks/use-lottie-preload';

interface LottiePlayerProps {
  src: string;
  width?: string | number;
  height?: string | number;
  loop?: boolean;
  autoplay?: boolean;
  background?: string;
  speed?: number;
  direction?: 'forward' | 'reverse';
  mode?: 'normal' | 'bounce';
  controls?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export interface LottiePlayerRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: 'forward' | 'reverse') => void;
}

export const LottiePlayer = forwardRef<LottiePlayerRef, LottiePlayerProps>(({
  src,
  width = 300,
  height = 300,
  loop = true,
  autoplay = true,
  background = "transparent",
  speed = 1,
  direction = 'forward',
  mode = 'normal',
  controls = false,
  className = "",
  onLoad,
  onError,
  onComplete
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { loadLottieScript } = useLottiePreload({ preloadOnMount: false });

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Exponer métodos del player
  useImperativeHandle(ref, () => ({
    play: () => {
      if (playerRef.current && 'play' in playerRef.current) {
        (playerRef.current as any).play();
      }
    },
    pause: () => {
      if (playerRef.current && 'pause' in playerRef.current) {
        (playerRef.current as any).pause();
      }
    },
    stop: () => {
      if (playerRef.current && 'stop' in playerRef.current) {
        (playerRef.current as any).stop();
      }
    },
    seek: (time: number) => {
      if (playerRef.current && 'seek' in playerRef.current) {
        (playerRef.current as any).seek(time);
      }
    },
    setSpeed: (speed: number) => {
      if (playerRef.current && 'setSpeed' in playerRef.current) {
        (playerRef.current as any).setSpeed(speed);
      }
    },
    setDirection: (direction: 'forward' | 'reverse') => {
      if (playerRef.current && 'setDirection' in playerRef.current) {
        (playerRef.current as any).setDirection(direction);
      }
    },
  }), []);

  const createPlayer = async () => {
    if (!isClient || !containerRef.current || playerRef.current) return;

    try {
      await loadLottieScript();

      // Verificar disponibilidad del custom element
      if (!window.customElements?.get('dotlottie-player')) {
        throw new Error('DotLottie player component not available');
      }

      // Crear elemento con tipado correcto
      const player = document.createElement('dotlottie-player') as HTMLElement;
      
      // Configurar atributos básicos
      player.setAttribute('src', src);
      player.setAttribute('background', background);
      player.setAttribute('speed', speed.toString());
      player.setAttribute('direction', direction);
      player.setAttribute('mode', mode);
      
      // Atributos booleanos
      if (loop) player.setAttribute('loop', '');
      if (autoplay) player.setAttribute('autoplay', '');
      if (controls) player.setAttribute('controls', '');

      // Configurar dimensiones usando className en lugar de style inline
      player.className = `lottie-player-instance ${className}`;
      
      // Event listeners con tipado correcto
      const handleLoad = () => {
        setIsReady(true);
        onLoad?.();
      };

      const handleError = () => {
        const errorMsg = 'Failed to load Lottie animation';
        setError(errorMsg);
        onError?.(new Error(errorMsg));
      };

      const handleComplete = () => {
        onComplete?.();
      };

      player.addEventListener('load', handleLoad);
      player.addEventListener('error', handleError);
      player.addEventListener('complete', handleComplete);

      // Agregar al DOM
      containerRef.current.appendChild(player);
      playerRef.current = player;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error loading Lottie';
      setError(errorMsg);
      onError?.(new Error(errorMsg));
    }
  };

  // Efecto principal para crear el player
  useEffect(() => {
    if (isClient) {
      createPlayer();
    }

    return () => {
      if (playerRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(playerRef.current);
        } catch (e) {
          // Element might already be removed
        }
        playerRef.current = null;
      }
    };
  }, [src, isClient]);

  // Actualizar propiedades cuando cambien
  useEffect(() => {
    if (playerRef.current && isReady && isClient) {
      if ('setSpeed' in playerRef.current) {
        (playerRef.current as any).setSpeed(speed);
      }
      if ('setDirection' in playerRef.current) {
        (playerRef.current as any).setDirection(direction);
      }
    }
  }, [speed, direction, isReady, isClient]);

  // Renderizado condicional para errores
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-red-600 text-sm">⚠</span>
          </div>
          <p className="text-xs text-gray-500">Error loading animation</p>
        </div>
      </div>
    );
  }

  // Placeholder durante carga en servidor
  if (!isClient) {
    return (
      <div className={`lottie-placeholder ${className}`}>
        <div className="animate-pulse bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .lottie-player-instance {
          width: ${typeof width === 'number' ? `${width}px` : width};
          height: ${typeof height === 'number' ? `${height}px` : height};
          display: block;
        }
        .lottie-placeholder {
          width: ${typeof width === 'number' ? `${width}px` : width};
          height: ${typeof height === 'number' ? `${height}px` : height};
        }
        .lottie-placeholder > div {
          width: 100%;
          height: 100%;
        }
      `}</style>
      <div 
        ref={containerRef} 
        className={`lottie-container ${className}`}
      />
    </>
  );
});

LottiePlayer.displayName = 'LottiePlayer';