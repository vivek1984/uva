import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function formatPrice(price) {
    if (!price) return null;
    if (/^\d+(\.\d+)?$/.test(String(price).trim())) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
    }
    return '₹' + price;
}

function whatsappLink(number, text = '') {
    const digits = number?.replace(/\D/g, '') ?? '';
    if (!digits) return null;
    const num = digits.startsWith('91') ? digits : `91${digits}`;
    return `https://wa.me/${num}${text ? '?text=' + encodeURIComponent(text) : ''}`;
}

/* ── Photo carousel ────────────────────────────────────────── */
function PhotoCarousel({ photos, productName }) {
    const [current, setCurrent] = useState(0);

    if (!photos.length) {
        return (
            <div className="flex h-64 items-center justify-center bg-gray-100 sm:h-72">
                <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-gray-100">
            <img
                src={photos[current].url}
                alt={productName}
                className="h-64 w-full object-cover sm:h-72"
            />
            {photos.length > 1 && (
                <>
                    <button
                        onClick={e => { e.preventDefault(); setCurrent(c => (c - 1 + photos.length) % photos.length); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={e => { e.preventDefault(); setCurrent(c => (c + 1) % photos.length); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="absolute bottom-2 right-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                        {current + 1} / {photos.length}
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={e => { e.preventDefault(); setCurrent(i); }}
                                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

/* ── Product card ──────────────────────────────────────────── */
function ProductCard({ product, whatsapp }) {
    const waLink = whatsapp
        ? whatsappLink(whatsapp, `Hi! I'm interested in "${product.name}". Please share more details.`)
        : null;

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
            <PhotoCarousel photos={product.photos} productName={product.name} />

            <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                    {product.category && (
                        <span className="mb-1.5 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                            {product.category}
                        </span>
                    )}
                    <h3 className="text-base font-bold text-gray-900">{product.name}</h3>
                    {product.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{product.description}</p>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    {product.price ? (
                        <span className="text-xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                    ) : (
                        <span className="text-sm text-gray-400 italic">Price on request</span>
                    )}

                    {waLink ? (
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-green-500/30 transition hover:bg-green-600 active:scale-95"
                        >
                            {/* WhatsApp icon */}
                            <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.851L.057 23.943l6.306-1.454A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.741.863.944-3.617-.243-.387A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            WhatsApp Us
                        </a>
                    ) : (
                        <span className="text-xs text-gray-400">No contact set</span>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── SEO head ──────────────────────────────────────────────── */
function SeoHead({ member, products }) {
    const siteName   = 'UVA Vyapari Welfare Association';
    const firmName   = member.firm_name ?? member.name;
    const title      = member.firm_name
        ? `${member.firm_name} | ${member.name} | ${siteName}`
        : `${member.name} | ${siteName}`;

    const cityMatch  = member.firm_address?.match(/([A-Za-zऀ-ॿ]+)(?:\s*[-,]\s*\d{6})?$/) ?? null;
    const city       = cityMatch?.[1] ?? '';

    const rawDesc    = member.business_services || member.nature_of_business || '';
    const description = rawDesc
        ? `${firmName}${city ? ', ' + city : ''} — ${rawDesc.slice(0, 140)}`
        : `${firmName}${city ? ' in ' + city : ''} is a member of ${siteName}. Explore their products and services.`;

    const ogImage    = member.firm_photo_url ?? member.photo_url ?? '/storage/logo.jpg';
    const url        = member.page_url;

    const productNames = products.slice(0, 5).map(p => p.name).join(', ');
    const keywords = [
        firmName,
        member.name,
        member.nature_of_business,
        city,
        siteName,
        productNames,
    ].filter(Boolean).join(', ');

    // JSON-LD LocalBusiness schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: firmName,
        description: description,
        url: url,
        ...(member.phone_number  && { telephone: member.phone_number }),
        ...(member.email         && { email: member.email }),
        ...(member.firm_address  && { address: { '@type': 'PostalAddress', streetAddress: member.firm_address } }),
        ...(ogImage              && { image: ogImage }),
        ...(products.length > 0  && {
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: `Products by ${firmName}`,
                itemListElement: products.slice(0, 10).map(p => ({
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Product',
                        name: p.name,
                        ...(p.description && { description: p.description }),
                        ...(p.price       && { offers: { '@type': 'Offer', price: p.price, priceCurrency: 'INR' } }),
                    },
                })),
            },
        }),
    };

    // Standalone Product schema per product — this is the shape Google's
    // rich-results ("Merchant listing") eligibility actually looks for.
    // Only numeric prices produce a valid `offers` block; a price range
    // string (e.g. "500-1000") isn't a valid schema.org price, so it's left
    // out rather than sending a bad value.
    const productJsonLd = products.slice(0, 20).map(p => {
        const numericPrice = /^\d+(\.\d+)?$/.test(String(p.price ?? '').trim()) ? p.price : null;
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.name,
            ...(p.description && { description: p.description }),
            ...(p.category    && { category: p.category }),
            ...(p.photos?.[0]?.url && { image: p.photos.map(ph => ph.url) }),
            brand: { '@type': 'Brand', name: firmName },
            ...(numericPrice && {
                offers: {
                    '@type': 'Offer',
                    price: numericPrice,
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                    url,
                },
            }),
        };
    });

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content="business.business" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={firmName} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter / X Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD */}
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            {productJsonLd.map((pld, i) => (
                <script key={i} type="application/ld+json">{JSON.stringify(pld)}</script>
            ))}
        </Head>
    );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function BusinessPage({ member, products }) {
    const contactNumber = member.whatsapp_number || member.phone_number;
    const generalWaLink = contactNumber ? whatsappLink(contactNumber, `Hi! I found you on UVA Vyapari Welfare Association. I'd like to know more about your business.`) : null;

    // Pre-fill from ?product=<name> so a click-through from the homepage
    // search lands here with the matching product already surfaced.
    const [query, setQuery] = useState(() => {
        if (typeof window === 'undefined') return '';
        return new URLSearchParams(window.location.search).get('product') ?? '';
    });

    useEffect(() => {
        if (query) {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Only run on initial mount — this is a one-time landing scroll, not a
        // per-keystroke behavior.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const q = query.trim().toLowerCase();
    const filteredProducts = q
        ? products.filter(p =>
            p.name?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
          )
        : products;

    return (
        <>
            <SeoHead member={member} products={products} />

            <div className="min-h-screen bg-gray-50">
                {/* ── Top bar ─────────────────────────────────── */}
                <div className="border-b border-gray-200 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                        <a href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            UVA Members
                        </a>
                        {generalWaLink && (
                            <a
                                href={generalWaLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition"
                            >
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.851L.057 23.943l6.306-1.454A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.741.863.944-3.617-.243-.387A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                </svg>
                                WhatsApp
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Business header ──────────────────────────── */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    {/* Firm photo banner */}
                    {member.firm_photo_url && (
                        <div className="relative h-48 w-full overflow-hidden sm:h-64">
                            <img src={member.firm_photo_url} alt={member.firm_name ?? member.name} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    )}

                    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                            {/* Avatar */}
                            {member.photo_url ? (
                                <img
                                    src={member.photo_url}
                                    alt={member.name}
                                    className="h-24 w-24 flex-none rounded-2xl object-cover shadow-md"
                                />
                            ) : (
                                <div className="flex h-24 w-24 flex-none items-center justify-center rounded-2xl bg-indigo-600 text-3xl font-extrabold text-white shadow-md">
                                    {(member.firm_name ?? member.name).charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                {member.firm_name && (
                                    <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                                        M/s {member.firm_name}
                                    </h1>
                                )}
                                <p className={`font-semibold text-gray-500 ${!member.firm_name ? 'text-2xl text-gray-900' : 'text-base'}`}>
                                    {member.name}
                                </p>

                                {/* Nature of business badge */}
                                {member.nature_of_business && (
                                    <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                                        {member.nature_of_business}
                                    </span>
                                )}

                                {/* Address */}
                                {member.firm_address && (
                                    <div className="mt-3 flex items-start gap-2">
                                        <svg className="mt-0.5 h-4 w-4 flex-none text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{member.firm_address}</span>
                                    </div>
                                )}

                                {/* Phone */}
                                {member.phone_number && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <svg className="h-4 w-4 flex-none text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                                        </svg>
                                        <a href={`tel:${member.phone_number}`} className="text-sm text-gray-600 hover:text-indigo-600 hover:underline">
                                            {member.phone_number}
                                        </a>
                                    </div>
                                )}

                                {/* Contact row */}
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {member.whatsapp_number && (
                                        <a
                                            href={whatsappLink(member.whatsapp_number) ?? '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-green-500/25 hover:bg-green-600 transition active:scale-95"
                                        >
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.851L.057 23.943l6.306-1.454A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.741.863.944-3.617-.243-.387A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                            </svg>
                                            {member.whatsapp_number}
                                        </a>
                                    )}
                                    {member.phone_number && !member.whatsapp_number && (
                                        <a
                                            href={`tel:${member.phone_number}`}
                                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                                            </svg>
                                            {member.phone_number}
                                        </a>
                                    )}
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {member.email}
                                        </a>
                                    )}
                                </div>

                                {/* Business services description */}
                                {member.business_services && (
                                    <p className="mt-4 text-sm leading-relaxed text-gray-600 max-w-2xl">
                                        {member.business_services}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Products ─────────────────────────────────── */}
                <div id="products" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap items-baseline gap-3">
                        <h2 className="text-xl font-bold text-gray-900">Products & Services</h2>
                        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-bold text-indigo-700">
                            {products.length}
                        </span>
                    </div>

                    {products.length > 0 && (
                        <div className="relative mx-auto mb-6 max-w-md">
                            <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search products or services…"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    )}

                    {products.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center">
                            <p className="text-gray-400">No products listed yet.</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                            <p className="text-sm font-medium text-gray-400">No products match "{query}"</p>
                            <button onClick={() => setQuery('')} className="mt-2 text-xs text-indigo-600 hover:underline">Clear search</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map(p => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    whatsapp={member.whatsapp_number || member.phone_number}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer ───────────────────────────────────── */}
                <div className="mt-10 border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
                    Member of <span className="font-semibold text-gray-500">UVA Vyapari Welfare Association</span>
                </div>
            </div>
        </>
    );
}
