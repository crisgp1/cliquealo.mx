import {
  require_session
} from "/build/_shared/chunk-EV32D4DT.js";
import {
  toast
} from "/build/_shared/chunk-UYPXJME5.js";
import {
  require_auth
} from "/build/_shared/chunk-OW4LD7OY.js";
import {
  ArrowLeft,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Settings,
  Share2,
  SquarePen,
  Trash2,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useNavigation
} from "/build/_shared/chunk-UPSJBP36.js";
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

// app/routes/listings_.$id.tsx
var import_node = __toESM(require_node(), 1);
var import_session = __toESM(require_session(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\listings_.$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\listings_.$id.tsx"
  );
  import.meta.hot.lastModified = "1749264726206.9023";
}
function ListingDetail() {
  _s();
  const {
    listing,
    similarListings,
    user,
    hasLiked,
    canEdit
  } = useLoaderData();
  const navigation = useNavigation();
  const likeFetcher = useFetcher();
  const [currentImageIndex, setCurrentImageIndex] = (0, import_react2.useState)(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = (0, import_react2.useState)(false);
  const isLiking = likeFetcher.state !== "idle";
  const isDeleting = navigation.state === "submitting" && navigation.formData?.get("intent") === "delete";
  const getCurrentlyLiked = () => {
    if (likeFetcher.formData) {
      const intent = likeFetcher.formData.get("intent");
      const intentStr = typeof intent === "string" ? intent : "";
      console.log("\u{1F504} Estado optimista - Intent:", intentStr);
      return intentStr === "like";
    }
    if (likeFetcher.data) {
      const data = likeFetcher.data;
      console.log("\u{1F4E1} Respuesta servidor - Action:", data?.action);
      if (data?.action === "liked")
        return true;
      if (data?.action === "unliked")
        return false;
      if (data?.error)
        return hasLiked;
    }
    return hasLiked;
  };
  const currentlyLiked = getCurrentlyLiked();
  (0, import_react2.useEffect)(() => {
    if (likeFetcher.data) {
      const data = likeFetcher.data;
      if (data?.error) {
        console.error("\u274C Error en like:", data.error);
        toast.error(data.error);
      } else if (data?.success) {
        if (data.action === "liked") {
          console.log("\u2705 Like exitoso");
          toast.success("Agregado a favoritos \u2764\uFE0F");
        } else if (data.action === "unliked") {
          console.log("\u2705 Unlike exitoso");
          toast.success("Removido de favoritos");
        }
      }
    }
  }, [likeFetcher.data]);
  const images = listing.images || [];
  const hasImages = images.length > 0;
  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };
  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };
  (0, import_react2.useEffect)(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft")
        prevImage();
      if (e.key === "ArrowRight")
        nextImage();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [images.length]);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `${listing.brand} ${listing.model} ${listing.year} - $${listing.price.toLocaleString()}`,
          url: window.location.href
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("\xA1Enlace copiado al portapapeles!");
    }
  };
  const getCurrentIntent = () => {
    if (!likeFetcher.formData)
      return "none";
    const intent = likeFetcher.formData.get("intent");
    return typeof intent === "string" ? intent : "unknown";
  };
  const getFetcherDataString = () => {
    if (!likeFetcher.data)
      return "null";
    try {
      return JSON.stringify(likeFetcher.data);
    } catch {
      return "error-serializing";
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-100 sticky top-0 bg-white z-40", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "w-5 h-5" }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 299,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: "Volver al Cat\xE1logo" }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 300,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings_.$id.tsx",
        lineNumber: 298,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-6 h-6 bg-black rounded-full" }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 304,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-light tracking-tight text-gray-900", children: "Cliquealo" }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 305,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings_.$id.tsx",
        lineNumber: 303,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2", children: [
        user && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(likeFetcher.Form, { method: "post", style: {
          display: "inline"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: currentlyLiked ? "unlike" : "like" }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 315,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isLiking, className: `p-2 rounded-full transition-all duration-200 ${currentlyLiked ? "bg-red-100 text-red-600 hover:bg-red-200 scale-110" : "bg-gray-100 text-gray-600 hover:bg-gray-200"} ${isLiking ? "opacity-50 cursor-not-allowed animate-pulse" : "hover:scale-105"}`, title: currentlyLiked ? "Quitar de favoritos" : "Agregar a favoritos", onClick: () => {
            console.log("\u{1F497} Click en coraz\xF3n - Estado actual:", currentlyLiked);
            console.log("\u{1F464} Usuario:", user.name);
            console.log("\u{1F504} Fetcher state:", likeFetcher.state);
            console.log("\u{1F4E4} Enviando intent:", currentlyLiked ? "unlike" : "like");
          }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: `w-5 h-5 transition-all duration-200 ${currentlyLiked ? "fill-current text-red-600" : "text-gray-600"}` }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 322,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 316,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 312,
          columnNumber: 24
        }, this),
        !user && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { disabled: true, className: "p-2 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed", title: "Inicia sesi\xF3n para dar like", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-5 h-5" }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 328,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 327,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleShare, className: "p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Share2, { className: "w-5 h-5" }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 332,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 331,
          columnNumber: 15
        }, this),
        canEdit && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${listing._id}/edit`, className: "p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-2", title: "Editar Listing", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SquarePen, { className: "w-5 h-5" }, void 0, false, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 337,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "hidden sm:inline text-sm", children: "Editar" }, void 0, false, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 338,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 336,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowDeleteConfirm(true), className: "p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 342,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 341,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 335,
          columnNumber: 27
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings_.$id.tsx",
        lineNumber: 310,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/listings_.$id.tsx",
      lineNumber: 297,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/listings_.$id.tsx",
      lineNumber: 296,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/listings_.$id.tsx",
      lineNumber: 295,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-12", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "lg:col-span-2 space-y-8", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
            hasImages ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden group", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: images[currentImageIndex], alt: `${listing.title} - Imagen ${currentImageIndex + 1}`, className: "w-full h-full object-cover" }, void 0, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 357,
                columnNumber: 19
              }, this),
              images.length > 1 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: prevImage, className: "absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronLeft, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 361,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 360,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: nextImage, className: "absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 365,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 364,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2", children: images.map((_, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setCurrentImageIndex(index), className: `w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"}` }, index, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 369,
                  columnNumber: 51
                }, this)) }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 368,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 359,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 356,
              columnNumber: 28
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "w-16 h-16 text-gray-400" }, void 0, false, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 373,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 372,
              columnNumber: 26
            }, this),
            images.length > 1 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-4 gap-2", children: [
              images.slice(0, 4).map((image, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setCurrentImageIndex(index), className: `aspect-square rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? "border-gray-900" : "border-transparent"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: image, alt: `Thumbnail ${index + 1}`, className: "w-full h-full object-cover" }, void 0, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 379,
                columnNumber: 23
              }, this) }, index, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 378,
                columnNumber: 61
              }, this)),
              images.length > 4 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-600", children: [
                "+",
                images.length - 4
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 381,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 377,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 355,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-light text-gray-900 mb-2 tracking-tight", children: listing.title }, void 0, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 390,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4 text-gray-600", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg", children: [
                  listing.brand,
                  " ",
                  listing.model
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 394,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u2022" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 395,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: listing.year }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 396,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 393,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 389,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-4xl font-light text-gray-900", children: [
              "$",
              listing.price.toLocaleString(),
              " MXN"
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 400,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-50 rounded-xl p-4 text-center", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-6 h-6 text-gray-600 mx-auto mb-2" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 407,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-600", children: "A\xF1o" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 408,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "font-medium", children: listing.year }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 409,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 406,
                columnNumber: 17
              }, this),
              listing.fuelType && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-50 rounded-xl p-4 text-center", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Fuel, { className: "w-6 h-6 text-gray-600 mx-auto mb-2" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 413,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-600", children: "Combustible" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 414,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "font-medium capitalize", children: listing.fuelType }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 415,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 412,
                columnNumber: 38
              }, this),
              listing.transmission && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-50 rounded-xl p-4 text-center", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settings, { className: "w-6 h-6 text-gray-600 mx-auto mb-2" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 419,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-600", children: "Transmisi\xF3n" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 420,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "font-medium capitalize", children: listing.transmission }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 421,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 418,
                columnNumber: 42
              }, this),
              listing.mileage && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-50 rounded-xl p-4 text-center", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Gauge, { className: "w-6 h-6 text-gray-600 mx-auto mb-2" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 425,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-600", children: "Kilometraje" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 426,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "font-medium", children: [
                  listing.mileage.toLocaleString(),
                  " km"
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 427,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 424,
                columnNumber: 37
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 405,
              columnNumber: 15
            }, this),
            listing.description && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-medium text-gray-900", children: "Descripci\xF3n" }, void 0, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 433,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 leading-relaxed whitespace-pre-wrap", children: listing.description }, void 0, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 434,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 432,
              columnNumber: 39
            }, this),
            (listing.color || listing.bodyType || listing.features?.length) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-medium text-gray-900", children: "Caracter\xEDsticas" }, void 0, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 441,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-2 gap-4", children: [
                listing.color && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Palette, { className: "w-5 h-5 text-gray-400" }, void 0, false, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 444,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: [
                    "Color: ",
                    listing.color
                  ] }, void 0, true, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 445,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 443,
                  columnNumber: 39
                }, this),
                listing.bodyType && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "w-5 h-5 text-gray-400" }, void 0, false, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 449,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: [
                    "Tipo: ",
                    listing.bodyType
                  ] }, void 0, true, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 450,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 448,
                  columnNumber: 42
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 442,
                columnNumber: 19
              }, this),
              listing.features?.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap gap-2 mt-4", children: listing.features.map((feature, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm", children: feature }, index, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 455,
                columnNumber: 65
              }, this)) }, void 0, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 454,
                columnNumber: 52
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 440,
              columnNumber: 83
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 388,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 353,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-50 rounded-2xl p-6 space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-medium text-gray-900", children: "Informaci\xF3n de contacto" }, void 0, false, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 467,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium text-gray-600", children: listing.owner.name.charAt(0).toUpperCase() }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 472,
                  columnNumber: 21
                }, this) }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 471,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "font-medium text-gray-900", children: listing.owner.name }, void 0, false, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 477,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-gray-600", children: listing.owner.role === "admin" ? "Vendedor Verificado" : "Vendedor" }, void 0, false, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 478,
                    columnNumber: 21
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 476,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 470,
                columnNumber: 17
              }, this),
              listing.contactInfo?.phone && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: `tel:${listing.contactInfo.phone}`, className: "flex items-center space-x-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { className: "w-5 h-5 text-gray-600" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 485,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-900", children: listing.contactInfo.phone }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 486,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 484,
                columnNumber: 48
              }, this),
              listing.contactInfo?.whatsapp && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: `https://wa.me/${listing.contactInfo.whatsapp.replace(/\D/g, "")}`, target: "_blank", rel: "noopener noreferrer", className: "flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 490,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "WhatsApp" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 491,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 492,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 489,
                columnNumber: 51
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium", children: "Contactar vendedor" }, void 0, false, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 495,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 469,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 466,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-50 rounded-2xl p-6 space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-medium text-gray-900", children: "Detalles" }, void 0, false, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 503,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: "Publicado" }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 507,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-900", children: new Date(listing.createdAt).toLocaleDateString("es-MX") }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 508,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 506,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 515,
                    columnNumber: 21
                  }, this),
                  "Vistas"
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 514,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-900", children: listing.viewsCount || 0 }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 518,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 513,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Heart, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 523,
                    columnNumber: 21
                  }, this),
                  "Me gusta"
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 522,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-900", children: listing.likesCount || 0 }, void 0, false, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 526,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 521,
                columnNumber: 17
              }, this),
              listing.location && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600 flex items-center gap-1", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "app/routes/listings_.$id.tsx",
                    lineNumber: 531,
                    columnNumber: 23
                  }, this),
                  "Ubicaci\xF3n"
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 530,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-900", children: [
                  listing.location.city,
                  ", ",
                  listing.location.state
                ] }, void 0, true, {
                  fileName: "app/routes/listings_.$id.tsx",
                  lineNumber: 534,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings_.$id.tsx",
                lineNumber: 529,
                columnNumber: 38
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 505,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 502,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 464,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings_.$id.tsx",
        lineNumber: 351,
        columnNumber: 9
      }, this),
      similarListings.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-16", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-light text-gray-900 mb-8", children: "Autos similares" }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 545,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: similarListings.map((similarListing) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${similarListing._id}`, className: "group", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aspect-[4/3] bg-gray-100 overflow-hidden", children: similarListing.images?.[0] ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: similarListing.images[0], alt: similarListing.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 550,
            columnNumber: 53
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "w-8 h-8 text-gray-400" }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 551,
            columnNumber: 27
          }, this) }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 550,
            columnNumber: 216
          }, this) }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 549,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium text-gray-900 mb-2 line-clamp-2", children: similarListing.title }, void 0, false, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 556,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg font-light text-gray-900", children: [
              "$",
              similarListing.price.toLocaleString()
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 559,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: [
              similarListing.brand,
              " ",
              similarListing.model,
              " \u2022 ",
              similarListing.year
            ] }, void 0, true, {
              fileName: "app/routes/listings_.$id.tsx",
              lineNumber: 562,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 555,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 548,
          columnNumber: 19
        }, this) }, similarListing._id, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 547,
          columnNumber: 54
        }, this)) }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 546,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings_.$id.tsx",
        lineNumber: 544,
        columnNumber: 40
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/listings_.$id.tsx",
      lineNumber: 350,
      columnNumber: 7
    }, this),
    showDeleteConfirm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-2xl p-6 max-w-md w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "\xBFEliminar este auto?" }, void 0, false, {
        fileName: "app/routes/listings_.$id.tsx",
        lineNumber: 575,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-6", children: "Esta acci\xF3n no se puede deshacer. El listing ser\xE1 eliminado permanentemente." }, void 0, false, {
        fileName: "app/routes/listings_.$id.tsx",
        lineNumber: 578,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowDeleteConfirm(false), className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors", children: "Cancelar" }, void 0, false, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 583,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "intent", value: "delete" }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 588,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isDeleting, className: "w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50", children: isDeleting ? "Eliminando..." : "Eliminar" }, void 0, false, {
            fileName: "app/routes/listings_.$id.tsx",
            lineNumber: 589,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings_.$id.tsx",
          lineNumber: 587,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings_.$id.tsx",
        lineNumber: 582,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/listings_.$id.tsx",
      lineNumber: 574,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/listings_.$id.tsx",
      lineNumber: 573,
      columnNumber: 29
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/listings_.$id.tsx",
    lineNumber: 293,
    columnNumber: 10
  }, this);
}
_s(ListingDetail, "IomVUH6zlM/tvHgcPHipsFqwcwA=", false, function() {
  return [useLoaderData, useNavigation, useFetcher];
});
_c = ListingDetail;
var _c;
$RefreshReg$(_c, "ListingDetail");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ListingDetail as default
};
//# sourceMappingURL=/build/routes/listings_.$id-2EY7PNLB.js.map
