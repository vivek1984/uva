import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { A as AccountingLayout } from "./AccountingLayout-D9weSSuH.js";
import "./AuthenticatedLayout-CO3HPgl3.js";
const MODE_LABELS = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque"
};
function ExpenseLedger({ fy, current_fy, all_years, entries, total, by_category }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActive] = useState(null);
  function changeFy(e) {
    router.get(route("accounting.ledger.expenses"), { fy: e.target.value }, { preserveScroll: true });
  }
  const filtered = entries.filter((e) => {
    const matchCat = !activeCategory || e.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || (e.notes ?? "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);
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
        "Expenses Ledger — ",
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
    /* @__PURE__ */ jsx(Head, { title: `Expenses Ledger — ${fy}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 py-6 space-y-4", children: [
      Object.keys(by_category).length > 0 && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: [
        Object.entries(by_category).map(([cat, amt]) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActive(activeCategory === cat ? null : cat),
            className: `rounded-xl border p-3 text-left transition-colors ${activeCategory === cat ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-500 truncate", children: cat }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-base font-bold text-red-600", children: [
                "₹",
                amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })
              ] })
            ]
          },
          cat
        )),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-indigo-200 bg-indigo-50 p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-indigo-500", children: "Total" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-base font-bold text-indigo-700", children: [
            "₹",
            total.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search description, category…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "w-56 bg-transparent text-sm outline-none placeholder-gray-400"
            }
          ),
          search && /* @__PURE__ */ jsx("button", { onClick: () => setSearch(""), className: "text-gray-300 hover:text-gray-500", children: "✕" })
        ] }),
        activeCategory && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700", children: [
          activeCategory,
          /* @__PURE__ */ jsx("button", { onClick: () => setActive(null), className: "text-orange-400 hover:text-orange-600", children: "✕" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-white shadow-sm overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left w-28", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Description" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left w-32", children: "Mode" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right w-36", children: "Amount" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right w-36", children: "Running Total" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y", children: [
          filtered.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 6, className: "px-5 py-8 text-center text-gray-400", children: [
            "No expenses found",
            activeCategory ? ` in "${activeCategory}"` : "",
            "."
          ] }) }),
          filtered.map((e, i) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-orange-50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-500 whitespace-nowrap", children: e.date }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700", children: e.category }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-gray-800", children: [
              e.description,
              e.notes && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic", children: e.notes })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-gray-500 whitespace-nowrap", children: [
              MODE_LABELS[e.payment_mode] ?? e.payment_mode,
              e.cheque && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs text-gray-400", children: [
                "#",
                e.cheque
              ] })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right font-semibold text-red-600", children: [
              "₹",
              e.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right text-gray-400 tabular-nums", children: [
              "₹",
              e.running_total.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] })
          ] }, e.id))
        ] }),
        filtered.length > 0 && /* @__PURE__ */ jsx("tfoot", { className: "bg-orange-50", children: /* @__PURE__ */ jsxs("tr", { className: "font-bold", children: [
          /* @__PURE__ */ jsxs("td", { colSpan: 4, className: "px-5 py-3 text-orange-800", children: [
            "Total",
            activeCategory ? ` — ${activeCategory}` : ""
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right text-red-700", children: [
            "₹",
            filteredTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3" })
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  ExpenseLedger as default
};
