import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const TYPE_LABELS = { text: 'Text Block', gallery: 'Image Gallery' };
const TYPE_COLORS = { text: 'bg-blue-100 text-blue-700', gallery: 'bg-purple-100 text-purple-700' };

function SectionCard({ section, isFirst, isLast }) {
    function toggle() {
        router.patch(route('homepage.sections.toggle', section.id));
    }
    function move(direction) {
        router.patch(route('homepage.sections.move', section.id), { direction });
    }
    function destroy() {
        if (confirm(`Delete section "${section.title || 'Untitled'}"? This cannot be undone.`)) {
            router.delete(route('homepage.sections.destroy', section.id));
        }
    }

    return (
        <div className={`rounded-xl border bg-white shadow-sm transition ${section.is_published ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'}`}>
            <div className="flex items-center gap-3 p-4">
                {/* Cover thumbnail */}
                {section.cover_image ? (
                    <img src={section.cover_image} alt="" className="h-14 w-14 rounded-lg object-cover flex-none" />
                ) : (
                    <div className="flex h-14 w-14 flex-none items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                        {section.type === 'gallery' ? (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" /></svg>
                        )}
                    </div>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TYPE_COLORS[section.type]}`}>
                            {TYPE_LABELS[section.type]}
                        </span>
                        {section.type === 'gallery' && (
                            <span className="text-xs text-gray-400">{section.image_count} photo{section.image_count !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                    <p className="mt-0.5 truncate font-semibold text-gray-900">{section.title || <span className="italic text-gray-400">Untitled</span>}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-none items-center gap-1 sm:gap-1.5">
                    <button onClick={() => move('up')} disabled={isFirst} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-30" title="Move up">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button onClick={() => move('down')} disabled={isLast} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-30" title="Move down">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <button onClick={toggle} className={`rounded-lg p-2 ${section.is_published ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={section.is_published ? 'Published — click to hide' : 'Hidden — click to publish'}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {section.is_published
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            }
                        </svg>
                    </button>
                    <Link href={route('homepage.sections.edit', section.id)} className="rounded-lg p-2 text-indigo-500 hover:bg-indigo-50" title="Edit">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </Link>
                    <button onClick={destroy} className="ml-1 rounded-lg p-2 text-red-400 hover:bg-red-50" title="Delete">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Manager({ sections }) {
    const [showAddMenu, setShowAddMenu] = React.useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Homepage Manager" />

            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Homepage</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Manage what visitors see on the front page</p>
                    </div>
                    <div className="relative sm:flex-none">
                        <button
                            onClick={() => setShowAddMenu(v => !v)}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 active:scale-95"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Add Section
                        </button>
                        {showAddMenu && (
                            <div className="absolute right-0 top-full z-10 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-xl">
                                <Link
                                    href={route('homepage.sections.create') + '?type=text'}
                                    className="flex items-center gap-3 rounded-t-xl px-4 py-3 text-sm hover:bg-indigo-50"
                                    onClick={() => setShowAddMenu(false)}
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">Text Block</p>
                                        <p className="text-xs text-gray-500">Title + text + photo</p>
                                    </div>
                                </Link>
                                <Link
                                    href={route('homepage.sections.create') + '?type=gallery'}
                                    className="flex items-center gap-3 rounded-b-xl px-4 py-3 text-sm hover:bg-indigo-50"
                                    onClick={() => setShowAddMenu(false)}
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">Image Gallery</p>
                                        <p className="text-xs text-gray-500">Grid of photos</p>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview link */}
                <a href="/" target="_blank" className="mb-5 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Preview live homepage →
                </a>

                {sections.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <p className="mt-3 text-gray-500">No sections yet. Add your first one!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sections.map((s, i) => (
                            <SectionCard key={s.id} section={s} isFirst={i === 0} isLast={i === sections.length - 1} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// Need React in scope for useState
import React from 'react';
