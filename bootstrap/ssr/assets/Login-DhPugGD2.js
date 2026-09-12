import { jsxs, jsx } from "react/jsx-runtime";
import { G as GuestLayout } from "./GuestLayout-D9cNON8J.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState } from "react";
function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    phone_number: "",
    password: "",
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), { onFinish: () => reset("password") });
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Log in" }),
    /* @__PURE__ */ jsx("h2", { className: "mb-1 text-2xl font-bold text-gray-900", children: "Welcome back" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-gray-500", children: "वापस स्वागत है · Sign in to continue" }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700", children: status }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: [
          "Phone Number",
          /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs font-normal text-indigo-400", children: "फ़ोन नंबर" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            autoComplete: "tel",
            autoFocus: true,
            value: data.phone_number,
            onChange: (e) => setData("phone_number", e.target.value),
            placeholder: "Enter your phone number",
            className: "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          }
        ),
        errors.phone_number && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-500", children: errors.phone_number })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: [
          "Password",
          /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs font-normal text-indigo-400", children: "पासवर्ड" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              autoComplete: "current-password",
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              placeholder: "Enter your password",
              className: "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pr-12 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword((v) => !v),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
              tabIndex: -1,
              children: showPassword ? /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) }) : /* @__PURE__ */ jsxs("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
              ] })
            }
          )
        ] }),
        errors.password && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-500", children: errors.password })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => setData("remember", !data.remember),
              className: `relative h-5 w-9 rounded-full transition-colors ${data.remember ? "bg-indigo-600" : "bg-gray-300"}`,
              children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${data.remember ? "translate-x-4" : "translate-x-0.5"}` })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Remember me" })
        ] }),
        canResetPassword && /* @__PURE__ */ jsx(Link, { href: route("password.request"), className: "text-sm font-medium text-indigo-600 hover:text-indigo-800", children: "Forgot password?" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "mt-2 flex h-12 w-full select-none items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60",
          children: processing ? "Signing in…" : "Log In · लॉग इन"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-500", children: [
      "Don't have an account?",
      " ",
      /* @__PURE__ */ jsx(Link, { href: route("register"), className: "font-semibold text-indigo-600 hover:text-indigo-800", children: "Register" })
    ] })
  ] });
}
export {
  Login as default
};
