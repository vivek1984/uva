import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
import { R as RequirementsBoard, M as MemberProfileForm } from "./RequirementsBoard-CArumgbW.js";
import { usePage, Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import "./compressImage-CFkZP8E5.js";
function SuggestionModal({ onClose }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    description: ""
  });
  const { flash } = usePage().props;
  useEffect(() => {
    if (flash?.success) onClose();
  }, [flash?.success]);
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  function submit(e) {
    e.preventDefault();
    post(route("member.suggestions.store"), { onSuccess: () => reset() });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center",
      onClick: handleBackdrop,
      children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg rounded-2xl bg-white shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 px-6 py-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Submit Suggestion" }),
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 px-6 py-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Title" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.title,
                onChange: (e) => setData("title", e.target.value),
                placeholder: "Brief title of your suggestion",
                className: "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                autoFocus: true
              }
            ),
            errors.title && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Description" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: data.description,
                onChange: (e) => setData("description", e.target.value),
                placeholder: "Describe your suggestion in detail…",
                rows: 5,
                className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              }
            ),
            errors.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "flex-1 h-12 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 transition hover:bg-gray-50",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "flex-1 h-12 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60",
                children: processing ? "Submitting…" : "Submit Suggestion"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function MemberDashboard({ profile, auth, requirements }) {
  const [showModal, setShowModal] = useState(false);
  const { flash } = usePage().props;
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800", children: "My Dashboard" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "UVA Vyapari Welfare Association — General Member" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700", children: "General Member" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Member Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-md", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold", children: [
              "Welcome, ",
              auth.user.name,
              "!"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-blue-100", children: "Manage your member profile and showcase your business products below." }),
            profile ? /* @__PURE__ */ jsx("span", { className: "mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium", children: "✓ Profile complete" }) : /* @__PURE__ */ jsx("span", { className: "mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium", children: "⚠ Profile not filled in yet" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowModal(true),
              className: "mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 px-6 py-4 text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100 active:scale-[0.99]",
              children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", children: "Submit Suggestion to Association" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-500", children: "Share your ideas or feedback with the executive committee" })
                ] })
              ]
            }
          ),
          flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-200", children: flash.success }),
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-base font-bold text-gray-800", children: "Customer Requirements" }),
            /* @__PURE__ */ jsx(RequirementsBoard, { requirements })
          ] }),
          /* @__PURE__ */ jsx(MemberProfileForm, { profile, userName: auth.user.name })
        ] }) }),
        showModal && /* @__PURE__ */ jsx(SuggestionModal, { onClose: () => setShowModal(false) })
      ]
    }
  );
}
export {
  MemberDashboard as default
};
