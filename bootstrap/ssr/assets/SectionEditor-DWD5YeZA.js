import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
import { usePage, useForm, Head, Link, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import { c as compressImage, a as compressImages } from "./compressImage-CFkZP8E5.js";
const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 pursuing focus:ring-indigo-500/20";
function SectionEditor({ section, type }) {
  const { flash } = usePage().props;
  const isNew = !section;
  const { data, setData, post, processing, errors } = useForm({
    type: section?.type ?? type,
    title: section?.title ?? "",
    subtitle: section?.subtitle ?? "",
    body: section?.body ?? "",
    cover_image: null
  });
  const [coverPreview, setCoverPreview] = useState(section?.cover_image ?? null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(section?.images ?? []);
  const galleryInputRef = useRef(null);
  async function handleCoverChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    const result = await compressImage(file);
    setData("cover_image", result.file);
    setCoverPreview(URL.createObjectURL(result.file));
  }
  function submit(e) {
    e.preventDefault();
    const url = isNew ? route("homepage.sections.store") : route("homepage.sections.update", section.id);
    post(url, { forceFormData: true });
  }
  async function uploadGalleryImages(e) {
    const raw = Array.from(e.target.files);
    if (!raw.length) return;
    setUploading(true);
    const results = await compressImages(raw);
    const files = results.map((r) => r.file);
    const fd = new FormData();
    files.forEach((f) => fd.append("images[]", f));
    fd.append("_method", "POST");
    await fetch(route("homepage.sections.images.store", section.id), {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "")
      },
      body: fd
    });
    setUploading(false);
    router.reload({ only: [] });
    e.target.value = "";
  }
  function deleteImage(imageId) {
    if (!confirm("Remove this photo?")) return;
    router.delete(route("homepage.sections.images.destroy", [section.id, imageId]), {
      onSuccess: () => setImages((prev) => prev.filter((i) => i.id !== imageId))
    });
  }
  function updateCaption(imageId, caption) {
    router.patch(route("homepage.sections.images.update", [section.id, imageId]), { caption });
  }
  const isGallery = data.type === "gallery";
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isNew ? "New Section" : "Edit Section" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl px-4 py-8 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { href: route("homepage.index"), className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900", children: isNew ? `New ${isGallery ? "Gallery" : "Text"} Section` : `Edit Section` })
      ] }),
      flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700", children: flash.success }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Section Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.title,
              onChange: (e) => setData("title", e.target.value),
              placeholder: "e.g. About Our Association",
              className: inputCls
            }
          ),
          errors.title && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: [
            "Subtitle ",
            /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: "(optional)" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.subtitle,
              onChange: (e) => setData("subtitle", e.target.value),
              placeholder: "A short line below the title",
              className: inputCls
            }
          )
        ] }),
        !isGallery && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Body Text" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.body,
              onChange: (e) => setData("body", e.target.value),
              rows: 6,
              placeholder: "Write your content here…",
              className: inputCls + " resize-y"
            }
          ),
          errors.body && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.body })
        ] }),
        !isGallery && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: [
            "Cover Photo ",
            /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-400", children: "(optional)" })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => document.getElementById("cover-input").click(),
              className: "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-indigo-400 hover:bg-indigo-50",
              style: { minHeight: coverPreview ? 0 : 120 },
              children: [
                coverPreview ? /* @__PURE__ */ jsx("img", { src: coverPreview, alt: "Cover preview", className: "max-h-56 w-full object-cover" }) : /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
                  /* @__PURE__ */ jsx("svg", { className: "mx-auto h-8 w-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Click to upload cover photo" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "JPG, PNG up to 4 MB" })
                ] }),
                coverPreview && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100", children: /* @__PURE__ */ jsx("span", { className: "rounded-lg bg-white px-3 py-1 text-xs font-semibold text-gray-700", children: "Change photo" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx("input", { id: "cover-input", type: "file", accept: "image/*", className: "hidden", onChange: handleCoverChange })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60",
            children: processing ? "Saving…" : isNew ? "Create Section" : "Save Changes"
          }
        )
      ] }),
      !isNew && isGallery && /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-gray-900", children: "Gallery Photos" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => galleryInputRef.current?.click(),
              disabled: uploading,
              className: "inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 active:scale-95 disabled:opacity-60",
              children: [
                uploading ? /* @__PURE__ */ jsx("span", { className: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }) : /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
                "Upload Photos"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: galleryInputRef,
              type: "file",
              accept: "image/*",
              multiple: true,
              className: "hidden",
              onChange: uploadGalleryImages
            }
          )
        ] }),
        section.images.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-400", children: 'No photos yet. Click "Upload Photos" to add some.' }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: section.images.map((img) => /* @__PURE__ */ jsxs("div", { className: "group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: [
          /* @__PURE__ */ jsx("img", { src: img.url, alt: img.caption || "", className: "aspect-square w-full object-cover" }),
          /* @__PURE__ */ jsx("div", { className: "p-2", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              defaultValue: img.caption || "",
              placeholder: "Caption…",
              onBlur: (e) => updateCaption(img.id, e.target.value),
              className: "w-full rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-indigo-400 focus:outline-none"
            }
          ) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => deleteImage(img.id),
              className: "absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100",
              children: /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }, img.id)) })
      ] }),
      isNew && isGallery && /* @__PURE__ */ jsx("p", { className: "mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700", children: "Create the section first, then you'll be able to upload gallery photos." })
    ] })
  ] });
}
export {
  SectionEditor as default
};
