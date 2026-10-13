import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Phone, Mail, Search, X, Share2 } from "lucide-react";
import { clsx } from "clsx";
function cn(...args) {
  return clsx(...args);
}
function PageLink({ href, active, children, ...rest }) {
  const classes = cn(
    "flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent",
    active ? "bg-primary text-white" : "text-primary/70 hover:bg-primary/5",
    !href && "pointer-events-none opacity-30"
  );
  if (!href) {
    return /* @__PURE__ */ jsx("span", { className: classes, ...rest, children });
  }
  return /* @__PURE__ */ jsx(Link, { href, className: classes, preserveScroll: true, ...rest, children });
}
function Pagination({ pagination }) {
  const { currentPage, lastPage, prevPageUrl, nextPageUrl, pageUrls } = pagination;
  if (!lastPage || lastPage <= 1) return null;
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1).filter((p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1);
  return /* @__PURE__ */ jsxs("nav", { "aria-label": "Pagination", className: "mt-10 flex items-center justify-center gap-1", children: [
    /* @__PURE__ */ jsx(PageLink, { href: prevPageUrl, "aria-label": "Previous page", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }) }),
    pages.map((page, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
      i > 0 && pages[i - 1] !== page - 1 && /* @__PURE__ */ jsx("span", { className: "px-1.5 text-primary/30", children: "…" }),
      /* @__PURE__ */ jsx(PageLink, { href: pageUrls[page], active: page === currentPage, children: page })
    ] }, page)),
    /* @__PURE__ */ jsx(PageLink, { href: nextPageUrl, "aria-label": "Next page", children: /* @__PURE__ */ jsx(ChevronRight, { size: 16 }) })
  ] });
}
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
        window.alert("Business page link copied to clipboard.");
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
      "aria-label": "Share business page",
      className: "inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-3 py-1.5 text-xs font-bold text-primary/70 transition hover:bg-primary/5",
      children: [
        /* @__PURE__ */ jsx(Share2, { className: "h-3.5 w-3.5" }),
        "Share"
      ]
    }
  );
}
function ExpandableText({ text, wordLimit = 28, className = "" }) {
  const [expanded, setExpanded] = useState(false);
  const words = text.trim().split(/\s+/);
  const isLong = words.length > wordLimit;
  const shown = expanded || !isLong ? text : words.slice(0, wordLimit).join(" ") + "…";
  return /* @__PURE__ */ jsxs("p", { className, children: [
    shown,
    isLong && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setExpanded((e) => !e),
        className: "ml-1.5 font-semibold text-accent hover:underline",
        children: expanded ? "less" : "more"
      }
    )
  ] });
}
function PhotoCarousel({ photos, productName }) {
  const [current, setCurrent] = useState(0);
  if (!photos.length) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center bg-primary/5 sm:h-72", children: /* @__PURE__ */ jsx("svg", { className: "h-16 w-16 text-primary/20", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-primary/5", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: photos[current].url,
        alt: productName,
        className: "h-64 w-full object-cover sm:h-72"
      }
    ),
    photos.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            setCurrent((c) => (c - 1 + photos.length) % photos.length);
          },
          className: "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60",
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            setCurrent((c) => (c + 1) % photos.length);
          },
          className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60",
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 right-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white", children: [
        current + 1,
        " / ",
        photos.length
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1", children: photos.map((_, i) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            setCurrent(i);
          },
          className: `h-1.5 rounded-full transition-all ${i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"}`
        },
        i
      )) })
    ] })
  ] });
}
function ProductCard({ product, whatsapp }) {
  const waLink = whatsapp ? whatsappLink(whatsapp, `Hi! I'm interested in "${product.name}". Please share more details.`) : null;
  const detailUrl = product.page_url ?? null;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col overflow-hidden rounded-[24px] border border-primary/10 bg-white shadow-[0_10px_30px_rgba(28,28,26,0.04)] transition hover:shadow-[0_14px_38px_rgba(28,28,26,0.08)]", children: [
    detailUrl ? /* @__PURE__ */ jsx("a", { href: detailUrl, className: "block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2", children: /* @__PURE__ */ jsx(PhotoCarousel, { photos: product.photos, productName: product.name }) }) : /* @__PURE__ */ jsx(PhotoCarousel, { photos: product.photos, productName: product.name }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        product.category && /* @__PURE__ */ jsx("span", { className: "mb-1.5 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent", children: product.category }),
        detailUrl ? /* @__PURE__ */ jsx("a", { href: detailUrl, className: "block text-base font-bold text-primary hover:text-accent", children: product.name }) : /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-primary", children: product.name }),
        product.description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-primary/60", children: product.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3", children: [
        product.price ? /* @__PURE__ */ jsx("span", { className: "text-xl font-extrabold text-primary", children: formatPrice(product.price) }) : /* @__PURE__ */ jsx("span", { className: "text-sm italic text-primary/40", children: "Price on request" }),
        waLink ? /* @__PURE__ */ jsxs(
          "a",
          {
            href: waLink,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-green-500/30 transition hover:bg-green-600 active:scale-95",
            children: [
              /* @__PURE__ */ jsxs("svg", { className: "h-4 w-4 flex-none", viewBox: "0 0 24 24", fill: "currentColor", children: [
                /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" }),
                /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.851L.057 23.943l6.306-1.454A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.741.863.944-3.617-.243-.387A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" })
              ] }),
              "WhatsApp Us"
            ]
          }
        ) : /* @__PURE__ */ jsx("span", { className: "text-xs text-primary/40", children: "No contact set" })
      ] }),
      detailUrl && /* @__PURE__ */ jsx(
        "a",
        {
          href: detailUrl,
          className: "mt-3 inline-flex h-10 items-center justify-center rounded-full border border-accent/20 bg-accent/5 px-4 text-sm font-bold text-accent transition hover:bg-accent/10",
          children: "View Details"
        }
      )
    ] })
  ] });
}
function CategoryTabs({ activeCategory, categoryTabs, uncategorizedCount, totalCount, baseUrl }) {
  const tabs = [
    { slug: null, label: "All Products", count: totalCount },
    ...categoryTabs.map((c) => ({ slug: c.slug, label: c.name, count: c.count })),
    ...uncategorizedCount > 0 ? [{ slug: "uncategorized", label: "Uncategorized", count: uncategorizedCount }] : []
  ];
  if (tabs.length <= 1) return null;
  return /* @__PURE__ */ jsx("div", { className: "mb-6 flex flex-wrap gap-2", children: tabs.map((tab) => {
    const isActive = (activeCategory ?? null) === tab.slug;
    const href = tab.slug ? `${baseUrl}?category=${tab.slug}` : baseUrl;
    return /* @__PURE__ */ jsxs(
      Link,
      {
        href,
        preserveScroll: true,
        className: cn(
          "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition",
          isActive ? "bg-primary text-white" : "bg-primary/5 text-primary/70 hover:bg-primary/10"
        ),
        children: [
          tab.label,
          /* @__PURE__ */ jsx("span", { className: cn("rounded-full px-1.5 text-xs", isActive ? "bg-white/20" : "bg-primary/10"), children: tab.count })
        ]
      },
      tab.slug ?? "all"
    );
  }) });
}
function SeoHead({ member, products }) {
  const siteName = "UVA Vyapari Welfare Association";
  const firmName = member.firm_name ?? member.name;
  const title = member.firm_name ? `${member.firm_name} | ${member.name} | ${siteName}` : `${member.name} | ${siteName}`;
  const cityMatch = member.firm_address?.match(/([A-Za-zऀ-ॿ]+)(?:\s*[-,]\s*\d{6})?$/) ?? null;
  const city = cityMatch?.[1] ?? "";
  const rawDesc = member.business_services || member.nature_of_business || "";
  const description = rawDesc ? `${firmName}${city ? ", " + city : ""} — ${rawDesc.slice(0, 140)}` : `${firmName}${city ? " in " + city : ""} is a member of ${siteName}. Explore their products and services.`;
  const ogImage = member.firm_photo_url ?? member.photo_url ?? "/storage/logo.jpg";
  const faviconUrl = member.firm_photo_url ?? member.photo_url ?? null;
  const url = member.page_url;
  const productNames = products.slice(0, 5).map((p) => p.name).join(", ");
  const keywords = [
    firmName,
    member.name,
    member.nature_of_business,
    city,
    siteName,
    productNames
  ].filter(Boolean).join(", ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: firmName,
    description,
    url,
    ...member.phone_number && { telephone: member.phone_number },
    ...member.email && { email: member.email },
    ...member.firm_address && { address: { "@type": "PostalAddress", streetAddress: member.firm_address } },
    ...ogImage && { image: ogImage },
    ...products.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Products by ${firmName}`,
        itemListElement: products.slice(0, 10).map((p) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: p.name,
            ...p.description && { description: p.description },
            ...p.price && { offers: { "@type": "Offer", price: p.price, priceCurrency: "INR" } }
          }
        }))
      }
    }
  };
  const productJsonLd = products.slice(0, 20).map((p) => {
    const numericPrice = /^\d+(\.\d+)?$/.test(String(p.price ?? "").trim()) ? p.price : null;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      ...p.description && { description: p.description },
      ...p.category && { category: p.category },
      ...p.photos?.[0]?.url && { image: p.photos.map((ph) => ph.url) },
      brand: { "@type": "Brand", name: firmName },
      ...numericPrice && {
        offers: {
          "@type": "Offer",
          price: numericPrice,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: p.page_url ?? url
        }
      }
    };
  });
  return /* @__PURE__ */ jsxs(Head, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "keywords", content: keywords }),
    /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: url }),
    /* @__PURE__ */ jsx("link", { rel: "icon", href: faviconUrl ?? "data:," }),
    /* @__PURE__ */ jsx("link", { rel: "apple-touch-icon", href: faviconUrl ?? "data:," }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: "business.business" }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: url }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: ogImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:alt", content: firmName }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: siteName }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: title }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: ogImage }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(jsonLd) }),
    productJsonLd.map((pld, i) => /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(pld) }, i))
  ] });
}
function BusinessPage({ member, products, activeCategory, categoryTabs, uncategorizedCount, totalCount, pagination }) {
  const contactNumber = member.whatsapp_number || member.phone_number;
  const generalWaLink = contactNumber ? whatsappLink(contactNumber, `Hi! I found you on UVA Vyapari Welfare Association. I'd like to know more about your business.`) : null;
  const [query, setQuery] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("product") ?? "";
  });
  useEffect(() => {
    if (query) {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
  const q = query.trim().toLowerCase();
  const filteredProducts = q ? products.filter(
    (p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
  ) : products;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SeoHead, { member, products }),
    /* @__PURE__ */ jsxs("div", { className: "storefront-theme min-h-screen bg-surface", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b border-primary/10 bg-surface/90 backdrop-blur-sm sticky top-0 z-30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6", children: [
        /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2 text-sm font-semibold text-primary/60 hover:text-accent transition", children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
          "UVA Members"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ShareButton, { url: member.page_url, title: member.firm_name ?? member.name }),
          generalWaLink && /* @__PURE__ */ jsxs(
            "a",
            {
              href: generalWaLink,
              target: "_blank",
              rel: "noreferrer",
              className: "inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition",
              children: [
                /* @__PURE__ */ jsxs("svg", { className: "h-3.5 w-3.5", viewBox: "0 0 24 24", fill: "currentColor", children: [
                  /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" }),
                  /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.851L.057 23.943l6.306-1.454A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.741.863.944-3.617-.243-.387A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" })
                ] }),
                "WhatsApp"
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white border-b border-primary/10 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-start", children: [
        member.firm_photo_url && /* @__PURE__ */ jsx("div", { className: "relative h-48 w-full flex-none overflow-hidden sm:h-64 sm:w-1/5", children: /* @__PURE__ */ jsx("img", { src: member.firm_photo_url, alt: member.firm_name ?? member.name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 sm:gap-5", children: [
          member.photo_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: member.photo_url,
              alt: member.name,
              className: "h-20 w-20 flex-none rounded-[20px] object-cover shadow-md sm:h-24 sm:w-24"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "flex h-20 w-20 flex-none items-center justify-center rounded-[20px] bg-primary text-2xl font-extrabold text-white shadow-md sm:h-24 sm:w-24 sm:text-3xl", children: (member.firm_name ?? member.name).charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            member.firm_name && /* @__PURE__ */ jsxs("h1", { className: "text-xl font-extrabold text-primary sm:text-3xl", children: [
              "M/s ",
              member.firm_name
            ] }),
            /* @__PURE__ */ jsx("p", { className: `font-semibold text-primary/60 ${!member.firm_name ? "text-xl text-primary sm:text-2xl" : "text-sm sm:text-base"}`, children: member.name }),
            member.nature_of_business && /* @__PURE__ */ jsx("span", { className: "mt-2 inline-block rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent", children: member.nature_of_business }),
            member.firm_address && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-start gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 h-4 w-4 flex-none text-primary/35" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-primary/60", children: member.firm_address })
            ] }),
            member.phone_number && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 flex-none text-primary/35" }),
              /* @__PURE__ */ jsx("a", { href: `tel:${member.phone_number}`, className: "text-sm text-primary/60 hover:text-accent hover:underline", children: member.phone_number })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
              member.whatsapp_number && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: whatsappLink(member.whatsapp_number) ?? "#",
                  target: "_blank",
                  rel: "noreferrer",
                  className: "inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-green-500/25 hover:bg-green-600 transition active:scale-95",
                  children: [
                    /* @__PURE__ */ jsxs("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "currentColor", children: [
                      /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.851L.057 23.943l6.306-1.454A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.741.863.944-3.617-.243-.387A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" })
                    ] }),
                    member.whatsapp_number
                  ]
                }
              ),
              member.phone_number && !member.whatsapp_number && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `tel:${member.phone_number}`,
                  className: "inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-sm font-semibold text-primary/70 hover:bg-primary/5 transition",
                  children: [
                    /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-primary/35" }),
                    member.phone_number
                  ]
                }
              ),
              member.email && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `mailto:${member.email}`,
                  className: "inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-sm font-semibold text-primary/70 hover:bg-primary/5 transition",
                  children: [
                    /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-primary/35" }),
                    member.email
                  ]
                }
              )
            ] }),
            member.business_services && /* @__PURE__ */ jsx(
              ExpandableText,
              {
                text: member.business_services,
                wordLimit: 28,
                className: "mt-4 text-sm leading-relaxed text-primary/60 max-w-2xl"
              }
            )
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { id: "products", className: "mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-baseline gap-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-primary", children: "Products & Services" }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full bg-accent/10 px-2.5 py-0.5 text-sm font-bold text-accent", children: totalCount })
        ] }),
        /* @__PURE__ */ jsx(
          CategoryTabs,
          {
            activeCategory,
            categoryTabs,
            uncategorizedCount,
            totalCount,
            baseUrl: member.page_url
          }
        ),
        products.length > 0 && /* @__PURE__ */ jsxs("div", { className: "relative mx-auto mb-6 max-w-md", children: [
          /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/35" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Search products on this page…",
              className: "h-11 w-full rounded-full border border-primary/10 bg-white pl-10 pr-9 text-sm text-primary placeholder-primary/40 shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            }
          ),
          query && /* @__PURE__ */ jsx("button", { onClick: () => setQuery(""), className: "absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary/70", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
        ] }),
        products.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-[24px] border-2 border-dashed border-primary/10 py-24 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-primary/40", children: "No products listed yet." }) }) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-[24px] border-2 border-dashed border-primary/10 py-16 text-center", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-primary/40", children: [
            'No products match "',
            query,
            '"'
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setQuery(""), className: "mt-2 text-xs text-accent hover:underline", children: "Clear search" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: filteredProducts.map((p) => /* @__PURE__ */ jsx(
          ProductCard,
          {
            product: p,
            whatsapp: member.whatsapp_number || member.phone_number
          },
          p.id
        )) }),
        !q && /* @__PURE__ */ jsx(Pagination, { pagination })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 border-t border-primary/10 bg-white py-6 text-center text-xs text-primary/40", children: [
        "Member of ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-primary/60", children: "UVA Vyapari Welfare Association" })
      ] })
    ] })
  ] });
}
export {
  BusinessPage as default
};
