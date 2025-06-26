import type { RouteConfig } from "@remix-run/route-config";

export const routes: RouteConfig = [
  // ========================================
  // RUTA PRINCIPAL - Carga optimizada
  // ========================================
  {
    path: "/",
    file: "routes/_index.tsx",
    lazy: {
      loader: async () => {
        const { loader } = await import("./routes/_index/loader");
        return { loader };
      },
      Component: async () => {
        const { default: Component } = await import("./routes/_index/component");
        return { default: Component };
      }
    }
  },

  // ========================================
  // RUTAS ADMINISTRATIVAS - Lazy loading granular
  // ========================================
  {
    path: "/admin",
    file: "routes/admin._layout.tsx",
    lazy: {
      // CRÍTICO: Middleware de autenticación (carga inmediata)
      unstable_middleware: async () => {
        const { middleware } = await import("./routes/admin/middleware");
        return { middleware };
      },
      
      // PRIORITARIO: Loader de datos básicos (carga temprana)
      loader: async () => {
        const { loader } = await import("./routes/admin/loader");
        return { loader };
      },
      
      // DIFERIDO: Componente principal (carga bajo demanda)
      Component: async () => {
        const { AdminDashboard } = await import("./routes/admin/component");
        return { default: AdminDashboard };
      },
      
      // ERROR BOUNDARY: Manejo de errores específico
      ErrorBoundary: async () => {
        const { AdminErrorBoundary } = await import("./routes/admin/error-boundary");
        return { default: AdminErrorBoundary };
      }
    },
    children: [
      // ========================================
      // SUB-RUTA: Gestión de Listings
      // ========================================
      {
        path: "listings",
        lazy: {
          middleware: async () => {
            const { listingsMiddleware } = await import("./routes/admin/listings/middleware");
            return { middleware: listingsMiddleware };
          },
          loader: async () => {
            const { listingsLoader } = await import("./routes/admin/listings/loader");
            return { loader: listingsLoader };
          },
          action: async () => {
            const { listingsAction } = await import("./routes/admin/listings/action");
            return { action: listingsAction };
          },
          Component: async () => {
            const { ListingsManagement } = await import("./routes/admin/listings/component");
            return { default: ListingsManagement };
          }
        }
      }
    ]
  },

  // ========================================
  // RUTAS DE LISTINGS - Optimización específica
  // ========================================
  {
    path: "/listings/:id",
    file: "routes/listings_.$id.tsx",
    lazy: {
      // DATOS: Loader optimizado para metadatos + datos básicos
      loader: async () => {
        const { listingDetailLoader } = await import("./routes/listings/detail/loader");
        return { loader: listingDetailLoader };
      },
      
      // ACCIONES: Likes, shares, contacto
      action: async () => {
        const { listingDetailAction } = await import("./routes/listings/detail/action");
        return { action: listingDetailAction };
      },
      
      // COMPONENTE: Vista principal sin imágenes pesadas
      Component: async () => {
        const { ListingDetail } = await import("./routes/listings/detail/component");
        return { default: ListingDetail };
      },
      
      // FALLBACK: Loading state para SSR
      HydrateFallback: async () => {
        const { ListingDetailFallback } = await import("./routes/listings/detail/hydrate-fallback");
        return { default: ListingDetailFallback };
      }
    }
  },

  // ========================================
  // RUTA DE CREACIÓN - Formulario pesado optimizado
  // ========================================
  {
    path: "/listings/new",
    file: "routes/listings_.new.tsx", 
    lazy: {
      middleware: async () => {
        const { authMiddleware } = await import("./routes/listings/create/middleware");
        return { middleware: authMiddleware };
      },
      loader: async () => {
        const { createListingLoader } = await import("./routes/listings/create/loader");
        return { loader: createListingLoader };
      },
      action: async () => {
        const { createListingAction } = await import("./routes/listings/create/action");
        return { action: createListingAction };
      },
      Component: async () => {
        const { CreateListingForm } = await import("./routes/listings/create/component");
        return { default: CreateListingForm };
      }
    }
  },

  // ========================================
  // RUTA DE EDICIÓN - Similar a creación
  // ========================================
  {
    path: "/listings/:id/edit",
    file: "routes/listings_.$id_.edit.tsx",
    lazy: {
      middleware: async () => {
        const { editMiddleware } = await import("./routes/listings/edit/middleware");
        return { middleware: editMiddleware };
      },
      loader: async () => {
        const { editListingLoader } = await import("./routes/listings/edit/loader");
        return { loader: editListingLoader };
      },
      action: async () => {
        const { editListingAction } = await import("./routes/listings/edit/action");
        return { action: editListingAction };
      },
      Component: async () => {
        const { EditListingForm } = await import("./routes/listings/edit/component");
        return { default: EditListingForm };
      }
    }
  },

  // ========================================
  // APLICACIÓN DE CRÉDITO - Formulario complejo
  // ========================================
  {
    path: "/credit/apply",
    file: "routes/credit.apply.tsx",
    lazy: {
      loader: async () => {
        const { creditApplicationLoader } = await import("./routes/credit/apply/loader");
        return { loader: creditApplicationLoader };
      },
      action: async () => {
        const { creditApplicationAction } = await import("./routes/credit/apply/action");
        return { action: creditApplicationAction };
      },
      Component: async () => {
        const { CreditApplicationForm } = await import("./routes/credit/apply/component");
        return { default: CreditApplicationForm };
      }
    }
  }
];