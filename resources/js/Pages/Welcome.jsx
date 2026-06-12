import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

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

function MembersDirectory({ members }) {
    const [query, setQuery] = useState('');
    const [visible, setVisible] = useState(PAGE_SIZE);
    if (!members?.length) return null;

    const q = query.trim().toLowerCase();
    const filtered = q
        ? members.filter(m =>
            m.name?.toLowerCase().includes(q) ||
            m.firm_name?.toLowerCase().includes(q) ||
            m.firm_address?.toLowerCase().includes(q)
          )
        : members;

    // Reset visible count whenever the search query changes
    const displayed = filtered.slice(0, visible);
    const hasMore = filtered.length > visible;

    return (
        <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Heading */}
                <div className="mb-8 text-center">
                    <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                        Directory
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our Members</h2>
                    <p className="mt-2 text-sm text-slate-500">Explore businesses run by our association members</p>
                </div>

                {/* Search */}
                <div className="relative mx-auto mb-8 max-w-sm">
                    <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
                        placeholder="Search name, business or address…"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {query && (
                        <button onClick={() => { setQuery(''); setVisible(PAGE_SIZE); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
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
                                    href={member.business_url}
                                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md hover:ring-indigo-200"
                                >
                                    {/* Photo */}
                                    <div className="relative h-28 bg-gradient-to-br from-indigo-100 to-indigo-50 sm:h-36">
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
                            {q && filtered.length < members.length && ` matching "${query}"`}
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
    return (
        <>
            <Head title="UVA Vyapari Welfare Association" />

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

                {/* ── Hero ───────────────────────────────────── */}
                <div className="relative isolate overflow-hidden bg-indigo-950">
                    {/* Background grid pattern */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(circle, #a5b4fc 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    {/* Glow blobs */}
                    <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

                    <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
                        {/* Logo badge */}
                        <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm sm:h-24 sm:w-24">
                            <img src="/storage/logo.jpg" alt="UVA" className="h-14 w-14 rounded-xl object-contain sm:h-16 sm:w-16" />
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            UVA Vyapari<br className="hidden sm:block" /> Welfare Association
                        </h1>
                        <p className="mx-auto mt-4 max-w-lg text-base text-indigo-300 sm:text-lg">
                            Yuva at Heart — uniting traders, empowering businesses, building community.
                        </p>

                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            {auth?.user ? (
                                <Link href={route('dashboard')} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-8 text-sm font-bold text-indigo-700 shadow-xl shadow-indigo-900/40 transition hover:bg-indigo-50 active:scale-95 sm:w-auto">
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link href={route('login')} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-8 text-sm font-bold text-indigo-700 shadow-xl shadow-indigo-900/40 transition hover:bg-indigo-50 active:scale-95 sm:w-auto">
                                            Member Login
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link href={route('register')} className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95 sm:w-auto">
                                            Register Free
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Stats strip */}
                        {members.length > 0 && (
                            <div className="mt-12 flex items-center justify-center gap-6 sm:gap-10">
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-white sm:text-3xl">{members.length}+</p>
                                    <p className="mt-0.5 text-xs text-indigo-400 uppercase tracking-wider">Members</p>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-white sm:text-3xl">{executives.length}</p>
                                    <p className="mt-0.5 text-xs text-indigo-400 uppercase tracking-wider">Executives</p>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-white sm:text-3xl">1</p>
                                    <p className="mt-0.5 text-xs text-indigo-400 uppercase tracking-wider">Association</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom fade into next section */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/5" />
                </div>

                {/* ── Executive committee ────────────────────── */}
                <ExecutiveSection executives={executives} />

                {/* ── Members directory ──────────────────────── */}
                <MembersDirectory members={members} />

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
