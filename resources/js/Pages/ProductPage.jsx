import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Share2 } from 'lucide-react';

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
                window.alert('Product link copied to clipboard.');
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
            aria-label="Share product"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary/10 bg-white px-5 text-sm font-semibold text-primary/70 transition hover:bg-primary/5"
        >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
        </button>
    );
}

function ProductSeo({ member, product }) {
    const siteName = 'UVA Vyapari Welfare Association';
    const firmName = member.firm_name ?? member.name;
    const title = `${product.name} | ${firmName} | ${siteName}`;
    const description = product.description
        ? product.description.slice(0, 155)
        : `${product.name} from ${firmName}. Contact this UVA member for details.`;
    const image = product.photos?.[0]?.url ?? member.firm_photo_url ?? member.photo_url ?? '/storage/logo.jpg';
    // Unlike og:image, the favicon never falls back to the UVA logo here —
    // product photo, then firm photo, then member photo, then a blank icon.
    const faviconUrl = product.photos?.[0]?.url ?? member.firm_photo_url ?? member.photo_url ?? null;
    const numericPrice = /^\d+(\.\d+)?$/.test(String(product.price ?? '').trim()) ? product.price : null;
    const siteUrl = new URL(member.page_url).origin + '/';

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: siteName, item: siteUrl },
            { '@type': 'ListItem', position: 2, name: firmName, item: member.page_url },
            { '@type': 'ListItem', position: 3, name: product.name, item: product.page_url },
        ],
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description,
        ...(product.category && { category: product.category }),
        ...(product.photos?.length && { image: product.photos.map(photo => photo.url) }),
        brand: { '@type': 'Brand', name: firmName },
        ...(numericPrice && {
            offers: {
                '@type': 'Offer',
                price: numericPrice,
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
                url: product.page_url,
                seller: {
                    '@type': 'LocalBusiness',
                    name: firmName,
                    ...(member.phone_number && { telephone: member.phone_number }),
                    ...(member.firm_address && { address: member.firm_address }),
                },
            },
        }),
    };

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={product.page_url} />
            <link rel="icon" href={faviconUrl ?? 'data:,'} />
            <link rel="apple-touch-icon" href={faviconUrl ?? 'data:,'} />
            <meta property="og:type" content="product" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={product.page_url} />
            <meta property="og:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        </Head>
    );
}

