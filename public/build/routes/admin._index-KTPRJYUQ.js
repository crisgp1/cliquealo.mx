import {
  require_auth
} from "/build/_shared/chunk-OW4LD7OY.js";
import {
  Car,
  Plus,
  TrendingUp,
  Users,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Link,
  useLoaderData
} from "/build/_shared/chunk-MITS3JJR.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-NL5YRBQO.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:~/lib/db.server
var require_db = __commonJS({
  "empty-module:~/lib/db.server"(exports, module) {
    module.exports = {};
  }
});

// app/routes/admin._index.tsx
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_db = __toESM(require_db(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/admin._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/admin._index.tsx"
  );
  import.meta.hot.lastModified = "1748642262004.835";
}
function AdminDashboard() {
  _s();
  const {
    users,
    listings,
    stats
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-light text-gray-900 mb-2", children: "Panel de Administraci\xF3n" }, void 0, false, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 66,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "Gestiona usuarios y listings de la plataforma" }, void 0, false, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 69,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/admin._index.tsx",
      lineNumber: 65,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-6 rounded-xl border border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "w-8 h-8 text-blue-600" }, void 0, false, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 78,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium text-gray-600", children: "Total Usuarios" }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 80,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-2xl font-light text-gray-900", children: stats.totalUsers }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 81,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 79,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 77,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 76,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-6 rounded-xl border border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "w-8 h-8 text-green-600" }, void 0, false, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 88,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium text-gray-600", children: "Total Listings" }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 90,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-2xl font-light text-gray-900", children: stats.totalListings }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 91,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 89,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 87,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 86,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-6 rounded-xl border border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TrendingUp, { className: "w-8 h-8 text-purple-600" }, void 0, false, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 98,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium text-gray-600", children: "Administradores" }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 100,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-2xl font-light text-gray-900", children: stats.totalAdmins }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 101,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 99,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 97,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 96,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/admin._index.tsx",
      lineNumber: 75,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-medium text-gray-900", children: "Usuarios Recientes" }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 111,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/admin/users", className: "text-sm text-blue-600 hover:text-blue-700", children: "Ver todos" }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 112,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 110,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: users.slice(0, 5).map((user) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-medium text-gray-900", children: user.name }, void 0, false, {
              fileName: "app/routes/admin._index.tsx",
              lineNumber: 120,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: user.email }, void 0, false, {
              fileName: "app/routes/admin._index.tsx",
              lineNumber: 121,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 119,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `px-2 py-1 text-xs rounded-full ${user.role === "admin" || user.role === "superadmin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`, children: user.role }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 123,
            columnNumber: 19
          }, this)
        ] }, user._id, true, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 118,
          columnNumber: 46
        }, this)) }, void 0, false, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 117,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 109,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-medium text-gray-900", children: "Listings Recientes" }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 133,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/listings/new", className: "flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/admin._index.tsx",
              lineNumber: 135,
              columnNumber: 17
            }, this),
            "Crear"
          ] }, void 0, true, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 134,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 132,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-3", children: listings.slice(0, 5).map((listing) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/listings/${listing._id}`, className: "block p-3 hover:bg-gray-50 rounded-lg transition-colors", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-medium text-gray-900", children: listing.title }, void 0, false, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 142,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: [
            "$",
            listing.price.toLocaleString(),
            " \u2022 ",
            listing.brand,
            " ",
            listing.model
          ] }, void 0, true, {
            fileName: "app/routes/admin._index.tsx",
            lineNumber: 143,
            columnNumber: 19
          }, this)
        ] }, listing._id, true, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 141,
          columnNumber: 52
        }, this)) }, void 0, false, {
          fileName: "app/routes/admin._index.tsx",
          lineNumber: 140,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/admin._index.tsx",
        lineNumber: 131,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/admin._index.tsx",
      lineNumber: 107,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/admin._index.tsx",
    lineNumber: 64,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/admin._index.tsx",
    lineNumber: 63,
    columnNumber: 10
  }, this);
}
_s(AdminDashboard, "/gqjeRH4uH+PEKProNbaSIONBjw=", false, function() {
  return [useLoaderData];
});
_c = AdminDashboard;
var _c;
$RefreshReg$(_c, "AdminDashboard");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  AdminDashboard as default
};
//# sourceMappingURL=/build/routes/admin._index-KTPRJYUQ.js.map
