import { jsxs, jsx } from "react/jsx-runtime";
import { G as GuestLayout } from "./GuestLayout-D9cNON8J.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { useState } from "react";
function validateField(name, value, allData) {
  switch (name) {
    case "name":
      if (!value.trim()) return "Full name is required · पूरा नाम आवश्यक है";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    case "firm_name":
      if (!value.trim()) return "Firm / business name is required · फर्म का नाम आवश्यक है";
      if (value.trim().length < 2) return "Firm name must be at least 2 characters";
      return "";
    case "phone_number":
      if (!value) return "Mobile number is required · मोबाइल नंबर आवश्यक है";
      if (value.length < 10) return `${10 - value.length} more digit${10 - value.length > 1 ? "s" : ""} needed · ${10 - value.length} अंक और चाहिए`;
      if (value.length > 10) return "Mobile number must be exactly 10 digits";
      if (!/^[6-9]/.test(value)) return "Indian mobile numbers start with 6, 7, 8 or 9";
      return "";
    case "email":
      if (!value.trim()) return "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return "Enter a valid email address · सही ईमेल पता दर्ज करें";
      return "";
    case "password":
      if (!value) return "Password is required · पासवर्ड आवश्यक है";
      if (value.length < 8) return `Password must be at least 8 characters (${8 - value.length} more needed)`;
      if (!/[A-Za-z]/.test(value)) return "Password must contain at least one letter";
      if (!/[0-9]/.test(value)) return "Password must contain at least one number";
      return "";
    case "password_confirmation":
      if (!value) return "Please confirm your password · पासवर्ड दोबारा दर्ज करें";
      if (value !== allData.password) return "Passwords do not match · पासवर्ड मेल नहीं खाता";
      return "";
    default:
      return "";
  }
}
function EyeIcon({ visible, toggle }) {
  return /* @__PURE__ */ jsx("button", { type: "button", tabIndex: -1, onClick: toggle, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600", children: visible ? /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) }) : /* @__PURE__ */ jsxs("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
  ] }) });
}
function Field({ label, hindi, error, touched, valid, children }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: [
      label,
      hindi && /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs font-normal text-indigo-400", children: hindi })
    ] }),
    children,
    touched && error && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600", children: [
      /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5 flex-none", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
      error
    ] }),
    touched && !error && valid && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 flex items-center gap-1.5 text-xs font-medium text-green-600", children: [
      /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5 flex-none", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
      "Looks good!"
    ] })
  ] });
}
function inputCls(touched, error) {
  const base = "h-12 w-full rounded-xl border bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:bg-white focus:outline-none focus:ring-2";
  if (!touched) return `${base} border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20`;
  if (error) return `${base} border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20`;
  return `${base} border-green-400 focus:border-green-500 focus:ring-green-500/20`;
}
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a letter", ok: /[A-Za-z]/.test(password) },
    { label: "Contains a number", ok: /[0-9]/.test(password) }
  ];
  const score = checks.filter((c) => c.ok).length;
  const bar = ["bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-green-500"][score];
  const label = ["Weak", "Fair", "Good", "Strong"][score];
  return /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-1 gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("div", { className: `h-1.5 flex-1 rounded-full transition-colors ${i < score ? bar : "bg-gray-200"}` }, i)) }),
      /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold ${["text-red-500", "text-amber-500", "text-yellow-600", "text-green-600"][score]}`, children: label })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-0.5", children: checks.map((c) => /* @__PURE__ */ jsxs("li", { className: `flex items-center gap-1.5 text-xs ${c.ok ? "text-green-600" : "text-gray-400"}`, children: [
      c.ok ? /* @__PURE__ */ jsx("svg", { className: "h-3 w-3 flex-none", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z", clipRule: "evenodd" }) }) : /* @__PURE__ */ jsx("svg", { className: "h-3 w-3 flex-none", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z", clipRule: "evenodd" }) }),
      c.label
    ] }, c.label)) })
  ] });
}
function Register() {
  const { data, setData, post, processing, errors: serverErrors, reset } = useForm({
    name: "",
    firm_name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const fields = ["name", "firm_name", "phone_number", "email", "password", "password_confirmation"];
  const [touched, setTouched] = useState({});
  const [clientErrors, setClientErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showPwC, setShowPwC] = useState(false);
  function touch(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setClientErrors((prev) => ({ ...prev, [name]: validateField(name, data[name], data) }));
  }
  function change(name, value) {
    setData(name, value);
    if (touched[name]) {
      const updated = { ...data, [name]: value };
      setClientErrors((prev) => ({ ...prev, [name]: validateField(name, value, updated) }));
      if (name === "password" && touched["password_confirmation"]) {
        setClientErrors((prev) => ({ ...prev, password_confirmation: validateField("password_confirmation", data.password_confirmation, updated) }));
      }
    }
  }
  function errorFor(name) {
    return clientErrors[name] || serverErrors[name] || "";
  }
  function submit(e) {
    e.preventDefault();
    const allTouched = Object.fromEntries(fields.map((f) => [f, true]));
    setTouched(allTouched);
    const allErrors = Object.fromEntries(fields.map((f) => [f, validateField(f, data[f], data)]));
    setClientErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) return;
    post(route("register"), { onFinish: () => reset("password", "password_confirmation") });
  }
  return /* @__PURE__ */ jsxs(GuestLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Register" }),
    /* @__PURE__ */ jsx("h2", { className: "mb-1 text-2xl font-bold text-gray-900", children: "Create account" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-gray-500", children: "खाता बनाएं · Join UVA Vyapari Welfare Association" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, noValidate: true, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "Full Name *", hindi: "पूरा नाम", error: errorFor("name"), touched: touched.name, valid: !errorFor("name"), children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          autoComplete: "name",
          autoFocus: true,
          value: data.name,
          onChange: (e) => change("name", e.target.value),
          onBlur: () => touch("name"),
          placeholder: "Your full name",
          className: inputCls(touched.name, errorFor("name"))
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "Firm / Business Name *", hindi: "फर्म का नाम", error: errorFor("firm_name"), touched: touched.firm_name, valid: !errorFor("firm_name"), children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: data.firm_name,
          onChange: (e) => change("firm_name", e.target.value),
          onBlur: () => touch("firm_name"),
          placeholder: "e.g. Sharma Traders",
          className: inputCls(touched.firm_name, errorFor("firm_name"))
        }
      ) }),
      /* @__PURE__ */ jsxs(Field, { label: "Phone Number *", hindi: "फ़ोन नंबर", error: errorFor("phone_number"), touched: touched.phone_number, valid: !errorFor("phone_number"), children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "tel",
            autoComplete: "tel",
            inputMode: "numeric",
            maxLength: 10,
            value: data.phone_number,
            onChange: (e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              change("phone_number", digits);
            },
            onBlur: () => touch("phone_number"),
            placeholder: "10-digit mobile number",
            className: inputCls(touched.phone_number, errorFor("phone_number"))
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400", children: [
            "Used as your login ID · ",
            /* @__PURE__ */ jsx("span", { className: "text-indigo-400", children: "लॉगिन ID के रूप में उपयोग होगा" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: `text-xs font-semibold tabular-nums ${data.phone_number.length === 10 ? "text-green-600" : "text-gray-400"}`, children: [
            data.phone_number.length,
            "/10"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Field, { label: "Email Address", hindi: "ईमेल पता", error: errorFor("email"), touched: touched.email, valid: touched.email && !errorFor("email") && !!data.email.trim(), children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            autoComplete: "email",
            value: data.email,
            onChange: (e) => change("email", e.target.value),
            onBlur: () => touch("email"),
            placeholder: "Optional — for password recovery",
            className: inputCls(touched.email && !!data.email.trim(), errorFor("email"))
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-gray-400", children: [
          "Optional · ",
          /* @__PURE__ */ jsx("span", { className: "text-indigo-400", children: "वैकल्पिक — केवल पासवर्ड रीसेट के लिए" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Field, { label: "Password *", hindi: "पासवर्ड", error: errorFor("password"), touched: touched.password, valid: !errorFor("password"), children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPw ? "text" : "password",
              autoComplete: "new-password",
              value: data.password,
              onChange: (e) => change("password", e.target.value),
              onBlur: () => touch("password"),
              placeholder: "Min. 8 characters with a number",
              className: inputCls(touched.password, errorFor("password")) + " pr-12"
            }
          ),
          /* @__PURE__ */ jsx(EyeIcon, { visible: showPw, toggle: () => setShowPw((v) => !v) })
        ] }),
        data.password && /* @__PURE__ */ jsx(PasswordStrength, { password: data.password })
      ] }),
      /* @__PURE__ */ jsx(Field, { label: "Confirm Password *", hindi: "पासवर्ड पुष्टि", error: errorFor("password_confirmation"), touched: touched.password_confirmation, valid: !errorFor("password_confirmation"), children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: showPwC ? "text" : "password",
            autoComplete: "new-password",
            value: data.password_confirmation,
            onChange: (e) => change("password_confirmation", e.target.value),
            onBlur: () => touch("password_confirmation"),
            placeholder: "Repeat your password",
            className: inputCls(touched.password_confirmation, errorFor("password_confirmation")) + " pr-12"
          }
        ),
        /* @__PURE__ */ jsx(EyeIcon, { visible: showPwC, toggle: () => setShowPwC((v) => !v) })
      ] }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "mt-2 flex h-12 w-full select-none items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60",
          children: processing ? "Creating account…" : "Register · पंजीकरण"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-gray-500", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsx(Link, { href: route("login"), className: "font-semibold text-indigo-600 hover:text-indigo-800", children: "Log in" })
    ] })
  ] });
}
export {
  Register as default
};
