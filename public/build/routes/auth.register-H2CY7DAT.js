import {
  require_session
} from "/build/_shared/chunk-EV32D4DT.js";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  require_node
} from "/build/_shared/chunk-NAZ4VLGB.js";
import {
  Form,
  Link,
  useActionData,
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

// app/routes/auth.register.tsx
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
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\auth.register.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\auth.register.tsx"
  );
  import.meta.hot.lastModified = "1749086516607.09";
}
function Register() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = (0, import_react2.useState)(false);
  const [showConfirmPassword, setShowConfirmPassword] = (0, import_react2.useState)(false);
  const [formData, setFormData] = (0, import_react2.useState)({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const isSubmitting = navigation.state === "submitting";
  const passwordRequirements = [{
    text: "Al menos 6 caracteres",
    met: formData.password.length >= 6
  }, {
    text: "Las contrase\xF1as coinciden",
    met: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  }];
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, "");
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length <= 10) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`;
    } else {
      return `+${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 5)} ${phoneNumber.slice(5, 8)} ${phoneNumber.slice(8, 12)}`;
    }
  };
  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange("phone", formatted);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-white flex", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-full flex items-center justify-center p-12", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-32 h-32 bg-gray-200 rounded-full mx-auto mb-8" }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 183,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-light text-gray-800 mb-4", children: "\xDAnete a nuestra comunidad" }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 184,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 max-w-md", children: "Publica tus autos, encuentra compradores y realiza transacciones seguras." }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 187,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 182,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 181,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 180,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-sm w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "inline-flex items-center space-x-3 mb-8", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-8 h-8 bg-black rounded-full" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 199,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-xl font-light tracking-tight text-gray-900", children: "Cliquealo" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 200,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 198,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-light text-gray-900 mb-3", children: "Crear cuenta" }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 205,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "Comienza a vender y comprar autos" }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 208,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 197,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nombre completo" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 215,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "name", required: true, autoComplete: "name", value: formData.name, onChange: (e) => handleInputChange("name", e.target.value), className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all", placeholder: "Tu nombre" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 218,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 214,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 222,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "email", name: "email", required: true, autoComplete: "email", value: formData.email, onChange: (e) => handleInputChange("email", e.target.value), className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all", placeholder: "tu@email.com" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 225,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 221,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "N\xFAmero de tel\xE9fono" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 229,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "tel", name: "phone", required: true, autoComplete: "tel", value: formData.phone, onChange: (e) => handlePhoneChange(e.target.value), className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all", placeholder: "33 1234 5678", maxLength: 15 }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 232,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-500 mt-1", children: "Formato: 33 1234 5678 o +52 33 1234 5678" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 233,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 228,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Contrase\xF1a" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 239,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: showPassword ? "text" : "password", name: "password", required: true, autoComplete: "new-password", value: formData.password, onChange: (e) => handleInputChange("password", e.target.value), className: "w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, void 0, false, {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 243,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors", children: showPassword ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "w-5 h-5" }, void 0, false, {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 245,
              columnNumber: 35
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-5 h-5" }, void 0, false, {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 245,
              columnNumber: 68
            }, this) }, void 0, false, {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 244,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 242,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 238,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirmar contrase\xF1a" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 251,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: showConfirmPassword ? "text" : "password", name: "confirmPassword", required: true, autoComplete: "new-password", value: formData.confirmPassword, onChange: (e) => handleInputChange("confirmPassword", e.target.value), className: "w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, void 0, false, {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 255,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors", children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "w-5 h-5" }, void 0, false, {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 257,
              columnNumber: 42
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-5 h-5" }, void 0, false, {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 257,
              columnNumber: 75
            }, this) }, void 0, false, {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 256,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 254,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 250,
          columnNumber: 13
        }, this),
        formData.password && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: passwordRequirements.map((req, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 text-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `w-4 h-4 rounded-full flex items-center justify-center ${req.met ? "bg-green-100" : "bg-gray-100"}`, children: req.met && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "w-3 h-3 text-green-600" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 266,
            columnNumber: 35
          }, this) }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 265,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: req.met ? "text-green-600" : "text-gray-500", children: req.text }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 268,
            columnNumber: 21
          }, this)
        ] }, index, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 264,
          columnNumber: 59
        }, this)) }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 263,
          columnNumber: 35
        }, this),
        actionData?.error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 bg-red-50 border border-red-200 rounded-xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-red-600", children: actionData.error }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 275,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 274,
          columnNumber: 35
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "w-5 h-5 animate-spin" }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 279,
          columnNumber: 31
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Crear cuenta" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 280,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 281,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 279,
          columnNumber: 78
        }, this) }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 278,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 213,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: [
        "\xBFYa tienes cuenta?",
        " ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/auth/login", className: "text-gray-900 hover:text-gray-700 transition-colors font-medium", children: "Iniciar sesi\xF3n" }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 289,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 287,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 286,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 196,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 195,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/auth.register.tsx",
    lineNumber: 178,
    columnNumber: 10
  }, this);
}
_s(Register, "Y/gCWIghrkkJCVijl1yKG/cmXVo=", false, function() {
  return [useActionData, useNavigation];
});
_c = Register;
var _c;
$RefreshReg$(_c, "Register");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Register as default
};
//# sourceMappingURL=/build/routes/auth.register-H2CY7DAT.js.map
