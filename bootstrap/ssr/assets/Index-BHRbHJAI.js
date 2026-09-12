import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
import { Head, Link, router } from "@inertiajs/react";
import "react";
function StatusBadge({ isActive, closesAt }) {
  const closed = closesAt && new Date(closesAt) < /* @__PURE__ */ new Date();
  if (closed) return /* @__PURE__ */ jsx("span", { className: "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600", children: "Closed (expired)" });
  if (!isActive) return /* @__PURE__ */ jsx("span", { className: "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700", children: "Inactive" });
  return /* @__PURE__ */ jsx("span", { className: "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700", children: "Active" });
}
function Index({ questionnaires }) {
  function copyLink(url) {
    navigator.clipboard.writeText(url);
  }
  function shareWhatsApp(q) {
    const text = encodeURIComponent(`Please fill out this form for UVA Vyapari Welfare Association:
*${q.title}*
${q.fill_url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }
  function toggle(q) {
    router.patch(route("questionnaires.toggle", q.id));
  }
  function destroy(q) {
    if (confirm(`Delete "${q.title}"? This will remove all responses too.`)) {
      router.delete(route("questionnaires.destroy", q.id));
    }
  }
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Questionnaires" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Questionnaires" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Create and manage member surveys" })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("questionnaires.create"),
            className: "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
              "New Questionnaire"
            ]
          }
        )
      ] }),
      questionnaires.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-2 border-dashed border-gray-200 py-16 text-center", children: [
        /* @__PURE__ */ jsx("svg", { className: "mx-auto h-12 w-12 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-500", children: "No questionnaires yet. Create your first one!" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("questionnaires.create"),
            className: "mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700",
            children: "Create Questionnaire"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: questionnaires.map((q) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-gray-900", children: q.title }),
            /* @__PURE__ */ jsx(StatusBadge, { isActive: q.is_active, closesAt: q.closes_at })
          ] }),
          q.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500 line-clamp-2", children: q.description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              q.responses_count,
              " response",
              q.responses_count !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "by ",
              q.created_by
            ] }),
            /* @__PURE__ */ jsx("span", { children: "·" }),
            /* @__PURE__ */ jsx("span", { children: q.created_at }),
            q.closes_at && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Closes ",
                q.closes_at
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("questionnaires.show", q.slug),
              className: "rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100",
              children: "View Results"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => copyLink(q.fill_url),
              className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50",
              title: "Copy form link",
              children: "Copy Link"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => shareWhatsApp(q),
              className: "rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100",
              children: "WhatsApp"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggle(q),
              className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50",
              children: q.is_active ? "Deactivate" : "Activate"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => destroy(q),
              className: "rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100",
              children: "Delete"
            }
          )
        ] })
      ] }) }, q.id)) })
    ] })
  ] });
}
export {
  Index as default
};
