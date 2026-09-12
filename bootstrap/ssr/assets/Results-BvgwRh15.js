import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
import { Head, router } from "@inertiajs/react";
import { useState, useMemo, useRef } from "react";
const TYPE_LABELS = {
  short_text: "Short Answer",
  paragraph: "Paragraph",
  multiple_choice: "Multiple Choice",
  checkboxes: "Checkboxes",
  dropdown: "Dropdown",
  date: "Date",
  number: "Number"
};
function parseAnswer(answer) {
  if (!answer) return [];
  try {
    return JSON.parse(answer);
  } catch {
    return [answer];
  }
}
function AmountCell({ response, questionnaire }) {
  const [value, setValue] = useState(response.amount ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const lastSaved = useRef(response.amount ?? "");
  async function save() {
    const next = value === "" ? null : Number(value);
    if (String(next) === String(lastSaved.current)) return;
    setSaving(true);
    setError(false);
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.content ?? "";
      const res = await fetch(
        route("questionnaires.responses.amount", { questionnaire: questionnaire.id, response: response.id }),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf, "Accept": "application/json" },
          body: JSON.stringify({ amount: next })
        }
      );
      if (!res.ok) throw new Error();
      lastSaved.current = next;
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2e3);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "₹" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "number",
        min: "0",
        value,
        onChange: (e) => setValue(e.target.value),
        onBlur: save,
        onKeyDown: (e) => e.key === "Enter" && e.target.blur(),
        placeholder: "—",
        className: "w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
      }
    ),
    saving && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "saving…" }),
    saved && /* @__PURE__ */ jsx("span", { className: "text-xs text-green-600", children: "✓" }),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: "failed" })
  ] });
}
function QuestionSummary({ question, responses }) {
  const answers = responses.map((r) => r.answers[question.id]).filter((a) => a !== void 0 && a !== null && a !== "");
  const isChoice = ["multiple_choice", "checkboxes", "dropdown"].includes(question.type);
  const counts = useMemo(() => {
    if (!isChoice) return {};
    const tally = {};
    answers.forEach((raw) => {
      parseAnswer(raw).forEach((val) => {
        tally[val] = (tally[val] || 0) + 1;
      });
    });
    return tally;
  }, [answers]);
  const maxCount = Math.max(...Object.values(counts), 1);
  const totalVotes = Object.values(counts).reduce((s, v) => s + v, 0);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-3 flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: question.label }),
      /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-gray-400", children: [
        TYPE_LABELS[question.type],
        " · ",
        answers.length,
        " response",
        answers.length !== 1 ? "s" : ""
      ] })
    ] }) }),
    answers.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm italic text-gray-400", children: "No responses yet" }) : isChoice ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: (question.options || []).map((opt) => {
      const count = counts[opt] || 0;
      const pct = totalVotes > 0 ? Math.round(count / totalVotes * 100) : 0;
      return /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-1 flex justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: opt }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-gray-900", children: [
            count,
            " (",
            pct,
            "%)"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-2 w-full rounded-full bg-gray-100", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-2 rounded-full bg-indigo-500 transition-all",
            style: { width: `${count / maxCount * 100}%` }
          }
        ) })
      ] }, opt);
    }) }) : /* @__PURE__ */ jsx("ul", { className: "max-h-40 space-y-1 overflow-y-auto text-sm text-gray-700", children: answers.map((a, i) => /* @__PURE__ */ jsx("li", { className: "border-b border-gray-50 py-0.5 last:border-0", children: a }, i)) })
  ] });
}
function Results({ questionnaire, responses, fill_url }) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("summary");
  function copyLink() {
    navigator.clipboard.writeText(fill_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }
  function shareWhatsApp() {
    const text = encodeURIComponent(`Please fill out this form for UVA Vyapari Welfare Association:
*${questionnaire.title}*
${fill_url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }
  function toggle() {
    router.patch(route("questionnaires.toggle", questionnaire.id));
  }
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Results — ${questionnaire.title}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-8 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-xl border-l-4 border-indigo-500 bg-white p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900", children: questionnaire.title }),
            questionnaire.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: questionnaire.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400", children: [
              /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-1 font-semibold ${questionnaire.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`, children: questionnaire.is_active ? "Active" : "Inactive" }),
              /* @__PURE__ */ jsxs("span", { children: [
                responses.length,
                " total response",
                responses.length !== 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "by ",
                questionnaire.created_by
              ] }),
              questionnaire.closes_at && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Closes ",
                  questionnaire.closes_at
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: copyLink,
                className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50",
                children: copied ? "✓ Copied!" : "Copy Link"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: shareWhatsApp,
                className: "rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100",
                children: "Share on WhatsApp"
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: route("questionnaires.export-csv", questionnaire.slug),
                className: "inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }),
                  "Download CSV"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggle,
                className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50",
                children: questionnaire.is_active ? "Deactivate" : "Activate"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2", children: /* @__PURE__ */ jsx("span", { className: "flex-1 truncate text-xs text-gray-500", children: fill_url }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-5 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1", children: ["summary", "responses"].map((t) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setTab(t),
          className: `flex-1 rounded-md py-1.5 text-sm font-semibold capitalize transition ${tab === t ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
          children: t === "summary" ? "Summary" : `Responses (${responses.length})`
        },
        t
      )) }),
      tab === "summary" && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: questionnaire.questions.map((q) => /* @__PURE__ */ jsx(QuestionSummary, { question: q, responses }, q.id)) }),
      tab === "responses" && (responses.length === 0 ? /* @__PURE__ */ jsx("p", { className: "py-8 text-center text-gray-400", children: "No responses yet" }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50", children: [
          /* @__PURE__ */ jsx("th", { className: "sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap border-r border-gray-200", children: "Member Name" }),
          questionnaire.questions.map((q) => /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap min-w-[160px]", children: q.label }, q.id)),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-600 whitespace-nowrap min-w-[150px]", children: "Amount (₹)" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: responses.map((r, i) => /* @__PURE__ */ jsxs("tr", { className: i % 2 === 0 ? "bg-white" : "bg-gray-50/50", children: [
          /* @__PURE__ */ jsxs("td", { className: `sticky left-0 z-10 px-4 py-3 border-r border-gray-200 whitespace-nowrap ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`, children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: r.respondent_name }),
            r.respondent_phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: r.respondent_phone })
          ] }),
          questionnaire.questions.map((q) => {
            const raw = r.answers[q.id];
            const display = raw ? q.type === "checkboxes" ? parseAnswer(raw).join(", ") : raw : "—";
            return /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-700 align-top", children: display }, q.id);
          }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top", children: /* @__PURE__ */ jsx(AmountCell, { response: r, questionnaire }) })
        ] }, r.id)) })
      ] }) }))
    ] })
  ] });
}
export {
  Results as default
};
