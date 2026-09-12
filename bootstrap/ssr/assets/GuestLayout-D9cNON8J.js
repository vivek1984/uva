import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
function GuestLayout({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[100dvh] flex-col bg-indigo-800", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center px-6 pb-8 pt-12", children: [
      /* @__PURE__ */ jsx(Link, { href: "/", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/storage/logo.jpg",
          alt: "UVA",
          className: "mb-4 h-20 w-20 rounded-2xl object-contain shadow-xl shadow-indigo-900/50"
        }
      ) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-white", children: "UVA" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-indigo-300", children: "Vyapari Welfare Association" }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs font-semibold italic text-indigo-400", children: "'Yuva at Heart'" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto rounded-t-[2rem] bg-white px-6 pb-8 pt-8 shadow-2xl sm:mx-auto sm:mb-8 sm:w-full sm:max-w-md sm:flex-none sm:rounded-2xl", children })
  ] });
}
export {
  GuestLayout as G
};
