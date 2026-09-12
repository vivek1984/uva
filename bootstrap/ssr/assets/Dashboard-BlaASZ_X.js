import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { A as AccountingLayout } from "./AccountingLayout-D9weSSuH.js";
import "./AuthenticatedLayout-CO3HPgl3.js";
import "react";
function StatCard({ label, value, color = "indigo", sub }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200"
  };
  return /* @__PURE__ */ jsxs("div", { className: `rounded-xl border p-5 ${colors[color]}`, children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide opacity-70", children: label }),
    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-2xl font-bold", children: [
      "₹",
      value.toLocaleString("en-IN", { minimumFractionDigits: 2 })
    ] }),
    sub && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs opacity-60", children: sub })
  ] });
}
function FeeTypeBadge({ type }) {
  if (type === "membership") return /* @__PURE__ */ jsx("span", { className: "rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700", children: "Membership" });
  if (type === "joining") return /* @__PURE__ */ jsx("span", { className: "rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700", children: "Joining" });
  return /* @__PURE__ */ jsx("span", { className: "rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700", children: "Expense" });
}
function Dashboard({ fy, current_fy, all_years, can_edit, stats, recent, unpaid_members }) {
  function changeFy(e) {
    router.get(route("accounting.dashboard"), { fy: e.target.value }, { preserveScroll: true });
  }
  return /* @__PURE__ */ jsxs(AccountingLayout, { header: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Accounting" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-500", children: "Financial Year" }),
      /* @__PURE__ */ jsx("select", { value: fy, onChange: changeFy, className: "rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400", children: all_years.map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
        y,
        y === current_fy ? " (current)" : ""
      ] }, y)) })
    ] })
  ] }), children: [
    /* @__PURE__ */ jsx(Head, { title: "Accounting" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl space-y-6 px-4 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsx(StatCard, { label: "Membership Fees", value: stats.membership_total, color: "indigo" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Joining Fees", value: stats.joining_total, color: "purple" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Total Expenses", value: stats.expenses_total, color: "red" }),
        /* @__PURE__ */ jsx(StatCard, { label: "Net Balance", value: stats.net_balance, color: stats.net_balance >= 0 ? "green" : "red", sub: "Income − Expenses" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "border-b px-5 py-3", children: /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-800", children: [
            "Recent Transactions — ",
            fy
          ] }) }),
          recent.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-5 py-8 text-center text-sm text-gray-400", children: "No transactions yet for this year." }) : /* @__PURE__ */ jsx("div", { className: "divide-y", children: recent.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FeeTypeBadge, { type: t.type === "expense" ? "expense" : t.fee_type }),
                /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-medium text-gray-800", children: t.label })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-gray-400", children: [
                t.date,
                " · ",
                t.mode,
                " · by ",
                t.recorded_by
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `ml-4 shrink-0 font-semibold ${t.type === "expense" ? "text-red-600" : "text-green-600"}`, children: [
              t.type === "expense" ? "−" : "+",
              "₹",
              Number(t.amount).toLocaleString("en-IN")
            ] })
          ] }, i)) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "border-b px-5 py-3", children: /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-800", children: [
            "Membership Fee Pending",
            unpaid_members.length > 0 && /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700", children: unpaid_members.length })
          ] }) }),
          unpaid_members.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-5 py-8 text-center text-sm text-gray-400", children: "All active members have paid. ✓" }) : /* @__PURE__ */ jsx("div", { className: "max-h-80 divide-y overflow-y-auto", children: unpaid_members.map((m) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: m.name }),
              m.firm_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: m.firm_name })
            ] }),
            can_edit && /* @__PURE__ */ jsx(
              Link,
              {
                href: route("accounting.fees.index", { fy, member: m.id }),
                className: "text-xs font-medium text-indigo-600 hover:underline",
                children: "Record"
              }
            )
          ] }, m.id)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as default
};
