import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { useState } from "react";
function ApplicationLogo({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: "/storage/logo.jpg",
      alt: "UVA Vyapari Welfare Association",
      className,
      ...props
    }
  );
}
const Icon = {
  home: /* @__PURE__ */ jsx("svg", { fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24", className: "h-5 w-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) }),
  forms: /* @__PURE__ */ jsx("svg", { fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24", className: "h-5 w-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }) }),
  globe: /* @__PURE__ */ jsx("svg", { fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24", className: "h-5 w-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
  money: /* @__PURE__ */ jsxs("svg", { fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24", className: "h-5 w-5", children: [
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" }),
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 12a3 3 0 100-6 3 3 0 000 6zM6 12h.01M18 12h.01" })
  ] }),
  settings: /* @__PURE__ */ jsxs("svg", { fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24", className: "h-5 w-5", children: [
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
    /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
  ] }),
  products: /* @__PURE__ */ jsx("svg", { fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24", className: "h-5 w-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }),
  logout: /* @__PURE__ */ jsx("svg", { fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24", className: "h-5 w-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }),
  menu: /* @__PURE__ */ jsx("svg", { fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", className: "h-6 w-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }) }),
  close: /* @__PURE__ */ jsx("svg", { fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", className: "h-6 w-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) })
};
const accountingItem = { href: "accounting.dashboard", label: "Accounting", icon: "money" };
const roleNav = {
  admin: [
    { href: "admin.dashboard", label: "Dashboard", icon: "home" },
    { href: "questionnaires.index", label: "Questionnaires", icon: "forms" },
    { href: "homepage.index", label: "Homepage", icon: "globe" },
    accountingItem
  ],
  executive: [
    { href: "executive.dashboard", label: "Dashboard", icon: "home" },
    { href: "my.products.index", label: "My Products", icon: "products" },
    { href: "questionnaires.index", label: "Questionnaires", icon: "forms" },
    { href: "homepage.index", label: "Homepage", icon: "globe" }
  ],
  general: [
    { href: "member.dashboard", label: "Dashboard", icon: "home" },
    { href: "my.products.index", label: "My Products", icon: "products" }
  ]
};
const roleBadge = {
  admin: { label: "Super Admin", cls: "bg-red-100 text-red-700" },
  executive: { label: "Executive", cls: "bg-purple-100 text-purple-700" },
  general: { label: "Member", cls: "bg-blue-100 text-blue-700" }
};
function NavItem({ item, onClick }) {
  const active = route().current(item.href);
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: route(item.href),
      onClick,
      className: `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: `flex-none transition-colors ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`, children: Icon[item.icon] }),
        /* @__PURE__ */ jsx("span", { children: item.label }),
        active && /* @__PURE__ */ jsx("span", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" })
      ]
    }
  );
}
function Avatar({ name, size = "md" }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const sz = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return /* @__PURE__ */ jsx("div", { className: `${sz} flex flex-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-sm`, children: initials });
}
function SidebarContent({ user, navItems, badge, onClose }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex h-16 flex-none items-center gap-3 border-b border-slate-100 px-5", children: [
      /* @__PURE__ */ jsxs(Link, { href: "/", onClick: onClose, className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-8 w-8 flex-none object-contain" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-extrabold leading-tight text-indigo-700", children: "UVA" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] leading-tight text-slate-400", children: "Vyapari Welfare" })
        ] })
      ] }),
      onClose && /* @__PURE__ */ jsx("button", { onClick: onClose, className: "ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600", children: Icon.close })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mx-4 mt-4 flex-none rounded-xl bg-slate-50 p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Avatar, { name: user.name }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-slate-800", children: user.name }),
        /* @__PURE__ */ jsx("span", { className: `mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.cls}`, children: badge.label })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("nav", { className: "mt-4 flex-1 overflow-y-auto px-3", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400", children: "Menu" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: navItems.map((item) => /* @__PURE__ */ jsx(NavItem, { item, onClick: onClose }, item.label)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-none border-t border-slate-100 px-3 py-3 space-y-0.5", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("profile.edit"),
          onClick: onClose,
          className: "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700",
          children: [
            /* @__PURE__ */ jsx("span", { className: "flex-none text-slate-400", children: Icon.settings }),
            "Account Settings"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("logout"),
          method: "post",
          as: "button",
          className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50",
          children: [
            /* @__PURE__ */ jsx("span", { className: "flex-none", children: Icon.logout }),
            "Log Out"
          ]
        }
      )
    ] })
  ] });
}
function AuthenticatedLayout({ header, children }) {
  const user = usePage().props.auth.user;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const baseNavItems = roleNav[user.role] ?? roleNav.general;
  const navItems = user.role !== "admin" && user.accounting_permission ? [...baseNavItems, accountingItem] : baseNavItems;
  const badge = roleBadge[user.role] ?? roleBadge.general;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[100dvh] bg-slate-50", children: [
    /* @__PURE__ */ jsx("aside", { className: "hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col md:border-r md:border-slate-200 md:bg-white md:shadow-sm", children: /* @__PURE__ */ jsx(SidebarContent, { user, navItems, badge, onClose: null }) }),
    drawerOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden",
        onClick: () => setDrawerOpen(false)
      }
    ),
    /* @__PURE__ */ jsx(
      "aside",
      {
        className: `fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 md:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`,
        style: { paddingTop: "env(safe-area-inset-top)" },
        children: /* @__PURE__ */ jsx(SidebarContent, { user, navItems, badge, onClose: () => setDrawerOpen(false) })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col md:pl-60", children: [
      /* @__PURE__ */ jsxs(
        "header",
        {
          className: "sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm md:hidden",
          style: { paddingTop: "env(safe-area-inset-top)" },
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setDrawerOpen(true),
                className: "rounded-lg p-1.5 text-slate-500 hover:bg-slate-100",
                children: Icon.menu
              }
            ),
            /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-7 w-7 object-contain" }),
              /* @__PURE__ */ jsx("span", { className: "text-base font-bold text-indigo-700", children: "UVA" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.cls}`, children: badge.label }),
              /* @__PURE__ */ jsx(Avatar, { name: user.name, size: "sm" })
            ] })
          ]
        }
      ),
      header && /* @__PURE__ */ jsx("div", { className: "border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8", children: header }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 pb-20 md:pb-0", children })
    ] }),
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: "fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200 bg-white md:hidden",
        style: { paddingBottom: "env(safe-area-inset-bottom)" },
        children: navItems.map((item) => {
          const active = route().current(item.href);
          return /* @__PURE__ */ jsxs(
            Link,
            {
              href: route(item.href),
              className: `relative flex min-w-0 flex-1 flex-col items-center gap-1 py-2 transition-colors ${active ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"}`,
              children: [
                active && /* @__PURE__ */ jsx("span", { className: "absolute inset-x-3 top-0 h-0.5 rounded-full bg-indigo-600" }),
                /* @__PURE__ */ jsx("span", { className: `flex-none ${active ? "text-indigo-600" : "text-slate-400"}`, children: Icon[item.icon] }),
                /* @__PURE__ */ jsx("span", { className: "max-w-full truncate px-1 text-[11px] font-semibold leading-none", children: item.label })
              ]
            },
            item.label
          );
        })
      }
    )
  ] });
}
export {
  AuthenticatedLayout as A
};
