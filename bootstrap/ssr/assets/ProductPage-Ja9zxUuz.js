import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { useState } from "react";
function formatPrice(price) {
  if (!price) return null;
  if (/^\d+(\.\d+)?$/.test(String(price).trim())) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  }
  return "₹" + price;
}
function whatsappLink(number, text = "") {
  const digits = number?.replace(/\D/g, "") ?? "";
  if (!digits) return null;
  const num = digits.startsWith("91") ? digits : `91${digits}`;
  return `https://wa.me/${num}${text ? "?text=" + encodeURIComponent(text) : ""}`;
}
function ShareButton({ url, title }) {
  const handleShare = async () => {
    const shareData = {
      title,
      text: `Check out ${title}`,
      url
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        window.alert("Product link copied to clipboard.");
        return;
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, "_blank", "noopener,noreferrer");
    } catch (error) {
      if (error?.name !== "AbortError") {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, "_blank", "noopener,noreferrer");
      }
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: handleShare,
      "aria-label": "Share product",
      className: "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50",
      children: [
        /* @__PURE__ */ jsxs("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("circle", { cx: "18", cy: "5", r: "2.5", strokeWidth: "1.8" }),
          /* @__PURE__ */ jsx("circle", { cx: "6", cy: "12", r: "2.5", strokeWidth: "1.8" }),
          /* @__PURE__ */ jsx("circle", { cx: "18", cy: "19", r: "2.5", strokeWidth: "1.8" }),
          /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.8", d: "M8.4 11.1l7.1-4.4M8.4 12.9l7.1 4.4" })
        ] }),
        /* @__PURE__ */ jsx("span", { children: "Share" })
      ]
    }
  );
}
function ProductSeo({ member, product }) {
  const siteName = "UVA Vyapari Welfare Association";
  const firmName = member.firm_name ?? member.name;
  const title = `${product.name} | ${firmName} | ${siteName}`;
  const description = product.description ? product.description.slice(0, 155) : `${product.name} from ${firmName}. Contact this UVA member for details.`;
  const image = product.photos?.[0]?.url ?? member.firm_photo_url ?? member.photo_url ?? "/storage/logo.jpg";
  const numericPrice = /^\d+(\.\d+)?$/.test(String(product.price ?? "").trim()) ? product.price : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    ...product.category && { category: product.category },
    ...product.photos?.length && { image: product.photos.map((photo) => photo.url) },
    brand: { "@type": "Brand", name: firmName },
    ...numericPrice && {
      offers: {
        "@type": "Offer",
        price: numericPrice,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: product.page_url,
        seller: {
          "@type": "LocalBusiness",
          name: firmName,
          ...member.phone_number && { telephone: member.phone_number },
          ...member.firm_address && { address: member.firm_address }
        }
      }
    }
  };
  return /* @__PURE__ */ jsxs(Head, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: product.page_url }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: "product" }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: product.page_url }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: image }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: title }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: image }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(jsonLd) })
  ] });
}
function Gallery({ photos, productName }) {
  const [current, setCurrent] = useState(0);
  if (!photos.length) {
    return /* @__PURE__ */ jsx("div", { className: "flex aspect-[4/3] items-center justify-center rounded-2xl bg-gray-100", children: /* @__PURE__ */ jsx("svg", { className: "h-16 w-16 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl bg-gray-100", children: /* @__PURE__ */ jsx("img", { src: photos[current].url, alt: productName, className: "aspect-[4/3] w-full object-cover" }) }),
    photos.length > 1 && /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-5 gap-2", children: photos.map((photo, index) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setCurrent(index),
        className: `overflow-hidden rounded-lg border-2 ${index === current ? "border-indigo-600" : "border-transparent"}`,
        children: /* @__PURE__ */ jsx("img", { src: photo.url, alt: "", className: "aspect-square w-full object-cover" })
      },
      photo.id
    )) })
  ] });
}
function ProductPage({ member, product }) {
  const firmName = member.firm_name ?? member.name;
  const sellerName = member.firm_name ? `M/s ${firmName}` : firmName;
  const contactNumber = member.whatsapp_number || member.phone_number;
  const generalWaLink = contactNumber ? whatsappLink(contactNumber, `Hi! I found you on UVA Vyapari Welfare Association. I'd like to know more about your business.`) : null;
  const waLink = contactNumber ? whatsappLink(contactNumber, `Hi! I'm interested in "${product.name}". Please share more details.`) : null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ProductSeo, { member, product }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_32%,_#f8fafc_100%)] text-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          member.photo_url ? /* @__PURE__ */ jsx("img", { src: member.photo_url, alt: member.name, className: "h-14 w-14 rounded-full object-cover ring-2 ring-indigo-100 shadow-sm" }) : /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-lg font-bold text-white ring-2 ring-indigo-100 shadow-sm", children: firmName.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: member.page_url,
                className: "inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-700 transition hover:bg-indigo-100",
                children: "Home Page"
              }
            ),
            /* @__PURE__ */ jsx("a", { href: member.page_url, className: "mt-2 block text-lg font-extrabold text-slate-900 transition hover:text-indigo-600", children: sellerName }),
            member.firm_address && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: member.firm_address })
          ] })
        ] }),
        generalWaLink && /* @__PURE__ */ jsxs("a", { href: generalWaLink, target: "_blank", rel: "noreferrer", className: "inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_26px_rgba(34,197,94,0.28)] transition hover:bg-green-600", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M20.52 3.48A11.78 11.78 0 0 0 12.02 0C5.45 0 .14 5.31.14 11.86c0 2.09.54 4.13 1.57 5.93L.02 24l6.41-1.67a11.9 11.9 0 0 0 5.59 1.68h.01c6.57 0 11.88-5.31 11.88-11.86 0-3.17-1.24-6.15-3.39-8.37ZM12.02 21.6c-1.8 0-3.56-.49-5.1-1.4l-.36-.22-3.8 1 1.01-3.7-.24-.38A9.76 9.76 0 0 1 2.24 11.9c0-5.38 4.39-9.76 9.78-9.76 2.6 0 5.05 1.01 6.88 2.84a9.7 9.7 0 0 1 2.85 6.92c0 5.38-4.39 9.76-9.78 9.76Zm5.36-7.3c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.14-.17.19-.35.22-.64.07-.29-.15-1.23-.45-2.35-1.44-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.35.44-.52.15-.17.2-.29.29-.49.1-.2.05-.38-.03-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.08-.8.38-.27.29-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.11 3.2 5.11 4.49.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.72-.7 1.96-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.2-.55-.35Z" }) }),
          "WhatsApp"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-8 p-4 sm:p-6 lg:grid-cols-[1.12fr_0.88fr] lg:p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-[24px] bg-slate-50 p-3 sm:p-4", children: /* @__PURE__ */ jsx(Gallery, { photos: product.photos, productName: product.name }) }),
          /* @__PURE__ */ jsxs("section", { className: "flex flex-col justify-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2", children: [
              product.category && /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-700", children: product.category }),
              member.nature_of_business && /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600", children: member.nature_of_business })
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl", children: product.name }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 flex items-baseline gap-3", children: product.price ? /* @__PURE__ */ jsx("p", { className: "text-3xl font-extrabold text-slate-900", children: formatPrice(product.price) }) : /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-slate-500", children: "Price on request" }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
              waLink && /* @__PURE__ */ jsx("a", { href: waLink, target: "_blank", rel: "noreferrer", className: "inline-flex h-12 items-center justify-center rounded-xl bg-green-500 px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(34,197,94,0.25)] transition hover:bg-green-600", children: "WhatsApp Enquiry" }),
              member.phone_number && /* @__PURE__ */ jsx("a", { href: `tel:${member.phone_number}`, className: "inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50", children: "Call Seller" }),
              /* @__PURE__ */ jsx(ShareButton, { url: product.page_url, title: product.name })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-slate-200 bg-slate-50/80 px-4 py-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.14em] text-slate-500", children: "About this business" }),
          member.business_services && /* @__PURE__ */ jsx("p", { className: "mt-3 whitespace-pre-line text-base leading-relaxed text-slate-600", children: member.business_services }),
          !member.business_services && /* @__PURE__ */ jsx("p", { className: "mt-3 text-base leading-relaxed text-slate-500", children: "Please contact the seller for more information about their services and offerings." })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  ProductPage as default
};
