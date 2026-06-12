import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MemberProfileForm from '@/Components/MemberProfileForm';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function SuggestionModal({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
    });
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) onClose();
    }, [flash?.success]);

    function handleBackdrop(e) {
        if (e.target === e.currentTarget) onClose();
    }

    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    function submit(e) {
        e.preventDefault();
        post(route('member.suggestions.store'), { onSuccess: () => reset() });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center"
            onClick={handleBackdrop}
        >
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">Submit Suggestion</h2>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={submit} className="space-y-4 px-6 py-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Brief title of your suggestion"
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            autoFocus
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Describe your suggestion in detail…"
                            rows={5}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-12 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60"
                        >
                            {processing ? 'Submitting…' : 'Submit Suggestion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function MemberDashboard({ profile, auth }) {
    const [showModal, setShowModal] = useState(false);
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">My Dashboard</h2>
                        <p className="text-sm text-gray-500">UVA Vyapari Welfare Association — General Member</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        General Member
                    </span>
                </div>
            }
        >
            <Head title="Member Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome banner */}
                    <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-md">
                        <h3 className="text-lg font-semibold">Welcome, {auth.user.name}!</h3>
                        <p className="mt-1 text-sm text-blue-100">
                            Manage your member profile and showcase your business products below.
                        </p>
                        {profile ? (
                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                                ✓ Profile complete
                            </span>
                        ) : (
                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                                ⚠ Profile not filled in yet
                            </span>
                        )}
                    </div>

                    {/* Suggestion CTA */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 px-6 py-4 text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100 active:scale-[0.99]"
                    >
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </span>
                        <div className="text-left">
                            <p className="text-sm font-bold">Submit Suggestion to Association</p>
                            <p className="text-xs text-indigo-500">Share your ideas or feedback with the executive committee</p>
                        </div>
                    </button>

                    {/* Flash */}
                    {flash?.success && (
                        <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-200">
                            {flash.success}
                        </div>
                    )}

                    <MemberProfileForm profile={profile} userName={auth.user.name} />
                </div>
            </div>

            {showModal && <SuggestionModal onClose={() => setShowModal(false)} />}
        </AuthenticatedLayout>
    );
}
