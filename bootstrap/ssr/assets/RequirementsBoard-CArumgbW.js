import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useForm, router } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import { f as formatBytes, c as compressImage } from "./compressImage-CFkZP8E5.js";
const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";
const textareaClass = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none";
const FieldError = ({ message }) => message ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: message }) : null;
const Label = ({ en, hi, optional = false }) => /* @__PURE__ */ jsxs("div", { className: "mb-1.5", children: [
  /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold uppercase tracking-wide text-gray-500", children: [
    en,
    optional && /* @__PURE__ */ jsx("span", { className: "ml-1 font-normal normal-case tracking-normal text-gray-400", children: "(optional)" })
  ] }),
  /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-indigo-400", children: hi })
] });
const SectionHeader = ({ icon, en, hi, subtitleEn, subtitleHi }) => /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3 border-b border-gray-100 pb-4", children: [
  /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg", children: icon }),
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-gray-800", children: [
      en,
      " ",
      /* @__PURE__ */ jsx("span", { className: "font-normal text-indigo-400", children: hi })
    ] }),
    subtitleEn && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400", children: [
      subtitleEn,
      " · ",
      /* @__PURE__ */ jsx("span", { className: "text-indigo-300", children: subtitleHi })
    ] })
  ] })
] });
const BUSINESS_TYPES = [
  { value: "wholesale", label: "Wholesale", hindi: "थोक" },
  { value: "retail", label: "Retail", hindi: "खुदरा" },
  { value: "both", label: "Both", hindi: "दोनों" }
];
const PROFILE_MAX_BYTES = 512 * 1024;
const buildChildren = (count, existing) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(existing?.[i] ?? { name: "", date_of_birth: "", gender: "" });
  }
  return result;
};
function MemberProfileForm({ profile, userName }) {
  const fileInputRef = useRef(null);
  const firmPhotoRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(profile?.photo_url ?? null);
  const [firmPhotoPreview, setFirmPhotoPreview] = useState(profile?.firm_photo_url ?? null);
  const [photoMeta, setPhotoMeta] = useState(null);
  const [firmPhotoMeta, setFirmPhotoMeta] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [compressingFirm, setCompressingFirm] = useState(false);
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setPhotoMeta(null);
    if (file.size > PROFILE_MAX_BYTES) {
      setCompressing(true);
      const result = await compressImage(file, PROFILE_MAX_BYTES);
      setCompressing(false);
      setData("photo", result.file);
      setPhotoMeta({ name: result.file.name, originalSize: file.size, finalSize: result.finalSize ?? result.file.size, compressed: result.compressed });
      setPreviewUrl(URL.createObjectURL(result.file));
    } else {
      setData("photo", file);
      setPhotoMeta({ name: file.name, finalSize: file.size, compressed: false });
    }
  };
  const handleFirmPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFirmPhotoPreview(URL.createObjectURL(file));
    setFirmPhotoMeta(null);
    if (file.size > PROFILE_MAX_BYTES) {
      setCompressingFirm(true);
      const result = await compressImage(file, PROFILE_MAX_BYTES);
      setCompressingFirm(false);
      setData("firm_photo", result.file);
      setFirmPhotoMeta({ name: result.file.name, originalSize: file.size, finalSize: result.finalSize ?? result.file.size, compressed: result.compressed });
      setFirmPhotoPreview(URL.createObjectURL(result.file));
    } else {
      setData("firm_photo", file);
      setFirmPhotoMeta({ name: file.name, finalSize: file.size, compressed: false });
    }
  };
  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    photo: null,
    firm_photo: null,
    father_husband_name: profile?.father_husband_name ?? "",
    firm_name: profile?.firm_name ?? "",
    firm_address: profile?.firm_address ?? "",
    phone_number: profile?.phone_number ?? "",
    whatsapp_number: profile?.whatsapp_number ?? "",
    email: profile?.email ?? "",
    nature_of_business: profile?.nature_of_business ?? "",
    business_services: profile?.business_services ?? "",
    residential_address: profile?.residential_address ?? "",
    date_of_birth: profile?.date_of_birth ?? "",
    is_married: profile?.is_married ?? false,
    spouse_name: profile?.spouse_name ?? "",
    spouse_phone_number: profile?.spouse_phone_number ?? "",
    spouse_date_of_birth: profile?.spouse_date_of_birth ?? "",
    anniversary_date: profile?.anniversary_date ?? "",
    number_of_children: profile?.number_of_children ?? 0,
    children: buildChildren(profile?.number_of_children ?? 0, profile?.children)
  });
  useEffect(() => {
    const count = parseInt(data.number_of_children) || 0;
    setData("children", buildChildren(count, data.children));
  }, [data.number_of_children]);
  const updateChild = (index, field, value) => {
    const updated = [...data.children];
    updated[index] = { ...updated[index], [field]: value };
    setData("children", updated);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("member-profile.store"), { forceFormData: true });
  };
  return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl bg-white shadow-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-white", children: [
        "Member Profile ",
        /* @__PURE__ */ jsx("span", { className: "font-normal text-indigo-200", children: "/ सदस्य प्रोफाइल" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-indigo-200", children: [
        "Keep your association profile up to date · ",
        /* @__PURE__ */ jsx("span", { className: "text-indigo-300", children: "अपनी एसोसिएशन प्रोफाइल अपडेट रखें" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-10 p-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(SectionHeader, { icon: "👤", en: "Personal Information", hi: "/ व्यक्तिगत जानकारी", subtitleEn: "Your basic details", subtitleHi: "आपकी बुनियादी जानकारी" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => fileInputRef.current?.click(),
                className: "group relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-indigo-200 transition hover:ring-indigo-400",
                children: [
                  previewUrl ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: previewUrl,
                      alt: "Member photo",
                      className: "h-full w-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-3xl font-bold text-white", children: userName?.charAt(0).toUpperCase() }),
                  /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100", children: [
                    /* @__PURE__ */ jsxs("svg", { className: "h-6 w-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
                      /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }),
                      /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-white", children: "Change" })
                  ] })
                ]
              }
            ),
            previewUrl && /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-400" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/jpeg,image/png,image/jpg,image/webp",
                onChange: handlePhotoChange,
                className: "sr-only"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => fileInputRef.current?.click(),
                disabled: compressing,
                className: "rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-60",
                children: compressing ? "Compressing… / संपीड़ित हो रहा है…" : previewUrl ? "Change Photo / फोटो बदलें" : "Upload Photo / फोटो अपलोड करें"
              }
            ),
            compressing && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 flex items-center gap-1.5 text-xs text-amber-600", children: [
              /* @__PURE__ */ jsxs("svg", { className: "h-3 w-3 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })
              ] }),
              "Shrinking image… / छवि छोटी की जा रही है…"
            ] }),
            !compressing && photoMeta && /* @__PURE__ */ jsxs("div", { className: "mt-1.5 space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-gray-500", children: photoMeta.name }),
              photoMeta.compressed ? /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600", children: [
                "✓ Compressed / संपीड़ित: ",
                formatBytes(photoMeta.originalSize),
                " → ",
                formatBytes(photoMeta.finalSize)
              ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: formatBytes(photoMeta.finalSize) })
            ] }),
            !compressing && !photoMeta && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-gray-400", children: "JPG, PNG या WebP · >0.5 MB स्वतः संपीड़ित होगी" }),
            errors.photo && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.photo })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Full Name", hi: "पूरा नाम" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: userName,
                readOnly: true,
                className: inputClass + " cursor-not-allowed bg-gray-50 text-gray-500"
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-gray-400", children: [
              "Managed via account settings · ",
              /* @__PURE__ */ jsx("span", { className: "text-indigo-300", children: "खाता सेटिंग्स से प्रबंधित" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Father / Husband Name", hi: "पिता / पति का नाम" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.father_husband_name,
                onChange: (e) => setData("father_husband_name", e.target.value),
                placeholder: "Enter name / नाम दर्ज करें",
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.father_husband_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Phone Number", hi: "फ़ोन नंबर" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: data.phone_number,
                onChange: (e) => setData("phone_number", e.target.value),
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.phone_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "WhatsApp Number", hi: "व्हाट्सऐप नंबर" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: data.whatsapp_number,
                onChange: (e) => setData("whatsapp_number", e.target.value),
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.whatsapp_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Email ID", hi: "ईमेल आईडी", optional: true }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                placeholder: "personal@example.com",
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Date of Birth", hi: "जन्म तिथि" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.date_of_birth,
                onChange: (e) => setData("date_of_birth", e.target.value),
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.date_of_birth })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx(Label, { en: "Residential Address", hi: "आवासीय पता" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 2,
                value: data.residential_address,
                onChange: (e) => setData("residential_address", e.target.value),
                placeholder: "House / Flat no., Street, City, State, PIN · मकान नंबर, गली, शहर, राज्य, पिन",
                className: textareaClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.residential_address })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(SectionHeader, { icon: "🏢", en: "Business Information", hi: "/ व्यवसाय की जानकारी", subtitleEn: "Details about your firm or business", subtitleHi: "आपकी फर्म या व्यवसाय की जानकारी" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx(Label, { en: "Firm / Shop Photo", hi: "फर्म / दुकान की फोटो", optional: true }),
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => firmPhotoRef.current?.click(),
              className: "group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 transition hover:border-indigo-400",
              style: { minHeight: "160px" },
              children: firmPhotoPreview ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("img", { src: firmPhotoPreview, alt: "Firm", className: "h-48 w-full object-cover sm:h-56" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100", children: /* @__PURE__ */ jsx("span", { className: "rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800", children: "Change Photo / फोटो बदलें" }) })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex h-40 flex-col items-center justify-center gap-2 text-gray-400", children: [
                /* @__PURE__ */ jsxs("svg", { className: "h-10 w-10 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }),
                  /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500", children: "Click to upload shop / firm photo" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "दुकान / फर्म की फोटो अपलोड करें · JPG, PNG, WebP" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("input", { ref: firmPhotoRef, type: "file", accept: "image/jpeg,image/png,image/jpg,image/webp", onChange: handleFirmPhotoChange, className: "sr-only" }),
          compressingFirm && /* @__PURE__ */ jsxs("p", { className: "mt-1.5 flex items-center gap-1.5 text-xs text-amber-600", children: [
            /* @__PURE__ */ jsxs("svg", { className: "h-3 w-3 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })
            ] }),
            "Compressing image…"
          ] }),
          !compressingFirm && firmPhotoMeta && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-400", children: firmPhotoMeta.compressed ? `✓ Compressed: ${formatBytes(firmPhotoMeta.originalSize)} → ${formatBytes(firmPhotoMeta.finalSize)}` : formatBytes(firmPhotoMeta.finalSize) }),
          errors.firm_photo && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.firm_photo })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Firm / Business Name", hi: "फर्म / व्यवसाय का नाम" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.firm_name,
                onChange: (e) => setData("firm_name", e.target.value),
                placeholder: "Enter firm name / फर्म का नाम दर्ज करें",
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.firm_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Nature of Business", hi: "व्यवसाय का प्रकार" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 pt-1", children: BUSINESS_TYPES.map(({ value, label, hindi }) => /* @__PURE__ */ jsxs(
              "label",
              {
                className: `flex cursor-pointer flex-col items-center rounded-lg border px-4 py-2 text-center text-sm font-medium transition ${data.nature_of_business === value ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "nature_of_business",
                      value,
                      checked: data.nature_of_business === value,
                      onChange: () => setData("nature_of_business", value),
                      className: "sr-only"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: label }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-normal text-indigo-400", children: hindi })
                ]
              },
              value
            )) }),
            /* @__PURE__ */ jsx(FieldError, { message: errors.nature_of_business })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx(Label, { en: "Firm Address", hi: "फर्म का पता" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 2,
                value: data.firm_address,
                onChange: (e) => setData("firm_address", e.target.value),
                placeholder: "Shop / Office address · दुकान / कार्यालय का पता",
                className: textareaClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.firm_address })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx(Label, { en: "Major Projects / Services", hi: "प्रमुख परियोजनाएँ / सेवाएँ" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 3,
                value: data.business_services,
                onChange: (e) => setData("business_services", e.target.value),
                placeholder: "Describe your key products, projects, or services… · अपने प्रमुख उत्पाद, परियोजनाएँ या सेवाएँ बताएँ…",
                className: textareaClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.business_services })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(SectionHeader, { icon: "💍", en: "Marital Status", hi: "/ वैवाहिक स्थिति", subtitleEn: "This will unlock spouse and family sections", subtitleHi: "यह पति/पत्नी और परिवार के अनुभाग खोलेगा" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-700", children: [
            "Are you married? ",
            /* @__PURE__ */ jsx("span", { className: "text-indigo-400", children: "/ क्या आप विवाहित हैं?" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": data.is_married,
              onClick: () => setData("is_married", !data.is_married),
              className: `relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${data.is_married ? "bg-indigo-600" : "bg-gray-300"}`,
              children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${data.is_married ? "translate-x-8" : "translate-x-1"}`
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { className: `text-sm font-semibold ${data.is_married ? "text-indigo-600" : "text-gray-400"}`, children: data.is_married ? "Yes / हाँ" : "No / नहीं" })
        ] })
      ] }),
      data.is_married && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-purple-100 bg-purple-50/40 p-6", children: [
        /* @__PURE__ */ jsx(SectionHeader, { icon: "💑", en: "Spouse Information", hi: "/ पति/पत्नी की जानकारी", subtitleEn: "Details about your spouse", subtitleHi: "आपके पति/पत्नी की जानकारी" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Spouse Name", hi: "पति/पत्नी का नाम" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.spouse_name,
                onChange: (e) => setData("spouse_name", e.target.value),
                placeholder: "Spouse's full name / पति/पत्नी का पूरा नाम",
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.spouse_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Spouse Phone Number", hi: "पति/पत्नी का फ़ोन नंबर" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: data.spouse_phone_number,
                onChange: (e) => setData("spouse_phone_number", e.target.value),
                placeholder: "+91 98765 43210",
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.spouse_phone_number })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Spouse Date of Birth", hi: "पति/पत्नी की जन्म तिथि" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.spouse_date_of_birth,
                onChange: (e) => setData("spouse_date_of_birth", e.target.value),
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.spouse_date_of_birth })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { en: "Anniversary Date", hi: "विवाह वर्षगाँठ" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.anniversary_date,
                onChange: (e) => setData("anniversary_date", e.target.value),
                className: inputClass
              }
            ),
            /* @__PURE__ */ jsx(FieldError, { message: errors.anniversary_date })
          ] })
        ] })
      ] }),
      data.is_married && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-blue-100 bg-blue-50/40 p-6", children: [
        /* @__PURE__ */ jsx(SectionHeader, { icon: "👨‍👩‍👧‍👦", en: "Family Information", hi: "/ परिवार की जानकारी", subtitleEn: "Details about your children", subtitleHi: "आपके बच्चों की जानकारी" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6 max-w-xs", children: [
          /* @__PURE__ */ jsx(Label, { en: "Number of Children", hi: "बच्चों की संख्या" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: data.number_of_children,
                onChange: (e) => setData("number_of_children", parseInt(e.target.value)),
                className: "w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-800 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100",
                children: [
                  /* @__PURE__ */ jsx("option", { value: 0, children: "No children / कोई बच्चा नहीं" }),
                  Array.from({ length: 10 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsxs("option", { value: n, children: [
                    n,
                    " ",
                    n === 1 ? "child" : "children",
                    " / ",
                    n,
                    " बच्चा",
                    n > 1 ? "एँ" : ""
                  ] }, n))
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-3 flex items-center", children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4 text-indigo-500", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })
          ] })
        ] }),
        data.children.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: data.children.map((child, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-xl border border-indigo-100 bg-white p-5 shadow-sm",
            children: [
              /* @__PURE__ */ jsxs("p", { className: "mb-4 text-sm font-semibold text-indigo-700", children: [
                "Child ",
                index + 1,
                " ",
                /* @__PURE__ */ jsxs("span", { className: "font-normal text-indigo-400", children: [
                  "/ बच्चा ",
                  index + 1
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { en: "Name", hi: "नाम" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: child.name,
                      onChange: (e) => updateChild(index, "name", e.target.value),
                      placeholder: "Child's name / बच्चे का नाम",
                      className: inputClass
                    }
                  ),
                  /* @__PURE__ */ jsx(FieldError, { message: errors[`children.${index}.name`] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { en: "Date of Birth", hi: "जन्म तिथि" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "date",
                      value: child.date_of_birth,
                      onChange: (e) => updateChild(index, "date_of_birth", e.target.value),
                      className: inputClass
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { en: "Gender", hi: "लिंग" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: child.gender,
                      onChange: (e) => updateChild(index, "gender", e.target.value),
                      className: inputClass,
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Select / चुनें" }),
                        /* @__PURE__ */ jsx("option", { value: "male", children: "Male / पुरुष" }),
                        /* @__PURE__ */ jsx("option", { value: "female", children: "Female / महिला" }),
                        /* @__PURE__ */ jsx("option", { value: "other", children: "Other / अन्य" })
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          index
        )) }),
        data.children.length === 0 && /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-gray-400", children: [
          "Select number of children above · ",
          /* @__PURE__ */ jsx("span", { className: "text-indigo-300", children: "ऊपर बच्चों की संख्या चुनें" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-gray-100 pt-6", children: [
        recentlySuccessful ? /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-sm font-medium text-green-600", children: [
          /* @__PURE__ */ jsx("span", { children: "✓" }),
          " Profile saved! ",
          /* @__PURE__ */ jsx("span", { className: "text-green-500", children: "/ प्रोफाइल सहेजी गई!" })
        ] }) : /* @__PURE__ */ jsx("span", {}),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing || compressing || compressingFirm,
            className: "rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60",
            children: processing ? "Saving… / सहेजा जा रहा है…" : "Save Profile / प्रोफाइल सहेजें"
          }
        )
      ] })
    ] })
  ] });
}
function AttachmentChip({ attachment }) {
  if (attachment.is_image) {
    return /* @__PURE__ */ jsx("a", { href: attachment.url, target: "_blank", rel: "noreferrer", className: "block h-16 w-16 flex-none overflow-hidden rounded-lg border border-gray-200", children: /* @__PURE__ */ jsx("img", { src: attachment.url, alt: attachment.name, className: "h-full w-full object-cover" }) });
  }
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: attachment.url,
      target: "_blank",
      rel: "noreferrer",
      className: "flex h-16 w-16 flex-none flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100",
      children: [
        /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
        /* @__PURE__ */ jsx("span", { className: "px-1 text-[9px] leading-tight line-clamp-1", children: attachment.name })
      ]
    }
  );
}
function ContactDetailsModal({ requirement, onClose }) {
  const r = requirement;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center", onClick: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm rounded-2xl bg-white shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 px-5 py-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-900", children: "Contact Details" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100", children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 px-5 py-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wide text-gray-400", children: "Name" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: r.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wide text-gray-400", children: "Address" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: r.address })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wide text-gray-400", children: "Phone Number" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: r.phone_number })
      ] })
    ] })
  ] }) });
}
function SeenByModal({ requirementId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [viewers, setViewers] = useState([]);
  useEffect(() => {
    fetch(route("admin.requirements.viewers", requirementId), { headers: { Accept: "application/json" } }).then((r) => r.json()).then((data) => {
      setViewers(data.viewers ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [requirementId]);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center", onClick: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm rounded-2xl bg-white shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 px-5 py-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-900", children: "Seen by" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100", children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-80 overflow-y-auto px-5 py-4", children: loading ? /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-400", children: "Loading…" }) : viewers.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-400", children: "No members have viewed this yet." }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: viewers.map((v, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800", children: v.name }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: v.viewed_at })
    ] }, i)) }) })
  ] }) });
}
function AdminControls({ requirement: r, attendableMembers, onAttendAs, onDelete, onViewSeenBy, busy }) {
  const [selected, setSelected] = useState("");
  return /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3", children: [
    /* @__PURE__ */ jsx("button", { onClick: () => onViewSeenBy(r.id), className: "rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700", children: "👁 Seen by" }),
    /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: selected,
          onChange: (e) => setSelected(e.target.value),
          className: "h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Attend as…" }),
            attendableMembers.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name }, m.id))
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => selected && onAttendAs(r.id, selected),
          disabled: !selected || busy,
          className: "h-8 rounded-lg bg-gray-800 px-2.5 text-xs font-semibold text-white hover:bg-gray-900 disabled:opacity-40",
          children: "Assign"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onDelete(r.id),
        disabled: busy,
        className: "rounded-lg px-2 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-40",
        children: "Delete"
      }
    )
  ] });
}
function RequirementCard({ requirement, onAttend, onUnattend, onComplete, busy, isAdmin, attendableMembers, onAttendAs, onDelete, onViewSeenBy, onViewContact }) {
  const r = requirement;
  const isCompleted = r.status === "completed";
  const isAttended = r.status === "attended";
  return /* @__PURE__ */ jsxs("div", { className: `rounded-2xl border p-4 shadow-sm ${isCompleted ? "border-emerald-200 bg-emerald-50/40" : isAttended ? r.attended_by_me ? "border-indigo-200 bg-indigo-50/40" : "border-gray-200 bg-gray-50" : "border-gray-200 bg-white"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "min-w-0", children: r.name ? /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onViewContact(r),
          className: "inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" }) }),
            "View Contact Details"
          ]
        }
      ) : /* @__PURE__ */ jsx("p", { className: "text-xs italic text-gray-400", children: "Contact details hidden — already being handled" }) }),
      /* @__PURE__ */ jsx("span", { className: "flex-none text-[11px] text-gray-400", children: r.submitted_at })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700", children: r.details }),
    r.attachments.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: r.attachments.map((a) => /* @__PURE__ */ jsx(AttachmentChip, { attachment: a }, a.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center justify-between gap-2", children: [
      isCompleted ? /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700", children: [
        "Completed",
        r.completed_at ? ` · ${r.completed_at}` : ""
      ] }) : isAttended ? /* @__PURE__ */ jsx("span", { className: `rounded-full px-2.5 py-1 text-xs font-semibold ${r.attended_by_me ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-600"}`, children: r.attended_by_me ? "You are handling this" : r.attended_by_name ? `Attended by ${r.attended_by_name}` : "Attended by another member" }) : /* @__PURE__ */ jsx("span", { className: "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700", children: "Available" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        r.attended_by_me && isAttended && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onComplete(r.id),
              disabled: busy,
              className: "min-h-[40px] rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60",
              children: busy ? "Please wait…" : "Mark Complete"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onUnattend(r.id),
              disabled: busy,
              className: "min-h-[40px] rounded-lg bg-red-50 px-4 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60",
              children: "Un-attend"
            }
          )
        ] }),
        !isAttended && !isCompleted && r.can_attend && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onAttend(r.id),
            disabled: busy,
            className: "min-h-[40px] rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60",
            children: busy ? "Please wait…" : "Attend"
          }
        ),
        r.blocked_by_inactive && /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("button", { disabled: true, className: "min-h-[40px] rounded-lg bg-gray-200 px-4 text-xs font-semibold text-gray-400", children: "Attend" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-[180px] text-[11px] text-amber-600", children: "Please contact admin to activate this feature." })
        ] })
      ] })
    ] }),
    isAdmin && /* @__PURE__ */ jsx(
      AdminControls,
      {
        requirement: r,
        attendableMembers,
        onAttendAs,
        onDelete,
        onViewSeenBy,
        busy
      }
    )
  ] });
}
function RequirementsBoard({ requirements, isAdmin = false, attendableMembers = [] }) {
  const [busyId, setBusyId] = useState(null);
  const [tab, setTab] = useState("open");
  const [seenById, setSeenById] = useState(null);
  const [contactFor, setContactFor] = useState(null);
  function run(routeName, id, data = {}) {
    setBusyId(id);
    router.post(route(routeName, id), data, { onFinish: () => setBusyId(null) });
  }
  const attend = (id) => run("requirements.attend", id);
  const unattend = (id) => run("requirements.unattend", id);
  const complete = (id) => run("requirements.complete", id);
  const attendAs = (id, memberId) => run("admin.requirements.attend-as", id, { member_id: memberId });
  function viewContact(requirement) {
    setContactFor(requirement);
    fetch(route("requirements.seen", requirement.id), {
      method: "POST",
      headers: {
        "X-XSRF-TOKEN": decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "")
      }
    });
  }
  function destroy(id) {
    if (!confirm("Delete this requirement permanently? This cannot be undone.")) return;
    setBusyId(id);
    router.delete(route("admin.requirements.destroy", id), { onFinish: () => setBusyId(null) });
  }
  if (!requirements?.length) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-2xl border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-400", children: "No customer requirements yet." });
  }
  const open = requirements.filter((r) => r.status !== "completed");
  const completed = requirements.filter((r) => r.status === "completed");
  const displayed = tab === "open" ? open : completed;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex gap-1 rounded-xl bg-gray-100 p-1 sm:w-fit", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setTab("open"),
          className: `flex-1 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${tab === "open" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
          children: [
            "Open ",
            /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs text-gray-400", children: [
              "(",
              open.length,
              ")"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setTab("completed"),
          className: `flex-1 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${tab === "completed" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`,
          children: [
            "Completed ",
            /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs text-gray-400", children: [
              "(",
              completed.length,
              ")"
            ] })
          ]
        }
      )
    ] }),
    displayed.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-400", children: tab === "open" ? "No open requirements right now." : "No completed requirements yet." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: displayed.map((r) => /* @__PURE__ */ jsx(
      RequirementCard,
      {
        requirement: r,
        onAttend: attend,
        onUnattend: unattend,
        onComplete: complete,
        busy: busyId === r.id,
        isAdmin,
        attendableMembers,
        onAttendAs: attendAs,
        onDelete: destroy,
        onViewSeenBy: setSeenById,
        onViewContact: viewContact
      },
      r.id
    )) }),
    seenById && /* @__PURE__ */ jsx(SeenByModal, { requirementId: seenById, onClose: () => setSeenById(null) }),
    contactFor && /* @__PURE__ */ jsx(ContactDetailsModal, { requirement: contactFor, onClose: () => setContactFor(null) })
  ] });
}
export {
  MemberProfileForm as M,
  RequirementsBoard as R
};
