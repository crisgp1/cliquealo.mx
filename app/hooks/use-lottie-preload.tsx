// app/hooks/use-lottie-preload.tsx
import { useEffect, useRef, useCallback } from 'react';

interface LottiePreloadOptions {
  preloadOnMount?: boolean;
  cacheTimeout?: number;
}

interface LottiePreloadReturn {
  loadLottieScript: () => Promise<void>;
  isLoaded: boolean;
}

export function useLottiePreload(options: LottiePreloadOptions = {}): LottiePreloadReturn {
  const { preloadOnMount = true, cacheTimeout = 300000 } = options;
  const isLoadedRef = useRef<boolean>(false);
  const loadPromiseRef = useRef<Promise<void> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadLottieScript = useCallback(async (): Promise<void> => {
    // Evitar cargas múltiples
    if (isLoadedRef.current || loadPromiseRef.current) {
      return loadPromiseRef.current || Promise.resolve();
    }

    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    // Verificar si ya está disponible
    if (window.customElements?.get('dotlottie-player')) {
      isLoadedRef.current = true;
      return Promise.resolve();
    }

    // Crear promesa de carga
    loadPromiseRef.current = new Promise<void>((resolve, reject) => {
      try {
        // Preload del módulo
        const linkPreload = document.createElement('link');
        linkPreload.rel = 'modulepreload';
        linkPreload.href = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
        linkPreload.crossOrigin = 'anonymous';
        document.head.appendChild(linkPreload);

        // Cargar el script principal
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
        script.type = 'module';
        script.async = true;
        script.crossOrigin = 'anonymous';

        const handleLoad = () => {
          isLoadedRef.current = true;
          resolve();
        };

        const handleError = () => {
          console.error('Failed to load DotLottie player script');
          loadPromiseRef.current = null;
          reject(new Error('Failed to load DotLottie script'));
        };

        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);

        document.head.appendChild(script);

        // Timeout de seguridad
        const timeoutId = setTimeout(() => {
          if (!isLoadedRef.current) {
            script.removeEventListener('load', handleLoad);
            script.removeEventListener('error', handleError);
            reject(new Error('DotLottie script load timeout'));
          }
        }, 10000);

        // Cleanup del timeout cuando se resuelve
        const originalResolve = resolve;
        resolve = () => {
          clearTimeout(timeoutId);
          originalResolve();
        };

      } catch (error) {
        loadPromiseRef.current = null;
        reject(error);
      }
    });

    return loadPromiseRef.current;
  }, []);

  useEffect(() => {
    if (preloadOnMount && typeof window !== 'undefined') {
      loadLottieScript().catch(console.error);
    }

    // Configurar limpieza de cache
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      loadPromiseRef.current = null;
      isLoadedRef.current = false;
    }, cacheTimeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [preloadOnMount, cacheTimeout, loadLottieScript]);

  return {
    loadLottieScript,
    isLoaded: isLoadedRef.current
  };
}