import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Search, X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import Pagination from '@/Components/Pagination';

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

function ShareButton({ url, title }) {
    const handleShare = async () => {
        const shareData = {
            title,
            text: `Check out ${title}`,
            url,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                window.alert('Business page link copied to clipboard.');
                return;
            }

            window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, '_blank', 'noopener,noreferrer');
        } catch (error) {
            if (error?.name !== 'AbortError') {
                window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, '_blank', 'noopener,noreferrer');
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label="Share business page"
            className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-3 py-1.5 text-xs font-bold text-primary/70 transition hover:bg-primary/5"
        >
            <Share2 className="h-3.5 w-3.5" />
            Share
        </button>
    );
}

/* ── Expandable text (truncate long descriptions to a word limit) ──────── */
function ExpandableText({ text, wordLimit = 28, className = '' }) {
    const [expanded, setExpanded] = useState(false);
    const words = text.trim().split(/\s+/);
    const isLong = words.length > wordLimit;
    const shown = expanded || !isLong ? text : words.slice(0, wordLimit).join(' ') + '…';

    return (
        <p className={className}>
            {shown}
            {isLong && (
                <button
                    type="button"
                    onClick={() => setExpanded(e => !e)}
                    className="ml-1.5 font-semibold text-accent hover:underline"
                >
                    {expanded ? 'less' : 'more'}
                </button>
            )}
        </p>
    );
}

