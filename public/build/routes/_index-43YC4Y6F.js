import {
  require_session
} from "/build/_shared/chunk-EV32D4DT.js";
import {
  require_auth
} from "/build/_shared/chunk-OW4LD7OY.js";
import {
  ArrowRight,
  Calendar,
  Eye,
  Funnel,
  Grid3x3,
  Heart,
  List,
  Plus,
  Search,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Form,
  Link,
  useLoaderData
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

// app/routes/_index.tsx
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_session = __toESM(require_session(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\_index.tsx"
  );
  import.meta.hot.lastModified = "1749009406268.5137";
}
function Index() {
  _s();
  const {
    listings,
    search,
    brand,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    user,
    canCreateListings
  } = useLoaderData();
  const [viewMode, setViewMode] = (0, import_react2.useState)("grid");
  const [showFilters, setShowFilters] = (0, import_react2.useState)(false);
  const hasActiveFilters = brand || minPrice || maxPrice || minYear || maxYear;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { className: "border-b border-gray-100 bg-gray-50/50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-2xl mx-auto text-center mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl sm:text-5xl font-light text-gray-900 mb-4 tracking-tight", children: "Encuentra tu auto ideal" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 86,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-gray-600 font-light", children: "Cat\xE1logo seleccionado de autos certificados por nuestro equipo" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 89,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 85,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "get", className: "max-w-4xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 96,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "search", name: "search", defaultValue: search, placeholder: "Buscar por marca, modelo...", className: "w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 97,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium", children: "Buscar" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 98,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 95,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 94,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 84,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 83,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 space-y-4 sm:space-y-0", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowFilters(!showFilters), className: `flex items-center space-x-2 px-4 py-2 rounded-xl border transition-colors ${hasActiveFilters || showFilters ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 hover:border-gray-300"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Funnel, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 111,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium", children: "Filtros" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 112,
              columnNumber: 15
            }, this),
            hasActiveFilters && !showFilters && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-2 h-2 bg-white rounded-full" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 113,
              columnNumber: 52
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 110,
            columnNumber: 13
          }, this),
          listings.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-gray-600", children: [
            listings.length,
            " resultado",
            listings.length !== 1 ? "s" : ""
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 116,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 109,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setViewMode("grid"), className: `p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Grid3x3, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 123,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 122,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setViewMode("list"), className: `p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(List, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 126,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 125,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 121,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 108,
        columnNumber: 9
      }, this),
      showFilters && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-12 p-6 bg-gray-50 rounded-2xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "get", className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "search", value: search }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 134,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Marca" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 137,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "brand", defaultValue: brand, className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Todas" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 141,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "Nissan", children: "Nissan" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 142,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "Honda", children: "Honda" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 143,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "Toyota", children: "Toyota" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 144,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "Volkswagen", children: "Volkswagen" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 145,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "Ford", children: "Ford" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 146,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "Chevrolet", children: "Chevrolet" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 147,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 140,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 136,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "A\xF1o m\xEDnimo" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 152,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", name: "minYear", defaultValue: minYear || "", placeholder: "2010", min: "1990", max: "2024", className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 155,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 151,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Precio m\xEDnimo" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 159,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", name: "minPrice", defaultValue: minPrice || "", placeholder: "50,000", step: "10000", className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 162,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 158,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Precio m\xE1ximo" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 166,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", name: "maxPrice", defaultValue: maxPrice || "", placeholder: "500,000", step: "10000", className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 169,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 165,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:col-span-2 lg:col-span-4 flex items-center space-x-4 pt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium", children: "Aplicar filtros" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 173,
            columnNumber: 17
          }, this),
          hasActiveFilters && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "text-gray-600 hover:text-gray-900 transition-colors font-medium", children: "Limpiar filtros" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 176,
            columnNumber: 38
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 172,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 133,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 132,
        columnNumber: 25
      }, this),
      listings.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `grid gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"}`, children: listings.map((listing) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", { className: `group ${viewMode === "list" ? "flex space-x-6" : ""}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `relative overflow-hidden rounded-2xl bg-gray-100 ${viewMode === "list" ? "w-80 h-60 flex-shrink-0" : "aspect-[4/3]"}`, children: [
          listing.images && listing.images.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: listing.images[0], alt: listing.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 187,
            columnNumber: 66
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-16 h-16 bg-gray-300 rounded-full" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 188,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 187,
            columnNumber: 215
          }, this),
          listing.year && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium", children: listing.year }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 191,
            columnNumber: 36
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-5 h-5 text-gray-600" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 196,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 195,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 186,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `${viewMode === "list" ? "flex-1 py-2" : "pt-6"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between mb-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors", children: listing.title }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 203,
              columnNumber: 23
            }, this),
            listing.brand && listing.model && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: [
              listing.brand,
              " ",
              listing.model
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 206,
              columnNumber: 58
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 202,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 201,
            columnNumber: 19
          }, this),
          listing.description && viewMode === "list" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-4 line-clamp-2", children: listing.description }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 212,
            columnNumber: 66
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-light text-gray-900", children: [
              "$",
              listing.price ? listing.price.toLocaleString() : 0
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 217,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4 text-sm text-gray-500", children: [
              listing.likesCount && listing.likesCount > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 222,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.likesCount }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 223,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 221,
                columnNumber: 72
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 226,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: Math.floor(Math.random() * 200) + 20 }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 227,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 225,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 220,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 216,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-500", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-1 mb-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-3 h-3" }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 235,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : "Fecha no disponible" }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 236,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 234,
                columnNumber: 23
              }, this),
              listing.owner?.name && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                "Por ",
                listing.owner.name
              ] }, void 0, true, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 238,
                columnNumber: 47
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 233,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${listing._id}`, className: "flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors font-medium group", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Ver detalles" }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 242,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform" }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 243,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 241,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 232,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 200,
          columnNumber: 17
        }, this)
      ] }, listing._id, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 185,
        columnNumber: 38
      }, this)) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 184,
        columnNumber: 32
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-24", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-20 h-20 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "w-8 h-8 text-gray-400" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 250,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 249,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-light text-gray-900 mb-4", children: search || hasActiveFilters ? "Sin resultados" : "No hay autos disponibles" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 252,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-8 max-w-md mx-auto", children: search || hasActiveFilters ? "Intenta ajustar tus filtros de b\xFAsqueda" : user && canCreateListings ? "Comienza agregando el primer auto a nuestro cat\xE1logo" : "Estamos preparando incre\xEDbles autos para ti" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 255,
          columnNumber: 13
        }, this),
        user && canCreateListings ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/listings/new", className: "inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-4 h-4" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 261,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Agregar Auto al Inventario" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 262,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 260,
          columnNumber: 42
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Notificarme cuando lleguen" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 264,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 263,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 248,
        columnNumber: 20
      }, this),
      listings.length >= 24 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mt-16", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "bg-gray-100 text-gray-900 px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium", children: "Ver m\xE1s resultados" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 270,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 269,
        columnNumber: 35
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", { className: "border-t border-gray-100 mt-24", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-6 h-6 bg-black rounded-full" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 281,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-light text-gray-900", children: "Cliquealo" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 282,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 280,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-500", children: "\xA9 2024 Todos los derechos reservados" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 284,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 279,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 278,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 277,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 80,
    columnNumber: 10
  }, this);
}
_s(Index, "1c8Vn7WcgHDIk2A5ow5Ufad7dH4=", false, function() {
  return [useLoaderData];
});
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
//# sourceMappingURL=/build/routes/_index-43YC4Y6F.js.map
