import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function PhoneStatusBadge({ status }) {
    if (status === 'loading') {
        return <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400"><span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500" /> Checking…</p>;
    }
    if (status === 'not_registered') {
        return <p className="mt-1.5 text-xs font-medium text-red-600">Please enter the phone number used for registration.</p>;
    }
    if (status === 'not_active') {
        return <p className="mt-1.5 text-xs font-medium text-red-600">Your membership is currently inactive. Please contact the association.</p>;
    }
    if (status === 'has_previous') {
        return <p className="mt-1.5 text-xs font-medium text-amber-600">Previous response found — your answers have been pre-filled. You may edit and re-submit.</p>;
    }
    if (status === 'valid') {
        return <p className="mt-1.5 text-xs font-medium text-green-600">Registered member verified.</p>;
    }
    return null;
}

function SuccessModal({ message, onEdit, onClose }) {
    // Close on backdrop click
    function handleBackdrop(e) {
        if (e.target === e.currentTarget) onClose();
    }

    // Close on Escape key
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl text-center">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Close"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="mb-1 text-lg font-bold text-gray-900">Response Submitted!</h2>
                <p className="mb-6 text-sm text-gray-500">{message}</p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onEdit}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit My Response
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Fill({ questionnaire, prefill }) {
    const { flash } = usePage().props;

    const initialAnswers = Object.fromEntries(
        (questionnaire.questions || []).map(q => [q.id, q.type === 'checkboxes' ? [] : ''])
    );

    const { data, setData, post, processing, errors } = useForm({
        respondent_name:  prefill?.name  ?? '',
        respondent_phone: prefill?.phone ?? '',
        answers:          initialAnswers,
    });

    const [phoneStatus, setPhoneStatus] = useState('idle');
    const [modalOpen, setModalOpen]     = useState(!!flash?.success);
    const [showEditForm, setShowEditForm] = useState(false);
    const debounceRef = useRef(null);

    // Re-open modal if a new flash arrives (e.g. after update submission)
    useEffect(() => {
        if (flash?.success) {
            setModalOpen(true);
            setShowEditForm(false);
        }
    }, [flash?.success]);

    // Auto-lookup for logged-in users on first load
    useEffect(() => {
        if (prefill?.phone) {
            doLookup(prefill.phone);
        }
    }, []);

    function handleEditClick() {
        setModalOpen(false);
        setShowEditForm(true);
        if (prefill?.phone) {
            doLookup(prefill.phone);
        }
    }

    async function doLookup(phone) {
        setPhoneStatus('loading');
        try {
            const res = await fetch(
                `/q/${questionnaire.slug}/prefill?phone=${encodeURIComponent(phone)}`,
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } }
            );
            const json = await res.json();

            if (res.status === 422) {
                setPhoneStatus('not_registered');
                return;
            }
            if (res.status === 403) {
                setPhoneStatus('not_active');
                return;
            }

            const newAnswers = { ...initialAnswers };
            if (json.previous_response?.answers) {
                Object.entries(json.previous_response.answers).forEach(([qId, val]) => {
                    newAnswers[Number(qId)] = val;
                });
            }

            setData({
                respondent_name:  json.user?.name ?? data.respondent_name,
                respondent_phone: phone,
                answers:          newAnswers,
            });

            setPhoneStatus(json.previous_response ? 'has_previous' : 'valid');
        } catch {
            setPhoneStatus('idle');
        }
    }

    function handlePhoneChange(phone) {
        setData('respondent_phone', phone);
        setPhoneStatus('idle');

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (phone.replace(/\D/g, '').length >= 10) {
            debounceRef.current = setTimeout(() => doLookup(phone), 600);
        }
    }

    function setAnswer(qId, val) {
        setData('answers', { ...data.answers, [qId]: val });
    }

    function toggleCheckbox(qId, opt) {
        const current = Array.isArray(data.answers[qId]) ? data.answers[qId] : [];
        const updated = current.includes(opt)
            ? current.filter(v => v !== opt)
            : [...current, opt];
        setAnswer(qId, updated);
    }

    function submit(e) {
        e.preventDefault();
        post(route('questionnaire.respond', questionnaire.slug));
    }

    const closed     = !questionnaire.is_active;
    const canSubmit  = phoneStatus === 'valid' || phoneStatus === 'has_previous';
    const showForm   = !closed && (!flash?.success || showEditForm);

    return (
        <>
            <Head title={questionnaire.title} />

            {/* Success modal */}
            {flash?.success && modalOpen && (
                <SuccessModal
                    message={flash.success}
                    onEdit={handleEditClick}
                    onClose={() => setModalOpen(false)}
                />
            )}

            <div className="min-h-screen bg-gray-100 px-4 py-10 sm:py-16">
                <div className="mx-auto max-w-xl">
                    {/* Branding */}
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <img src="/storage/logo.jpg" alt="UVA" className="h-10 w-auto object-contain" />
                        <span className="text-lg font-bold text-indigo-700">UVA Vyapari Welfare Association</span>
                    </div>

                    {/* Title card */}
                    <div className="mb-5 rounded-xl border-l-4 border-indigo-500 bg-white shadow-sm overflow-hidden">
                        {questionnaire.image_url && (
                            <img src={questionnaire.image_url} alt="" className="w-full max-h-64 object-cover" />
                        )}
                        <div className="p-5">
                            <h1 className="text-xl font-bold text-gray-900">{questionnaire.title}</h1>
                            {questionnaire.description && (
                                <p className="mt-2 text-sm text-gray-600">{questionnaire.description}</p>
                            )}
                            {closed && (
                                <div className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                                    This form is no longer accepting responses.
                                </div>
                            )}
                        </div>
                    </div>

                    {showForm && (
                        <form onSubmit={submit} className="space-y-4">
                            {/* Respondent identity */}
                            <div className="rounded-xl bg-white p-5 shadow-sm">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Your Details</p>

                                <div className="mb-4">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                        <span className="ml-1 text-xs font-normal text-gray-400">(used for registration)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.respondent_phone}
                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                            phoneStatus === 'not_registered' || phoneStatus === 'not_active' || errors.respondent_phone
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                                                : phoneStatus === 'valid' || phoneStatus === 'has_previous'
                                                ? 'border-green-400 focus:border-green-500 focus:ring-green-400'
                                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                        placeholder="Enter your registered phone number"
                                        required
                                    />
                                    <PhoneStatusBadge status={phoneStatus} />
                                    {errors.respondent_phone && (
                                        <p className="mt-1 text-xs font-medium text-red-600">{errors.respondent_phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.respondent_name}
                                        onChange={(e) => setData('respondent_name', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.respondent_name && (
                                        <p className="mt-1 text-xs text-red-500">{errors.respondent_name}</p>
                                    )}
                                </div>
                            </div>

                            {!canSubmit && phoneStatus !== 'loading' && (
                                <div className="rounded-xl border-2 border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
                                    Enter your registered phone number above to load the form.
                                </div>
                            )}

                            {canSubmit && questionnaire.questions.map((q, i) => (
                                <div key={q.id} className="rounded-xl bg-white p-5 shadow-sm">
                                    <label className="mb-3 block text-sm font-medium text-gray-900">
                                        {i + 1}. {q.label}
                                        {q.is_required && <span className="ml-1 text-red-500">*</span>}
                                    </label>

                                    {q.type === 'short_text' && (
                                        <input type="text" value={data.answers[q.id] || ''} onChange={(e) => setAnswer(q.id, e.target.value)} required={q.is_required} placeholder="Your answer" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                    )}
                                    {q.type === 'paragraph' && (
                                        <textarea value={data.answers[q.id] || ''} onChange={(e) => setAnswer(q.id, e.target.value)} required={q.is_required} rows={4} placeholder="Your answer" className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                    )}
                                    {q.type === 'number' && (
                                        <input type="number" value={data.answers[q.id] || ''} onChange={(e) => setAnswer(q.id, e.target.value)} required={q.is_required} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                    )}
                                    {q.type === 'date' && (
                                        <input type="date" value={data.answers[q.id] || ''} onChange={(e) => setAnswer(q.id, e.target.value)} required={q.is_required} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                    )}
                                    {q.type === 'multiple_choice' && (
                                        <div className="space-y-2">
                                            {(q.options || []).map(opt => (
                                                <label key={opt} className="flex cursor-pointer items-center gap-3">
                                                    <input type="radio" name={`q_${q.id}`} value={opt} checked={data.answers[q.id] === opt} onChange={() => setAnswer(q.id, opt)} required={q.is_required} className="h-4 w-4 text-indigo-600" />
                                                    <span className="text-sm text-gray-700">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {q.type === 'checkboxes' && (
                                        <div className="space-y-2">
                                            {(q.options || []).map(opt => (
                                                <label key={opt} className="flex cursor-pointer items-center gap-3">
                                                    <input type="checkbox" checked={Array.isArray(data.answers[q.id]) && data.answers[q.id].includes(opt)} onChange={() => toggleCheckbox(q.id, opt)} className="h-4 w-4 rounded text-indigo-600" />
                                                    <span className="text-sm text-gray-700">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {q.type === 'dropdown' && (
                                        <select value={data.answers[q.id] || ''} onChange={(e) => setAnswer(q.id, e.target.value)} required={q.is_required} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                            <option value="">— Select —</option>
                                            {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    )}
                                </div>
                            ))}

                            {errors.form && (
                                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{errors.form}</p>
                            )}

                            {canSubmit && (
                                <button type="submit" disabled={processing} className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-60">
                                    {processing ? 'Submitting…' : phoneStatus === 'has_previous' ? 'Update My Response' : 'Submit Response'}
                                </button>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
