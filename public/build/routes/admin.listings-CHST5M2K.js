import {
  require_auth
} from "/build/_shared/chunk-OW4LD7OY.js";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheckBig,
  CircleX,
  Clock,
  Ellipsis,
  Eye,
  Funnel,
  ListFilter,
  LoaderCircle,
  Plus,
  Search,
  SquarePen,
  X,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit
} from "/build/_shared/chunk-T6UYO7E6.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-QA5V5W5C.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/admin.listings.tsx
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\admin.listings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\admin.listings.tsx"
  );
  import.meta.hot.lastModified = "1748918744061.276";
}
function AdminListings() {
  _s();
  const {
    listings,
    totalCount,
    currentPage,
    totalPages,
    brands,
    filters
  } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = (0, import_react2.useState)(false);
  const [actionListingId, setActionListingId] = (0, import_react2.useState)(null);
  const isSubmitting = navigation.state === "submitting";
  const statusOptions = [{
    value: "",
    label: "Todos"
  }, {
    value: "active",
    label: "Activos"
  }, {
    value: "inactive",
    label: "Inactivos"
  }, {
    value: "sold",
    label: "Vendidos"
  }, {
    value: "reserved",
    label: "Reservados"
  }];
  const sortOptions = [{
    value: "recent",
    label: "M\xE1s recientes"
  }, {
    value: "price_low",
    label: "Menor precio"
  }, {
    value: "price_high",
    label: "Mayor precio"
  }, {
    value: "views",
    label: "M\xE1s vistas"
  }, {
    value: "popular",
    label: "M\xE1s gustados"
  }];
  const clearFilters = () => {
    submit({}, {
      method: "get"
    });
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheckBig, { className: "w-3 h-3" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 247,
            columnNumber: 13
          }, this),
          "Activo"
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 246,
          columnNumber: 16
        }, this);
      case "inactive":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleX, { className: "w-3 h-3" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 252,
            columnNumber: 13
          }, this),
          "Inactivo"
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 251,
          columnNumber: 16
        }, this);
      case "sold":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheckBig, { className: "w-3 h-3" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 257,
            columnNumber: 13
          }, this),
          "Vendido"
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 256,
          columnNumber: 16
        }, this);
      case "reserved":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "w-3 h-3" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 262,
            columnNumber: 13
          }, this),
          "Reservado"
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 261,
          columnNumber: 16
        }, this);
      default:
        return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleAlert, { className: "w-3 h-3" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 267,
            columnNumber: 13
          }, this),
          "Desconocido"
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 266,
          columnNumber: 16
        }, this);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-light text-gray-900 mb-2", children: "Gesti\xF3n de Listings" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 276,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: [
            totalCount,
            " listings en total"
          ] }, void 0, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 279,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 275,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 sm:mt-0 flex space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/listings/new", className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 286,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Nuevo Listing" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 287,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 285,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/admin", className: "flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: "Volver" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 290,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 284,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin.listings.tsx",
        lineNumber: 274,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-4 rounded-xl border border-gray-200 mb-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "get", className: "flex-1 flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1 flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1 relative", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 302,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "search", name: "search", defaultValue: filters.search, placeholder: "Buscar por t\xEDtulo, marca, modelo...", className: "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 303,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 301,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowFilters(!showFilters), className: `p-2 rounded-lg border transition-colors ${showFilters ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 hover:border-gray-300"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Funnel, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 307,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 306,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 300,
          columnNumber: 15
        }, this),
        showFilters && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "brand", defaultValue: filters.brand, className: "px-3 py-2 border border-gray-200 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Todas las marcas" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 313,
              columnNumber: 21
            }, this),
            brands.map((brand) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: brand, children: brand }, brand, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 314,
              columnNumber: 42
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 312,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "status", defaultValue: filters.status, className: "px-3 py-2 border border-gray-200 rounded-lg", children: statusOptions.map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: option.value, children: option.label }, option.value, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 318,
            columnNumber: 50
          }, this)) }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 317,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "sortBy", defaultValue: filters.sortBy, className: "px-3 py-2 border border-gray-200 rounded-lg", children: sortOptions.map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: option.value, children: option.label }, option.value, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 322,
            columnNumber: 48
          }, this)) }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 321,
            columnNumber: 19
          }, this),
          (filters.search || filters.brand || filters.status !== "" || filters.sortBy !== "recent") && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: clearFilters, className: "flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 326,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Limpiar" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 327,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 325,
            columnNumber: 113
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 311,
          columnNumber: 31
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors", children: "Buscar" }, void 0, false, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 331,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin.listings.tsx",
        lineNumber: 299,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/admin.listings.tsx",
        lineNumber: 298,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/admin.listings.tsx",
        lineNumber: 297,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [
        listings.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", { className: "min-w-full divide-y divide-gray-200", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { className: "bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Listing" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 344,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Precio" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 347,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Estado" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 350,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Estad\xEDsticas" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 353,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Fecha" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 356,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Acciones" }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 359,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 343,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 342,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { className: "bg-white divide-y divide-gray-200", children: listings.map((listing) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-10 w-10 flex-shrink-0 mr-3", children: listing.images && listing.images[0] ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { className: "h-10 w-10 rounded-md object-cover", src: listing.images[0], alt: listing.title }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 369,
                columnNumber: 68
              }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "h-5 w-5 text-gray-400" }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 370,
                columnNumber: 33
              }, this) }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 369,
                columnNumber: 168
              }, this) }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 368,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm font-medium text-gray-900 line-clamp-1 max-w-xs", children: listing.title }, void 0, false, {
                  fileName: "app/routes/admin.listings.tsx",
                  lineNumber: 374,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-500", children: [
                  listing.brand,
                  " ",
                  listing.model,
                  " \u2022 ",
                  listing.year
                ] }, void 0, true, {
                  fileName: "app/routes/admin.listings.tsx",
                  lineNumber: 377,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 373,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 367,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 366,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm font-medium text-gray-900", children: [
              "$",
              listing.price?.toLocaleString()
            ] }, void 0, true, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 384,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 383,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 whitespace-nowrap", children: [
              getStatusBadge(listing.status),
              listing.isFeatured && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800", children: "Destacado" }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 390,
                columnNumber: 48
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 388,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-500 flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "app/routes/admin.listings.tsx",
                  lineNumber: 397,
                  columnNumber: 29
                }, this),
                listing.viewsCount || 0
              ] }, void 0, true, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 396,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center gap-1", children: [
                "\u2764\uFE0F",
                listing.likesCount || 0
              ] }, void 0, true, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 400,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 395,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 394,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(listing.createdAt).toLocaleDateString() }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 406,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-end space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${listing._id}`, className: "p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors", title: "Ver", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-4 h-4" }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 412,
                columnNumber: 29
              }, this) }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 411,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${listing._id}/edit`, className: "p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors", title: "Editar", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SquarePen, { className: "w-4 h-4" }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 416,
                columnNumber: 29
              }, this) }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 415,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setActionListingId(actionListingId === listing._id ? null : listing._id), className: "p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors", title: "M\xE1s acciones", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ellipsis, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "app/routes/admin.listings.tsx",
                  lineNumber: 421,
                  columnNumber: 31
                }, this) }, void 0, false, {
                  fileName: "app/routes/admin.listings.tsx",
                  lineNumber: 420,
                  columnNumber: 29
                }, this),
                actionListingId === listing._id && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "py-1", children: [
                  listing.status !== "active" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "block", children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "listingId", value: listing._id }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 427,
                      columnNumber: 39
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: "activate" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 428,
                      columnNumber: 39
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100", children: "Activar" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 429,
                      columnNumber: 39
                    }, this)
                  ] }, void 0, true, {
                    fileName: "app/routes/admin.listings.tsx",
                    lineNumber: 426,
                    columnNumber: 67
                  }, this),
                  listing.status !== "inactive" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "block", children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "listingId", value: listing._id }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 435,
                      columnNumber: 39
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: "deactivate" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 436,
                      columnNumber: 39
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100", children: "Desactivar" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 437,
                      columnNumber: 39
                    }, this)
                  ] }, void 0, true, {
                    fileName: "app/routes/admin.listings.tsx",
                    lineNumber: 434,
                    columnNumber: 69
                  }, this),
                  listing.status !== "sold" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "block", children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "listingId", value: listing._id }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 443,
                      columnNumber: 39
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: "mark-sold" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 444,
                      columnNumber: 39
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100", children: "Marcar como vendido" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 445,
                      columnNumber: 39
                    }, this)
                  ] }, void 0, true, {
                    fileName: "app/routes/admin.listings.tsx",
                    lineNumber: 442,
                    columnNumber: 65
                  }, this),
                  listing.status !== "reserved" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "block", children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "listingId", value: listing._id }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 451,
                      columnNumber: 39
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: "mark-reserved" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 452,
                      columnNumber: 39
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100", children: "Marcar como reservado" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 453,
                      columnNumber: 39
                    }, this)
                  ] }, void 0, true, {
                    fileName: "app/routes/admin.listings.tsx",
                    lineNumber: 450,
                    columnNumber: 69
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "block", children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "listingId", value: listing._id }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 459,
                      columnNumber: 37
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: "toggle-featured" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 460,
                      columnNumber: 37
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100", children: listing.isFeatured ? "Quitar destacado" : "Destacar" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 461,
                      columnNumber: 37
                    }, this)
                  ] }, void 0, true, {
                    fileName: "app/routes/admin.listings.tsx",
                    lineNumber: 458,
                    columnNumber: 35
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-gray-100 my-1" }, void 0, false, {
                    fileName: "app/routes/admin.listings.tsx",
                    lineNumber: 466,
                    columnNumber: 35
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "block", onSubmit: (e) => {
                    if (!confirm("\xBFEst\xE1s seguro de eliminar este listing? Esta acci\xF3n no se puede deshacer.")) {
                      e.preventDefault();
                    }
                  }, children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "listingId", value: listing._id }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 473,
                      columnNumber: 37
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: "delete" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 474,
                      columnNumber: 37
                    }, this),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50", children: "Eliminar" }, void 0, false, {
                      fileName: "app/routes/admin.listings.tsx",
                      lineNumber: 475,
                      columnNumber: 37
                    }, this)
                  ] }, void 0, true, {
                    fileName: "app/routes/admin.listings.tsx",
                    lineNumber: 468,
                    columnNumber: 35
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/admin.listings.tsx",
                  lineNumber: 425,
                  columnNumber: 33
                }, this) }, void 0, false, {
                  fileName: "app/routes/admin.listings.tsx",
                  lineNumber: 424,
                  columnNumber: 65
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 419,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 410,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 409,
              columnNumber: 23
            }, this)
          ] }, listing._id, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 365,
            columnNumber: 44
          }, this)) }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 364,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 341,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 340,
          columnNumber: 34
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "py-16 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListFilter, { className: "mx-auto h-12 w-12 text-gray-400" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 488,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No hay listings" }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 489,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-500", children: "No se encontraron listings con los filtros aplicados." }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 490,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 487,
          columnNumber: 22
        }, this),
        totalPages > 1 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hidden sm:flex-1 sm:flex sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-700", children: [
            "Mostrando ",
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: (currentPage - 1) * 15 + 1 }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 500,
              columnNumber: 31
            }, this),
            " a ",
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: Math.min(currentPage * 15, totalCount) }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 500,
              columnNumber: 99
            }, this),
            " de ",
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: totalCount }, void 0, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 502,
              columnNumber: 32
            }, this),
            " resultados"
          ] }, void 0, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 499,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 498,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "relative z-0 inline-flex rounded-md shadow-sm -space-x-px", "aria-label": "Pagination", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `?${new URLSearchParams({
              ...Object.fromEntries(searchParams.entries()),
              page: (currentPage - 1).toString()
            })}`, className: `relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`, "aria-disabled": currentPage === 1, tabIndex: currentPage === 1 ? -1 : 0, children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "sr-only", children: "Anterior" }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 511,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronLeft, { className: "h-5 w-5", "aria-hidden": "true" }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 512,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 507,
              columnNumber: 21
            }, this),
            Array.from({
              length: totalPages
            }, (_, i) => i + 1).map((page) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `?${new URLSearchParams({
              ...Object.fromEntries(searchParams.entries()),
              page: page.toString()
            })}`, className: `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage ? "z-10 bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`, children: page }, page, false, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 517,
              columnNumber: 49
            }, this)),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `?${new URLSearchParams({
              ...Object.fromEntries(searchParams.entries()),
              page: (currentPage + 1).toString()
            })}`, className: `relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`, "aria-disabled": currentPage === totalPages, tabIndex: currentPage === totalPages ? -1 : 0, children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "sr-only", children: "Siguiente" }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 528,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-5 w-5", "aria-hidden": "true" }, void 0, false, {
                fileName: "app/routes/admin.listings.tsx",
                lineNumber: 529,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/admin.listings.tsx",
              lineNumber: 524,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 506,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/admin.listings.tsx",
            lineNumber: 505,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 497,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/admin.listings.tsx",
          lineNumber: 496,
          columnNumber: 30
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin.listings.tsx",
        lineNumber: 339,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/admin.listings.tsx",
      lineNumber: 273,
      columnNumber: 7
    }, this),
    isSubmitting && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-8 w-8 text-blue-500 animate-spin" }, void 0, false, {
        fileName: "app/routes/admin.listings.tsx",
        lineNumber: 541,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-gray-700", children: "Procesando..." }, void 0, false, {
        fileName: "app/routes/admin.listings.tsx",
        lineNumber: 542,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/admin.listings.tsx",
      lineNumber: 540,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/admin.listings.tsx",
      lineNumber: 539,
      columnNumber: 24
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/admin.listings.tsx",
    lineNumber: 272,
    columnNumber: 10
  }, this);
}
_s(AdminListings, "apA9UCiS790GDvhvI0Tao8JGPko=", false, function() {
  return [useLoaderData, useNavigation, useSubmit, useSearchParams];
});
_c = AdminListings;
var _c;
$RefreshReg$(_c, "AdminListings");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  AdminListings as default
};
//# sourceMappingURL=/build/routes/admin.listings-CHST5M2K.js.map
