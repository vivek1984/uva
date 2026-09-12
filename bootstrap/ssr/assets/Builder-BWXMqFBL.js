import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
import { useForm, Head } from "@inertiajs/react";
import { useState, useRef } from "react";
import { c as compressImage } from "./compressImage-CFkZP8E5.js";
const QUESTION_TYPES = [
  { value: "short_text", label: "Short Answer", icon: "—" },
  { value: "paragraph", label: "Paragraph", icon: "¶" },
  { value: "multiple_choice", label: "Multiple Choice", icon: "◉" },
  { value: "checkboxes", label: "Checkboxes", icon: "☑" },
  { value: "dropdown", label: "Dropdown", icon: "▾" },
  { value: "date", label: "Date", icon: "📅" },
  { value: "number", label: "Number", icon: "#" }
];
const NEEDS_OPTIONS = ["multiple_choice", "checkboxes", "dropdown"];
let uid = 0;
function nextId() {
  return ++uid;
}
function newQuestion() {
  return { _key: nextId(), type: "short_text", label: "", is_required: false, options: ["Option 1"] };
}
function QuestionCard({ q, index, total, onChange, onDelete, onMove }) {
  const hasOptions = NEEDS_OPTIONS.includes(q.type);
  function setField(field, val) {
    onChange({ ...q, [field]: val });
  }
  function setOption(i, val) {
    const opts = [...q.options];
    opts[i] = val;
    setField("options", opts);
  }
  function addOption() {
    setField("options", [...q.options || [], `Option ${(q.options?.length || 0) + 1}`]);
  }
  function removeOption(i) {
    setField("options", q.options.filter((_, idx) => idx !== i));
  }
  const typeLabel = QUESTION_TYPES.find((t) => t.value === q.type)?.label ?? q.type;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-gray-100 px-4 py-3", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex-1 text-xs font-semibold uppercase tracking-wide text-gray-400", children: [
        "Q",
        index + 1,
        " · ",
        typeLabel
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: index === 0,
          onClick: () => onMove(index, -1),
          className: "rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30",
          title: "Move up",
          children: "▲"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: index === total - 1,
          onClick: () => onMove(index, 1),
          className: "rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30",
          title: "Move down",
          children: "▼"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onDelete,
          className: "rounded p-1 text-red-400 hover:bg-red-50",
          title: "Delete question",
          children: "✕"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-4", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Question text *",
          value: q.label,
          onChange: (e) => setField("label", e.target.value),
          className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500", children: "Question Type" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: q.type,
            onChange: (e) => setField("type", e.target.value),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
            children: QUESTION_TYPES.map((t) => /* @__PURE__ */ jsxs("option", { value: t.value, children: [
              t.icon,
              " ",
              t.label
            ] }, t.value))
          }
        )
      ] }),
      !hasOptions && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500", children: "Answer Preview" }),
        q.type === "paragraph" ? /* @__PURE__ */ jsx(
          "textarea",
          {
            disabled: true,
            placeholder: "Long answer text...",
            className: "w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400",
            rows: 3
          }
        ) : q.type === "date" ? /* @__PURE__ */ jsx("input", { type: "date", disabled: true, className: "rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400" }) : q.type === "number" ? /* @__PURE__ */ jsx("input", { type: "number", disabled: true, placeholder: "0", className: "w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400" }) : /* @__PURE__ */ jsx("input", { type: "text", disabled: true, placeholder: "Short answer...", className: "w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400" })
      ] }),
      hasOptions && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-2 block text-xs font-medium text-gray-500", children: "Options" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          (q.options || []).map((opt, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            q.type === "checkboxes" && /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "☐" }),
            q.type === "multiple_choice" && /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "○" }),
            q.type === "dropdown" && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
              i + 1,
              "."
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: opt,
                onChange: (e) => setOption(i, e.target.value),
                className: "flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                placeholder: `Option ${i + 1}`
              }
            ),
            q.options.length > 1 && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => removeOption(i),
                className: "rounded p-1 text-red-400 hover:bg-red-50",
                children: "✕"
              }
            )
          ] }, i)),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: addOption,
              className: "mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800",
              children: "+ Add option"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 border-t border-gray-100 pt-3", children: /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-sm text-gray-600", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => setField("is_required", !q.is_required),
            className: `relative h-5 w-9 rounded-full transition-colors ${q.is_required ? "bg-indigo-600" : "bg-gray-300"}`,
            children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${q.is_required ? "translate-x-4" : "translate-x-0.5"}` })
          }
        ),
        "Required"
      ] }) })
    ] })
  ] });
}
function Builder() {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    image: null,
    closes_at: "",
    questions: [newQuestion()]
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageCompressing, setImageCompressing] = useState(false);
  const imageRef = useRef(null);
  function addQuestion() {
    setData("questions", [...data.questions, newQuestion()]);
  }
  function updateQuestion(index, q) {
    const qs = [...data.questions];
    qs[index] = q;
    setData("questions", qs);
  }
  function deleteQuestion(index) {
    setData("questions", data.questions.filter((_, i) => i !== index));
  }
  function moveQuestion(index, dir) {
    const qs = [...data.questions];
    const target = index + dir;
    if (target < 0 || target >= qs.length) return;
    [qs[index], qs[target]] = [qs[target], qs[index]];
    setData("questions", qs);
  }
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageCompressing(true);
    const { file: ready } = await compressImage(file, 2 * 1024 * 1024);
    setImageCompressing(false);
    setData("image", ready);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(ready));
  }
  function removeImage() {
    setData("image", null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (imageRef.current) imageRef.current.value = "";
  }
  function submit(e) {
    e.preventDefault();
    post(route("questionnaires.store"));
  }
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Questionnaire" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl px-4 py-8 sm:px-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-6 text-2xl font-bold text-gray-900", children: "Create Questionnaire" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl border-l-4 border-indigo-500 bg-white p-5 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Questionnaire Title *",
                value: data.title,
                onChange: (e) => setData("title", e.target.value),
                className: "w-full border-b border-gray-300 pb-1 text-xl font-semibold text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
              }
            ),
            errors.title && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.title })
          ] }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "textarea",
            {
              placeholder: "Description (optional)",
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              rows: 2,
              className: "w-full resize-none border-b border-gray-200 pb-1 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500", children: "Close responses after (optional)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.closes_at,
                onChange: (e) => setData("closes_at", e.target.value),
                className: "rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs font-medium text-gray-500", children: "Image (optional — shown to respondents)" }),
            imageCompressing ? /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-4 text-sm text-gray-400", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500" }),
              "Compressing…"
            ] }) : imagePreview ? /* @__PURE__ */ jsxs("div", { className: "relative w-full overflow-hidden rounded-lg border border-gray-200", children: [
              /* @__PURE__ */ jsx("img", { src: imagePreview, alt: "Preview", className: "max-h-48 w-full object-contain bg-gray-50" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: removeImage,
                  className: "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600",
                  children: /* @__PURE__ */ jsx("svg", { className: "h-3 w-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                }
              )
            ] }) : /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => imageRef.current?.click(),
                className: "flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                  "Upload image"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: imageRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handleImageChange
              }
            ),
            errors.image && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.image })
          ] })
        ] }) }),
        data.questions.map((q, i) => /* @__PURE__ */ jsx(
          QuestionCard,
          {
            q,
            index: i,
            total: data.questions.length,
            onChange: (updated) => updateQuestion(i, updated),
            onDelete: () => deleteQuestion(i),
            onMove: (idx, dir) => moveQuestion(idx, dir)
          },
          q._key
        )),
        errors.questions && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.questions }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: addQuestion,
            className: "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 py-3 text-sm font-semibold text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
              "Add Question"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 border-t border-gray-100 pt-4", children: [
          /* @__PURE__ */ jsx("a", { href: route("questionnaires.index"), className: "text-sm text-gray-500 hover:text-gray-700", children: "Cancel" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60",
              children: processing ? "Creating…" : "Create Questionnaire"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  Builder as default
};
