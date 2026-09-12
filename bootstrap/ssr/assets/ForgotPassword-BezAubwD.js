import { jsxs, jsx } from "react/jsx-runtime";
import { G as GuestLayout } from "./GuestLayout-D9cNON8J.js";
import { useForm, Head, Link } from "@inertiajs/react";
function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({ email: "" });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Forgot Password" }),
    /* @__PURE__ */ jsx("h2", { className: "mb-1 text-2xl font-bold text-gray-900", children: "Reset password" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-gray-500", children: "पासवर्ड रीसेट करें · Enter your registered email address" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Note / नोट" }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5", children: "If you registered without an email, password reset is unavailable — contact the administrator." }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-amber-600", children: "यदि आपने ईमेल के बिना पंजीकरण किया है, तो व्यवस्थापक से संपर्क करें।" })
    ] }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700", children: status }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: [
          "Email Address",
          /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs font-normal text-indigo-400", children: "ईमेल पता" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            autoFocus: true,
            value: data.email,
            onChange: (e) => setData("email", e.target.value),
            placeholder: "your@email.com",
            className: "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          }
        ),
        errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-red-500", children: errors.email })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "flex h-12 w-full select-none items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60",
          children: processing ? "Sending…" : "Send Reset Link · रीसेट लिंक भेजें"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-6 text-center text-sm text-gray-500", children: /* @__PURE__ */ jsx(Link, { href: route("login"), className: "font-semibold text-indigo-600 hover:text-indigo-800", children: "← Back to login" }) })
  ] });
}
export {
  ForgotPassword as default
};
