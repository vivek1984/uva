import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import SubmitRequirementModal from '@/Components/SubmitRequirementModal';

function textMatches(text, q) {
    return text?.toLowerCase().includes(q) ?? false;
}

/**
 * A member's business page URL, carrying along the matched product name
 * (if any) so that page can pre-fill its own product search on arrival.
 */
function businessUrlFor(member) {
    if (!member.matchedProduct) return member.business_url;
    if (member.matchedProduct.page_url) return member.matchedProduct.page_url;
    return `${member.business_url}?product=${encodeURIComponent(member.matchedProduct.name)}`;
}

/**
 * Matches on the member's own fields OR their published products.
 * A product-only match is annotated with `matchedProduct` so the UI
 * can explain why that member showed up ("product found with this dealer").
 */
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
        const matchedProduct = m.products?.find(p => textMatches(p.name, q) || textMatches(p.category, q)) ?? null;
        if (matchedProduct) {
            results.push({ ...m, matchedProduct });
        }
    }
    return results;
}

/* ── Search box with clickable results dropdown ──────────────── */
function MemberSearchBox({ members, query, setQuery }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function onDocMouseDown(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, []);

    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') setOpen(false); }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const trimmed = query.trim();
    const allMatches = trimmed ? filterMembers(members, query) : [];
    const matches = allMatches.slice(0, 8);

    return (
        <div ref={wrapperRef} className="relative flex-1">
            <svg className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => { if (query.trim()) setOpen(true); }}
                placeholder="Search name, business, address or product…"
                className="h-14 w-full rounded-2xl border-2 border-slate-200 bg-white pl-12 pr-11 text-base text-slate-900 placeholder-slate-400 shadow-md transition focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            />
            {query && (
                <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}

            {open && trimmed && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-xl">
                    {matches.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-slate-400">No members match "{query}"</p>
                    ) : (
                        <>
                            {matches.map(m => (
                                <a
                                    key={m.id}
                                    href={businessUrlFor(m)}
                                    className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-indigo-50"
                                >
                                    <div className="flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                                        {m.photo_url ? (
                                            <img src={m.photo_url} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            (m.firm_name ?? m.name).charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    {m.matchedProduct ? (
                                        <div className="min-w-0 flex-1">
                                            <span className="mb-0.5 inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                                                Product
                                            </span>
                                            <p className="truncate text-sm font-semibold text-slate-900">{m.matchedProduct.name}</p>
                                            <p className="truncate text-xs text-slate-400">with {m.firm_name ?? m.name}</p>
                                        </div>
                                    ) : (
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-900">{m.firm_name ?? m.name}</p>
                                            <p className="truncate text-xs text-slate-400">
                                                {m.firm_name ? m.name : ''}{m.firm_name && m.firm_address ? ' · ' : ''}{m.firm_address ?? ''}
                                            </p>
                                        </div>
                                    )}
                                    <svg className="h-4 w-4 flex-none text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            ))}
                            {allMatches.length > matches.length && (
                                <p className="px-4 py-2 text-center text-xs text-slate-400">
                                    +{allMatches.length - matches.length} more — see full results below
                                </p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

/* ── Lightbox ──────────────────────────────────────────────── */
function Lightbox({ images, startIndex, onClose }) {
    const [current, setCurrent] = useState(startIndex);
    const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
    const next = () => setCurrent(i => (i + 1) % images.length);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4" onClick={onClose}>
            <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 transition">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={images[current].url} alt={images[current].caption || ''} className="max-h-[88dvh] max-w-full rounded-2xl object-contain shadow-2xl" onClick={e => e.stopPropagation()} />
            <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 transition">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/25 transition">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {images[current].caption && (
                <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs text-white backdrop-blur-sm">
                    {images[current].caption}
                </p>
            )}
        </div>
    );
}

/* ── Text section ──────────────────────────────────────────── */
function TextSection({ section }) {
    return (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {(section.title || section.subtitle) && (
                    <div className="mb-8 text-center">
                        {section.title && <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{section.title}</h2>}
                        {section.subtitle && <p className="mt-2 text-base text-indigo-600">{section.subtitle}</p>}
                    </div>
                )}
                <div className={`flex flex-col gap-6 ${section.cover_image ? 'sm:flex-row sm:items-start' : ''}`}>
                    {section.cover_image && (
                        <img src={section.cover_image} alt={section.title || ''} className="w-full rounded-2xl object-cover shadow-md sm:w-64 sm:flex-none" />
                    )}
                    {section.body && (
                        <p className="flex-1 whitespace-pre-line text-base leading-relaxed text-slate-600">{section.body}</p>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ── Gallery section ───────────────────────────────────────── */
function GallerySection({ section }) {
    const [lightbox, setLightbox] = useState(null);
    if (!section.images?.length) return null;
    return (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {(section.title || section.subtitle) && (
                    <div className="mb-8 text-center">
                        {section.title && <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{section.title}</h2>}
                        {section.subtitle && <p className="mt-2 text-base text-indigo-600">{section.subtitle}</p>}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {section.images.map((img, i) => (
                        <button key={img.id} onClick={() => setLightbox(i)} className="group relative overflow-hidden rounded-2xl focus:outline-none">
                            <img src={img.url} alt={img.caption || ''} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
                            {img.caption && (
                                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 px-2 py-2 text-xs text-white backdrop-blur-sm transition duration-300 group-hover:translate-y-0">
                                    {img.caption}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            {lightbox !== null && <Lightbox images={section.images} startIndex={lightbox} onClose={() => setLightbox(null)} />}
        </section>
    );
}

/* ── Executive section ─────────────────────────────────────── */
function ExecutiveSection({ executives }) {
    if (!executives?.length) return null;
    return (
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Heading */}
                <div className="mb-10 text-center">
                    <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                        Leadership
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Executive Committee</h2>
                    <p className="mt-2 text-sm text-slate-500">The people driving UVA Vyapari Welfare Association forward</p>
                </div>

                {/* Horizontal scroll on mobile, wrap on desktop */}
                <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
                    <div className="flex gap-4 pb-2 sm:flex-wrap sm:justify-center sm:gap-6 sm:pb-0">
                        {executives.map(exec => (
                            <a
                                key={exec.id}
                                href={exec.slug ? `/${exec.slug}` : '#'}
                                className="group flex w-32 flex-none flex-col items-center gap-3 rounded-2xl p-4 transition hover:bg-indigo-50 sm:w-36"
                            >
                                {exec.photo_url ? (
                                    <img
                                        src={exec.photo_url}
                                        alt={exec.name}
                                        className="h-20 w-20 rounded-full object-cover shadow-md ring-2 ring-white group-hover:ring-indigo-300 transition sm:h-24 sm:w-24"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md ring-2 ring-white group-hover:ring-indigo-300 transition text-2xl font-extrabold text-white sm:h-24 sm:w-24">
                                        {exec.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-indigo-700 transition">
                                        {exec.name}
                                    </p>
                                    <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                        exec.post_name
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {exec.post_name ?? 'Executive Member'}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Members directory ─────────────────────────────────────── */
const PAGE_SIZE = 50;

function MembersDirectory({ members, query, setQuery }) {
    const [visible, setVisible] = useState(PAGE_SIZE);

    // Reset pagination whenever the search query changes
    useEffect(() => { setVisible(PAGE_SIZE); }, [query]);

    if (!members?.length) return null;

    const filtered = filterMembers(members, query);
    const displayed = filtered.slice(0, visible);
    const hasMore = filtered.length > visible;

    return (
        <section id="directory" className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Heading */}
                <div className="mb-8 text-center">
                    <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                        Directory
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our Members</h2>
                    <p className="mt-2 text-sm text-slate-500">Explore businesses run by our association members</p>
                </div>

                {/* Card grid */}
                {filtered.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                        <p className="text-sm font-medium text-slate-500">No members match "{query}"</p>
                        <button onClick={() => setQuery('')} className="mt-2 text-xs text-indigo-600 hover:underline">Clear search</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {displayed.map(member => (
                                <a
                                    key={member.id}
                                    href={businessUrlFor(member)}
                                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md hover:ring-indigo-200"
                                >
                                    {/* Photo */}
                                    <div className="relative aspect-square bg-gradient-to-br from-indigo-100 to-indigo-50">
                                        {member.photo_url ? (
                                            <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-indigo-300 sm:text-4xl">
                                                {(member.firm_name ?? member.name).charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-1 flex-col p-3">
                                        {member.matchedProduct && (
                                            <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                                🛍 {member.matchedProduct.name}
                                            </span>
                                        )}
                                        <p className="line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
                                            {member.firm_name ?? member.name}
                                        </p>
                                        {member.firm_name && (
                                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{member.name}</p>
                                        )}
                                        {member.firm_address && (
                                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{member.firm_address}</p>
                                        )}
                                        {member.business_services && (
                                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{member.business_services}</p>
                                        )}
                                        <div className="mt-auto pt-3">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 transition">
                                                View business
                                                <svg className="h-3 w-3 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <p className="mt-5 text-center text-xs text-slate-400">
                            Showing {displayed.length} of {filtered.length} member{filtered.length !== 1 ? 's' : ''}
                            {query.trim() && filtered.length < members.length && ` matching "${query}"`}
                        </p>

                        {hasMore && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setVisible(v => v + PAGE_SIZE)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 active:scale-95"
                                >
                                    Load more
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                                        +{Math.min(PAGE_SIZE, filtered.length - visible)}
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function Welcome({ canLogin, canRegister, sections = [], executives = [], members = [], auth }) {
    const [query, setQuery] = useState('');
    const [showRequirementModal, setShowRequirementModal] = useState(false);
    const { flash } = usePage().props;

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const description = 'UVA Vyapari Welfare Association — We are a group of wholesalers, distributors, and retailers of various products. Search member businesses, explore products, or submit a requirement and get connected with a trusted local trader.';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'UVA Vyapari Welfare Association',
        alternateName: 'UVA',
        url: siteUrl,
        logo: `${siteUrl}/storage/logo.jpg`,
        description,
    };

    return (
        <>
            <Head>
                <title>UVA Vyapari Welfare Association</title>
                <meta name="description" content={description} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={siteUrl} />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="UVA Vyapari Welfare Association" />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:image" content={`${siteUrl}/storage/logo.jpg`} />
                <meta property="og:site_name" content="UVA Vyapari Welfare Association" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="UVA Vyapari Welfare Association" />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={`${siteUrl}/storage/logo.jpg`} />

                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Head>

            <div className="min-h-[100dvh] bg-white text-slate-900 antialiased">

                {/* ── Navbar ─────────────────────────────────── */}
                <nav className="sticky top-0 z-40 border-b border-white/10 bg-indigo-950/90 backdrop-blur-md">
                    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <img src="/storage/logo.jpg" alt="UVA" className="h-8 w-8 rounded-lg object-contain" />
                            <span className="text-sm font-bold text-white">
                                UVA
                                <span className="hidden font-normal text-indigo-300 sm:inline"> Vyapari Welfare Association</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {auth?.user ? (
                                <Link href={route('dashboard')} className="inline-flex h-8 items-center rounded-lg bg-white px-4 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 active:scale-95">
                                    Dashboard →
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link href={route('login')} className="inline-flex h-8 items-center rounded-lg px-4 text-xs font-semibold text-indigo-200 transition hover:text-white">
                                            Login
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link href={route('register')} className="inline-flex h-8 items-center rounded-lg bg-indigo-500 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-400 active:scale-95">
                                            Join →
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── Hero (compact) ────────────────────────────── */}
                <div className="relative isolate overflow-hidden bg-indigo-950">
                    {/* Background grid pattern */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(circle, #a5b4fc 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    {/* Glow blobs */}
                    <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

                    <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-10 text-center sm:px-6 sm:pb-28 sm:pt-14">
                        <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-3xl">
                            UVA Vyapari Welfare Association
                        </h1>
                        <p className="mx-auto mt-2 max-w-md text-sm text-indigo-300 sm:text-base">
                            We are a group of wholesalers, distributors, and retailers of various products.
                        </p>

                        {auth?.user && (
                            <Link href={route('dashboard')} className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-50 active:scale-95">
                                Go to Dashboard →
                            </Link>
                        )}

                        {/* Stats strip */}
                        {members.length > 0 && (
                            <div className="mt-5 flex items-center justify-center gap-4 text-xs uppercase tracking-wider text-indigo-400">
                                <span><strong className="text-sm font-bold text-white">{members.length}+</strong> Members</span>
                                <span className="h-3 w-px bg-white/10" />
                                <span><strong className="text-sm font-bold text-white">{executives.length}</strong> Executives</span>
                                <span className="h-3 w-px bg-white/10" />
                                <span><strong className="text-sm font-bold text-white">1</strong> Association</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Search hub — the primary CTA, floating over the hero ── */}
                <div className="relative z-10 -mt-16 mb-10 px-4 sm:-mt-20 sm:mb-14 sm:px-6">
                    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-900/5 sm:p-7">
                        <p className="mb-4 text-center text-sm font-semibold text-slate-600">
                            Looking for a trusted business, or need something done?
                        </p>

                        {flash?.success && (
                            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
                                {flash.success}
                            </div>
                        )}

                        <div className="flex flex-col items-stretch gap-3 sm:flex-row">
                            <MemberSearchBox members={members} query={query} setQuery={setQuery} />
                            <button
                                onClick={() => setShowRequirementModal(true)}
                                className="flex h-14 flex-none items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Submit Requirement
                            </button>
                        </div>

                        {!auth?.user && (
                            <p className="mt-4 text-center text-xs text-slate-400">
                                Are you a trader?{' '}
                                {canLogin && <Link href={route('login')} className="font-semibold text-indigo-600 hover:underline">Member Login</Link>}
                                {canLogin && canRegister && ' · '}
                                {canRegister && <Link href={route('register')} className="font-semibold text-indigo-600 hover:underline">Register Free</Link>}
                            </p>
                        )}
                    </div>
                </div>

                {showRequirementModal && (
                    <SubmitRequirementModal onClose={() => setShowRequirementModal(false)} />
                )}

                {/* ── Executive committee ────────────────────── */}
                <ExecutiveSection executives={executives} />

                {/* ── Members directory ──────────────────────── */}
                <MembersDirectory members={members} query={query} setQuery={setQuery} />

                {/* ── Dynamic sections ───────────────────────── */}
                {sections.length > 0 && (
                    <div>
                        {sections.map((section, i) => (
                            <div key={section.id} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                {section.type === 'text'    && <TextSection    section={section} />}
                                {section.type === 'gallery' && <GallerySection section={section} />}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Footer ─────────────────────────────────── */}
                <footer className="bg-indigo-950 px-4 py-10 sm:px-6">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/storage/logo.jpg" alt="UVA" className="h-9 w-9 rounded-xl object-contain opacity-80" />
                                <div>
                                    <p className="text-sm font-bold text-white">UVA Vyapari Welfare Association</p>
                                    <p className="text-xs text-indigo-400">Yuva at Heart</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-indigo-400">
                                {canLogin && <Link href={route('login')} className="hover:text-white transition">Login</Link>}
                                {canRegister && <Link href={route('register')} className="hover:text-white transition">Register</Link>}
                            </div>
                        </div>
                        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-indigo-500">
                            © {new Date().getFullYear()} UVA Vyapari Welfare Association. All rights reserved.
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
