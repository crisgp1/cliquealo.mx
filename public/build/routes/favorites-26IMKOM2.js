import {
  require_session
} from "/build/_shared/chunk-EV32D4DT.js";
import {
  toast
} from "/build/_shared/chunk-6JM7CQRR.js";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Eye,
  Heart,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Link,
  useFetcher,
  useLoaderData
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

// app/routes/favorites.tsx
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
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\favorites.tsx"' + id);
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
    "app\\routes\\favorites.tsx"
  );
  import.meta.hot.lastModified = "1749341128337.4448";
}
function RemoveFavoriteButton({
  listing
}) {
  _s();
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  (0, import_react2.useEffect)(() => {
    if (fetcher.data) {
      const data = fetcher.data;
      if (data?.listingId === listing._id) {
        if (data?.error) {
          toast.error(data.error);
        } else if (data?.success && data.action === "unliked") {
          toast.success("Removido de favoritos");
        }
      }
    }
  }, [fetcher.data, listing._id]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(fetcher.Form, { method: "post", style: {
    display: "inline"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: "unlike" }, void 0, false, {
      fileName: "app/routes/favorites.tsx",
      lineNumber: 120,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "listingId", value: listing._id }, void 0, false, {
      fileName: "app/routes/favorites.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isLoading, className: `p-2 rounded-full transition-all duration-200 bg-red-100 text-red-600 hover:bg-red-200 ${isLoading ? "opacity-50 cursor-not-allowed animate-pulse" : "hover:scale-105"}`, title: "Quitar de favoritos", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-5 h-5 fill-current" }, void 0, false, {
      fileName: "app/routes/favorites.tsx",
      lineNumber: 123,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/favorites.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/favorites.tsx",
    lineNumber: 117,
    columnNumber: 10
  }, this);
}
_s(RemoveFavoriteButton, "WjihN4CabdhkHDxQoVW7dBj/pPI=", false, function() {
  return [useFetcher];
});
_c = RemoveFavoriteButton;
function Favorites() {
  _s2();
  const {
    user,
    likedListings,
    totalLikes
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-100", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "w-5 h-5" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 144,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: "Volver al inicio" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 145,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/favorites.tsx",
        lineNumber: 143,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-6 h-6 bg-black rounded-full" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 149,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-light tracking-tight text-gray-900", children: "Cliquealo" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 150,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/favorites.tsx",
        lineNumber: 148,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-20" }, void 0, false, {
        fileName: "app/routes/favorites.tsx",
        lineNumber: 155,
        columnNumber: 13
      }, this),
      " "
    ] }, void 0, true, {
      fileName: "app/routes/favorites.tsx",
      lineNumber: 142,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/favorites.tsx",
      lineNumber: 141,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/favorites.tsx",
      lineNumber: 140,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-light text-gray-900 mb-4 tracking-tight", children: "Mis Favoritos" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 163,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-gray-600", children: totalLikes > 0 ? `${totalLikes} auto${totalLikes !== 1 ? "s" : ""} guardado${totalLikes !== 1 ? "s" : ""} como favorito${totalLikes !== 1 ? "s" : ""}` : "A\xFAn no tienes autos favoritos" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 166,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/favorites.tsx",
        lineNumber: 162,
        columnNumber: 9
      }, this),
      likedListings.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", children: likedListings.map((listing) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", { className: "group", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]", children: [
          listing.images && listing.images.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: listing.images[0], alt: listing.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 175,
            columnNumber: 66
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "w-16 h-16 text-gray-300" }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 176,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 175,
            columnNumber: 215
          }, this),
          listing.year && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium", children: listing.year }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 179,
            columnNumber: 36
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RemoveFavoriteButton, { listing }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 185,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 184,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 174,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pt-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between mb-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors", children: listing.title }, void 0, false, {
              fileName: "app/routes/favorites.tsx",
              lineNumber: 192,
              columnNumber: 23
            }, this),
            listing.brand && listing.model && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: [
              listing.brand,
              " ",
              listing.model
            ] }, void 0, true, {
              fileName: "app/routes/favorites.tsx",
              lineNumber: 195,
              columnNumber: 58
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 191,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 190,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-light text-gray-900", children: [
              "$",
              listing.price ? listing.price.toLocaleString() : 0
            ] }, void 0, true, {
              fileName: "app/routes/favorites.tsx",
              lineNumber: 202,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4 text-sm text-gray-500", children: [
              listing.likesCount && listing.likesCount > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "app/routes/favorites.tsx",
                  lineNumber: 207,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.likesCount }, void 0, false, {
                  fileName: "app/routes/favorites.tsx",
                  lineNumber: 208,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/favorites.tsx",
                lineNumber: 206,
                columnNumber: 72
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "app/routes/favorites.tsx",
                  lineNumber: 211,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.viewsCount || 0 }, void 0, false, {
                  fileName: "app/routes/favorites.tsx",
                  lineNumber: 212,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/favorites.tsx",
                lineNumber: 210,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/favorites.tsx",
              lineNumber: 205,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 201,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-500", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-1 mb-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-3 h-3" }, void 0, false, {
                  fileName: "app/routes/favorites.tsx",
                  lineNumber: 220,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: new Date(listing.createdAt).toLocaleDateString() }, void 0, false, {
                  fileName: "app/routes/favorites.tsx",
                  lineNumber: 221,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/favorites.tsx",
                lineNumber: 219,
                columnNumber: 23
              }, this),
              listing.owner?.name && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                "Por ",
                listing.owner.name
              ] }, void 0, true, {
                fileName: "app/routes/favorites.tsx",
                lineNumber: 223,
                columnNumber: 47
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/favorites.tsx",
              lineNumber: 218,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${listing._id}`, className: "flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors font-medium group", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Ver detalles" }, void 0, false, {
                fileName: "app/routes/favorites.tsx",
                lineNumber: 227,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform" }, void 0, false, {
                fileName: "app/routes/favorites.tsx",
                lineNumber: 228,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/favorites.tsx",
              lineNumber: 226,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 217,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 189,
          columnNumber: 17
        }, this)
      ] }, listing._id, true, {
        fileName: "app/routes/favorites.tsx",
        lineNumber: 173,
        columnNumber: 43
      }, this)) }, void 0, false, {
        fileName: "app/routes/favorites.tsx",
        lineNumber: 172,
        columnNumber: 37
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-24", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-20 h-20 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-8 h-8 text-gray-400" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 235,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 234,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-light text-gray-900 mb-4", children: "A\xFAn no tienes favoritos" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 237,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-8 max-w-md mx-auto", children: "Explora nuestro cat\xE1logo y marca los autos que m\xE1s te gusten como favoritos" }, void 0, false, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 240,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Explorar cat\xE1logo" }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 245,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
            fileName: "app/routes/favorites.tsx",
            lineNumber: 246,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/favorites.tsx",
          lineNumber: 244,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/favorites.tsx",
        lineNumber: 233,
        columnNumber: 20
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/favorites.tsx",
      lineNumber: 160,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/favorites.tsx",
    lineNumber: 138,
    columnNumber: 10
  }, this);
}
_s2(Favorites, "2hrkmwg94XYUbAGj9HOurzvEWqM=", false, function() {
  return [useLoaderData];
});
_c2 = Favorites;
var _c;
var _c2;
$RefreshReg$(_c, "RemoveFavoriteButton");
$RefreshReg$(_c2, "Favorites");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Favorites as default
};
//# sourceMappingURL=/build/routes/favorites-26IMKOM2.js.map
