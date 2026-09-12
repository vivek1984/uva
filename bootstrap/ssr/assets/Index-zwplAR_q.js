import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, useForm, Head, router, Link } from "@inertiajs/react";
import { useState, useRef } from "react";
import { A as AccountingLayout } from "./AccountingLayout-D9weSSuH.js";
import "./AuthenticatedLayout-CO3HPgl3.js";
function SummaryCard({ title, href, opening, receipts, payments, closing }) {
  return /* @__PURE__ */ jsxs(Link, { href, className: "block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-3 font-semibold text-gray-800", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-gray-500", children: [
        /* @__PURE__ */ jsx("span", { children: "Opening Balance" }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-700", children: [
          "₹",
          opening.toLocaleString("en-IN", { minimumFractionDigits: 2 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-green-600", children: [
        /* @__PURE__ */ jsx("span", { children: "+ Receipts" }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          "₹",
          receipts.toLocaleString("en-IN", { minimumFractionDigits: 2 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-red-500", children: [
        /* @__PURE__ */ jsx("span", { children: "− Payments" }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          "₹",
          payments.toLocaleString("en-IN", { minimumFractionDigits: 2 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex justify-between border-t pt-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: "Closing Balance" }),
        /* @__PURE__ */ jsxs("span", { className: `font-bold text-lg ${closing >= 0 ? "text-indigo-700" : "text-red-600"}`, children: [
          "₹",
          closing.toLocaleString("en-IN", { minimumFractionDigits: 2 })
        ] })
      ] })
    ] })
  ] });
}
function ExpenseCard({ href, total, byCategory }) {
  const topCats = Object.entries(byCategory).slice(0, 3);
  return /* @__PURE__ */ jsxs(Link, { href, className: "block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-3 font-semibold text-gray-800", children: "Expenses Ledger" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-sm", children: [
      topCats.map(([cat, amt]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-gray-500", children: [
        /* @__PURE__ */ jsx("span", { className: "truncate max-w-[140px]", children: cat }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium text-red-600", children: [
          "₹",
          amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })
        ] })
      ] }, cat)),
      topCats.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-xs", children: "No expenses recorded." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex justify-between border-t pt-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: "Total Expenses" }),
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-lg text-red-600", children: [
          "₹",
          total.toLocaleString("en-IN", { minimumFractionDigits: 2 })
        ] })
      ] })
    ] })
  ] });
}
function LedgerIndex({ fy, current_fy, all_years, can_edit, cash_summary, bank_summary, expense_summary, members }) {
  const { flash } = usePage().props;
  const [search, setSearch] = useState("");
  const [showOpeningForm, setShowOpeningForm] = useState(false);
  const [obType, setObType] = useState("cash");
  const [obYear, setObYear] = useState(fy);
  const [obAmt, setObAmt] = useState("");
  const [saving, setSaving] = useState(false);
  const [exportFy, setExportFy] = useState(fy);
  const [showImport, setShowImport] = useState(false);
  const importForm = useForm({ file: null });
  const fileInputRef = useRef(null);
  function changeFy(e) {
    const val = e.target.value;
    setExportFy(val);
    router.get(route("accounting.ledger.index"), { fy: val }, { preserveScroll: true });
  }
  function submitOpeningBalance(e) {
    e.preventDefault();
    setSaving(true);
    router.post(route("accounting.ledger.opening-balance"), {
      type: obType,
      financial_year: obYear,
      opening_balance: obAmt
    }, { preserveScroll: true, onFinish: () => {
      setSaving(false);
      setShowOpeningForm(false);
      setObAmt("");
    } });
  }
  function submitImport(e) {
    e.preventDefault();
    importForm.post(route("accounting.ledger.import"), {
      preserveScroll: true,
      onSuccess: () => {
        importForm.reset();
        setShowImport(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  }
  const filteredMembers = search.trim() ? members.filter((m) => {
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || (m.firm_name ?? "").toLowerCase().includes(q);
  }) : members;
  const outstanding = filteredMembers.filter((m) => m.outstanding > 0);
  const settled = filteredMembers.filter((m) => m.outstanding <= 0);
  return /* @__PURE__ */ jsxs(AccountingLayout, { header: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Ledgers" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-500", children: "FY" }),
      /* @__PURE__ */ jsx("select", { value: fy, onChange: changeFy, className: "rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400", children: all_years.map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
        y,
        y === current_fy ? " (current)" : ""
      ] }, y)) }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: route("accounting.ledger.export", { fy: exportFy }),
          className: "flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" }) }),
            "Export CSV"
          ]
        }
      ),
      can_edit && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowImport((v) => !v),
          className: "flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 8l5-5 5 5M12 3v11" }) }),
            "Import CSV"
          ]
        }
      )
    ] })
  ] }), children: [
    /* @__PURE__ */ jsx(Head, { title: "Ledgers" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 py-6 space-y-6", children: [
      flash?.success && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700", children: flash.success }),
      flash?.import_results && /* @__PURE__ */ jsx(ImportResultsBanner, { results: flash.import_results }),
      can_edit && showImport && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b px-5 py-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-700", children: "Import CSV" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowImport(false), className: "text-gray-400 hover:text-gray-600 text-lg leading-none", children: "×" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
            "Upload a ",
            /* @__PURE__ */ jsx("strong", { children: ".zip" }),
            " exported from this page. It restores members, fee structures, fee payments, expenses, and opening balances. New members are created with a temporary password — they must use ",
            /* @__PURE__ */ jsx("em", { children: "Forgot Password" }),
            " to log in. Members and balances are matched by mobile number. Duplicate transactions are skipped automatically."
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitImport, className: "flex flex-wrap items-end gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-600", children: "ZIP file" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: ".zip,application/zip,application/x-zip-compressed",
                  onChange: (e) => importForm.setData("file", e.target.files[0]),
                  className: "block text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100",
                  required: true
                }
              ),
              importForm.errors.import_file && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: importForm.errors.import_file }),
              importForm.errors.file && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: importForm.errors.file })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: importForm.processing || !importForm.data.file,
                className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60",
                children: importForm.processing ? "Importing…" : "Import"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            title: "Cash Book",
            href: route("accounting.ledger.cash", { fy }),
            opening: cash_summary.opening,
            receipts: cash_summary.receipts,
            payments: cash_summary.payments,
            closing: cash_summary.closing
          }
        ),
        /* @__PURE__ */ jsx(
          SummaryCard,
          {
            title: "Bank Book",
            href: route("accounting.ledger.bank", { fy }),
            opening: bank_summary.opening,
            receipts: bank_summary.receipts,
            payments: bank_summary.payments,
            closing: bank_summary.closing
          }
        ),
        /* @__PURE__ */ jsx(
          ExpenseCard,
          {
            href: route("accounting.ledger.expenses", { fy }),
            total: expense_summary.total,
            byCategory: expense_summary.by_category
          }
        )
      ] }),
      can_edit && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowOpeningForm((v) => !v),
            className: "flex w-full items-center justify-between px-5 py-3 text-left",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-700", children: "Set Opening Balance" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs", children: showOpeningForm ? "▲" : "▼" })
            ]
          }
        ),
        showOpeningForm && /* @__PURE__ */ jsxs("form", { onSubmit: submitOpeningBalance, className: "border-t px-5 py-4 flex flex-wrap items-end gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-600", children: "Ledger" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: obType,
                onChange: (e) => setObType(e.target.value),
                className: "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "cash", children: "Cash" }),
                  /* @__PURE__ */ jsx("option", { value: "bank", children: "Bank" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-600", children: "Financial Year" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: obYear,
                onChange: (e) => setObYear(e.target.value),
                className: "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
                children: all_years.map((y) => /* @__PURE__ */ jsx("option", { value: y, children: y }, y))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-600", children: "Opening Balance (₹)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                step: "0.01",
                min: "0",
                value: obAmt,
                onChange: (e) => setObAmt(e.target.value),
                className: "w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: saving,
              className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60",
              children: saving ? "Saving…" : "Save"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b px-5 py-3 flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800", children: "Member Ledger" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
              "up to FY ",
              fy
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5", children: [
              /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search member or firm…",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "w-48 bg-transparent text-sm outline-none placeholder-gray-400"
                }
              )
            ] })
          ] })
        ] }),
        outstanding.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "px-5 py-2 text-xs font-semibold uppercase tracking-wide text-red-500 bg-red-50", children: [
            "Outstanding (",
            outstanding.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "divide-y", children: outstanding.map((m) => /* @__PURE__ */ jsx(MemberRow, { m }, m.id)) })
        ] }),
        settled.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "px-5 py-2 text-xs font-semibold uppercase tracking-wide text-green-600 bg-green-50", children: [
            "Settled / Credit (",
            settled.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "divide-y", children: settled.map((m) => /* @__PURE__ */ jsx(MemberRow, { m }, m.id)) })
        ] }),
        members.length === 0 && /* @__PURE__ */ jsx("p", { className: "px-5 py-8 text-center text-sm text-gray-400", children: "No members found." })
      ] })
    ] })
  ] });
}
function ImportResultsBanner({ results }) {
  const sections = Object.entries(results);
  const totalErrors = sections.reduce((s, [, r]) => s + (r.errors ?? 0), 0);
  const totalSaved = sections.reduce((s, [, r]) => s + (r.imported ?? 0) + (r.upserted ?? 0) + (r.created ?? 0) + (r.updated ?? 0), 0);
  return /* @__PURE__ */ jsxs("div", { className: `rounded-lg border px-4 py-3 text-sm ${totalErrors > 0 ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}`, children: [
    /* @__PURE__ */ jsxs("p", { className: `font-semibold mb-2 ${totalErrors > 0 ? "text-yellow-800" : "text-green-800"}`, children: [
      "Import complete — ",
      totalSaved,
      " record",
      totalSaved !== 1 ? "s" : "",
      " saved",
      totalErrors > 0 && `, ${totalErrors} row${totalErrors !== 1 ? "s" : ""} skipped due to errors`
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: sections.map(([section, r]) => /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
        section,
        ":"
      ] }),
      " ",
      r.created != null && /* @__PURE__ */ jsxs(Fragment, { children: [
        r.created,
        " created, ",
        r.updated,
        " updated"
      ] }),
      r.imported != null && /* @__PURE__ */ jsxs(Fragment, { children: [
        r.imported,
        " imported, ",
        r.skipped,
        " skipped as duplicates"
      ] }),
      r.upserted != null && /* @__PURE__ */ jsxs(Fragment, { children: [
        r.upserted,
        " upserted"
      ] }),
      (r.errors ?? 0) > 0 && /* @__PURE__ */ jsxs("span", { className: "text-yellow-700", children: [
        ", ",
        r.errors,
        " error",
        r.errors !== 1 ? "s" : ""
      ] })
    ] }, section)) })
  ] });
}
function MemberRow({ m }) {
  const isOwed = m.outstanding > 0;
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: route("accounting.ledger.member", m.id),
      className: "flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-gray-800", children: m.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-0.5", children: [
            m.firm_name && /* @__PURE__ */ jsx("span", { className: "truncate text-xs text-gray-400", children: m.firm_name }),
            /* @__PURE__ */ jsx("span", { className: `flex-none text-xs font-medium ${m.role === "executive" ? "text-purple-600" : "text-blue-500"}`, children: m.role }),
            m.status === "non-active" && /* @__PURE__ */ jsx("span", { className: "flex-none text-xs text-gray-400", children: "(inactive)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-none text-right", children: [
          /* @__PURE__ */ jsxs("p", { className: `font-semibold ${isOwed ? "text-red-600" : "text-green-600"}`, children: [
            isOwed ? "−" : "+",
            "₹",
            Math.abs(m.outstanding).toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: isOwed ? "outstanding" : "credit / settled" })
        ] })
      ]
    }
  );
}
export {
  LedgerIndex as default
};
