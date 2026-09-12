import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-CO3HPgl3.js";
import { usePage, useForm, router, Head } from "@inertiajs/react";
import { useState, useRef } from "react";
import { a as compressImages } from "./compressImage-CFkZP8E5.js";
function formatPrice(price) {
  if (price === null || price === void 0 || price === "") return null;
  if (/^\d+(\.\d+)?$/.test(String(price).trim())) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  }
  return "₹" + price;
}
function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function PhotoStrip({ photos }) {
  const [current, setCurrent] = useState(0);
  if (!photos.length) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-48 items-center justify-center bg-gray-100 rounded-t-2xl", children: /* @__PURE__ */ jsx("svg", { className: "h-12 w-12 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative h-48 bg-gray-100 rounded-t-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsx("img", { src: photos[current].url, alt: "product", className: "h-full w-full object-cover" }),
    photos.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setCurrent((c) => (c - 1 + photos.length) % photos.length),
          className: "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60",
          children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setCurrent((c) => (c + 1) % photos.length),
          className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60",
          children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1", children: photos.map((_, i) => /* @__PURE__ */ jsx("button", { onClick: () => setCurrent(i), className: `h-1.5 rounded-full transition-all ${i === current ? "w-4 bg-white" : "w-1.5 bg-white/60"}` }, i)) })
    ] })
  ] });
}
function ProductCard({ product, onEdit, onDelete, businessSlug }) {
  return /* @__PURE__ */ jsxs("div", { className: `overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg ${!product.is_published ? "opacity-60" : ""}`, children: [
    /* @__PURE__ */ jsx(PhotoStrip, { photos: product.photos }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 truncate", children: product.name }),
          product.category && /* @__PURE__ */ jsx("span", { className: "text-xs text-indigo-600 font-medium", children: product.category })
        ] }),
        product.price && /* @__PURE__ */ jsx("span", { className: "flex-none text-sm font-bold text-green-700", children: formatPrice(product.price) })
      ] }),
      product.description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600 line-clamp-3", children: product.description }),
      !product.is_published && /* @__PURE__ */ jsx("span", { className: "mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700", children: "Draft" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: product.page_url ?? route("business.show", businessSlug),
            target: "_blank",
            rel: "noreferrer",
            className: "flex min-h-[40px] flex-1 items-center justify-center rounded-lg bg-indigo-50 px-3 text-center text-xs font-semibold text-indigo-700 hover:bg-indigo-100",
            children: "View"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onEdit(product),
            className: "min-h-[40px] rounded-lg bg-gray-100 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-200",
            children: "Edit"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onDelete(product),
            className: "min-h-[40px] rounded-lg bg-red-50 px-3 text-xs font-semibold text-red-600 hover:bg-red-100",
            children: "Delete"
          }
        )
      ] })
    ] })
  ] });
}
function ExistingPhotoTile({ photo, markedForDelete, onToggle }) {
  return /* @__PURE__ */ jsxs("div", { className: "relative h-20 w-20 flex-none overflow-hidden rounded-lg", children: [
    /* @__PURE__ */ jsx("img", { src: photo.url, alt: "", className: `h-full w-full object-cover ${markedForDelete ? "opacity-30" : ""}` }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onToggle(photo.id),
        className: `absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow before:absolute before:-inset-2 before:content-[''] ${markedForDelete ? "bg-green-500 text-white" : "bg-red-500 text-white"}`,
        children: markedForDelete ? "↩" : "✕"
      }
    )
  ] });
}
function ProductModal({ product, businessSlug, onClose }) {
  const isEdit = !!product;
  const fileRef = useRef(null);
  const [newPhotoFiles, setNewPhotoFiles] = useState([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState([]);
  const [deletePhotoIds, setDeletePhotoIds] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const { data, setData, processing, errors, reset } = useForm({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    category: product?.category ?? "",
    is_published: product?.is_published ?? true
  });
  async function handleFileChange(e) {
    const raw = Array.from(e.target.files);
    e.target.value = "";
    if (!raw.length) return;
    setCompressing(true);
    const results = await compressImages(raw);
    setCompressing(false);
    const compressed = results.map((r) => r.file);
    setNewPhotoFiles((prev) => [...prev, ...compressed]);
    setNewPhotoPreviews((prev) => [...prev, ...compressed.map((f) => URL.createObjectURL(f))]);
  }
  function removeNewPhoto(index) {
    URL.revokeObjectURL(newPhotoPreviews[index]);
    setNewPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  }
  function toggleDeletePhoto(id) {
    setDeletePhotoIds(
      (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function buildFormData() {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("slug", data.slug ?? "");
    fd.append("description", data.description ?? "");
    fd.append("price", data.price ?? "");
    fd.append("category", data.category ?? "");
    fd.append("is_published", data.is_published ? "1" : "0");
    newPhotoFiles.forEach((f) => fd.append("photos[]", f));
    if (isEdit) {
      deletePhotoIds.forEach((id) => fd.append("delete_photo_ids[]", id));
    }
    return fd;
  }
  function submit(e) {
    e.preventDefault();
    const fd = buildFormData();
    const url = isEdit ? route("my.products.update", product.id) : route("my.products.store");
    router.post(url, fd, {
      forceFormData: true,
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  }
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center",
      onClick: handleBackdrop,
      children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 px-6 py-4 flex-none", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: isEdit ? "Edit Product" : "Add Product" }),
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "overflow-y-auto flex-1 space-y-4 px-6 py-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Product Name *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => {
                  const nextName = e.target.value;
                  setData("name", nextName);
                  if (!isEdit) setData("slug", slugify(nextName));
                },
                placeholder: "e.g. Premium Cotton Saree",
                className: "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Product URL Slug" }),
            /* @__PURE__ */ jsxs("div", { className: "flex rounded-xl border border-gray-200 bg-gray-50 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center border-r border-gray-200 px-3 text-xs text-gray-400", children: [
                "/",
                businessSlug,
                "/"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.slug,
                  onChange: (e) => setData("slug", slugify(e.target.value)),
                  placeholder: "premium-cotton-saree",
                  className: "h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                }
              )
            ] }),
            errors.slug && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.slug })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Price (₹)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.price,
                  onChange: (e) => setData("price", e.target.value),
                  placeholder: "e.g. 500 or 1000-1500",
                  className: "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                }
              ),
              errors.price && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.price })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Category" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.category,
                  onChange: (e) => setData("category", e.target.value),
                  placeholder: "e.g. Clothing",
                  className: "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-semibold text-gray-700", children: "Description" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: data.description,
                onChange: (e) => setData("description", e.target.value),
                placeholder: "Describe the product…",
                rows: 3,
                className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              }
            )
          ] }),
          isEdit && product.photos.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-semibold text-gray-700", children: "Existing Photos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: product.photos.map((photo) => /* @__PURE__ */ jsx(
              ExistingPhotoTile,
              {
                photo,
                markedForDelete: deletePhotoIds.includes(photo.id),
                onToggle: toggleDeletePhoto
              },
              photo.id
            )) }),
            deletePhotoIds.length > 0 && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 text-xs text-red-500", children: [
              deletePhotoIds.length,
              " photo(s) will be removed on save"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-semibold text-gray-700", children: isEdit ? "Add More Photos" : "Product Photos" }),
            newPhotoPreviews.length > 0 && /* @__PURE__ */ jsx("div", { className: "mb-2 flex flex-wrap gap-2", children: newPhotoPreviews.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative h-20 w-20 flex-none overflow-hidden rounded-lg", children: [
              /* @__PURE__ */ jsx("img", { src, alt: "", className: "h-full w-full object-cover" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeNewPhoto(i),
                  className: "absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow before:absolute before:-inset-2 before:content-['']",
                  children: "✕"
                }
              )
            ] }, i)) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => fileRef.current?.click(),
                disabled: compressing,
                className: "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-60",
                children: compressing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("svg", { className: "h-4 w-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                    /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                    /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })
                  ] }),
                  "Compressing…"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
                  "Choose photos"
                ] })
              }
            ),
            /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: handleFileChange }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-400", children: "Up to 10 images — auto-compressed before upload" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-700", children: "Visible on business page" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Unpublished products are hidden from visitors" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setData("is_published", !data.is_published),
                className: `relative h-6 w-11 flex-none rounded-full transition-colors ${data.is_published ? "bg-indigo-600" : "bg-gray-300"}`,
                children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data.is_published ? "translate-x-5" : "translate-x-0.5"}` })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1 pb-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "flex-1 h-12 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing || compressing,
                className: "flex-1 h-12 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60",
                children: processing ? "Saving…" : isEdit ? "Save Changes" : "Add Product"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function DeleteModal({ product, onClose }) {
  const [deleting, setDeleting] = useState(false);
  function confirm() {
    setDeleting(true);
    router.delete(route("my.products.destroy", product.id), {
      onFinish: () => {
        setDeleting(false);
        onClose();
      }
    });
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Delete product?" }),
    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-600", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
        '"',
        product.name,
        '"'
      ] }),
      " and all its photos will be permanently removed."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex gap-3", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50", children: "Cancel" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: confirm,
          disabled: deleting,
          className: "flex-1 h-11 rounded-xl bg-red-600 text-sm font-bold text-white shadow disabled:opacity-60 hover:bg-red-700",
          children: deleting ? "Deleting…" : "Delete"
        }
      )
    ] })
  ] }) });
}
function ProductsTab({ products, businessSlug }) {
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const { flash } = usePage().props;
  return /* @__PURE__ */ jsxs("div", { children: [
    flash?.success && /* @__PURE__ */ jsx("div", { className: "mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-200", children: flash.success }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "My Products" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "These appear on your public business page" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: route("business.show", businessSlug),
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }),
              "View Page"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowAdd(true),
            className: "inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition active:scale-95",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
              "Add Product"
            ]
          }
        )
      ] })
    ] }),
    products.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50", children: /* @__PURE__ */ jsx("svg", { className: "h-7 w-7 text-indigo-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }) }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-700", children: "No products yet" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-400", children: "Add your first product to showcase on your business page" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowAdd(true),
          className: "mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-600/30",
          children: "Add Product"
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", children: products.map((product) => /* @__PURE__ */ jsx(
      ProductCard,
      {
        product,
        businessSlug,
        onEdit: (p) => setEditProduct(p),
        onDelete: (p) => setDeleteProduct(p)
      },
      product.id
    )) }),
    showAdd && /* @__PURE__ */ jsx(ProductModal, { businessSlug, onClose: () => setShowAdd(false) }),
    editProduct && /* @__PURE__ */ jsx(ProductModal, { product: editProduct, businessSlug, onClose: () => setEditProduct(null) }),
    deleteProduct && /* @__PURE__ */ jsx(DeleteModal, { product: deleteProduct, onClose: () => setDeleteProduct(null) })
  ] });
}
function MyProducts({ products, businessSlug }) {
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800", children: "My Products" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Manage your business products and showcase" })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "My Products" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(ProductsTab, { products, businessSlug }) }) })
      ]
    }
  );
}
export {
  MyProducts as default
};
