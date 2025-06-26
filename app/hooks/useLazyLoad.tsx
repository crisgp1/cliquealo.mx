import React, { useState, useEffect, useRef, ReactNode } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

// ========================================
// TIPOS E INTERFACES
// ========================================
interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
  onVisible?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  initialState?: {
    isVisible?: boolean;
    isLoaded?: boolean;
    isError?: boolean;
  };
}

interface UseLazyLoadResult {
  isVisible: boolean;
  isLoaded: boolean;
  isError: boolean;
  error: Error | null;
  containerRef: React.RefObject<HTMLDivElement>;
  loadContent: () => Promise<void>;
}

/**
 * Hook para cargar contenido bajo demanda cuando es visible en el viewport
 * 
 * @param contentLoader Función que carga el contenido (puede ser una promesa)
 * @param options Opciones de configuración
 * @returns Estado del lazy loading y una referencia para el contenedor
 */
function useLazyLoad(
  contentLoader: () => Promise<any> | any,
  options: UseLazyLoadOptions = {}
): UseLazyLoadResult {
  // Extraer opciones con valores por defecto
  const {
    threshold = 0.1,
    rootMargin = '100px 0px',
    triggerOnce = true,
    skip = false,
    onVisible,
    onLoad,
    onError,
    initialState = {}
  } = options;

  // Referencias y estado
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef(contentLoader);
  const [isLoaded, setIsLoaded] = useState(initialState.isLoaded || false);
  const [isError, setIsError] = useState(initialState.isError || false);
  const [error, setError] = useState<Error | null>(null);
  
  // Actualizar la referencia a la función de carga si cambia
  useEffect(() => {
    loaderRef.current = contentLoader;
  }, [contentLoader]);

  // Usar Intersection Observer para detectar visibilidad
  const { isIntersecting: isVisible } = useIntersectionObserver(
    containerRef,
    {
      threshold,
      rootMargin,
      triggerOnce,
      skip,
      onEnter: onVisible
    }
  );

  // Función para cargar el contenido
  const loadContent = async (): Promise<void> => {
    if (isLoaded || isError) return;

    try {
      const result = await loaderRef.current();
      setIsLoaded(true);
      setIsError(false);
      setError(null);
      onLoad?.();
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Error cargando contenido');
      setIsError(true);
      setError(errorObj);
      onError?.(errorObj);
    }
  };

  // Efecto para cargar contenido cuando es visible
  useEffect(() => {
    if (isVisible && !isLoaded && !isError && !skip) {
      loadContent();
    }
  }, [isVisible, isLoaded, isError, skip]);

  return {
    isVisible: isVisible || initialState.isVisible || false,
    isLoaded,
    isError,
    error,
    containerRef,
    loadContent
  };
}

// ========================================
// COMPONENTES AUXILIARES
// ========================================

interface LazyContentProps {
  children: ReactNode | (() => ReactNode);
  fallback?: ReactNode;
  errorFallback?: ReactNode | ((error: Error) => ReactNode);
  options?: UseLazyLoadOptions;
  contentLoader?: () => Promise<any> | any;
}

/**
 * Componente para envolver contenido con lazy loading
 */
export function LazyContent({
  children,
  fallback = null,
  errorFallback = null,
  options = {},
  contentLoader = () => Promise.resolve()
}: LazyContentProps) {
  // Usar el hook de lazy loading
  const { isVisible, isLoaded, isError, error, containerRef } = useLazyLoad(
    contentLoader,
    options
  );

  // Renderizado condicional según el estado
  let content: ReactNode = null;

  if (isError && errorFallback) {
    // Mostrar fallback de error si hay un error
    content = typeof errorFallback === 'function'
      ? errorFallback(error!)
      : errorFallback;
  } else if (isVisible && (isLoaded || typeof children !== 'function')) {
    // Mostrar contenido cuando sea visible y cargado
    content = typeof children === 'function' ? children() : children;
  } else {
    // Mostrar fallback mientras no se carga
    content = fallback;
  }

  return (
    <div ref={containerRef} className="lazy-content">
      {content}
    </div>
  );
}

export default useLazyLoad;