import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { compressImage, formatBytes } from '@/utils/compressImage';

const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

const textareaClass =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none';

const FieldError = ({ message }) =>
    message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;

// Bilingual label: English above, Hindi below in indigo
const Label = ({ en, hi, optional = false }) => (
    <div className="mb-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {en}
            {optional && <span className="ml-1 font-normal normal-case tracking-normal text-gray-400">(optional)</span>}
        </p>
        <p className="text-[11px] font-medium text-indigo-400">{hi}</p>
    </div>
);

const SectionHeader = ({ icon, en, hi, subtitleEn, subtitleHi }) => (
    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg">
            {icon}
        </div>
        <div>
            <h3 className="text-base font-semibold text-gray-800">{en} <span className="font-normal text-indigo-400">{hi}</span></h3>
            {subtitleEn && (
                <p className="text-xs text-gray-400">{subtitleEn} · <span className="text-indigo-300">{subtitleHi}</span></p>
            )}
        </div>
    </div>
);

const BUSINESS_TYPES = [
    { value: 'wholesale', label: 'Wholesale', hindi: 'थोक' },
    { value: 'retail',    label: 'Retail',    hindi: 'खुदरा' },
    { value: 'both',      label: 'Both',      hindi: 'दोनों' },
];

const PROFILE_MAX_BYTES = 512 * 1024; // 0.5 MB — keeps profile photos small

const buildChildren = (count, existing) => {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(existing?.[i] ?? { name: '', date_of_birth: '', gender: '' });
    }
    return result;
};

