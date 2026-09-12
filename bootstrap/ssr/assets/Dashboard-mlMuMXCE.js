import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
import { R as RequirementsBoard, M as MemberProfileForm } from "./RequirementsBoard-CArumgbW.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import "./compressImage-CFkZP8E5.js";
function StatusBadge({ status }) {
  return status === "active" ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700", children: "Active" }) : /* @__PURE__ */ jsx("span", { className: "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600", children: "Non-Active" });
}
function MemberRow({ member, onToggleManage, onToggleStatus, canToggleStatus }) {
  const isManaged = member.is_managed_by_me;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: `flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-semibold ${isManaged ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`, children: member.name.charAt(0).toUpperCase() }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800 truncate", children: member.name }),
        /* @__PURE__ */ jsxs("div", { className: "mt-0.5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(StatusBadge, { status: member.status }),
          member.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 truncate", children: member.email })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:ml-3 sm:flex-none", children: [
      canToggleStatus && member.status !== "active" && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onToggleStatus(member),
          className: "rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100",
          children: "Make Active"
        }
      ),
      canToggleStatus && member.status === "active" && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onToggleStatus(member),
          className: "rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100",
          children: "Deactivate"
        }
      ),
      onToggleManage && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onToggleManage(member.id),
          className: `rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isManaged ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`,
          children: isManaged ? "Remove" : "Manage"
        }
      )
    ] })
  ] });
}
function SuggestionsTab({ suggestions, unreadCount, onViewed }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: suggestions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border-2 border-dashed border-gray-200 py-14 text-center text-sm text-gray-400", children: "No suggestions submitted yet." }) : suggestions.map((s) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `rounded-xl border bg-white p-5 shadow-sm transition ${!s.is_read ? "border-indigo-300 ring-1 ring-indigo-200" : "border-gray-200"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            !s.is_read && /* @__PURE__ */ jsx("span", { className: "inline-block h-2 w-2 flex-none rounded-full bg-indigo-500" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: s.title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-line", children: s.description })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: s.member_name }),
          s.phone && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
            /* @__PURE__ */ jsx("span", { children: s.phone })
          ] }),
          s.firm_name && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
            /* @__PURE__ */ jsxs("span", { className: "text-indigo-600", children: [
              "M/s ",
              s.firm_name
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
          /* @__PURE__ */ jsx("span", { children: s.submitted_at })
        ] })
      ]
    },
    s.id
  )) });
}
const CELEBRATION_STYLE = {
  birthday: { bg: "bg-amber-50", border: "border-amber-200", icon: "🎂", label: "Birthday" },
  spouse_birthday: { bg: "bg-pink-50", border: "border-pink-200", icon: "🎂", label: "Birthday" },
  child_birthday: { bg: "bg-sky-50", border: "border-sky-200", icon: "🎂", label: "Birthday" },
  anniversary: { bg: "bg-rose-50", border: "border-rose-200", icon: "💍", label: "Anniversary" }
};
function CelebrationsPanel({ celebrations }) {
  if (!celebrations?.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4", children: [
    /* @__PURE__ */ jsxs("p", { className: "mb-3 flex items-center gap-2 text-sm font-bold text-amber-800", children: [
      /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🎉" }),
      " Today's Celebrations"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: celebrations.map((c, i) => {
      const s = CELEBRATION_STYLE[c.type] ?? CELEBRATION_STYLE.birthday;
      return /* @__PURE__ */ jsxs("div", { className: `flex items-start gap-3 rounded-xl border ${s.border} ${s.bg} px-4 py-3`, children: [
        /* @__PURE__ */ jsx("span", { className: "mt-0.5 text-xl leading-none", children: s.icon }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-snug text-gray-800", children: c.message })
      ] }, i);
    }) })
  ] });
}
function ExecutiveDashboard({ heldPost, allGeneralMembers, profile, auth, todaysCelebrations, suggestions, unreadSuggestions, requirements }) {
  const [activeTab, setActiveTab] = useState("members");
  const [localUnread, setLocalUnread] = useState(unreadSuggestions ?? 0);
  const tabs = [
    { key: "members", label: "Manage Members", icon: "👥" },
    { key: "requirements", label: "Requirements", icon: "📋" },
    { key: "suggestions", label: "Suggestions", icon: "💬" },
    { key: "profile", label: "My Profile", icon: "👤" }
  ];
  const myMembers = allGeneralMembers.filter((m) => m.is_managed_by_me);
  const available = allGeneralMembers.filter((m) => !m.is_managed_by_me && !m.is_managed_by_other);
  const takenByOthers = allGeneralMembers.filter((m) => !m.is_managed_by_me && m.is_managed_by_other);
  const toggle = (memberId) => {
    router.post(route("executive.members.toggle"), { general_member_id: memberId });
  };
  const toggleStatus = (member) => {
    const action = member.status === "active" ? "deactivate" : "activate";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${member.name}?`)) return;
    router.post(route("executive.members.toggle-status", member.id));
  };
  function openSuggestions() {
    setActiveTab("suggestions");
    if (localUnread > 0) {
      setLocalUnread(0);
      fetch(route("executive.suggestions.mark-read"), {
        method: "POST",
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ""),
          "Content-Type": "application/json"
        }
      });
    }
  }
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Executive Dashboard" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "UVA Vyapari Welfare Association" })
        ] }),
        heldPost ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow", children: heldPost.name }) : /* @__PURE__ */ jsx("span", { className: "rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-500", children: "No post assigned" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Executive Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsx(CelebrationsPanel, { celebrations: todaysCelebrations }),
          /* @__PURE__ */ jsx("div", { className: "mb-8 flex gap-1 rounded-xl bg-gray-100 p-1", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: tab.key === "suggestions" ? openSuggestions : () => setActiveTab(tab.key),
              className: `relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${activeTab === tab.key ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
              children: [
                /* @__PURE__ */ jsx("span", { children: tab.icon }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: tab.label }),
                tab.key === "suggestions" && localUnread > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white", children: localUnread > 99 ? "99+" : localUnread })
              ]
            },
            tab.key
          )) }),
          activeTab === "members" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-md", children: [
              /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4", children: [
                /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-800", children: [
                  "My Members",
                  /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white", children: myMembers.length })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-gray-500", children: "Members you are currently managing" })
              ] }),
              myMembers.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-6 py-6 text-center text-sm text-gray-400", children: "You haven't selected any members yet. Choose from the available list below." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: myMembers.map((member) => /* @__PURE__ */ jsx(MemberRow, { member, onToggleManage: toggle, onToggleStatus: toggleStatus, canToggleStatus: !!heldPost }, member.id)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-md", children: [
              /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-100 px-6 py-4", children: [
                /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-800", children: [
                  "Available General Members",
                  /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700", children: available.length })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-gray-500", children: 'Click "Manage" to add a member to your list' })
              ] }),
              available.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-6 py-6 text-center text-sm text-gray-400", children: "No available members to add." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: available.map((member) => /* @__PURE__ */ jsx(MemberRow, { member, onToggleManage: toggle, onToggleStatus: toggleStatus, canToggleStatus: !!heldPost }, member.id)) })
            ] }),
            takenByOthers.length > 0 && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-md opacity-75", children: [
              /* @__PURE__ */ jsx("div", { className: "border-b border-gray-100 px-6 py-4", children: /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-600", children: [
                "Managed by Other Executives",
                /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500", children: takenByOthers.length })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: takenByOthers.map((member) => /* @__PURE__ */ jsx(MemberRow, { member, onToggleManage: null, onToggleStatus: toggleStatus, canToggleStatus: !!heldPost }, member.id)) })
            ] })
          ] }),
          activeTab === "requirements" && /* @__PURE__ */ jsx(RequirementsBoard, { requirements }),
          activeTab === "suggestions" && /* @__PURE__ */ jsx(SuggestionsTab, { suggestions: suggestions ?? [] }),
          activeTab === "profile" && /* @__PURE__ */ jsx(MemberProfileForm, { profile, userName: auth.user.name })
        ] }) })
      ]
    }
  );
}
export {
  ExecutiveDashboard as default
};
