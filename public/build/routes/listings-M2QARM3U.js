import {
  require_session
} from "/build/_shared/chunk-EV32D4DT.js";
import {
  toast
} from "/build/_shared/chunk-6JM7CQRR.js";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Funnel,
  Grid3x3,
  Heart,
  List,
  Search,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams
} from "/build/_shared/chunk-XUSZDHZA.js";
import {
  createHotContext
} from "/build/_shared/chunk-QA5V5W5C.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/listings.tsx
var import_node = __toESM(require_node(), 1);
var import_session = __toESM(require_session(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\listings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\listings.tsx"
  );
  import.meta.hot.lastModified = "1749340590569.35";
}
function LikeButton({
  listing,
  isLiked: initialLiked,
  user
}) {
  _s();
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  const getCurrentlyLiked = () => {
    if (fetcher.formData) {
      const intent = fetcher.formData.get("intent");
      const fetcherListingId = fetcher.formData.get("listingId");
      const intentStr = typeof intent === "string" ? intent : "";
      const listingIdStr = typeof fetcherListingId === "string" ? fetcherListingId : "";
      if (listingIdStr === listing._id) {
        return intentStr === "like";
      }
    }
    if (fetcher.data) {
      const data = fetcher.data;
      if (data?.listingId === listing._id) {
        if (data?.action === "liked")
          return true;
        if (data?.action === "unliked")
          return false;
        if (data?.error)
          return initialLiked;
      }
    }
    return initialLiked;
  };
  const currentlyLiked = getCurrentlyLiked();
  (0, import_react2.useEffect)(() => {
    if (fetcher.data) {
      const data = fetcher.data;
      if (data?.listingId === listing._id) {
        if (data?.error) {
          toast.error(data.error);
        } else if (data?.success) {
          if (data.action === "liked") {
            toast.success("Agregado a favoritos \u2764\uFE0F");
          } else if (data.action === "unliked") {
            toast.success("Removido de favoritos");
          }
        }
      }
    }
  }, [fetcher.data, listing._id]);
  if (!user) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { disabled: true, className: "absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-not-allowed opacity-60", title: "Inicia sesi\xF3n para dar like", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-5 h-5 text-gray-400" }, void 0, false, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 233,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 232,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(fetcher.Form, { method: "post", style: {
    display: "inline"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: currentlyLiked ? "unlike" : "like" }, void 0, false, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 239,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "listingId", value: listing._id }, void 0, false, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 240,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isLoading, className: `absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 ${currentlyLiked ? "hover:bg-red-50 scale-110" : "hover:bg-white"} ${isLoading ? "opacity-50 cursor-not-allowed animate-pulse" : "hover:scale-105"}`, title: currentlyLiked ? "Quitar de favoritos" : "Agregar a favoritos", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: `w-5 h-5 transition-all duration-200 ${currentlyLiked ? "fill-red-500 text-red-500" : "text-gray-600"}` }, void 0, false, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 242,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 241,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/listings.tsx",
    lineNumber: 236,
    columnNumber: 10
  }, this);
}
_s(LikeButton, "WjihN4CabdhkHDxQoVW7dBj/pPI=", false, function() {
  return [useFetcher];
});
_c = LikeButton;
function ListingsIndex() {
  _s2();
  const {
    listings,
    search,
    brand,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    user,
    currentPage,
    totalPages,
    totalCount,
    brands,
    likedListings
  } = useLoaderData();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = (0, import_react2.useState)("grid");
  const [showFilters, setShowFilters] = (0, import_react2.useState)(false);
  const hasActiveFilters = brand || minPrice || maxPrice || minYear || maxYear;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { className: "border-b border-gray-100 bg-gray-50/50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-2xl mx-auto text-center mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl sm:text-5xl font-light text-gray-900 mb-4 tracking-tight", children: "Explorar Cat\xE1logo" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 276,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-gray-600 font-light", children: "Encuentra tu auto ideal entre nuestras opciones" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 279,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 275,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "get", className: "max-w-4xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 286,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "search", name: "search", defaultValue: search, placeholder: "Buscar por marca, modelo...", className: "w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 287,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium", children: "Buscar" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 288,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 285,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 284,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 274,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 273,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 space-y-4 sm:space-y-0", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowFilters(!showFilters), className: `flex items-center space-x-2 px-4 py-2 rounded-xl border transition-colors ${hasActiveFilters || showFilters ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 hover:border-gray-300"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Funnel, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 301,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium", children: "Filtros" }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 302,
              columnNumber: 15
            }, this),
            hasActiveFilters && !showFilters && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-2 h-2 bg-white rounded-full" }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 303,
              columnNumber: 52
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 300,
            columnNumber: 13
          }, this),
          listings.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-gray-600", children: [
            listings.length,
            " resultado",
            listings.length !== 1 ? "s" : "",
            " de ",
            totalCount
          ] }, void 0, true, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 306,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 299,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setViewMode("grid"), className: `p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Grid3x3, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 313,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 312,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setViewMode("list"), className: `p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(List, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 316,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 315,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 311,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 298,
        columnNumber: 9
      }, this),
      showFilters && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-12 p-6 bg-gray-50 rounded-2xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "get", className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "search", value: search }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 324,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Marca" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 327,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "brand", defaultValue: brand, className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Todas" }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 331,
              columnNumber: 19
            }, this),
            brands.map((brand2) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: brand2, children: brand2 }, brand2, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 332,
              columnNumber: 40
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 330,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 326,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "A\xF1o m\xEDnimo" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 337,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", name: "minYear", defaultValue: minYear || "", placeholder: "2010", min: "1990", max: "2024", className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 340,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 336,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Precio m\xEDnimo" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 344,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", name: "minPrice", defaultValue: minPrice || "", placeholder: "50,000", step: "10000", className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 347,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 343,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Precio m\xE1ximo" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 351,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", name: "maxPrice", defaultValue: maxPrice || "", placeholder: "500,000", step: "10000", className: "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 354,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 350,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:col-span-2 lg:col-span-4 flex items-center space-x-4 pt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium", children: "Aplicar filtros" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 358,
            columnNumber: 17
          }, this),
          hasActiveFilters && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/listings", className: "text-gray-600 hover:text-gray-900 transition-colors font-medium", children: "Limpiar filtros" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 361,
            columnNumber: 38
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 357,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 323,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 322,
        columnNumber: 25
      }, this),
      listings.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `grid gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"}`, children: listings.map((listing) => {
        const isLiked = likedListings.includes(listing._id);
        return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", { className: `group ${viewMode === "list" ? "flex space-x-6" : ""}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `relative overflow-hidden rounded-2xl bg-gray-100 ${viewMode === "list" ? "w-80 h-60 flex-shrink-0" : "aspect-[4/3]"}`, children: [
            listing.images && listing.images.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: listing.images[0], alt: listing.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 375,
              columnNumber: 68
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-16 h-16 bg-gray-300 rounded-full" }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 376,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 375,
              columnNumber: 217
            }, this),
            listing.year && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium", children: listing.year }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 379,
              columnNumber: 38
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LikeButton, { listing, isLiked, user }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 384,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 374,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `${viewMode === "list" ? "flex-1 py-2" : "pt-6"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between mb-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors", children: listing.title }, void 0, false, {
                fileName: "app/routes/listings.tsx",
                lineNumber: 390,
                columnNumber: 25
              }, this),
              listing.brand && listing.model && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: [
                listing.brand,
                " ",
                listing.model
              ] }, void 0, true, {
                fileName: "app/routes/listings.tsx",
                lineNumber: 393,
                columnNumber: 60
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 389,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 388,
              columnNumber: 21
            }, this),
            listing.description && viewMode === "list" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-4 line-clamp-2", children: listing.description }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 399,
              columnNumber: 68
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-light text-gray-900", children: [
                "$",
                listing.price ? listing.price.toLocaleString() : 0
              ] }, void 0, true, {
                fileName: "app/routes/listings.tsx",
                lineNumber: 404,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4 text-sm text-gray-500", children: [
                listing.likesCount && listing.likesCount > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center space-x-1", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "app/routes/listings.tsx",
                    lineNumber: 409,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.likesCount }, void 0, false, {
                    fileName: "app/routes/listings.tsx",
                    lineNumber: 410,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/listings.tsx",
                  lineNumber: 408,
                  columnNumber: 74
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center space-x-1", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "app/routes/listings.tsx",
                    lineNumber: 413,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.viewsCount || Math.floor(Math.random() * 200) + 20 }, void 0, false, {
                    fileName: "app/routes/listings.tsx",
                    lineNumber: 414,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/listings.tsx",
                  lineNumber: 412,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings.tsx",
                lineNumber: 407,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 403,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-500", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-1 mb-1", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-3 h-3" }, void 0, false, {
                    fileName: "app/routes/listings.tsx",
                    lineNumber: 422,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : "Fecha no disponible" }, void 0, false, {
                    fileName: "app/routes/listings.tsx",
                    lineNumber: 423,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/listings.tsx",
                  lineNumber: 421,
                  columnNumber: 25
                }, this),
                listing.owner?.name && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                  "Por ",
                  listing.owner.name
                ] }, void 0, true, {
                  fileName: "app/routes/listings.tsx",
                  lineNumber: 425,
                  columnNumber: 49
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings.tsx",
                lineNumber: 420,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${listing._id}`, className: "flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors font-medium group", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Ver detalles" }, void 0, false, {
                  fileName: "app/routes/listings.tsx",
                  lineNumber: 429,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform" }, void 0, false, {
                  fileName: "app/routes/listings.tsx",
                  lineNumber: 430,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings.tsx",
                lineNumber: 428,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 419,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 387,
            columnNumber: 19
          }, this)
        ] }, listing._id, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 373,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 369,
        columnNumber: 32
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-24", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-20 h-20 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "w-8 h-8 text-gray-400" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 438,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 437,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-light text-gray-900 mb-4", children: search || hasActiveFilters ? "Sin resultados" : "No hay autos disponibles" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 440,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-8 max-w-md mx-auto", children: search || hasActiveFilters ? "Intenta ajustar tus filtros de b\xFAsqueda" : "Estamos preparando incre\xEDbles autos para ti" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 443,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Volver al inicio" }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 448,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 447,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 436,
        columnNumber: 20
      }, this),
      totalPages > 1 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-12 flex justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "relative z-0 inline-flex rounded-md shadow-sm -space-x-px", "aria-label": "Pagination", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `?${new URLSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          page: (currentPage - 1).toString()
        })}`, className: `relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`, "aria-disabled": currentPage === 1, tabIndex: currentPage === 1 ? -1 : 0, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "sr-only", children: "Anterior" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 459,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronLeft, { className: "h-5 w-5", "aria-hidden": "true" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 460,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 455,
          columnNumber: 15
        }, this),
        Array.from({
          length: totalPages
        }, (_, i) => i + 1).filter((page) => {
          return page === 1 || page === totalPages || page >= currentPage - 1 && page <= currentPage + 1;
        }).map((page, index, array) => {
          const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
          const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
          return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            showEllipsisBefore && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700", children: "..." }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 473,
              columnNumber: 46
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `?${new URLSearchParams({
              ...Object.fromEntries(searchParams.entries()),
              page: page.toString()
            })}`, className: `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage ? "z-10 bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`, children: page }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 477,
              columnNumber: 23
            }, this),
            showEllipsisAfter && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700", children: "..." }, void 0, false, {
              fileName: "app/routes/listings.tsx",
              lineNumber: 484,
              columnNumber: 45
            }, this)
          ] }, page, true, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 472,
            columnNumber: 20
          }, this);
        }),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `?${new URLSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          page: (currentPage + 1).toString()
        })}`, className: `relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"}`, "aria-disabled": currentPage === totalPages, tabIndex: currentPage === totalPages ? -1 : 0, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "sr-only", children: "Siguiente" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 494,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-5 w-5", "aria-hidden": "true" }, void 0, false, {
            fileName: "app/routes/listings.tsx",
            lineNumber: 495,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.tsx",
          lineNumber: 490,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 454,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/listings.tsx",
        lineNumber: 453,
        columnNumber: 28
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/listings.tsx",
      lineNumber: 296,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/listings.tsx",
    lineNumber: 271,
    columnNumber: 10
  }, this);
}
_s2(ListingsIndex, "cRtf8y/W53EV68Toe56zvkkoss8=", false, function() {
  return [useLoaderData, useSearchParams];
});
_c2 = ListingsIndex;
var _c;
var _c2;
$RefreshReg$(_c, "LikeButton");
$RefreshReg$(_c2, "ListingsIndex");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ListingsIndex as default
};
//# sourceMappingURL=/build/routes/listings-M2QARM3U.js.map
