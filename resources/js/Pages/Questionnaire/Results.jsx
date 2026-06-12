import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';

const TYPE_LABELS = {
    short_text:      'Short Answer',
    paragraph:       'Paragraph',
    multiple_choice: 'Multiple Choice',
    checkboxes:      'Checkboxes',
    dropdown:        'Dropdown',
    date:            'Date',
    number:          'Number',
};

function parseAnswer(answer) {
    if (!answer) return [];
    try { return JSON.parse(answer); } catch { return [answer]; }
}

function AmountCell({ response, questionnaire }) {
    const [value, setValue] = useState(response.amount ?? '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved]   = useState(false);
    const [error, setError]   = useState(false);
    const lastSaved = useRef(response.amount ?? '');

    async function save() {
        const next = value === '' ? null : Number(value);
        if (String(next) === String(lastSaved.current)) return;
        setSaving(true);
        setError(false);
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
            const res = await fetch(
                route('questionnaires.responses.amount', { questionnaire: questionnaire.id, response: response.id }),
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Accept': 'application/json' },
                    body: JSON.stringify({ amount: next }),
                }
            );
            if (!res.ok) throw new Error();
            lastSaved.current = next;
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
        } catch {
            setError(true);
            setTimeout(() => setError(false), 2000);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex items-center gap-1.5">
            <span className="text-gray-400">₹</span>
            <input
                type="number"
                min="0"
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={save}
                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                placeholder="—"
                className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            {saving && <span className="text-xs text-gray-400">saving…</span>}
            {saved  && <span className="text-xs text-green-600">✓</span>}
            {error  && <span className="text-xs text-red-500">failed</span>}
        </div>
    );
}

function QuestionSummary({ question, responses }) {
    const answers = responses
        .map(r => r.answers[question.id])
        .filter(a => a !== undefined && a !== null && a !== '');

    const isChoice = ['multiple_choice', 'checkboxes', 'dropdown'].includes(question.type);

    const counts = useMemo(() => {
        if (!isChoice) return {};
        const tally = {};
        answers.forEach(raw => {
            parseAnswer(raw).forEach(val => {
                tally[val] = (tally[val] || 0) + 1;
            });
        });
        return tally;
    }, [answers]);

    const maxCount = Math.max(...Object.values(counts), 1);
    const totalVotes = Object.values(counts).reduce((s, v) => s + v, 0);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                    <p className="font-semibold text-gray-900">{question.label}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{TYPE_LABELS[question.type]} · {answers.length} response{answers.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {answers.length === 0 ? (
                <p className="text-sm italic text-gray-400">No responses yet</p>
            ) : isChoice ? (
                <div className="space-y-2">
                    {(question.options || []).map(opt => {
                        const count = counts[opt] || 0;
                        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        return (
                            <div key={opt}>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="text-gray-700">{opt}</span>
                                    <span className="font-semibold text-gray-900">{count} ({pct}%)</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-100">
                                    <div
                                        className="h-2 rounded-full bg-indigo-500 transition-all"
                                        style={{ width: `${(count / maxCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <ul className="max-h-40 space-y-1 overflow-y-auto text-sm text-gray-700">
                    {answers.map((a, i) => (
                        <li key={i} className="border-b border-gray-50 py-0.5 last:border-0">{a}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function Results({ questionnaire, responses, fill_url }) {
    const [copied, setCopied] = useState(false);
    const [tab, setTab] = useState('summary');

    function copyLink() {
        navigator.clipboard.writeText(fill_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function shareWhatsApp() {
        const text = encodeURIComponent(`Please fill out this form for UVA Vyapari Welfare Association:\n*${questionnaire.title}*\n${fill_url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }

    function toggle() {
        router.patch(route('questionnaires.toggle', questionnaire.id));
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Results — ${questionnaire.title}`} />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                {/* Header card */}
                <div className="mb-6 rounded-xl border-l-4 border-indigo-500 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{questionnaire.title}</h1>
                            {questionnaire.description && (
                                <p className="mt-1 text-sm text-gray-500">{questionnaire.description}</p>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                                <span className={`rounded-full px-2.5 py-1 font-semibold ${questionnaire.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {questionnaire.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span>{responses.length} total response{responses.length !== 1 ? 's' : ''}</span>
                                <span>·</span>
                                <span>by {questionnaire.created_by}</span>
                                {questionnaire.closes_at && <><span>·</span><span>Closes {questionnaire.closes_at}</span></>}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={copyLink}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                {copied ? '✓ Copied!' : 'Copy Link'}
                            </button>
                            <button
                                onClick={shareWhatsApp}
                                className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                            >
                                Share on WhatsApp
                            </button>
                            <a
                                href={route('questionnaires.export-csv', questionnaire.slug)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download CSV
                            </a>
                            <button
                                onClick={toggle}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                {questionnaire.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>

                    {/* Share URL display */}
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                        <span className="flex-1 truncate text-xs text-gray-500">{fill_url}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-5 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1">
                    {['summary', 'responses'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 rounded-md py-1.5 text-sm font-semibold capitalize transition ${tab === t ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {t === 'summary' ? 'Summary' : `Responses (${responses.length})`}
                        </button>
                    ))}
                </div>

                {tab === 'summary' && (
                    <div className="space-y-4">
                        {questionnaire.questions.map(q => (
                            <QuestionSummary key={q.id} question={q} responses={responses} />
                        ))}
                    </div>
                )}

                {tab === 'responses' && (
                    responses.length === 0 ? (
                        <p className="py-8 text-center text-gray-400">No responses yet</p>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap border-r border-gray-200">
                                            Member Name
                                        </th>
                                        {questionnaire.questions.map(q => (
                                            <th key={q.id} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap min-w-[160px]">
                                                {q.label}
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-indigo-600 whitespace-nowrap min-w-[150px]">
                                            Amount (₹)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {responses.map((r, i) => (
                                        <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                            <td className={`sticky left-0 z-10 px-4 py-3 border-r border-gray-200 whitespace-nowrap ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                                <p className="font-medium text-gray-900">{r.respondent_name}</p>
                                                {r.respondent_phone && (
                                                    <p className="text-xs text-gray-400">{r.respondent_phone}</p>
                                                )}
                                            </td>
                                            {questionnaire.questions.map(q => {
                                                const raw = r.answers[q.id];
                                                const display = raw
                                                    ? (q.type === 'checkboxes' ? parseAnswer(raw).join(', ') : raw)
                                                    : '—';
                                                return (
                                                    <td key={q.id} className="px-4 py-3 text-gray-700 align-top">
                                                        {display}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-4 py-3 align-top">
                                                <AmountCell response={r} questionnaire={questionnaire} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </AuthenticatedLayout>
    );
}