/* ── Photo carousel ────────────────────────────────────────── */
function PhotoCarousel({ photos, productName }) {
    const [current, setCurrent] = useState(0);

    if (!photos.length) {
        return (
            <div className="flex h-64 items-center justify-center bg-primary/5 sm:h-72">
                <svg className="h-16 w-16 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-primary/5">
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
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={e => { e.preventDefault(); setCurrent(c => (c + 1) % photos.length); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                    >
                        <ChevronRight className="h-4 w-4" />
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
    const detailUrl = product.page_url ?? null;

    return (
        <div className="flex flex-col overflow-hidden rounded-[24px] border border-primary/10 bg-white shadow-[0_10px_30px_rgba(28,28,26,0.04)] transition hover:shadow-[0_14px_38px_rgba(28,28,26,0.08)]">
            {detailUrl ? (
                <a href={detailUrl} className="block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
                    <PhotoCarousel photos={product.photos} productName={product.name} />
                </a>
            ) : (
                <PhotoCarousel photos={product.photos} productName={product.name} />
            )}

            <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                    {product.category && (
                        <span className="mb-1.5 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                            {product.category}
                        </span>
                    )}
                    {detailUrl ? (
                        <a href={detailUrl} className="block text-base font-bold text-primary hover:text-accent">
                            {product.name}
                        </a>
                    ) : (
                        <h3 className="text-base font-bold text-primary">{product.name}</h3>
                    )}
                    {product.description && (
                        <p className="mt-2 text-sm leading-relaxed text-primary/60">{product.description}</p>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    {product.price ? (
                        <span className="text-xl font-extrabold text-primary">{formatPrice(product.price)}</span>
                    ) : (
                        <span className="text-sm italic text-primary/40">Price on request</span>
                    )}

                    {waLink ? (
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-green-500/30 transition hover:bg-green-600 active:scale-95"
                        >
                            {/* WhatsApp icon */}
                            <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.851L.057 23.943l6.306-1.454A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.741.863.944-3.617-.243-.387A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            WhatsApp Us
                        </a>
                    ) : (
                        <span className="text-xs text-primary/40">No contact set</span>
                    )}
                </div>

                {detailUrl && (
                    <a
                        href={detailUrl}
                        className="mt-3 inline-flex h-10 items-center justify-center rounded-full border border-accent/20 bg-accent/5 px-4 text-sm font-bold text-accent transition hover:bg-accent/10"
                    >
                        View Details
                    </a>
                )}
            </div>
        </div>
    );
}

/* ── Category tab bar ─────────────────────────────────────────── */
function CategoryTabs({ activeCategory, categoryTabs, uncategorizedCount, totalCount, baseUrl }) {
    const tabs = [
        { slug: null, label: 'All Products', count: totalCount },
        ...categoryTabs.map(c => ({ slug: c.slug, label: c.name, count: c.count })),
        ...(uncategorizedCount > 0 ? [{ slug: 'uncategorized', label: 'Uncategorized', count: uncategorizedCount }] : []),
    ];

    if (tabs.length <= 1) return null;

    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map(tab => {
                const isActive = (activeCategory ?? null) === tab.slug;
                const href = tab.slug ? `${baseUrl}?category=${tab.slug}` : baseUrl;
                return (
                    <Link
                        key={tab.slug ?? 'all'}
                        href={href}
                        preserveScroll
                        className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition',
                            isActive ? 'bg-primary text-white' : 'bg-primary/5 text-primary/70 hover:bg-primary/10',
                        )}
                    >
                        {tab.label}
                        <span className={cn('rounded-full px-1.5 text-xs', isActive ? 'bg-white/20' : 'bg-primary/10')}>
                            {tab.count}
                        </span>
                    </Link>
                );
            })}
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
                    url: p.page_url ?? url,
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
export default function BusinessPage({ member, products, activeCategory, categoryTabs, uncategorizedCount, totalCount, pagination }) {
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

    // Note: this filters only the current page's products (up to 20) — the
    // catalog itself is now server-paginated, so a search no longer reaches
    // across pages. Use the category tabs above to narrow the catalog first.
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

            <div className="storefront-theme min-h-screen bg-surface">
                {/* ── Top bar ─────────────────────────────────── */}
                <div className="border-b border-primary/10 bg-surface/90 backdrop-blur-sm sticky top-0 z-30">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                        <a href="/" className="flex items-center gap-2 text-sm font-semibold text-primary/60 hover:text-accent transition">
                            <ChevronLeft className="h-4 w-4" />
                            UVA Members
                        </a>
                        <div className="flex items-center gap-2">
                            <ShareButton url={member.page_url} title={member.firm_name ?? member.name} />
                            {generalWaLink && (
                                <a
                                    href={generalWaLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition"
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
                </div>

                {/* ── Business header ──────────────────────────── */}
                <div className="bg-white border-b border-primary/10 shadow-sm">
                    <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-start">
                        {/* Firm photo banner — left column, 20% width on larger screens.
                            Fixed height (not stretched to match the info column) so a
                            long business description never pulls the image taller. */}
                        {member.firm_photo_url && (
                            <div className="relative h-48 w-full flex-none overflow-hidden sm:h-64 sm:w-1/5">
                                <img src={member.firm_photo_url} alt={member.firm_name ?? member.name} className="h-full w-full object-cover" />
                            </div>
                        )}

                        <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex items-start gap-4 sm:gap-5">
                            {/* Avatar */}
                            {member.photo_url ? (
                                <img
                                    src={member.photo_url}
                                    alt={member.name}
                                    className="h-20 w-20 flex-none rounded-[20px] object-cover shadow-md sm:h-24 sm:w-24"
                                />
                            ) : (
                                <div className="flex h-20 w-20 flex-none items-center justify-center rounded-[20px] bg-primary text-2xl font-extrabold text-white shadow-md sm:h-24 sm:w-24 sm:text-3xl">
                                    {(member.firm_name ?? member.name).charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                {member.firm_name && (
                                    <h1 className="text-xl font-extrabold text-primary sm:text-3xl">
                                        M/s {member.firm_name}
                                    </h1>
                                )}
                                <p className={`font-semibold text-primary/60 ${!member.firm_name ? 'text-xl text-primary sm:text-2xl' : 'text-sm sm:text-base'}`}>
                                    {member.name}
                                </p>

                                {/* Nature of business badge */}
                                {member.nature_of_business && (
                                    <span className="mt-2 inline-block rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">
                                        {member.nature_of_business}
                                    </span>
                                )}

                                {/* Address */}
                                {member.firm_address && (
                                    <div className="mt-3 flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 flex-none text-primary/35" />
                                        <span className="text-sm text-primary/60">{member.firm_address}</span>
                                    </div>
                                )}

                                {/* Phone */}
                                {member.phone_number && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <Phone className="h-4 w-4 flex-none text-primary/35" />
                                        <a href={`tel:${member.phone_number}`} className="text-sm text-primary/60 hover:text-accent hover:underline">
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
                                            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-green-500/25 hover:bg-green-600 transition active:scale-95"
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
                                            className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-sm font-semibold text-primary/70 hover:bg-primary/5 transition"
                                        >
                                            <Phone className="h-4 w-4 text-primary/35" />
                                            {member.phone_number}
                                        </a>
                                    )}
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-sm font-semibold text-primary/70 hover:bg-primary/5 transition"
                                        >
                                            <Mail className="h-4 w-4 text-primary/35" />
                                            {member.email}
                                        </a>
                                    )}
                                </div>

                                {/* Business services description */}
                                {member.business_services && (
                                    <ExpandableText
                                        text={member.business_services}
                                        wordLimit={28}
                                        className="mt-4 text-sm leading-relaxed text-primary/60 max-w-2xl"
                                    />
                                )}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                {/* ── Products ─────────────────────────────────── */}
                <div id="products" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap items-baseline gap-3">
                        <h2 className="text-xl font-bold text-primary">Products & Services</h2>
                        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-sm font-bold text-accent">
                            {totalCount}
                        </span>
                    </div>

                    <CategoryTabs
                        activeCategory={activeCategory}
                        categoryTabs={categoryTabs}
                        uncategorizedCount={uncategorizedCount}
                        totalCount={totalCount}
                        baseUrl={member.page_url}
                    />

                    {products.length > 0 && (
                        <div className="relative mx-auto mb-6 max-w-md">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/35" />
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search products on this page…"
                                className="h-11 w-full rounded-full border border-primary/10 bg-white pl-10 pr-9 text-sm text-primary placeholder-primary/40 shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary/70">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {products.length === 0 ? (
                        <div className="rounded-[24px] border-2 border-dashed border-primary/10 py-24 text-center">
                            <p className="text-primary/40">No products listed yet.</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="rounded-[24px] border-2 border-dashed border-primary/10 py-16 text-center">
                            <p className="text-sm font-medium text-primary/40">No products match "{query}"</p>
                            <button onClick={() => setQuery('')} className="mt-2 text-xs text-accent hover:underline">Clear search</button>
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

                    {!q && <Pagination pagination={pagination} />}
                </div>

                {/* ── Footer ───────────────────────────────────── */}
                <div className="mt-10 border-t border-primary/10 bg-white py-6 text-center text-xs text-primary/40">
                    Member of <span className="font-semibold text-primary/60">UVA Vyapari Welfare Association</span>
                </div>
            </div>
        </>
    );
}