function Gallery({ photos, productName }) {
    const [current, setCurrent] = useState(0);

    if (!photos.length) {
        return (
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-primary/5">
                <svg className="h-16 w-16 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }

    return (
        <div>
            <div className="overflow-hidden rounded-2xl bg-primary/5">
                <img src={photos[current].url} alt={productName} className="aspect-[4/3] w-full object-cover" />
            </div>
            {photos.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                    {photos.map((photo, index) => (
                        <button
                            key={photo.id}
                            onClick={() => setCurrent(index)}
                            className={`overflow-hidden rounded-lg border-2 ${index === current ? 'border-accent' : 'border-transparent'}`}
                        >
                            <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductPage({ member, product }) {
    const firmName = member.firm_name ?? member.name;
    const sellerName = member.firm_name ? `M/s ${firmName}` : firmName;
    const contactNumber = member.whatsapp_number || member.phone_number;
    const generalWaLink = contactNumber
        ? whatsappLink(contactNumber, `Hi! I found you on UVA Vyapari Welfare Association. I'd like to know more about your business.`)
        : null;
    const waLink = contactNumber
        ? whatsappLink(contactNumber, `Hi! I'm interested in "${product.name}". Please share more details.`)
        : null;

    return (
        <>
            <ProductSeo member={member} product={product} />

            <div className="storefront-theme min-h-screen bg-[radial-gradient(circle_at_top,_rgb(var(--color-surface))_0%,_rgb(var(--color-accent)/0.08)_32%,_rgb(var(--color-surface))_100%)] text-primary">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-6 overflow-hidden rounded-3xl border border-primary/10 bg-white/90 shadow-[0_18px_45px_rgba(28,28,26,0.06)] backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:items-start">
                        {/* Firm photo banner — same left-column, fixed-height treatment as the business page */}
                        {member.firm_photo_url && (
                            <div className="relative h-40 w-full flex-none overflow-hidden sm:h-40 sm:w-1/5">
                                <img src={member.firm_photo_url} alt={member.firm_name ?? member.name} className="h-full w-full object-cover" />
                            </div>
                        )}
                        <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between sm:p-5">
                            <div className="flex items-center gap-3">
                                {member.photo_url ? (
                                    <img src={member.photo_url} alt={member.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-accent/15 shadow-sm" />
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white ring-2 ring-accent/15 shadow-sm">
                                        {firmName.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div>
                                    <a
                                        href={member.page_url}
                                        className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent transition hover:bg-accent/10"
                                    >
                                        Home Page
                                    </a>
                                    <a href={member.page_url} className="mt-2 block text-lg font-extrabold text-primary transition hover:text-accent">
                                        {sellerName}
                                    </a>
                                    {member.firm_address && (
                                        <p className="mt-1 text-sm text-primary/60">{member.firm_address}</p>
                                    )}
                                </div>
                            </div>

                            {generalWaLink && (
                                <a href={generalWaLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_26px_rgba(34,197,94,0.28)] transition hover:bg-green-600">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.02 0C5.45 0 .14 5.31.14 11.86c0 2.09.54 4.13 1.57 5.93L.02 24l6.41-1.67a11.9 11.9 0 0 0 5.59 1.68h.01c6.57 0 11.88-5.31 11.88-11.86 0-3.17-1.24-6.15-3.39-8.37ZM12.02 21.6c-1.8 0-3.56-.49-5.1-1.4l-.36-.22-3.8 1 1.01-3.7-.24-.38A9.76 9.76 0 0 1 2.24 11.9c0-5.38 4.39-9.76 9.78-9.76 2.6 0 5.05 1.01 6.88 2.84a9.7 9.7 0 0 1 2.85 6.92c0 5.38-4.39 9.76-9.78 9.76Zm5.36-7.3c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.14-.17.19-.35.22-.64.07-.29-.15-1.23-.45-2.35-1.44-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.35.44-.52.15-.17.2-.29.29-.49.1-.2.05-.38-.03-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.08-.8.38-.27.29-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.11 3.2 5.11 4.49.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.72-.7 1.96-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.2-.55-.35Z" />
                                    </svg>
                                    WhatsApp
                                </a>
                            )}
                        </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_22px_60px_rgba(28,28,26,0.08)]">
                        <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[1.12fr_0.88fr] lg:p-8">
                            <div className="rounded-[24px] bg-primary/[0.03] p-3 sm:p-4">
                                <Gallery photos={product.photos} productName={product.name} />
                            </div>

                            <section className="flex flex-col">
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                    {product.category && (
                                        <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                                            {product.category}
                                        </span>
                                    )}
                                    {member.nature_of_business && (
                                        <span className="inline-flex rounded-full bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/60">
                                            {member.nature_of_business}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">{product.name}</h1>

                                <div className="mt-4 flex items-baseline gap-3">
                                    {product.price ? (
                                        <p className="text-3xl font-extrabold text-primary">{formatPrice(product.price)}</p>
                                    ) : (
                                        <p className="text-base font-medium text-primary/50">Price on request</p>
                                    )}
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    {waLink && (
                                        <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-xl bg-green-500 px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(34,197,94,0.25)] transition hover:bg-green-600">
                                            WhatsApp Enquiry
                                        </a>
                                    )}
                                    {member.phone_number && (
                                        <a href={`tel:${member.phone_number}`} className="inline-flex h-12 items-center justify-center rounded-xl border border-primary/10 bg-white px-5 text-sm font-semibold text-primary/70 transition hover:bg-primary/5">
                                            Call Seller
                                        </a>
                                    )}
                                    <ShareButton url={product.page_url} title={product.name} />
                                </div>

                                {product.description && (
                                    <div className="mt-8 border-t border-primary/10 pt-6">
                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/50">Product details</p>
                                        <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-primary/70">{product.description}</p>
                                    </div>
                                )}

                                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/[0.02] px-4 py-4">
                                    {member.photo_url ? (
                                        <img src={member.photo_url} alt={member.name} className="h-10 w-10 flex-none rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                            {firmName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary/40">Sold by</p>
                                        <a href={member.page_url} className="block truncate text-sm font-bold text-primary hover:text-accent">{sellerName}</a>
                                        <p className="text-xs text-primary/50">To purchase this product, please contact us on WhatsApp.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="border-t border-primary/10 bg-primary/[0.02] px-4 py-6 sm:px-6 lg:px-8">
                            <div className="max-w-3xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/50">About this business</p>
                                {member.business_services && (
                                    <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-primary/60">{member.business_services}</p>
                                )}
                                {!member.business_services && (
                                    <p className="mt-3 text-base leading-relaxed text-primary/50">Please contact the seller for more information about their services and offerings.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
