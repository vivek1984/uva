import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm, usePage, router, Head, Link } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import { c as compressImage } from "./compressImage-CFkZP8E5.js";
function FileTile({ file, preview, onRemove }) {
  return /* @__PURE__ */ jsxs("div", { className: "relative flex h-20 w-20 flex-none flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50", children: [
    preview ? /* @__PURE__ */ jsx("img", { src: preview, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("svg", { className: "h-6 w-6 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
      /* @__PURE__ */ jsx("span", { className: "mt-1 px-1 text-[9px] leading-tight text-gray-500 line-clamp-2 text-center", children: file.name })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onRemove,
        className: "absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow before:absolute before:-inset-2 before:content-['']",
        children: "✕"
      }
    )
  ] });
}
function SubmitRequirementModal({ onClose }) {
  const fileRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const { data, setData, processing, errors, reset } = useForm({
    name: "",
    address: "",
    phone_number: "",
    details: "",
    website: ""
    // honeypot — left empty by humans
  });
  const { flash } = usePage().props;
  useEffect(() => {
    if (flash?.success) onClose();
  }, [flash?.success]);
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }
  async function handleFileChange(e) {
    const raw = Array.from(e.target.files);
    e.target.value = "";
    if (!raw.length) return;
    setCompressing(true);
    const processed = await Promise.all(raw.map(async (f) => {
      if (f.type.startsWith("image/")) {
        const { file } = await compressImage(f, 2 * 1024 * 1024);
        return file;
      }
      return f;
    }));
    setCompressing(false);
    setFiles((prev) => [...prev, ...processed]);
    setPreviews((prev) => [...prev, ...processed.map((f) => f.type.startsWith("image/") ? URL.createObjectURL(f) : null)]);
  }
  function removeFile(index) {
    if (previews[index]) URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }
  function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("address", data.address);
    fd.append("phone_number", data.phone_number);
    fd.append("details", data.details);
    fd.append("website", data.website);
    files.forEach((f) => fd.append("attachments[]", f));
    router.post(route("requirements.store"), fd, {
      forceFormData: true,
      onSuccess: () => reset()
    });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center",
      onClick: handleBackdrop,
      children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 px-6 py-4 flex-none", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Submit Your Requirement" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Tell us what you need — a member will reach out to you." })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "overflow-y-auto flex-1 space-y-4 px-6 py-5", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "website",
              value: data.website,
              onChange: (e) => setData("website", e.target.value),
              tabIndex: -1,
              autoComplete: "off",
              className: "absolute -left-[9999px] h-0 w-0 opacity-0",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Your Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Full name",
                className: "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                autoFocus: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Address" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.address,
                onChange: (e) => setData("address", e.target.value),
                placeholder: "Your address",
                className: "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              }
            ),
            errors.address && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.address })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Phone Number" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: data.phone_number,
                onChange: (e) => setData("phone_number", e.target.value),
                placeholder: "Your phone number",
                className: "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              }
            ),
            errors.phone_number && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.phone_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Enter Your Requirements" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: data.details,
                onChange: (e) => setData("details", e.target.value),
                placeholder: "Describe what you're looking for…",
                rows: 5,
                className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              }
            ),
            errors.details && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.details })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Attach Files (optional)" }),
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs text-gray-400", children: "Photos or documents — you can attach more than one." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
              files.map((f, i) => /* @__PURE__ */ jsx(FileTile, { file: f, preview: previews[i], onRemove: () => removeFile(i) }, i)),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => fileRef.current?.click(),
                  disabled: compressing,
                  className: "flex h-20 w-20 flex-none flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-indigo-400 hover:text-indigo-500 disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium", children: compressing ? "Processing…" : "Add" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileRef,
                type: "file",
                multiple: true,
                accept: "image/*,.pdf,.doc,.docx",
                onChange: handleFileChange,
                className: "hidden"
              }
            ),
            errors["attachments"] && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors["attachments"] }),
            errors["attachments.0"] && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors["attachments.0"] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1 pb-1", children: [
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
                disabled: processing || compressing,
                className: "flex-1 h-12 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60",
                children: processing ? "Submitting…" : "Submit Requirement"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function textMatches(text, q) {
  return text?.toLowerCase().includes(q) ?? false;
}
function businessUrlFor(member) {
  if (!member.matchedProduct) return member.business_url;
  if (member.matchedProduct.page_url) return member.matchedProduct.page_url;
  return `${member.business_url}?product=${encodeURIComponent(member.matchedProduct.name)}`;
}
function filterMembers(members, query) {
  const q = query.trim().toLowerCase();
  if (!q) return members;
  const results = [];
  for (const m of members) {
    const direct = textMatches(m.name, q) || textMatches(m.firm_name, q) || textMatches(m.firm_address, q);
    if (direct) {
      results.push({ ...m, matchedProduct: null });
      continue;
    }
    const matchedProduct = m.products?.find((p) => textMatches(p.name, q) || textMatches(p.category, q)) ?? null;
    if (matchedProduct) {
      results.push({ ...m, matchedProduct });
    }
  }
  return results;
}
function MemberSearchBox({ members, query, setQuery }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    function onDocMouseDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const trimmed = query.trim();
  const allMatches = trimmed ? filterMembers(members, query) : [];
  const matches = allMatches.slice(0, 8);
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative flex-1", children: [
    /* @__PURE__ */ jsx("svg", { className: "pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" }) }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: query,
        onChange: (e) => {
          setQuery(e.target.value);
          setOpen(true);
        },
        onFocus: () => {
          if (query.trim()) setOpen(true);
        },
        placeholder: "Search name, business, address or product…",
        className: "h-14 w-full rounded-2xl border-2 border-slate-200 bg-white pl-12 pr-11 text-base text-slate-900 placeholder-slate-400 shadow-md transition focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
      }
    ),
    query && /* @__PURE__ */ jsx("button", { onClick: () => {
      setQuery("");
      setOpen(false);
    }, className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }),
    open && trimmed && /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-xl", children: matches.length === 0 ? /* @__PURE__ */ jsxs("p", { className: "px-4 py-6 text-center text-sm text-slate-400", children: [
      'No members match "',
      query,
      '"'
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      matches.map((m) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: businessUrlFor(m),
          className: "flex items-center gap-3 px-4 py-2.5 transition hover:bg-indigo-50",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-xs font-bold text-indigo-600", children: m.photo_url ? /* @__PURE__ */ jsx("img", { src: m.photo_url, alt: "", className: "h-full w-full object-cover" }) : (m.firm_name ?? m.name).charAt(0).toUpperCase() }),
            m.matchedProduct ? /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-0.5 inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600", children: "Product" }),
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-slate-900", children: m.matchedProduct.name }),
              /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-slate-400", children: [
                "with ",
                m.firm_name ?? m.name
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-slate-900", children: m.firm_name ?? m.name }),
              /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-slate-400", children: [
                m.firm_name ? m.name : "",
                m.firm_name && m.firm_address ? " · " : "",
                m.firm_address ?? ""
              ] })
            ] }),
            /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 flex-none text-slate-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ]
        },
        m.id
      )),
      allMatches.length > matches.length && /* @__PURE__ */ jsxs("p", { className: "px-4 py-2 text-center text-xs text-slate-400", children: [
        "+",
        allMatches.length - matches.length,
        " more — see full results below"
      ] })
    ] }) })
  ] });
}
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4", onClick: onClose, children: [
    /* @__PURE__ */ jsx("button", { onClick: (e) => {
      e.stopPropagation();
      prev();
    }, className: "absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 transition", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }),
    /* @__PURE__ */ jsx("img", { src: images[current].url, alt: images[current].caption || "", className: "max-h-[88dvh] max-w-full rounded-2xl object-contain shadow-2xl", onClick: (e) => e.stopPropagation() }),
    /* @__PURE__ */ jsx("button", { onClick: (e) => {
      e.stopPropagation();
      next();
    }, className: "absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 transition", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) }),
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/25 transition", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }),
    images[current].caption && /* @__PURE__ */ jsx("p", { className: "absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs text-white backdrop-blur-sm", children: images[current].caption })
  ] });
}
function TextSection({ section }) {
  return /* @__PURE__ */ jsx("section", { className: "px-4 py-14 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
    (section.title || section.subtitle) && /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
      section.title && /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: section.title }),
      section.subtitle && /* @__PURE__ */ jsx("p", { className: "mt-2 text-base text-indigo-600", children: section.subtitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `flex flex-col gap-6 ${section.cover_image ? "sm:flex-row sm:items-start" : ""}`, children: [
      section.cover_image && /* @__PURE__ */ jsx("img", { src: section.cover_image, alt: section.title || "", className: "w-full rounded-2xl object-cover shadow-md sm:w-64 sm:flex-none" }),
      section.body && /* @__PURE__ */ jsx("p", { className: "flex-1 whitespace-pre-line text-base leading-relaxed text-slate-600", children: section.body })
    ] })
  ] }) });
}
function GallerySection({ section }) {
  const [lightbox, setLightbox] = useState(null);
  if (!section.images?.length) return null;
  return /* @__PURE__ */ jsxs("section", { className: "px-4 py-14 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl", children: [
      (section.title || section.subtitle) && /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
        section.title && /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: section.title }),
        section.subtitle && /* @__PURE__ */ jsx("p", { className: "mt-2 text-base text-indigo-600", children: section.subtitle })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4", children: section.images.map((img, i) => /* @__PURE__ */ jsxs("button", { onClick: () => setLightbox(i), className: "group relative overflow-hidden rounded-2xl focus:outline-none", children: [
        /* @__PURE__ */ jsx("img", { src: img.url, alt: img.caption || "", className: "aspect-square w-full object-cover transition duration-500 group-hover:scale-110" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" }),
        img.caption && /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 translate-y-full bg-black/70 px-2 py-2 text-xs text-white backdrop-blur-sm transition duration-300 group-hover:translate-y-0", children: img.caption })
      ] }, img.id)) })
    ] }),
    lightbox !== null && /* @__PURE__ */ jsx(Lightbox, { images: section.images, startIndex: lightbox, onClose: () => setLightbox(null) })
  ] });
}
function ExecutiveSection({ executives }) {
  if (!executives?.length) return null;
  return /* @__PURE__ */ jsx("section", { className: "bg-white px-4 py-14 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600", children: "Leadership" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Executive Committee" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-500", children: "The people driving UVA Vyapari Welfare Association forward" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0", children: /* @__PURE__ */ jsx("div", { className: "flex gap-4 pb-2 sm:flex-wrap sm:justify-center sm:gap-6 sm:pb-0", children: executives.map((exec) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: exec.slug ? `/${exec.slug}` : "#",
        className: "group flex w-32 flex-none flex-col items-center gap-3 rounded-2xl p-4 transition hover:bg-indigo-50 sm:w-36",
        children: [
          exec.photo_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: exec.photo_url,
              alt: exec.name,
              className: "h-20 w-20 rounded-full object-cover shadow-md ring-2 ring-white group-hover:ring-indigo-300 transition sm:h-24 sm:w-24"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md ring-2 ring-white group-hover:ring-indigo-300 transition text-2xl font-extrabold text-white sm:h-24 sm:w-24", children: exec.name.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold leading-snug text-slate-800 group-hover:text-indigo-700 transition", children: exec.name }),
            /* @__PURE__ */ jsx("span", { className: `mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${exec.post_name ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`, children: exec.post_name ?? "Executive Member" })
          ] })
        ]
      },
      exec.id
    )) }) })
  ] }) });
}
const PAGE_SIZE = 50;
function MembersDirectory({ members, query, setQuery }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query]);
  if (!members?.length) return null;
  const filtered = filterMembers(members, query);
  const displayed = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;
  return /* @__PURE__ */ jsx("section", { id: "directory", className: "bg-slate-50 px-4 py-14 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600", children: "Directory" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 sm:text-3xl", children: "Our Members" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Explore businesses run by our association members" })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-slate-500", children: [
        'No members match "',
        query,
        '"'
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setQuery(""), className: "mt-2 text-xs text-indigo-600 hover:underline", children: "Clear search" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: displayed.map((member) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: businessUrlFor(member),
          className: "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md hover:ring-indigo-200",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative aspect-square bg-gradient-to-br from-indigo-100 to-indigo-50", children: [
              member.photo_url ? /* @__PURE__ */ jsx("img", { src: member.photo_url, alt: member.name, className: "h-full w-full object-cover transition duration-500 group-hover:scale-105" }) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center text-3xl font-extrabold text-indigo-300 sm:text-4xl", children: (member.firm_name ?? member.name).charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-3", children: [
              member.matchedProduct && /* @__PURE__ */ jsxs("span", { className: "mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700", children: [
                "🛍 ",
                member.matchedProduct.name
              ] }),
              /* @__PURE__ */ jsx("p", { className: "line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition", children: member.firm_name ?? member.name }),
              member.firm_name && /* @__PURE__ */ jsx("p", { className: "mt-0.5 line-clamp-1 text-xs text-slate-400", children: member.name }),
              member.firm_address && /* @__PURE__ */ jsx("p", { className: "mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500", children: member.firm_address }),
              member.business_services && /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400", children: member.business_services }),
              /* @__PURE__ */ jsx("div", { className: "mt-auto pt-3", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 transition", children: [
                "View business",
                /* @__PURE__ */ jsx("svg", { className: "h-3 w-3 transition group-hover:translate-x-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }) })
              ] }) })
            ] })
          ]
        },
        member.id
      )) }),
      /* @__PURE__ */ jsxs("p", { className: "mt-5 text-center text-xs text-slate-400", children: [
        "Showing ",
        displayed.length,
        " of ",
        filtered.length,
        " member",
        filtered.length !== 1 ? "s" : "",
        query.trim() && filtered.length < members.length && ` matching "${query}"`
      ] }),
      hasMore && /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setVisible((v) => v + PAGE_SIZE),
          className: "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 active:scale-95",
          children: [
            "Load more",
            /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500", children: [
              "+",
              Math.min(PAGE_SIZE, filtered.length - visible)
            ] })
          ]
        }
      ) })
    ] })
  ] }) });
}
function Welcome({ canLogin, canRegister, sections = [], executives = [], members = [], auth }) {
  const [query, setQuery] = useState("");
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const { flash } = usePage().props;
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const description = "UVA Vyapari Welfare Association — We are a group of wholesalers, distributors, and retailers of various products. Search member businesses, explore products, or submit a requirement and get connected with a trusted local trader.";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UVA Vyapari Welfare Association",
    alternateName: "UVA",
    url: siteUrl,
    logo: `${siteUrl}/storage/logo.jpg`,
    description
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: "UVA Vyapari Welfare Association" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: siteUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "UVA Vyapari Welfare Association" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: siteUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: `${siteUrl}/storage/logo.jpg` }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "UVA Vyapari Welfare Association" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "UVA Vyapari Welfare Association" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: `${siteUrl}/storage/logo.jpg` }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(jsonLd) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-[100dvh] bg-white text-slate-900 antialiased", children: [
      /* @__PURE__ */ jsx("nav", { className: "sticky top-0 z-40 border-b border-white/10 bg-indigo-950/90 backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6", children: [
        /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("img", { src: "/storage/logo.jpg", alt: "UVA", className: "h-8 w-8 rounded-lg object-contain" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-white", children: [
            "UVA",
            /* @__PURE__ */ jsx("span", { className: "hidden font-normal text-indigo-300 sm:inline", children: " Vyapari Welfare Association" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: auth?.user ? /* @__PURE__ */ jsx(Link, { href: route("dashboard"), className: "inline-flex h-8 items-center rounded-lg bg-white px-4 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 active:scale-95", children: "Dashboard →" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          canLogin && /* @__PURE__ */ jsx(Link, { href: route("login"), className: "inline-flex h-8 items-center rounded-lg px-4 text-xs font-semibold text-indigo-200 transition hover:text-white", children: "Login" }),
          canRegister && /* @__PURE__ */ jsx(Link, { href: route("register"), className: "inline-flex h-8 items-center rounded-lg bg-indigo-500 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-400 active:scale-95", children: "Join →" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative isolate overflow-hidden bg-indigo-950", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute inset-0 opacity-[0.07]",
            style: { backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)", backgroundSize: "28px 28px" }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-3xl px-4 pb-24 pt-10 text-center sm:px-6 sm:pb-28 sm:pt-14", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-extrabold tracking-tight text-white sm:text-3xl", children: "UVA Vyapari Welfare Association" }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto mt-2 max-w-md text-sm text-indigo-300 sm:text-base", children: "We are a group of wholesalers, distributors, and retailers of various products." }),
          auth?.user && /* @__PURE__ */ jsx(Link, { href: route("dashboard"), className: "mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-50 active:scale-95", children: "Go to Dashboard →" }),
          members.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-center gap-4 text-xs uppercase tracking-wider text-indigo-400", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsxs("strong", { className: "text-sm font-bold text-white", children: [
                members.length,
                "+"
              ] }),
              " Members"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "h-3 w-px bg-white/10" }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-sm font-bold text-white", children: executives.length }),
              " Executives"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "h-3 w-px bg-white/10" }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-sm font-bold text-white", children: "1" }),
              " Association"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10 -mt-16 mb-10 px-4 sm:-mt-20 sm:mb-14 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-900/5 sm:p-7", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-center text-sm font-semibold text-slate-600", children: "Looking for a trusted business, or need something done?" }),
        flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700", children: flash.success }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-stretch gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsx(MemberSearchBox, { members, query, setQuery }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowRequirementModal(true),
              className: "flex h-14 flex-none items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }),
                "Submit Requirement"
              ]
            }
          )
        ] }),
        !auth?.user && /* @__PURE__ */ jsxs("p", { className: "mt-4 text-center text-xs text-slate-400", children: [
          "Are you a trader?",
          " ",
          canLogin && /* @__PURE__ */ jsx(Link, { href: route("login"), className: "font-semibold text-indigo-600 hover:underline", children: "Member Login" }),
          canLogin && canRegister && " · ",
          canRegister && /* @__PURE__ */ jsx(Link, { href: route("register"), className: "font-semibold text-indigo-600 hover:underline", children: "Register Free" })
        ] })
      ] }) }),
      showRequirementModal && /* @__PURE__ */ jsx(SubmitRequirementModal, { onClose: () => setShowRequirementModal(false) }),
      /* @__PURE__ */ jsx(ExecutiveSection, { executives }),
      /* @__PURE__ */ jsx(MembersDirectory, { members, query, setQuery }),
      sections.length > 0 && /* @__PURE__ */ jsx("div", { children: sections.map((section, i) => /* @__PURE__ */ jsxs("div", { className: `border-t border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`, children: [
        section.type === "text" && /* @__PURE__ */ jsx(TextSection, { section }),
        section.type === "gallery" && /* @__PURE__ */ jsx(GallerySection, { section })
      ] }, section.id)) }),
      /* @__PURE__ */ jsx("footer", { className: "bg-indigo-950 px-4 py-10 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 sm:flex-row sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: "/storage/logo.jpg", alt: "UVA", className: "h-9 w-9 rounded-xl object-contain opacity-80" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-white", children: "UVA Vyapari Welfare Association" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-400", children: "Yuva at Heart" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-indigo-400", children: [
            canLogin && /* @__PURE__ */ jsx(Link, { href: route("login"), className: "hover:text-white transition", children: "Login" }),
            canRegister && /* @__PURE__ */ jsx(Link, { href: route("register"), className: "hover:text-white transition", children: "Register" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 border-t border-white/5 pt-6 text-center text-xs text-indigo-500", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " UVA Vyapari Welfare Association. All rights reserved."
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Welcome as default
};
