import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { A as AccountingLayout } from "./AccountingLayout-D9weSSuH.js";
import "./AuthenticatedLayout-CO3HPgl3.js";
import "react";
function Access({ permitted, members }) {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    user_id: "",
    permission: "view"
  });
  function submit(e) {
    e.preventDefault();
    post(route("accounting.access.store"), {
      preserveScroll: true,
      onSuccess: reset
    });
  }
  function revoke(userId) {
    if (!confirm("Revoke this member's accounting access?")) return;
    router.delete(route("accounting.access.destroy", userId), { preserveScroll: true });
  }
  return /* @__PURE__ */ jsxs(AccountingLayout, { header: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Accounting Access Management" }), children: [
    /* @__PURE__ */ jsx(Head, { title: "Accounting Access" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-6 space-y-6", children: [
      flash?.success && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700", children: flash.success }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b px-5 py-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800", children: "Grant Access" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Only executive members can be granted access to the accounting module." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "px-5 py-4 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
              "Member ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: data.user_id,
                onChange: (e) => setData("user_id", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
                required: true,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "— Select member —" }),
                  members.map((m) => /* @__PURE__ */ jsxs("option", { value: m.id, children: [
                    m.name,
                    " (",
                    m.role,
                    ")"
                  ] }, m.id))
                ]
              }
            ),
            members.length === 0 && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-400", children: "All executive members already have accounting access." }),
            errors.user_id && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.user_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: [
              "Permission Level ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:gap-6", children: [
              /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-start gap-2", children: [
                /* @__PURE__ */ jsx("input", { type: "radio", value: "view", checked: data.permission === "view", onChange: () => setData("permission", "view"), className: "mt-1 text-indigo-600" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: "View Only" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Can see all accounting data but cannot add or edit." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-start gap-2", children: [
                /* @__PURE__ */ jsx("input", { type: "radio", value: "edit", checked: data.permission === "edit", onChange: () => setData("permission", "edit"), className: "mt-1 text-indigo-600" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: "Edit" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Can record fees, add expenses, and delete records." })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing || members.length === 0,
              className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60",
              children: processing ? "Granting…" : "Grant Access"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "border-b px-5 py-4", children: /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-800", children: [
          "Current Access",
          /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600", children: permitted.length })
        ] }) }),
        permitted.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-5 py-8 text-center text-sm text-gray-400", children: "No members have been granted accounting access yet." }) : /* @__PURE__ */ jsx("div", { className: "divide-y", children: permitted.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate font-medium text-gray-800", children: p.name }),
              /* @__PURE__ */ jsx("span", { className: `flex-none rounded-full px-2 py-0.5 text-xs font-medium ${p.role === "executive" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`, children: p.role }),
              /* @__PURE__ */ jsx("span", { className: `flex-none rounded-full px-2 py-0.5 text-xs font-semibold ${p.permission === "edit" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`, children: p.permission === "edit" ? "Edit" : "View Only" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-gray-400", children: [
              "Granted by ",
              p.granted_by,
              " on ",
              p.granted_at
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-none gap-3", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setData({ user_id: String(p.user_id), permission: p.permission === "edit" ? "view" : "edit" });
                },
                className: "text-xs font-medium text-indigo-600 hover:underline",
                children: [
                  "Change to ",
                  p.permission === "edit" ? "View" : "Edit"
                ]
              }
            ),
            /* @__PURE__ */ jsx("button", { onClick: () => revoke(p.user_id), className: "text-xs font-medium text-red-500 hover:underline", children: "Revoke" })
          ] })
        ] }, p.id)) })
      ] })
    ] })
  ] });
}
export {
  Access as default
};
