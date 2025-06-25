import React, { useState, useEffect, useRef, ReactNode } from 'react';

// ========================================
// TIPOS Y INTERFACES
// ========================================
interface LazyWrapperProps {
  children: ReactNode;
  height?: string | number;
  width?: string | number;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
  className?: string;
  onVisible?: () => void;
  fallback?: ReactNode;
  skipLazy?: boolean;
}

export function LazyWrapper({
  children,
  height = 'auto',
  width = 'auto',
  threshold = 0.1,
  rootMargin = '50px 0px',
  placeholder,
  className = '',
  onVisible,
  fallback,
  skipLazy = false
}: LazyWrapperProps) {
  // ========================================
  // ESTADO DEL COMPONENTE
  // ========================================
  const [isVisible, setIsVisible] = useState(skipLazy);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ========================================
  // INTERSECTION OBSERVER PARA LAZY LOADING
  // ========================================
  useEffect(() => {
    // Si ya está visible o se debe omitir lazy loading, no hacer nada
    if (isVisible || skipLazy) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.();
          observerRef.current?.disconnect();
          observerRef.current = null;
        }
      });
    };

    try {
      if (containerRef.current && !observerRef.current) {
        observerRef.current = new IntersectionObserver(handleIntersection, {
          threshold,
          rootMargin
        });
        observerRef.current.observe(containerRef.current);
      }
    } catch (error) {
      // Fallback si Intersection Observer falla
      console.error('Error en LazyWrapper IntersectionObserver:', error);
      setIsVisible(true);
      setHasError(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isVisible, skipLazy, threshold, rootMargin, onVisible]);

  // ========================================
  // MANEJO DE ERRORES
  // ========================================
  const handleError = () => {
    setHasError(true);
    console.error('Error al cargar el componente en LazyWrapper');
  };

  // ========================================
  // ESTILOS Y DIMENSIONES
  // ========================================
  const containerStyle: React.CSSProperties = {
    height: isVisible ? 'auto' : height,
    width: isVisible ? 'auto' : width,
    overflow: isVisible ? 'visible' : 'hidden',
    position: 'relative'
  };

  // ========================================
  // RENDERIZADO CONDICIONAL
  // ========================================
  // Error fallback
  if (hasError && fallback) {
    return (
      <div className={`lazy-wrapper-error ${className}`}>
        {fallback}
      </div>
    );
  }

  // Contenido visible o skeleton/placeholder
  return (
    <div
      ref={containerRef}
      className={`lazy-wrapper ${className} ${isVisible ? 'lazy-loaded' : 'lazy-loading'}`}
      style={containerStyle}
    >
      {isVisible ? (
        // Contenido real cuando es visible
        <React.Fragment>
          {children}
        </React.Fragment>
      ) : (
        // Placeholder mientras no es visible
        <div className="lazy-placeholder">
          {placeholder || (
            <div className="animate-pulse bg-gray-200 rounded flex items-center justify-center w-full h-full min-h-[100px]">
              <svg
                className="w-12 h-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========================================
// EXPORTACIONES ADICIONALES
// ========================================

// HOC para wrappear componentes con LazyWrapper
export function withLazyLoading<P extends React.JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
  options: Omit<LazyWrapperProps, 'children'> = {}
) {
  const LazyComponent = (props: P) => (
    <LazyWrapper {...options}>
      <Component {...props} />
    </LazyWrapper>
  );

  // Preservar displayName para debugging
  LazyComponent.displayName = `Lazy(${Component.displayName || Component.name || 'Component'})`;
  
  return LazyComponent;
}