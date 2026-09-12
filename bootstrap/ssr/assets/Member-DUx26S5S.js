import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { A as AccountingLayout } from "./AccountingLayout-D9weSSuH.js";
import "./AuthenticatedLayout-CO3HPgl3.js";
const MODE_LABELS = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque"
};
function BalancePill({ amount }) {
  if (amount === 0) return /* @__PURE__ */ jsx("span", { className: "rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700", children: "Settled" });
  if (amount > 0) return /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700", children: [
    "Due ₹",
    amount.toLocaleString("en-IN")
  ] });
  return /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700", children: [
    "Credit ₹",
    Math.abs(amount).toLocaleString("en-IN")
  ] });
}
function MemberSearch({ members, currentId }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = members.find((m) => m.id === currentId);
  const filtered = query.trim() === "" ? members : members.filter((m) => {
    const q = query.toLowerCase();
    return m.name.toLowerCase().includes(q) || (m.firm_name ?? "").toLowerCase().includes(q);
  });
  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  function select(id) {
    setOpen(false);
    setQuery("");
    router.get(route("accounting.ledger.member", id));
  }
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative w-72", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 cursor-text focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400",
        onClick: () => setOpen(true),
        children: [
          /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 shrink-0 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: open ? query : current ? current.name + (current.firm_name ? ` — ${current.firm_name}` : "") : "",
              onChange: (e) => {
                setQuery(e.target.value);
                setOpen(true);
              },
              onFocus: () => setOpen(true),
              placeholder: "Search member or firm…",
              className: "flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg", children: filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-4 py-3 text-sm text-gray-400", children: "No members found." }) : filtered.map((m) => /* @__PURE__ */ jsxs(
      "button",
      {
        onMouseDown: () => select(m.id),
        className: `flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-indigo-50 transition-colors ${m.id === currentId ? "bg-indigo-50 font-semibold" : ""}`,
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800", children: m.name }),
            m.firm_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: m.firm_name })
          ] }),
          /* @__PURE__ */ jsx("span", { className: `ml-3 shrink-0 text-xs ${m.role === "executive" ? "text-purple-500" : "text-blue-400"}`, children: m.role })
        ]
      },
      m.id
    )) })
  ] });
}
function MemberLedger({ member, ledger, members, current_fy, can_edit, member_opening_balance }) {
  const { flash } = usePage().props;
  const [expanded, setExpanded] = useState(null);
  const [showObForm, setShowObForm] = useState(false);
  const [obAmt, setObAmt] = useState(String(member_opening_balance ?? 0));
  const [saving, setSaving] = useState(false);
  function submitOpeningBalance(e) {
    e.preventDefault();
    setSaving(true);
    router.post(route("accounting.ledger.member.opening-balance", member.id), {
      opening_balance: obAmt
    }, {
      preserveScroll: true,
      onFinish: () => {
        setSaving(false);
        setShowObForm(false);
      }
    });
  }
  const totalDue = ledger.reduce((s, r) => s + r.membership_due, 0);
  const totalPaid = ledger.reduce((s, r) => s + r.membership_paid + r.joining_paid, 0);
  const finalBalance = ledger.length > 0 ? ledger[ledger.length - 1].closing_balance : 0;
  return /* @__PURE__ */ jsxs(AccountingLayout, { header: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("accounting.ledger.index"),
          className: "flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
            "Ledgers"
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "/" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Member Ledger" })
    ] }),
    /* @__PURE__ */ jsx(MemberSearch, { members, currentId: member.id })
  ] }), children: [
    /* @__PURE__ */ jsx(Head, { title: `Ledger — ${member.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-4 py-6 space-y-4", children: [
      flash?.success && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700", children: flash.success }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white p-5 shadow-sm flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: member.name }),
          member.firm_name && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: member.firm_name }),
          member.phone && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: member.phone }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-xs font-semibold ${member.role === "executive" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-600"}`, children: member.role }),
            /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-xs font-semibold ${member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`, children: member.status })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mb-1", children: "Total Outstanding" }),
          /* @__PURE__ */ jsxs("p", { className: `text-2xl font-bold ${finalBalance > 0 ? "text-red-600" : finalBalance < 0 ? "text-blue-600" : "text-green-600"}`, children: [
            finalBalance > 0 ? "−" : finalBalance < 0 ? "+" : "",
            "₹",
            Math.abs(finalBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: finalBalance > 0 ? "dues pending" : finalBalance < 0 ? "credit balance" : "fully settled" })
        ] })
      ] }),
      can_edit && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setShowObForm((v) => !v);
              setObAmt(String(member_opening_balance ?? 0));
            },
            className: "flex w-full items-center justify-between px-5 py-3 text-left",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-700", children: "Set Opening Balance" }),
                member_opening_balance !== 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs text-indigo-600", children: [
                  "Current: ₹",
                  Math.abs(member_opening_balance).toLocaleString("en-IN", { minimumFractionDigits: 2 }),
                  member_opening_balance > 0 ? " (due)" : " (credit)"
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs", children: showObForm ? "▲" : "▼" })
            ]
          }
        ),
        showObForm && /* @__PURE__ */ jsxs("form", { onSubmit: submitOpeningBalance, className: "border-t px-5 py-4 flex flex-wrap items-end gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-600", children: "Opening Balance (₹) — positive = dues owed, negative = credit" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                step: "0.01",
                value: obAmt,
                onChange: (e) => setObAmt(e.target.value),
                className: "w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
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
      ledger.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-white p-8 text-center text-sm text-gray-400 shadow-sm", children: "No fee records found for this member." }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-white shadow-sm overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Financial Year" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Opening Balance" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Membership Due" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Amount Paid" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Closing Balance" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center w-20", children: "Details" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y", children: ledger.map((row) => {
          const isOpen = expanded === row.financial_year;
          const totalRowPaid = row.membership_paid + row.joining_paid;
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              "tr",
              {
                className: `${row.financial_year === current_fy ? "bg-indigo-50" : ""} hover:bg-gray-50 cursor-pointer`,
                onClick: () => setExpanded(isOpen ? null : row.financial_year),
                children: [
                  /* @__PURE__ */ jsxs("td", { className: "px-5 py-3 font-semibold text-gray-800", children: [
                    row.financial_year,
                    row.financial_year === current_fy && /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700", children: "Current" })
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right text-gray-500", children: row.opening_balance !== 0 ? /* @__PURE__ */ jsxs("span", { className: row.opening_balance > 0 ? "text-red-500" : "text-blue-500", children: [
                    "₹",
                    Math.abs(row.opening_balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "—" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-medium text-gray-700", children: row.membership_due > 0 ? `₹${row.membership_due.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "—" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: totalRowPaid > 0 ? /* @__PURE__ */ jsxs("span", { className: "font-medium text-green-700", children: [
                    "₹",
                    totalRowPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
                    row.joining_paid > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs text-purple-500", children: "+joining" })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-red-400 text-xs", children: "Unpaid" }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx(BalancePill, { amount: row.closing_balance }) }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center text-gray-400 text-xs", children: row.payments.length > 0 ? /* @__PURE__ */ jsx("span", { className: "text-indigo-500 underline", children: isOpen ? "Hide" : `${row.payments.length} payment${row.payments.length > 1 ? "s" : ""}` }) : "—" })
                ]
              },
              row.financial_year
            ),
            isOpen && row.payments.map((p, pi) => /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsx("td", { className: "pl-10 pr-4 py-2 text-gray-400", children: p.payment_date }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-2", colSpan: 2, children: [
                /* @__PURE__ */ jsx("span", { className: `rounded-full px-1.5 py-0.5 font-medium ${p.fee_type === "joining" ? "bg-purple-100 text-purple-700" : "bg-indigo-100 text-indigo-700"}`, children: p.fee_type === "joining" ? "Joining fee" : "Membership fee" }),
                /* @__PURE__ */ jsx("span", { className: "ml-2", children: MODE_LABELS[p.payment_mode] ?? p.payment_mode }),
                p.notes && /* @__PURE__ */ jsx("span", { className: "ml-2 italic text-gray-400", children: p.notes })
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 text-right font-semibold text-green-700", children: [
                "₹",
                p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2", colSpan: 2, children: /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
                "by ",
                p.recorded_by
              ] }) })
            ] }, pi))
          ] });
        }) }),
        /* @__PURE__ */ jsx("tfoot", { className: "bg-gray-100 text-sm font-semibold", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-gray-700", children: "Total" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3" }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right text-gray-700", children: [
            "₹",
            totalDue.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right text-green-700", children: [
            "₹",
            totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx(BalancePill, { amount: finalBalance }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3" })
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  MemberLedger as default
};
