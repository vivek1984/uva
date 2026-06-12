import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function StatusBadge({ isActive, closesAt }) {
    const closed = closesAt && new Date(closesAt) < new Date();
    if (closed) return <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">Closed (expired)</span>;
    if (!isActive) return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Inactive</span>;
    return <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Active</span>;
}

export default function Index({ questionnaires }) {
    function copyLink(url) {
        navigator.clipboard.writeText(url);
    }

    function shareWhatsApp(q) {
        const text = encodeURIComponent(`Please fill out this form for UVA Vyapari Welfare Association:\n*${q.title}*\n${q.fill_url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }

    function toggle(q) {
        router.patch(route('questionnaires.toggle', q.id));
    }

    function destroy(q) {
        if (confirm(`Delete "${q.title}"? This will remove all responses too.`)) {
            router.delete(route('questionnaires.destroy', q.id));
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Questionnaires" />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Questionnaires</h1>
                        <p className="mt-1 text-sm text-gray-500">Create and manage member surveys</p>
                    </div>
                    <Link
                        href={route('questionnaires.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Questionnaire
                    </Link>
                </div>

                {questionnaires.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="mt-4 text-gray-500">No questionnaires yet. Create your first one!</p>
                        <Link
                            href={route('questionnaires.create')}
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Create Questionnaire
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questionnaires.map((q) => (
                            <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-base font-semibold text-gray-900">{q.title}</h2>
                                            <StatusBadge isActive={q.is_active} closesAt={q.closes_at} />
                                        </div>
                                        {q.description && (
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{q.description}</p>
                                        )}
                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                            <span>{q.responses_count} response{q.responses_count !== 1 ? 's' : ''}</span>
                                            <span>·</span>
                                            <span>by {q.created_by}</span>
                                            <span>·</span>
                                            <span>{q.created_at}</span>
                                            {q.closes_at && <><span>·</span><span>Closes {q.closes_at}</span></>}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            href={route('questionnaires.show', q.slug)}
                                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                                        >
                                            View Results
                                        </Link>
                                        <button
                                            onClick={() => copyLink(q.fill_url)}
                                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                            title="Copy form link"
                                        >
                                            Copy Link
                                        </button>
                                        <button
                                            onClick={() => shareWhatsApp(q)}
                                            className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                                        >
                                            WhatsApp
                                        </button>
                                        <button
                                            onClick={() => toggle(q)}
                                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                        >
                                            {q.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => destroy(q)}
                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
