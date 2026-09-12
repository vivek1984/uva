import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
function AccountingLayout({ header, children }) {
  const { auth } = usePage().props;
  const isAdmin = auth.user?.role === "admin";
  const navItems = [
    { href: route("accounting.dashboard"), label: "Overview" },
    { href: route("accounting.fees.index"), label: "Member Fees" },
    { href: route("accounting.expenses.index"), label: "Expenses" },
    { href: route("accounting.ledger.index"), label: "Ledgers" },
    ...isAdmin ? [
      { href: route("accounting.settings"), label: "Fee Settings" },
      { href: route("accounting.access.index"), label: "Access Management" }
    ] : []
  ];
  const current = window.location.pathname;
  function isActive(href) {
    const path = new URL(href, window.location.origin).pathname;
    if (path === "/accounting") return current === "/accounting";
    return current.startsWith(path);
  }
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { header: header ?? /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Accounting" }), children: [
    /* @__PURE__ */ jsx("div", { className: "border-b bg-white shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl px-4", children: /* @__PURE__ */ jsx("nav", { className: "-mb-px flex gap-1 overflow-x-auto", children: navItems.map((item) => /* @__PURE__ */ jsx(
      Link,
      {
        href: item.href,
        className: `whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${isActive(item.href) ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`,
        children: item.label
      },
      item.href
    )) }) }) }),
    children
  ] });
}
export {
  AccountingLayout as A
};
