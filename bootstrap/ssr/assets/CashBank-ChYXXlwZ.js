import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { A as AccountingLayout } from "./AccountingLayout-D9weSSuH.js";
import "./AuthenticatedLayout-CO3HPgl3.js";
import "react";
const MODE_LABELS = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque"
};
function CashBank({ type, fy, current_fy, all_years, opening, entries, total_receipts, total_payments, closing }) {
  const title = type === "cash" ? "Cash Book" : "Bank Book";
  function changeFy(e) {
    const dest = type === "cash" ? "accounting.ledger.cash" : "accounting.ledger.bank";
    router.get(route(dest), { fy: e.target.value }, { preserveScroll: true });
  }
  return /* @__PURE__ */ jsxs(AccountingLayout, { header: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("accounting.ledger.index", { fy }),
          className: "flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
            "Ledgers"
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "/" }),
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-gray-800", children: [
        title,
        " — ",
        fy
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-500", children: "FY" }),
      /* @__PURE__ */ jsx("select", { value: fy, onChange: changeFy, className: "rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400", children: all_years.map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
        y,
        y === current_fy ? " (current)" : ""
      ] }, y)) })
    ] })
  ] }), children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl px-4 py-6", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-white shadow-sm overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left w-28", children: "Date" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Particulars" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left w-28", children: "Mode" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right w-32", children: "Receipt (Dr)" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right w-32", children: "Payment (Cr)" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right w-36", children: "Balance" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y", children: [
        /* @__PURE__ */ jsxs("tr", { className: "bg-indigo-50 font-medium", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-500", children: "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-indigo-800", children: "Opening Balance (brought forward)" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right text-indigo-700", children: opening > 0 ? `₹${opening.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3" }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right font-bold text-indigo-700", children: [
            "₹",
            opening.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] })
        ] }),
        entries.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 6, className: "px-5 py-8 text-center text-gray-400", children: [
          "No ",
          type,
          " transactions for this year."
        ] }) }),
        entries.map((e, i) => /* @__PURE__ */ jsxs("tr", { className: e.receipt > 0 ? "hover:bg-green-50" : "hover:bg-red-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-500 whitespace-nowrap", children: e.date }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-gray-800", children: [
            e.particulars,
            e.cheque && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs text-gray-400", children: [
              "Ch#",
              e.cheque
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-500 whitespace-nowrap", children: MODE_LABELS[e.mode] ?? e.mode }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-medium text-green-700", children: e.receipt > 0 ? `₹${e.receipt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-medium text-red-600", children: e.payment > 0 ? `₹${e.payment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—" }),
          /* @__PURE__ */ jsxs("td", { className: `px-4 py-3 text-right font-semibold ${e.balance >= 0 ? "text-gray-800" : "text-red-600"}`, children: [
            "₹",
            e.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] })
        ] }, i))
      ] }),
      /* @__PURE__ */ jsxs("tfoot", { children: [
        /* @__PURE__ */ jsxs("tr", { className: "bg-gray-100 font-semibold text-sm", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", colSpan: 2 }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600", children: "Totals" }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right text-green-700", children: [
            "₹",
            total_receipts.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right text-red-600", children: [
            "₹",
            total_payments.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { className: "bg-indigo-50 font-bold", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3", colSpan: 2 }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-indigo-800", children: "Closing Balance" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", colSpan: 2 }),
          /* @__PURE__ */ jsxs("td", { className: `px-4 py-3 text-right text-lg ${closing >= 0 ? "text-indigo-700" : "text-red-600"}`, children: [
            "₹",
            closing.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  CashBank as default
};
