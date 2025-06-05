import {
  require_auth
} from "/build/_shared/chunk-OW4LD7OY.js";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Car,
  DollarSign,
  Hash,
  LoaderCircle,
  Plus,
  X,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Form,
  Link,
  useActionData,
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

// app/routes/listings.$id.edit.tsx
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
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\listings.$id.edit.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\listings.$id.edit.tsx"
  );
  import.meta.hot.lastModified = "1748918744064.882";
}
function EditListing() {
  _s();
  const {
    listing
  } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [imageUrls, setImageUrls] = (0, import_react2.useState)([]);
  const [imageInput, setImageInput] = (0, import_react2.useState)("");
  const isSubmitting = navigation.state === "submitting";
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const years = Array.from({
    length: currentYear - 1979
  }, (_, i) => currentYear - i);
  const popularBrands = ["Nissan", "Volkswagen", "Chevrolet", "Ford", "Toyota", "Honda", "Hyundai", "Kia", "Mazda", "Suzuki", "BMW", "Mercedes-Benz", "Audi", "SEAT", "Renault", "Peugeot", "Mitsubishi", "Jeep"];
  (0, import_react2.useEffect)(() => {
    if (listing.images && listing.images.length > 0) {
      setImageUrls(listing.images);
    }
  }, [listing]);
  const addImageUrl = () => {
    if (imageInput.trim() && !imageUrls.includes(imageInput.trim())) {
      setImageUrls([...imageUrls, imageInput.trim()]);
      setImageInput("");
    }
  };
  const removeImageUrl = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addImageUrl();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-100", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${listing._id}`, className: "flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "w-5 h-5" }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 192,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: "Volver al Listing" }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 193,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.$id.edit.tsx",
        lineNumber: 191,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-6 h-6 bg-black rounded-full" }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 197,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-light tracking-tight text-gray-900", children: "Cliquealo" }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 198,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.$id.edit.tsx",
        lineNumber: 196,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-20" }, void 0, false, {
        fileName: "app/routes/listings.$id.edit.tsx",
        lineNumber: 203,
        columnNumber: 13
      }, this),
      " "
    ] }, void 0, true, {
      fileName: "app/routes/listings.$id.edit.tsx",
      lineNumber: 190,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/listings.$id.edit.tsx",
      lineNumber: 189,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/listings.$id.edit.tsx",
      lineNumber: 188,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-light text-gray-900 mb-4 tracking-tight", children: "Editar Auto" }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 210,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-gray-600", children: "Actualiza la informaci\xF3n de tu anuncio" }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.$id.edit.tsx",
        lineNumber: 209,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "space-y-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: "T\xEDtulo del anuncio *" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 221,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "title", required: true, maxLength: 100, defaultValue: listing.title, placeholder: "ej: Nissan Sentra 2020 Autom\xE1tico Excelente Estado", className: "w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-lg" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 224,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: "Incluye marca, modelo, a\xF1o y caracter\xEDsticas principales" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 225,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 220,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "w-4 h-4 inline mr-2" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 234,
                columnNumber: 17
              }, this),
              "Marca *"
            ] }, void 0, true, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 233,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "brand", required: true, defaultValue: listing.brand, className: "w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Seleccionar marca" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 238,
                columnNumber: 17
              }, this),
              popularBrands.map((brand) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: brand, children: brand }, brand, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 239,
                columnNumber: 45
              }, this)),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "Otra", children: "Otra marca" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 240,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 237,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 232,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: "Modelo *" }, void 0, false, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 245,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "model", required: true, maxLength: 50, defaultValue: listing.model, placeholder: "ej: Sentra, Civic, Corolla", className: "w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" }, void 0, false, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 248,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 244,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 231,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "w-4 h-4 inline mr-2" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 256,
                columnNumber: 17
              }, this),
              "A\xF1o *"
            ] }, void 0, true, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 255,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { name: "year", required: true, defaultValue: listing.year, className: "w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Seleccionar a\xF1o" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 260,
                columnNumber: 17
              }, this),
              years.map((year) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: year, children: year }, year, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 261,
                columnNumber: 36
              }, this))
            ] }, void 0, true, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 259,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 254,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DollarSign, { className: "w-4 h-4 inline mr-2" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 267,
                columnNumber: 17
              }, this),
              "Precio (MXN) *"
            ] }, void 0, true, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 266,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", name: "price", required: true, min: "1000", max: "5000000", step: "1000", defaultValue: listing.price, placeholder: "250000", className: "w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" }, void 0, false, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 270,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: "Precio sin comas ni s\xEDmbolos" }, void 0, false, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 271,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 265,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 253,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: "Descripci\xF3n" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 279,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { name: "description", rows: 6, maxLength: 1e3, defaultValue: listing.description || "", placeholder: "Describe las caracter\xEDsticas, estado, historia del mantenimiento, extras incluidos, raz\xF3n de venta, etc.", className: "w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 282,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: "Una buena descripci\xF3n ayuda a vender m\xE1s r\xE1pido" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 283,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 278,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "w-4 h-4 inline mr-2" }, void 0, false, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 291,
              columnNumber: 15
            }, this),
            "Fotograf\xEDas"
          ] }, void 0, true, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 290,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "url", value: imageInput, onChange: (e) => setImageInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "https://ejemplo.com/foto-del-auto.jpg", className: "flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 297,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: addImageUrl, className: "px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-5 h-5" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 299,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 298,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 296,
              columnNumber: 15
            }, this),
            imageUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: imageUrls.map((url, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative group", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aspect-video bg-gray-100 rounded-xl overflow-hidden", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: url, alt: `Foto ${index + 1}`, className: "w-full h-full object-cover", onError: (e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                } }, void 0, false, {
                  fileName: "app/routes/listings.$id.edit.tsx",
                  lineNumber: 306,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hidden w-full h-full flex items-center justify-center text-gray-400", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Camera, { className: "w-8 h-8" }, void 0, false, {
                  fileName: "app/routes/listings.$id.edit.tsx",
                  lineNumber: 311,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "app/routes/listings.$id.edit.tsx",
                  lineNumber: 310,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 305,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => removeImageUrl(index), className: "absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "w-4 h-4" }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 315,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "app/routes/listings.$id.edit.tsx",
                lineNumber: 314,
                columnNumber: 23
              }, this)
            ] }, index, true, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 304,
              columnNumber: 50
            }, this)) }, void 0, false, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 303,
              columnNumber: 40
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "images", value: imageUrls.join(",") }, void 0, false, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 320,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: "Las fotos aumentan las posibilidades de venta hasta en 5x" }, void 0, false, {
              fileName: "app/routes/listings.$id.edit.tsx",
              lineNumber: 322,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 295,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 289,
          columnNumber: 11
        }, this),
        actionData?.error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 bg-red-50 border border-red-200 rounded-xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-red-600", children: actionData.error }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 330,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 329,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pt-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "w-6 h-6 animate-spin" }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 336,
          columnNumber: 33
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Guardar cambios" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 337,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Hash, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 338,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 336,
          columnNumber: 80
        }, this) }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 335,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 334,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.$id.edit.tsx",
        lineNumber: 218,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-12 p-6 bg-gray-50 rounded-2xl", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium text-gray-900 mb-4", children: "Consejos para una mejor venta" }, void 0, false, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 346,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "space-y-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "\u2022 Incluye fotos desde diferentes \xE1ngulos (exterior, interior, motor)" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 350,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "\u2022 Menciona el kilometraje y historial de mantenimiento" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 351,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "\u2022 S\xE9 honesto sobre el estado del veh\xEDculo" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 352,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "\u2022 Indica si tiene alg\xFAn detalle o reparaci\xF3n necesaria" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 353,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "\u2022 Responde r\xE1pido a los mensajes de compradores interesados" }, void 0, false, {
            fileName: "app/routes/listings.$id.edit.tsx",
            lineNumber: 354,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/listings.$id.edit.tsx",
          lineNumber: 349,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/listings.$id.edit.tsx",
        lineNumber: 345,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/listings.$id.edit.tsx",
      lineNumber: 208,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/listings.$id.edit.tsx",
    lineNumber: 186,
    columnNumber: 10
  }, this);
}
_s(EditListing, "6ZZPZYOSuR2sXJO8mPTafNY7mFo=", false, function() {
  return [useLoaderData, useActionData, useNavigation];
});
_c = EditListing;
var _c;
$RefreshReg$(_c, "EditListing");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  EditListing as default
};
//# sourceMappingURL=/build/routes/listings.$id.edit-JORJRYWU.js.map
