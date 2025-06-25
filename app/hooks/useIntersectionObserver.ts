import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  skip?: boolean;
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onExit?: (entry: IntersectionObserverEntry) => void;
}

/**
 * Hook personalizado para detectar cuando un elemento entra o sale del viewport
 * utilizando la API Intersection Observer.
 * 
 * @param elementRef - Referencia al elemento que queremos observar
 * @param options - Opciones de configuración para el Intersection Observer
 * @returns Un objeto con el estado de intersección y métodos para controlar el observer
 */
function useIntersectionObserver<T extends Element>(
  elementRef: RefObject<T>,
  {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
    skip = false,
    onEnter,
    onExit
  }: IntersectionObserverOptions = {}
) {
  // Estado para rastrear si el elemento es visible
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  
  // Referencia al observer para poder limpiarlo después
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Estado para rastrear si se ha disparado una vez (para triggerOnce)
  const triggeredOnceRef = useRef(false);

  // Función para limpiar el observer actual
  const cleanup = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  };

  // Función para observar un elemento manualmente
  const observe = (element: Element) => {
    if (!observerRef.current) return;
    cleanup();
    observerRef.current.observe(element);
  };

  // Función para dejar de observar manualmente
  const unobserve = (element: Element) => {
    if (!observerRef.current) return;
    observerRef.current.unobserve(element);
  };

  useEffect(() => {
    // Si se debe omitir o el elemento no existe, no hacer nada
    if (skip || !elementRef.current) return cleanup;

    // Si triggerOnce está activado y ya se ha disparado, no hacer nada
    if (triggerOnce && triggeredOnceRef.current) return cleanup;

    // Callback para manejar las entradas del observer
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const firstEntry = entries[0];
      
      // Actualizar el estado con la entrada actual
      setEntry(firstEntry);
      
      // Si el elemento es visible
      if (firstEntry.isIntersecting) {
        onEnter?.(firstEntry);
        
        // Si solo se debe disparar una vez, desconectar y marcar como disparado
        if (triggerOnce) {
          cleanup();
          triggeredOnceRef.current = true;
        }
      } else if (entry?.isIntersecting) {
        // Si antes era visible y ahora no lo es
        onExit?.(firstEntry);
      }
    };

    // Crear el observer
    try {
      observerRef.current = new IntersectionObserver(handleIntersect, {
        root,
        rootMargin,
        threshold
      });
      
      // Observar el elemento
      observerRef.current.observe(elementRef.current);
    } catch (error) {
      console.error('Error creating IntersectionObserver:', error);
    }

    // Limpiar el observer cuando el componente se desmonte o cambien las dependencias
    return cleanup;
  }, [
    elementRef,
    root,
    rootMargin,
    threshold,
    triggerOnce,
    skip,
    onEnter,
    onExit,
    entry
  ]);

  return {
    isIntersecting: entry?.isIntersecting || false,
    entry,
    observe,
    unobserve,
    reset: () => {
      triggeredOnceRef.current = false;
      cleanup();
      
      if (elementRef.current && !skip) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            const firstEntry = entries[0];
            setEntry(firstEntry);
            
            if (firstEntry.isIntersecting) {
              onEnter?.(firstEntry);
              
              if (triggerOnce) {
                cleanup();
                triggeredOnceRef.current = true;
              }
            }
          },
          { root, rootMargin, threshold }
        );
        
        observerRef.current.observe(elementRef.current);
      }
    }
  };
}

export default useIntersectionObserver;