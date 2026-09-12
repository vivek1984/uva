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
function RecordModal({ member, fy, structure, onClose }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    user_id: member.id,
    financial_year: fy,
    fee_type: "membership",
    amount: structure?.membership_fee ?? "",
    payment_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    payment_mode: "cash",
    cheque_number: "",
    notes: ""
  });
  function handleFeeType(v) {
    setData((prev) => ({
      ...prev,
      fee_type: v,
      amount: v === "membership" ? structure?.membership_fee ?? "" : structure?.joining_fee ?? ""
    }));
  }
  const availableFeeTypes = member.is_new_member ? ["membership", "joining"] : ["membership"];
  function submit(e) {
    e.preventDefault();
    post(route("accounting.fees.store"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0", onClick: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ jsxs("div", { className: "flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl", children: [
    /* @__PURE__ */ jsxs("h3", { className: "flex-none px-6 pt-6 text-lg font-bold text-gray-900", children: [
      "Record Payment — ",
      member.name
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex-1 space-y-3 overflow-y-auto px-6 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        availableFeeTypes.map((t) => /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2", children: [
          /* @__PURE__ */ jsx("input", { type: "radio", checked: data.fee_type === t, onChange: () => handleFeeType(t), className: "text-indigo-600" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm capitalize", children: [
            t,
            " Fee"
          ] })
        ] }, t)),
        !member.is_new_member && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 self-center", children: "(Joining fee not applicable — existing member)" })
      ] }),
      errors.fee_type && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: errors.fee_type }),
      /* @__PURE__ */ jsxs("div", { children: [
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
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          "Payment Date ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value: data.payment_date,
            onChange: (e) => setData("payment_date", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
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
      data.payment_mode === "cheque" && /* @__PURE__ */ jsxs("div", { children: [
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
      /* @__PURE__ */ jsxs("div", { children: [
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
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60", children: processing ? "Saving…" : "Record Payment" })
      ] })
    ] })
  ] }) });
}
function FeeStatus({ fees, label, can_edit, onDelete }) {
  if (fees.length === 0) {
    return /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: "—" });
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-1", children: fees.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700", children: [
      "₹",
      Number(f.amount).toLocaleString("en-IN"),
      " · ",
      f.payment_date
    ] }),
    can_edit && /* @__PURE__ */ jsx("button", { onClick: () => onDelete(f.id), className: "text-xs text-red-400 hover:text-red-600", title: "Delete", children: "✕" })
  ] }, f.id)) });
}
function Fees({ fy, current_fy, all_years, can_edit, structure, members }) {
  const { flash } = usePage().props;
  const [recordFor, setRecordFor] = useState(null);
  const [search, setSearch] = useState("");
  function changeFy(e) {
    router.get(route("accounting.fees.index"), { fy: e.target.value }, { preserveScroll: true });
  }
  function deleteFee(id) {
    if (!confirm("Delete this fee record?")) return;
    router.delete(route("accounting.fees.destroy", id), { preserveScroll: true });
  }
  const filtered = members.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || (m.firm_name ?? "").toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxs(AccountingLayout, { header: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Member Fees" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-500", children: "FY" }),
      /* @__PURE__ */ jsx("select", { value: fy, onChange: changeFy, className: "rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400", children: all_years.map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
        y,
        y === current_fy ? " (current)" : ""
      ] }, y)) })
    ] })
  ] }), children: [
    /* @__PURE__ */ jsx(Head, { title: "Member Fees" }),
    recordFor && /* @__PURE__ */ jsx(
      RecordModal,
      {
        member: recordFor,
        fy,
        structure,
        onClose: () => setRecordFor(null)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 py-6 space-y-4", children: [
      flash?.success && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700", children: flash.success }),
      !structure && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700", children: [
        "No fee structure set for ",
        fy,
        ". ",
        /* @__PURE__ */ jsx("a", { href: route("accounting.settings"), className: "font-semibold underline", children: "Set it here" }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search member or firm…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:w-64"
            }
          ),
          structure && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400", children: [
            "Membership: ₹",
            Number(structure.membership_fee).toLocaleString("en-IN"),
            " · Joining: ₹",
            Number(structure.joining_fee).toLocaleString("en-IN")
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Member" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Phone" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Membership Fee" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Joining Fee" }),
            can_edit && /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y", children: [
            filtered.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-5 py-8 text-center text-gray-400", children: "No members found." }) }),
            filtered.map((m) => /* @__PURE__ */ jsxs("tr", { className: m.status === "non-active" ? "opacity-50" : "", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800", children: m.name }),
                  m.is_new_member && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700", children: "New" })
                ] }),
                m.firm_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: m.firm_name }),
                /* @__PURE__ */ jsx("span", { className: `text-xs ${m.role === "executive" ? "text-purple-600" : "text-gray-400"}`, children: m.role })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600", children: m.phone }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(FeeStatus, { fees: m.membership_fees, label: "Membership", can_edit, onDelete: deleteFee }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: m.is_new_member ? /* @__PURE__ */ jsx(FeeStatus, { fees: m.joining_fees, label: "Joining", can_edit, onDelete: deleteFee }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-300", children: "N/A" }) }),
              can_edit && /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setRecordFor(m),
                  className: "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700",
                  children: "+ Record"
                }
              ) })
            ] }, m.id))
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Fees as default
};
