import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
import { R as RequirementsBoard, M as MemberProfileForm } from "./RequirementsBoard-CArumgbW.js";
import { usePage, Head, router, useForm } from "@inertiajs/react";
import { useState, useRef } from "react";
import "./compressImage-CFkZP8E5.js";
const CELEBRATION_STYLE = {
  birthday: { bg: "bg-amber-50", border: "border-amber-200", icon: "🎂" },
  spouse_birthday: { bg: "bg-pink-50", border: "border-pink-200", icon: "🎂" },
  child_birthday: { bg: "bg-sky-50", border: "border-sky-200", icon: "🎂" },
  anniversary: { bg: "bg-rose-50", border: "border-rose-200", icon: "💍" }
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
const StatCard = ({ label, value, icon, color }) => /* @__PURE__ */ jsx("div", { className: `rounded-2xl p-6 text-white shadow-md ${color}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium opacity-80", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-4xl font-bold", children: value })
  ] }),
  /* @__PURE__ */ jsx("span", { className: "text-4xl opacity-70", children: icon })
] }) });
const Badge = ({ role }) => {
  const styles = {
    executive: "bg-purple-100 text-purple-700",
    general: "bg-blue-100 text-blue-700",
    admin: "bg-red-100 text-red-700"
  };
  return /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[role] ?? ""}`, children: role });
};
function AdminDashboard({ stats, posts, executives, generalMembers, allMembers, profile, auth, todaysCelebrations, requirements }) {
  const [activeTab, setActiveTab] = useState("overview");
  const { flash } = usePage().props;
  const csvInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  function handleCsvUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    const fd = new FormData();
    fd.append("csv_file", file);
    router.post(route("admin.members.import-csv"), fd, {
      forceFormData: true,
      onFinish: () => {
        setImporting(false);
        e.target.value = "";
      }
    });
  }
  const tabs = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "posts", label: "Posts", icon: "🏷️" },
    { key: "members", label: "Members", icon: "👥" },
    { key: "requirements", label: "Requirements", icon: "📋" },
    { key: "profile", label: "My Profile", icon: "👤" }
  ];
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Admin Dashboard" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "UVA Vyapari Welfare Association — Control Panel" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700", children: "Super Admin" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Admin Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsx(CelebrationsPanel, { celebrations: todaysCelebrations }),
          /* @__PURE__ */ jsx("div", { className: "mb-8 flex gap-1 rounded-xl bg-gray-100 p-1", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab(tab.key),
              className: `flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${activeTab === tab.key ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
              children: [
                /* @__PURE__ */ jsx("span", { children: tab.icon }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: tab.label })
              ]
            },
            tab.key
          )) }),
          activeTab === "overview" && /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-3", children: [
              /* @__PURE__ */ jsx(StatCard, { label: "Total Members", value: stats.total_members, icon: "👥", color: "bg-gradient-to-br from-indigo-500 to-indigo-700" }),
              /* @__PURE__ */ jsx(StatCard, { label: "Executive Members", value: stats.executives, icon: "⭐", color: "bg-gradient-to-br from-purple-500 to-purple-700" }),
              /* @__PURE__ */ jsx(StatCard, { label: "General Members", value: stats.generals, icon: "👤", color: "bg-gradient-to-br from-blue-500 to-blue-700" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white p-6 shadow-md", children: [
              /* @__PURE__ */ jsx("h3", { className: "mb-4 text-base font-semibold text-gray-800", children: "Executive Committee" }),
              executives.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "No executive members yet." }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: executives.map((exec) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: exec.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: exec.email })
                ] }),
                exec.post ? /* @__PURE__ */ jsx("span", { className: "rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700", children: exec.post.name }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "No post assigned" })
              ] }, exec.id)) })
            ] })
          ] }),
          activeTab === "posts" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx(CreatePostForm, {}),
            /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-md", children: [
              /* @__PURE__ */ jsx("div", { className: "border-b border-gray-100 px-6 py-4", children: /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800", children: "All Posts" }) }),
              /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-50", children: [
                posts.map((post) => /* @__PURE__ */ jsx(PostRow, { post, executives }, post.id)),
                posts.length === 0 && /* @__PURE__ */ jsx("p", { className: "px-6 py-4 text-sm text-gray-400", children: "No posts created yet." })
              ] })
            ] })
          ] }),
          activeTab === "members" && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-md", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800", children: "All Members" }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-gray-400", children: "Manage member roles and post assignments" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => csvInputRef.current?.click(),
                    disabled: importing,
                    className: "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 active:scale-95 disabled:opacity-60",
                    children: [
                      importing ? /* @__PURE__ */ jsxs("svg", { className: "h-4 w-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })
                      ] }) : /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4 4l4-4m0 0l4 4m-4-4V4" }) }),
                      importing ? "Importing…" : "Upload CSV"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("input", { ref: csvInputRef, type: "file", accept: ".csv,text/csv", className: "hidden", onChange: handleCsvUpload }),
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: route("admin.members.export-csv"),
                    className: "inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 active:scale-95",
                    children: [
                      /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }),
                      "Download CSV"
                    ]
                  }
                )
              ] })
            ] }),
            flash?.import_results && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b border-green-100 bg-green-50 px-6 py-3 text-sm", children: [
              /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 flex-none text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-green-800", children: [
                "Import complete —",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: flash.import_results.created }),
                " member",
                flash.import_results.created !== 1 ? "s" : "",
                " created,",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: flash.import_results.skipped }),
                " skipped (already exist or missing phone)."
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-50", children: [
              allMembers.map((member) => /* @__PURE__ */ jsx(MemberRow, { member, posts, executives }, member.id)),
              allMembers.length === 0 && /* @__PURE__ */ jsx("p", { className: "px-6 py-4 text-sm text-gray-400", children: "No members registered yet." })
            ] })
          ] }),
          activeTab === "requirements" && /* @__PURE__ */ jsx(
            RequirementsBoard,
            {
              requirements,
              isAdmin: true,
              attendableMembers: allMembers.filter((m) => m.status === "active" && m.role !== "admin")
            }
          ),
          activeTab === "profile" && /* @__PURE__ */ jsx(MemberProfileForm, { profile, userName: auth.user.name })
        ] }) })
      ]
    }
  );
}
function CreatePostForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    description: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.posts.store"), { onSuccess: () => reset() });
  };
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white p-6 shadow-md", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 font-semibold text-gray-800", children: "Create New Post" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col gap-4 sm:flex-row", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            placeholder: "Post name (e.g. Chairman)",
            className: "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          }
        ),
        errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.name })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: data.description,
          onChange: (e) => setData("description", e.target.value),
          placeholder: "Description (optional)",
          className: "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        }
      ) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60",
          children: "Add Post"
        }
      )
    ] })
  ] });
}
function PostRow({ post, executives }) {
  const [assigning, setAssigning] = useState(false);
  const { data, setData, post: submit, processing } = useForm({ post_id: post.id });
  const handleAssign = (e) => {
    e.preventDefault();
    const memberId = e.target.elements.executive_id.value;
    if (!memberId) return;
    router.post(route("admin.members.assign-post", memberId), { post_id: post.id }, {
      onSuccess: () => setAssigning(false)
    });
  };
  const handleDelete = () => {
    if (confirm(`Delete post "${post.name}"? This will unassign the current holder.`)) {
      router.delete(route("admin.posts.destroy", post.id));
    }
  };
  const handleRemoveHolder = () => {
    if (post.holder) {
      router.delete(route("admin.members.remove-post", post.holder.id));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "px-6 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800", children: post.name }),
        post.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: post.description }),
        post.holder ? /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700", children: [
            "Held by: ",
            post.holder.name
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleRemoveHolder,
              className: "text-xs text-red-400 hover:text-red-600",
              children: "Remove"
            }
          )
        ] }) : /* @__PURE__ */ jsx("span", { className: "mt-1 inline-block text-xs text-gray-400", children: "Vacant" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setAssigning(!assigning),
            className: "rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100",
            children: "Assign"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleDelete,
            className: "rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100",
            children: "Delete"
          }
        )
      ] })
    ] }),
    assigning && /* @__PURE__ */ jsxs("form", { onSubmit: handleAssign, className: "mt-3 flex gap-2", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          name: "executive_id",
          className: "flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select executive member…" }),
            executives.map((exec) => /* @__PURE__ */ jsxs("option", { value: exec.id, children: [
              exec.name,
              " ",
              exec.post ? `(currently: ${exec.post.name})` : ""
            ] }, exec.id))
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700",
          children: "Confirm"
        }
      )
    ] })
  ] });
}
function MemberRow({ member, posts }) {
  const handleRoleChange = (newRole) => {
    if (confirm(`Change ${member.name}'s role to ${newRole}?`)) {
      router.post(route("admin.members.role", member.id), { role: newRole });
    }
  };
  const handleToggleStatus = () => {
    const action = member.status === "active" ? "deactivate" : "activate";
    if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${member.name}?`)) {
      router.post(route("admin.members.toggle-status", member.id));
    }
  };
  const handleDelete = () => {
    if (confirm(`Permanently delete "${member.name}"? This cannot be undone and will remove all their data.`)) {
      router.delete(route("admin.members.destroy", member.id));
    }
  };
  const isActive = member.status === "active";
  return /* @__PURE__ */ jsx("div", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 flex-none items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700", children: member.name.charAt(0).toUpperCase() }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800 truncate", children: member.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 truncate", children: member.email || member.phone })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx(Badge, { role: member.role }),
      member.role !== "admin" && /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`, children: isActive ? "Active" : "Non-Active" }),
      member.role !== "admin" && /* @__PURE__ */ jsxs(Fragment, { children: [
        member.role !== "executive" && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleRoleChange("executive"),
            className: "rounded px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50",
            children: "→ Executive"
          }
        ),
        member.role !== "general" && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleRoleChange("general"),
            className: "rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50",
            children: "→ General"
          }
        )
      ] }),
      member.role !== "admin" && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleToggleStatus,
          className: `rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isActive ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`,
          children: isActive ? "Deactivate" : "Activate"
        }
      ),
      member.role !== "admin" && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleDelete,
          className: "rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition",
          children: "Delete"
        }
      )
    ] })
  ] }) });
}
export {
  AdminDashboard as default
};