export default function MemberProfileForm({ profile, userName }) {
    const fileInputRef     = useRef(null);
    const firmPhotoRef     = useRef(null);
    const [previewUrl, setPreviewUrl]             = useState(profile?.photo_url ?? null);
    const [firmPhotoPreview, setFirmPhotoPreview] = useState(profile?.firm_photo_url ?? null);
    const [photoMeta, setPhotoMeta]               = useState(null);
    const [firmPhotoMeta, setFirmPhotoMeta]       = useState(null);
    const [compressing, setCompressing]           = useState(false);
    const [compressingFirm, setCompressingFirm]   = useState(false);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreviewUrl(URL.createObjectURL(file));
        setPhotoMeta(null);
        if (file.size > PROFILE_MAX_BYTES) {
            setCompressing(true);
            const result = await compressImage(file, PROFILE_MAX_BYTES);
            setCompressing(false);
            setData('photo', result.file);
            setPhotoMeta({ name: result.file.name, originalSize: file.size, finalSize: result.finalSize ?? result.file.size, compressed: result.compressed });
            setPreviewUrl(URL.createObjectURL(result.file));
        } else {
            setData('photo', file);
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
            setData('firm_photo', result.file);
            setFirmPhotoMeta({ name: result.file.name, originalSize: file.size, finalSize: result.finalSize ?? result.file.size, compressed: result.compressed });
            setFirmPhotoPreview(URL.createObjectURL(result.file));
        } else {
            setData('firm_photo', file);
            setFirmPhotoMeta({ name: file.name, finalSize: file.size, compressed: false });
        }
    };

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        photo:      null,
        firm_photo: null,
        father_husband_name: profile?.father_husband_name ?? '',
        firm_name: profile?.firm_name ?? '',
        firm_address: profile?.firm_address ?? '',
        phone_number: profile?.phone_number ?? '',
        whatsapp_number: profile?.whatsapp_number ?? '',
        email: profile?.email ?? '',
        nature_of_business: profile?.nature_of_business ?? '',
        business_services: profile?.business_services ?? '',
        residential_address: profile?.residential_address ?? '',
        date_of_birth: profile?.date_of_birth ?? '',
        is_married: profile?.is_married ?? false,
        spouse_name: profile?.spouse_name ?? '',
        spouse_phone_number: profile?.spouse_phone_number ?? '',
        spouse_date_of_birth: profile?.spouse_date_of_birth ?? '',
        anniversary_date: profile?.anniversary_date ?? '',
        number_of_children: profile?.number_of_children ?? 0,
        children: buildChildren(profile?.number_of_children ?? 0, profile?.children),
    });

    useEffect(() => {
        const count = parseInt(data.number_of_children) || 0;
        setData('children', buildChildren(count, data.children));
    }, [data.number_of_children]);

    const updateChild = (index, field, value) => {
        const updated = [...data.children];
        updated[index] = { ...updated[index], [field]: value };
        setData('children', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('member-profile.store'), { forceFormData: true });
    };

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            {/* Card header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <h2 className="text-xl font-bold text-white">
                    Member Profile <span className="font-normal text-indigo-200">/ सदस्य प्रोफाइल</span>
                </h2>
                <p className="mt-1 text-sm text-indigo-200">
                    Keep your association profile up to date · <span className="text-indigo-300">अपनी एसोसिएशन प्रोफाइल अपडेट रखें</span>
                </p>
            </div>

            <form onSubmit={submit} className="space-y-10 p-8">

                {/* ── Personal Information ── */}
                <div>
                    <SectionHeader icon="👤" en="Personal Information" hi="/ व्यक्तिगत जानकारी" subtitleEn="Your basic details" subtitleHi="आपकी बुनियादी जानकारी" />

                    {/* Photo uploader */}
                    <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                        <div className="relative">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-indigo-200 transition hover:ring-indigo-400"
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Member photo"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-3xl font-bold text-white">
                                        {userName?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-xs font-medium text-white">Change</span>
                                </div>
                            </div>
                            {/* Green dot if photo exists */}
                            {previewUrl && (
                                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
                            )}
                        </div>

                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handlePhotoChange}
                                className="sr-only"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={compressing}
                                className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-60"
                            >
                                {compressing
                                    ? 'Compressing… / संपीड़ित हो रहा है…'
                                    : previewUrl
                                        ? 'Change Photo / फोटो बदलें'
                                        : 'Upload Photo / फोटो अपलोड करें'}
                            </button>

                            {compressing && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600">
                                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Shrinking image… / छवि छोटी की जा रही है…
                                </p>
                            )}

                            {!compressing && photoMeta && (
                                <div className="mt-1.5 space-y-0.5">
                                    <p className="truncate text-xs text-gray-500">{photoMeta.name}</p>
                                    {photoMeta.compressed ? (
                                        <p className="text-xs text-green-600">
                                            ✓ Compressed / संपीड़ित: {formatBytes(photoMeta.originalSize)} → {formatBytes(photoMeta.finalSize)}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-400">{formatBytes(photoMeta.finalSize)}</p>
                                    )}
                                </div>
                            )}

                            {!compressing && !photoMeta && (
                                <p className="mt-1.5 text-xs text-gray-400">
                                    JPG, PNG या WebP · &gt;0.5 MB स्वतः संपीड़ित होगी
                                </p>
                            )}

                            {errors.photo && <p className="mt-1 text-xs text-red-500">{errors.photo}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        <div>
                            <Label en="Full Name" hi="पूरा नाम" />
                            <input
                                type="text"
                                value={userName}
                                readOnly
                                className={inputClass + ' cursor-not-allowed bg-gray-50 text-gray-500'}
                            />
                            <p className="mt-1 text-xs text-gray-400">Managed via account settings · <span className="text-indigo-300">खाता सेटिंग्स से प्रबंधित</span></p>
                        </div>

                        <div>
                            <Label en="Father / Husband Name" hi="पिता / पति का नाम" />
                            <input
                                type="text"
                                value={data.father_husband_name}
                                onChange={(e) => setData('father_husband_name', e.target.value)}
                                placeholder="Enter name / नाम दर्ज करें"
                                className={inputClass}
                            />
                            <FieldError message={errors.father_husband_name} />
                        </div>

                        <div>
                            <Label en="Phone Number" hi="फ़ोन नंबर" />
                            <input
                                type="tel"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className={inputClass}
                            />
                            <FieldError message={errors.phone_number} />
                        </div>

                        <div>
                            <Label en="WhatsApp Number" hi="व्हाट्सऐप नंबर" />
                            <input
                                type="tel"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                className={inputClass}
                            />
                            <FieldError message={errors.whatsapp_number} />
                        </div>

                        <div>
                            <Label en="Email ID" hi="ईमेल आईडी" optional />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="personal@example.com"
                                className={inputClass}
                            />
                            <FieldError message={errors.email} />
                        </div>

                        <div>
                            <Label en="Date of Birth" hi="जन्म तिथि" />
                            <input
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                className={inputClass}
                            />
                            <FieldError message={errors.date_of_birth} />
                        </div>

                        <div className="sm:col-span-2">
                            <Label en="Residential Address" hi="आवासीय पता" />
                            <textarea
                                rows={2}
                                value={data.residential_address}
                                onChange={(e) => setData('residential_address', e.target.value)}
                                placeholder="House / Flat no., Street, City, State, PIN · मकान नंबर, गली, शहर, राज्य, पिन"
                                className={textareaClass}
                            />
                            <FieldError message={errors.residential_address} />
                        </div>
                    </div>
                </div>

                {/* ── Business Information ── */}
                <div>
                    <SectionHeader icon="🏢" en="Business Information" hi="/ व्यवसाय की जानकारी" subtitleEn="Details about your firm or business" subtitleHi="आपकी फर्म या व्यवसाय की जानकारी" />

                    {/* Firm photo uploader */}
                    <div className="mb-6">
                        <Label en="Firm / Shop Photo" hi="फर्म / दुकान की फोटो" optional />
                        <div
                            onClick={() => firmPhotoRef.current?.click()}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 transition hover:border-indigo-400"
                            style={{ minHeight: '160px' }}
                        >
                            {firmPhotoPreview ? (
                                <>
                                    <img src={firmPhotoPreview} alt="Firm" className="h-48 w-full object-cover sm:h-56" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800">Change Photo / फोटो बदलें</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-400">
                                    <svg className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-500">Click to upload shop / firm photo</p>
                                    <p className="text-xs text-gray-400">दुकान / फर्म की फोटो अपलोड करें · JPG, PNG, WebP</p>
                                </div>
                            )}
                        </div>
                        <input ref={firmPhotoRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleFirmPhotoChange} className="sr-only" />
                        {compressingFirm && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600">
                                <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                Compressing image…
                            </p>
                        )}
                        {!compressingFirm && firmPhotoMeta && (
                            <p className="mt-1 text-xs text-gray-400">
                                {firmPhotoMeta.compressed
                                    ? `✓ Compressed: ${formatBytes(firmPhotoMeta.originalSize)} → ${formatBytes(firmPhotoMeta.finalSize)}`
                                    : formatBytes(firmPhotoMeta.finalSize)}
                            </p>
                        )}
                        {errors.firm_photo && <p className="mt-1 text-xs text-red-500">{errors.firm_photo}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        <div>
                            <Label en="Firm / Business Name" hi="फर्म / व्यवसाय का नाम" />
                            <input
                                type="text"
                                value={data.firm_name}
                                onChange={(e) => setData('firm_name', e.target.value)}
                                placeholder="Enter firm name / फर्म का नाम दर्ज करें"
                                className={inputClass}
                            />
                            <FieldError message={errors.firm_name} />
                        </div>

                        <div>
                            <Label en="Nature of Business" hi="व्यवसाय का प्रकार" />
                            <div className="flex flex-wrap gap-3 pt-1">
                                {BUSINESS_TYPES.map(({ value, label, hindi }) => (
                                    <label
                                        key={value}
                                        className={`flex cursor-pointer flex-col items-center rounded-lg border px-4 py-2 text-center text-sm font-medium transition ${
                                            data.nature_of_business === value
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="nature_of_business"
                                            value={value}
                                            checked={data.nature_of_business === value}
                                            onChange={() => setData('nature_of_business', value)}
                                            className="sr-only"
                                        />
                                        <span>{label}</span>
                                        <span className="text-[11px] font-normal text-indigo-400">{hindi}</span>
                                    </label>
                                ))}
                            </div>
                            <FieldError message={errors.nature_of_business} />
                        </div>

                        <div className="sm:col-span-2">
                            <Label en="Firm Address" hi="फर्म का पता" />
                            <textarea
                                rows={2}
                                value={data.firm_address}
                                onChange={(e) => setData('firm_address', e.target.value)}
                                placeholder="Shop / Office address · दुकान / कार्यालय का पता"
                                className={textareaClass}
                            />
                            <FieldError message={errors.firm_address} />
                        </div>

                        <div className="sm:col-span-2">
                            <Label en="Major Projects / Services" hi="प्रमुख परियोजनाएँ / सेवाएँ" />
                            <textarea
                                rows={3}
                                value={data.business_services}
                                onChange={(e) => setData('business_services', e.target.value)}
                                placeholder="Describe your key products, projects, or services… · अपने प्रमुख उत्पाद, परियोजनाएँ या सेवाएँ बताएँ…"
                                className={textareaClass}
                            />
                            <FieldError message={errors.business_services} />
                        </div>
                    </div>
                </div>

                {/* ── Marital Status toggle ── */}
                <div>
                    <SectionHeader icon="💍" en="Marital Status" hi="/ वैवाहिक स्थिति" subtitleEn="This will unlock spouse and family sections" subtitleHi="यह पति/पत्नी और परिवार के अनुभाग खोलेगा" />
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">
                            Are you married? <span className="text-indigo-400">/ क्या आप विवाहित हैं?</span>
                        </span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={data.is_married}
                            onClick={() => setData('is_married', !data.is_married)}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                data.is_married ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                    data.is_married ? 'translate-x-8' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span className={`text-sm font-semibold ${data.is_married ? 'text-indigo-600' : 'text-gray-400'}`}>
                            {data.is_married ? 'Yes / हाँ' : 'No / नहीं'}
                        </span>
                    </div>
                </div>

                {/* ── Spouse Information (conditional) ── */}
                {data.is_married && (
                    <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-6">
                        <SectionHeader icon="💑" en="Spouse Information" hi="/ पति/पत्नी की जानकारी" subtitleEn="Details about your spouse" subtitleHi="आपके पति/पत्नी की जानकारी" />
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <Label en="Spouse Name" hi="पति/पत्नी का नाम" />
                                <input
                                    type="text"
                                    value={data.spouse_name}
                                    onChange={(e) => setData('spouse_name', e.target.value)}
                                    placeholder="Spouse's full name / पति/पत्नी का पूरा नाम"
                                    className={inputClass}
                                />
                                <FieldError message={errors.spouse_name} />
                            </div>

                            <div>
                                <Label en="Spouse Phone Number" hi="पति/पत्नी का फ़ोन नंबर" />
                                <input
                                    type="tel"
                                    value={data.spouse_phone_number}
                                    onChange={(e) => setData('spouse_phone_number', e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className={inputClass}
                                />
                                <FieldError message={errors.spouse_phone_number} />
                            </div>

                            <div>
                                <Label en="Spouse Date of Birth" hi="पति/पत्नी की जन्म तिथि" />
                                <input
                                    type="date"
                                    value={data.spouse_date_of_birth}
                                    onChange={(e) => setData('spouse_date_of_birth', e.target.value)}
                                    className={inputClass}
                                />
                                <FieldError message={errors.spouse_date_of_birth} />
                            </div>

                            <div>
                                <Label en="Anniversary Date" hi="विवाह वर्षगाँठ" />
                                <input
                                    type="date"
                                    value={data.anniversary_date}
                                    onChange={(e) => setData('anniversary_date', e.target.value)}
                                    className={inputClass}
                                />
                                <FieldError message={errors.anniversary_date} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Children Information (conditional) ── */}
                {data.is_married && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-6">
                        <SectionHeader icon="👨‍👩‍👧‍👦" en="Family Information" hi="/ परिवार की जानकारी" subtitleEn="Details about your children" subtitleHi="आपके बच्चों की जानकारी" />

                        <div className="mb-6 max-w-xs">
                            <Label en="Number of Children" hi="बच्चों की संख्या" />
                            <div className="relative">
                                <select
                                    value={data.number_of_children}
                                    onChange={(e) => setData('number_of_children', parseInt(e.target.value))}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-800 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value={0}>No children / कोई बच्चा नहीं</option>
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>
                                            {n} {n === 1 ? 'child' : 'children'} / {n} बच्चा{n > 1 ? 'एँ' : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {data.children.length > 0 && (
                            <div className="space-y-4">
                                {data.children.map((child, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm"
                                    >
                                        <p className="mb-4 text-sm font-semibold text-indigo-700">
                                            Child {index + 1} <span className="font-normal text-indigo-400">/ बच्चा {index + 1}</span>
                                        </p>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div>
                                                <Label en="Name" hi="नाम" />
                                                <input
                                                    type="text"
                                                    value={child.name}
                                                    onChange={(e) => updateChild(index, 'name', e.target.value)}
                                                    placeholder="Child's name / बच्चे का नाम"
                                                    className={inputClass}
                                                />
                                                <FieldError message={errors[`children.${index}.name`]} />
                                            </div>
                                            <div>
                                                <Label en="Date of Birth" hi="जन्म तिथि" />
                                                <input
                                                    type="date"
                                                    value={child.date_of_birth}
                                                    onChange={(e) => updateChild(index, 'date_of_birth', e.target.value)}
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <Label en="Gender" hi="लिंग" />
                                                <select
                                                    value={child.gender}
                                                    onChange={(e) => updateChild(index, 'gender', e.target.value)}
                                                    className={inputClass}
                                                >
                                                    <option value="">Select / चुनें</option>
                                                    <option value="male">Male / पुरुष</option>
                                                    <option value="female">Female / महिला</option>
                                                    <option value="other">Other / अन्य</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.children.length === 0 && (
                            <p className="text-center text-sm text-gray-400">
                                Select number of children above · <span className="text-indigo-300">ऊपर बच्चों की संख्या चुनें</span>
                            </p>
                        )}
                    </div>
                )}

                {/* ── Submit ── */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                    {recentlySuccessful ? (
                        <p className="flex items-center gap-2 text-sm font-medium text-green-600">
                            <span>✓</span> Profile saved! <span className="text-green-500">/ प्रोफाइल सहेजी गई!</span>
                        </p>
                    ) : (
                        <span />
                    )}
                    <button
                        type="submit"
                        disabled={processing || compressing || compressingFirm}
                        className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60"
                    >
                        {processing ? 'Saving… / सहेजा जा रहा है…' : 'Save Profile / प्रोफाइल सहेजें'}
                    </button>
                </div>
            </form>
        </div>
    );
}
