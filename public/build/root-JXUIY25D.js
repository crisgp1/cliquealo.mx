import {
  require_session
} from "/build/_shared/chunk-EV32D4DT.js";
import {
  require_auth
} from "/build/_shared/chunk-OW4LD7OY.js";
import {
  LogOut,
  Plus,
  Shield,
  User,
  X,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "/build/_shared/chunk-PD2HC7TI.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-NL5YRBQO.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/root.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_session = __toESM(require_session(), 1);
var import_auth = __toESM(require_auth(), 1);

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-FGER2SU6.css";

// app/root.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/root.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/root.tsx"
  );
}
var links = () => [{
  rel: "stylesheet",
  href: tailwind_default
}, {
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", { charSet: "utf-8" }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 57,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 58,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Meta, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 59,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Links, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 60,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 56,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [
      children,
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScrollRestoration, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 62,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 55,
    columnNumber: 10
  }, this);
}
_c = Layout;
function App() {
  _s();
  const {
    user,
    canCreateListings
  } = useLoaderData();
  const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react2.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-white flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-50 py-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between h-16", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-6 h-6 bg-black rounded-full" }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 83,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-light tracking-tight text-gray-900", children: "Cliquealo" }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 84,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/root.tsx",
          lineNumber: 82,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "hidden md:flex items-center space-x-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/listings", className: "text-gray-600 hover:text-black transition-colors text-sm", children: "Explorar" }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 90,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/about", className: "text-gray-600 hover:text-black transition-colors text-sm", children: "Nosotros" }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 93,
            columnNumber: 15
          }, this),
          user && canCreateListings && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/listings/new", className: "text-gray-600 hover:text-black transition-colors text-sm flex items-center gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-3.5 h-3.5" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 100,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Crear" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 101,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/root.tsx",
            lineNumber: 98,
            columnNumber: 45
          }, this),
          user?.role === "superadmin" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/admin", className: "text-gray-600 hover:text-black transition-colors text-sm flex items-center gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "w-3.5 h-3.5" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 106,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Admin" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 107,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/root.tsx",
            lineNumber: 104,
            columnNumber: 47
          }, this)
        ] }, void 0, true, {
          fileName: "app/root.tsx",
          lineNumber: 89,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
          user ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "hidden sm:block text-sm text-gray-600", children: [
              user.name,
              (user.role === "admin" || user.role === "superadmin") && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "ml-1 text-xs text-gray-400", children: [
                "(",
                user.role,
                ")"
              ] }, void 0, true, {
                fileName: "app/root.tsx",
                lineNumber: 115,
                columnNumber: 79
              }, this)
            ] }, void 0, true, {
              fileName: "app/root.tsx",
              lineNumber: 113,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "w-4 h-4 text-gray-600" }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 122,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 121,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/auth/logout", className: "ml-2 p-2 text-gray-400 hover:text-gray-600", title: "Cerrar Sesi\xF3n", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "w-4 h-4" }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 126,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "app/root.tsx",
                lineNumber: 124,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/root.tsx",
              lineNumber: 120,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/root.tsx",
            lineNumber: 112,
            columnNumber: 23
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/auth/login", className: "text-gray-600 hover:text-black transition-colors text-sm", children: "Entrar" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 130,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/auth/register", className: "px-3 py-1.5 border border-gray-200 text-sm rounded-full hover:border-gray-400 transition-colors", children: "Registrarse" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 134,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/root.tsx",
            lineNumber: 129,
            columnNumber: 26
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "md:hidden ml-2 p-2", "aria-label": mobileMenuOpen ? "Cerrar men\xFA" : "Abrir men\xFA", children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "w-5 h-5 text-gray-900" }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 143,
            columnNumber: 35
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-5 h-0.5 bg-gray-900 mb-1" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 144,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-5 h-0.5 bg-gray-900 mb-1" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 145,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-5 h-0.5 bg-gray-900" }, void 0, false, {
              fileName: "app/root.tsx",
              lineNumber: 146,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/root.tsx",
            lineNumber: 143,
            columnNumber: 77
          }, this) }, void 0, false, {
            fileName: "app/root.tsx",
            lineNumber: 141,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/root.tsx",
          lineNumber: 111,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/root.tsx",
        lineNumber: 81,
        columnNumber: 11
      }, this),
      mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "md:hidden py-4 border-t border-gray-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/listings", className: "text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2", onClick: () => setMobileMenuOpen(false), children: "Explorar Cat\xE1logo" }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 155,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/about", className: "text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2", onClick: () => setMobileMenuOpen(false), children: "Nosotros" }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 159,
          columnNumber: 17
        }, this),
        user?.role === "admin" || user?.role === "superadmin" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/listings/new", className: "text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-1 py-2", onClick: () => setMobileMenuOpen(false), children: "Crear Listing" }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 163,
          columnNumber: 74
        }, this) : null,
        user?.role === "superadmin" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/admin", className: "text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2", onClick: () => setMobileMenuOpen(false), children: "Panel de Administraci\xF3n" }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 167,
          columnNumber: 49
        }, this),
        user && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/auth/logout", className: "text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2", onClick: () => setMobileMenuOpen(false), children: "Cerrar Sesi\xF3n" }, void 0, false, {
          fileName: "app/root.tsx",
          lineNumber: 171,
          columnNumber: 26
        }, this)
      ] }, void 0, true, {
        fileName: "app/root.tsx",
        lineNumber: 154,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/root.tsx",
        lineNumber: 153,
        columnNumber: 30
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.tsx",
      lineNumber: 80,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/root.tsx",
      lineNumber: 79,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
      fileName: "app/root.tsx",
      lineNumber: 182,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/root.tsx",
      lineNumber: 181,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/root.tsx",
    lineNumber: 77,
    columnNumber: 10
  }, this);
}
_s(App, "Q1ivtq+wrPcc/n1cGb3S1fx3RyQ=", false, function() {
  return [useLoaderData];
});
_c2 = App;
var _c;
var _c2;
$RefreshReg$(_c, "Layout");
$RefreshReg$(_c2, "App");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Layout,
  App as default,
  links
};
//# sourceMappingURL=/build/root-JXUIY25D.js.map
