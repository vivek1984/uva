import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { usePage, useForm, Head } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
function PhoneStatusBadge({ status }) {
  if (status === "loading") {
    return /* @__PURE__ */ jsxs("p", { className: "mt-1.5 flex items-center gap-1.5 text-xs text-gray-400", children: [
      /* @__PURE__ */ jsx("span", { className: "inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500" }),
      " Checking…"
    ] });
  }
  if (status === "not_registered") {
    return /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs font-medium text-red-600", children: "Please enter the phone number used for registration." });
  }
  if (status === "not_active") {
    return /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs font-medium text-red-600", children: "Your membership is currently inactive. Please contact the association." });
  }
  if (status === "has_previous") {
    return /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs font-medium text-amber-600", children: "Previous response found — your answers have been pre-filled. You may edit and re-submit." });
  }
  if (status === "valid") {
    return /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs font-medium text-green-600", children: "Registered member verified." });
  }
  return null;
}
function SuccessModal({ message, onEdit, onClose }) {
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
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm",
      onClick: handleBackdrop,
      children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl text-center", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: "mb-1 text-lg font-bold text-gray-900", children: "Response Submitted!" }),
        /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-gray-500", children: message }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onEdit,
              className: "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }),
                "Edit My Response"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              className: "w-full rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50",
              children: "Done"
            }
          )
        ] })
      ] })
    }
  );
}
function Fill({ questionnaire, prefill }) {
  const { flash } = usePage().props;
  const initialAnswers = Object.fromEntries(
    (questionnaire.questions || []).map((q) => [q.id, q.type === "checkboxes" ? [] : ""])
  );
  const { data, setData, post, processing, errors } = useForm({
    respondent_name: prefill?.name ?? "",
    respondent_phone: prefill?.phone ?? "",
    answers: initialAnswers
  });
  const [phoneStatus, setPhoneStatus] = useState("idle");
  const [modalOpen, setModalOpen] = useState(!!flash?.success);
  const [showEditForm, setShowEditForm] = useState(false);
  const debounceRef = useRef(null);
  useEffect(() => {
    if (flash?.success) {
      setModalOpen(true);
      setShowEditForm(false);
    }
  }, [flash?.success]);
  useEffect(() => {
    if (prefill?.phone) {
      doLookup(prefill.phone);
    }
  }, []);
  function handleEditClick() {
    setModalOpen(false);
    setShowEditForm(true);
    if (prefill?.phone) {
      doLookup(prefill.phone);
    }
  }
  async function doLookup(phone) {
    setPhoneStatus("loading");
    try {
      const res = await fetch(
        `/q/${questionnaire.slug}/prefill?phone=${encodeURIComponent(phone)}`,
        { headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" } }
      );
      const json = await res.json();
      if (res.status === 422) {
        setPhoneStatus("not_registered");
        return;
      }
      if (res.status === 403) {
        setPhoneStatus("not_active");
        return;
      }
      const newAnswers = { ...initialAnswers };
      if (json.previous_response?.answers) {
        Object.entries(json.previous_response.answers).forEach(([qId, val]) => {
          newAnswers[Number(qId)] = val;
        });
      }
      setData({
        respondent_name: json.user?.name ?? data.respondent_name,
        respondent_phone: phone,
        answers: newAnswers
      });
      setPhoneStatus(json.previous_response ? "has_previous" : "valid");
    } catch {
      setPhoneStatus("idle");
    }
  }
  function handlePhoneChange(phone) {
    setData("respondent_phone", phone);
    setPhoneStatus("idle");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (phone.replace(/\D/g, "").length >= 10) {
      debounceRef.current = setTimeout(() => doLookup(phone), 600);
    }
  }
  function setAnswer(qId, val) {
    setData("answers", { ...data.answers, [qId]: val });
  }
  function toggleCheckbox(qId, opt) {
    const current = Array.isArray(data.answers[qId]) ? data.answers[qId] : [];
    const updated = current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt];
    setAnswer(qId, updated);
  }
  function submit(e) {
    e.preventDefault();
    post(route("questionnaire.respond", questionnaire.slug));
  }
  const closed = !questionnaire.is_active;
  const canSubmit = phoneStatus === "valid" || phoneStatus === "has_previous";
  const showForm = !closed && (!flash?.success || showEditForm);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: questionnaire.title }),
    flash?.success && modalOpen && /* @__PURE__ */ jsx(
      SuccessModal,
      {
        message: flash.success,
        onEdit: handleEditClick,
        onClose: () => setModalOpen(false)
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-100 px-4 py-10 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsx("img", { src: "/storage/logo.jpg", alt: "UVA", className: "h-10 w-auto object-contain" }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-indigo-700", children: "UVA Vyapari Welfare Association" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-5 rounded-xl border-l-4 border-indigo-500 bg-white shadow-sm overflow-hidden", children: [
        questionnaire.image_url && /* @__PURE__ */ jsx("img", { src: questionnaire.image_url, alt: "", className: "w-full max-h-64 object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900", children: questionnaire.title }),
          questionnaire.description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: questionnaire.description }),
          closed && /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700", children: "This form is no longer accepting responses." })
        ] })
      ] }),
      showForm && /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400", children: "Your Details" }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
              "Phone Number ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" }),
              /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs font-normal text-gray-400", children: "(used for registration)" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: data.respondent_phone,
                onChange: (e) => handlePhoneChange(e.target.value),
                className: `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${phoneStatus === "not_registered" || phoneStatus === "not_active" || errors.respondent_phone ? "border-red-400 focus:border-red-500 focus:ring-red-400" : phoneStatus === "valid" || phoneStatus === "has_previous" ? "border-green-400 focus:border-green-500 focus:ring-green-400" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`,
                placeholder: "Enter your registered phone number",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(PhoneStatusBadge, { status: phoneStatus }),
            errors.respondent_phone && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs font-medium text-red-600", children: errors.respondent_phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
              "Full Name ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.respondent_name,
                onChange: (e) => setData("respondent_name", e.target.value),
                className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                required: true
              }
            ),
            errors.respondent_name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.respondent_name })
          ] })
        ] }),
        !canSubmit && phoneStatus !== "loading" && /* @__PURE__ */ jsx("div", { className: "rounded-xl border-2 border-dashed border-gray-200 py-6 text-center text-sm text-gray-400", children: "Enter your registered phone number above to load the form." }),
        canSubmit && questionnaire.questions.map((q, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxs("label", { className: "mb-3 block text-sm font-medium text-gray-900", children: [
            i + 1,
            ". ",
            q.label,
            q.is_required && /* @__PURE__ */ jsx("span", { className: "ml-1 text-red-500", children: "*" })
          ] }),
          q.type === "short_text" && /* @__PURE__ */ jsx("input", { type: "text", value: data.answers[q.id] || "", onChange: (e) => setAnswer(q.id, e.target.value), required: q.is_required, placeholder: "Your answer", className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" }),
          q.type === "paragraph" && /* @__PURE__ */ jsx("textarea", { value: data.answers[q.id] || "", onChange: (e) => setAnswer(q.id, e.target.value), required: q.is_required, rows: 4, placeholder: "Your answer", className: "w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" }),
          q.type === "number" && /* @__PURE__ */ jsx("input", { type: "number", value: data.answers[q.id] || "", onChange: (e) => setAnswer(q.id, e.target.value), required: q.is_required, className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" }),
          q.type === "date" && /* @__PURE__ */ jsx("input", { type: "date", value: data.answers[q.id] || "", onChange: (e) => setAnswer(q.id, e.target.value), required: q.is_required, className: "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" }),
          q.type === "multiple_choice" && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: (q.options || []).map((opt) => /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-3", children: [
            /* @__PURE__ */ jsx("input", { type: "radio", name: `q_${q.id}`, value: opt, checked: data.answers[q.id] === opt, onChange: () => setAnswer(q.id, opt), required: q.is_required, className: "h-4 w-4 text-indigo-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: opt })
          ] }, opt)) }),
          q.type === "checkboxes" && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: (q.options || []).map((opt) => /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-3", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: Array.isArray(data.answers[q.id]) && data.answers[q.id].includes(opt), onChange: () => toggleCheckbox(q.id, opt), className: "h-4 w-4 rounded text-indigo-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: opt })
          ] }, opt)) }),
          q.type === "dropdown" && /* @__PURE__ */ jsxs("select", { value: data.answers[q.id] || "", onChange: (e) => setAnswer(q.id, e.target.value), required: q.is_required, className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "— Select —" }),
            (q.options || []).map((opt) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, opt))
          ] })
        ] }, q.id)),
        errors.form && /* @__PURE__ */ jsx("p", { className: "rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600", children: errors.form }),
        canSubmit && /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-60", children: processing ? "Submitting…" : phoneStatus === "has_previous" ? "Update My Response" : "Submit Response" })
      ] })
    ] }) })
  ] });
}
export {
  Fill as default
};
