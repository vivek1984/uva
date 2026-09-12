import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { A as AccountingLayout } from "./AccountingLayout-D9weSSuH.js";
import "./AuthenticatedLayout-CO3HPgl3.js";
const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer / NEFT" },
  { value: "cheque", label: "Cheque" }
];
function ExpenseForm({ fy, categories, initial = {}, onSuccess, onCancel, submitLabel = "Add Expense" }) {
  const { data, setData, post, patch, processing, errors } = useForm({
    financial_year: fy,
    category: initial.category ?? "",
    custom_category: "",
    description: initial.description ?? "",
    amount: initial.amount ?? "",
    expense_date: initial.expense_date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    payment_mode: initial.payment_mode ?? "cash",
    cheque_number: initial.cheque_number ?? "",
    notes: initial.notes ?? ""
  });
  const isCustom = data.category === "__custom__";
  const finalCategory = isCustom ? data.custom_category : data.category;
  function submit(e) {
    e.preventDefault();
    const payload = { ...data, category: finalCategory };
    const opts = { preserveScroll: true, onSuccess };
    if (initial.id) {
      router.patch(route("accounting.expenses.update", initial.id), payload, opts);
    } else {
      router.post(route("accounting.expenses.store"), payload, opts);
    }
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          "Category ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: data.category,
            onChange: (e) => setData("category", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
            required: true,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "— Select —" }),
              categories.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)),
              /* @__PURE__ */ jsx("option", { value: "__custom__", children: "Other / Custom…" })
            ]
          }
        ),
        isCustom && /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Type category name",
            value: data.custom_category,
            onChange: (e) => setData("custom_category", e.target.value),
            className: "mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
            required: true
          }
        ),
        errors.category && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.category })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          "Amount (₹) ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            min: "0.01",
            value: data.amount,
            onChange: (e) => setData("amount", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
            required: true
          }
        ),
        errors.amount && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.amount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          "Description ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          "Date ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value: data.expense_date,
            onChange: (e) => setData("expense_date", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          "Payment Mode ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: data.payment_mode,
            onChange: (e) => setData("payment_mode", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
            children: PAYMENT_MODES.map((m) => /* @__PURE__ */ jsx("option", { value: m.value, children: m.label }, m.value))
          }
        )
      ] }),
      data.payment_mode === "cheque" && /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "Cheque Number" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.cheque_number,
            onChange: (e) => setData("cheque_number", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "Notes" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: 2,
            value: data.notes,
            onChange: (e) => setData("notes", e.target.value),
            className: "w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-1", children: [
      onCancel && /* @__PURE__ */ jsx("button", { type: "button", onClick: onCancel, className: "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60", children: processing ? "Saving…" : submitLabel })
    ] })
  ] });
}
function Expenses({ fy, current_fy, all_years, can_edit, categories, active_category, expenses, total }) {
  const { flash } = usePage().props;
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  function changeFy(e) {
    router.get(route("accounting.expenses.index"), { fy: e.target.value }, { preserveScroll: true });
  }
  function filterCategory(cat) {
    router.get(route("accounting.expenses.index"), { fy, category: cat || void 0 }, { preserveScroll: true });
  }
  function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;
    router.delete(route("accounting.expenses.destroy", id), { preserveScroll: true });
  }
  const modeLabel = (v) => PAYMENT_MODES.find((m) => m.value === v)?.label ?? v;
  return /* @__PURE__ */ jsxs(AccountingLayout, { header: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Expenses" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-500", children: "FY" }),
      /* @__PURE__ */ jsx("select", { value: fy, onChange: changeFy, className: "rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400", children: all_years.map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
        y,
        y === current_fy ? " (current)" : ""
      ] }, y)) })
    ] })
  ] }), children: [
    /* @__PURE__ */ jsx(Head, { title: "Expenses" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 py-6 space-y-4", children: [
      flash?.success && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700", children: flash.success }),
      can_edit && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setShowAdd((v) => !v), className: "flex w-full items-center justify-between px-5 py-4 text-left", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-800", children: "+ Add Expense" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: showAdd ? "▲" : "▼" })
        ] }),
        showAdd && /* @__PURE__ */ jsx("div", { className: "border-t px-5 py-4", children: /* @__PURE__ */ jsx(ExpenseForm, { fy, categories, onSuccess: () => setShowAdd(false), submitLabel: "Add Expense" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => filterCategory(null),
            className: `rounded-full px-3 py-1 text-xs font-medium border ${!active_category ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`,
            children: "All"
          }
        ),
        categories.map((c) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => filterCategory(c),
            className: `rounded-full px-3 py-1 text-xs font-medium border ${active_category === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`,
            children: c
          },
          c
        ))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-white shadow-sm overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Description" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Amount" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Mode" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Recorded By" }),
          can_edit && /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y", children: [
          expenses.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-gray-400", children: "No expenses recorded for this period." }) }),
          expenses.map((e) => /* @__PURE__ */ jsxs("tr", { className: editing?.id === e.id ? "bg-indigo-50" : "", children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-600 whitespace-nowrap", children: e.expense_date }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700", children: e.category }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-800", children: e.description }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right font-semibold text-red-600", children: [
              "₹",
              Number(e.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-500 whitespace-nowrap", children: modeLabel(e.payment_mode) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-400", children: e.recorded_by }),
            can_edit && /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right whitespace-nowrap", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setEditing(editing?.id === e.id ? null : e),
                  className: "mr-2 text-xs font-medium text-indigo-600 hover:underline",
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => deleteExpense(e.id),
                  className: "text-xs font-medium text-red-500 hover:underline",
                  children: "Delete"
                }
              )
            ] })
          ] }, e.id))
        ] }),
        expenses.length > 0 && /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { colSpan: 3, className: "px-5 py-3 text-sm font-semibold text-gray-700", children: "Total" }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right font-bold text-red-700", children: [
            "₹",
            Number(total).toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsx("td", { colSpan: can_edit ? 3 : 2 })
        ] }) })
      ] }) }),
      editing && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-indigo-50 shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "border-b border-indigo-100 px-5 py-3", children: /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-800", children: [
          "Editing: ",
          editing.description
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "px-5 py-4", children: /* @__PURE__ */ jsx(
          ExpenseForm,
          {
            fy,
            categories,
            initial: editing,
            onSuccess: () => setEditing(null),
            onCancel: () => setEditing(null),
            submitLabel: "Save Changes"
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  Expenses as default
};
