import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, useForm, Head } from "@inertiajs/react";
import { A as AccountingLayout } from "./AccountingLayout-D9weSSuH.js";
import "./AuthenticatedLayout-CO3HPgl3.js";
import "react";
function Settings({ structures, current_fy }) {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    financial_year: current_fy,
    membership_fee: "",
    joining_fee: ""
  });
  function submit(e) {
    e.preventDefault();
    post(route("accounting.settings.save"), {
      preserveScroll: true,
      onSuccess: reset
    });
  }
  return /* @__PURE__ */ jsxs(AccountingLayout, { header: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Fee Structure Settings" }), children: [
    /* @__PURE__ */ jsx(Head, { title: "Fee Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl px-4 py-6 space-y-6", children: [
      flash?.success && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700", children: flash.success }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b px-5 py-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800", children: "Set Fee Amounts for a Financial Year" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Financial year runs April–March (e.g. 2025-26). Saving overwrites existing amounts for that year." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "px-5 py-4 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
              "Financial Year ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.financial_year,
                onChange: (e) => setData("financial_year", e.target.value),
                placeholder: "e.g. 2025-26",
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:w-40",
                required: true
              }
            ),
            errors.financial_year && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.financial_year })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
                "Membership Fee (₹/year) ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  min: "0",
                  value: data.membership_fee,
                  onChange: (e) => setData("membership_fee", e.target.value),
                  className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
                  required: true
                }
              ),
              errors.membership_fee && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.membership_fee })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
                "Joining Fee (one-time, ₹) ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  min: "0",
                  value: data.joining_fee,
                  onChange: (e) => setData("joining_fee", e.target.value),
                  className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
                  required: true
                }
              ),
              errors.joining_fee && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.joining_fee })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60",
              children: processing ? "Saving…" : "Save Fee Structure"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "border-b px-5 py-4", children: /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800", children: "Saved Fee Structures" }) }),
        structures.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-5 py-8 text-center text-sm text-gray-400", children: "No fee structures saved yet." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-left", children: "Financial Year" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Membership Fee" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Joining Fee" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Set By" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y", children: structures.map((s) => /* @__PURE__ */ jsxs("tr", { className: s.financial_year === current_fy ? "bg-indigo-50" : "", children: [
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-3 font-semibold text-gray-800", children: [
              s.financial_year,
              s.financial_year === current_fy && /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700", children: "Current" })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right font-medium text-gray-700", children: [
              "₹",
              Number(s.membership_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right font-medium text-gray-700", children: [
              "₹",
              Number(s.joining_fee).toLocaleString("en-IN", { minimumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-400", children: s.created_by })
          ] }, s.id)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Settings as default
};
