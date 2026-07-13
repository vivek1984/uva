import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function AttachmentChip({ attachment }) {
    if (attachment.is_image) {
        return (
            <a href={attachment.url} target="_blank" rel="noreferrer" className="block h-16 w-16 flex-none overflow-hidden rounded-lg border border-gray-200">
                <img src={attachment.url} alt={attachment.name} className="h-full w-full object-cover" />
            </a>
        );
    }
    return (
        <a
            href={attachment.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-16 w-16 flex-none flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
        >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="px-1 text-[9px] leading-tight line-clamp-1">{attachment.name}</span>
        </a>
    );
}

function ContactDetailsModal({ requirement, onClose }) {
    const r = requirement;
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h3 className="text-sm font-bold text-gray-900">Contact Details</h3>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="space-y-3 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Name</p>
                        <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Address</p>
                        <p className="text-sm text-gray-700">{r.address}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Phone Number</p>
                        <p className="text-sm text-gray-700">{r.phone_number}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SeenByModal({ requirementId, onClose }) {
    const [loading, setLoading] = useState(true);
    const [viewers, setViewers] = useState([]);

    useEffect(() => {
        fetch(route('admin.requirements.viewers', requirementId), { headers: { Accept: 'application/json' } })
            .then(r => r.json())
            .then(data => { setViewers(data.viewers ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [requirementId]);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h3 className="text-sm font-bold text-gray-900">Seen by</h3>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="max-h-80 overflow-y-auto px-5 py-4">
                    {loading ? (
                        <p className="text-center text-sm text-gray-400">Loading…</p>
                    ) : viewers.length === 0 ? (
                        <p className="text-center text-sm text-gray-400">No members have viewed this yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {viewers.map((v, i) => (
                                <li key={i} className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-800">{v.name}</span>
                                    <span className="text-xs text-gray-400">{v.viewed_at}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function AdminControls({ requirement: r, attendableMembers, onAttendAs, onDelete, onViewSeenBy, busy }) {
    const [selected, setSelected] = useState('');

    return (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
            <button onClick={() => onViewSeenBy(r.id)} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                👁 Seen by
            </button>

            <div className="ml-auto flex items-center gap-1.5">
                <select
                    value={selected}
                    onChange={e => setSelected(e.target.value)}
                    className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">Attend as…</option>
                    {attendableMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <button
                    onClick={() => selected && onAttendAs(r.id, selected)}
                    disabled={!selected || busy}
                    className="h-8 rounded-lg bg-gray-800 px-2.5 text-xs font-semibold text-white hover:bg-gray-900 disabled:opacity-40"
                >
                    Assign
                </button>
            </div>

            <button
                onClick={() => onDelete(r.id)}
                disabled={busy}
                className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-40"
            >
                Delete
            </button>
        </div>
    );
}

function RequirementCard({ requirement, onAttend, onUnattend, onComplete, busy, isAdmin, attendableMembers, onAttendAs, onDelete, onViewSeenBy, onViewContact }) {
    const r = requirement;
    const isCompleted = r.status === 'completed';
    const isAttended = r.status === 'attended';

    return (
        <div className={`rounded-2xl border p-4 shadow-sm ${
            isCompleted ? 'border-emerald-200 bg-emerald-50/40'
            : isAttended ? (r.attended_by_me ? 'border-indigo-200 bg-indigo-50/40' : 'border-gray-200 bg-gray-50')
            : 'border-gray-200 bg-white'
        }`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    {r.name ? (
                        <button
                            onClick={() => onViewContact(r)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Contact Details
                        </button>
                    ) : (
                        <p className="text-xs italic text-gray-400">Contact details hidden — already being handled</p>
                    )}
                </div>
                <span className="flex-none text-[11px] text-gray-400">{r.submitted_at}</span>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{r.details}</p>

            {r.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {r.attachments.map(a => <AttachmentChip key={a.id} attachment={a} />)}
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                {isCompleted ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Completed{r.completed_at ? ` · ${r.completed_at}` : ''}
                    </span>
                ) : isAttended ? (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.attended_by_me ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'}`}>
                        {r.attended_by_me ? 'You are handling this' : (r.attended_by_name ? `Attended by ${r.attended_by_name}` : 'Attended by another member')}
                    </span>
                ) : (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Available</span>
                )}

                <div className="flex items-center gap-2">
                    {r.attended_by_me && isAttended && (
                        <>
                            <button
                                onClick={() => onComplete(r.id)}
                                disabled={busy}
                                className="min-h-[40px] rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {busy ? 'Please wait…' : 'Mark Complete'}
                            </button>
                            <button
                                onClick={() => onUnattend(r.id)}
                                disabled={busy}
                                className="min-h-[40px] rounded-lg bg-red-50 px-4 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
                            >
                                Un-attend
                            </button>
                        </>
                    )}
                    {!isAttended && !isCompleted && r.can_attend && (
                        <button
                            onClick={() => onAttend(r.id)}
                            disabled={busy}
                            className="min-h-[40px] rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {busy ? 'Please wait…' : 'Attend'}
                        </button>
                    )}
                    {r.blocked_by_inactive && (
                        <div className="text-right">
                            <button disabled className="min-h-[40px] rounded-lg bg-gray-200 px-4 text-xs font-semibold text-gray-400">
                                Attend
                            </button>
                            <p className="mt-1 max-w-[180px] text-[11px] text-amber-600">Please contact admin to activate this feature.</p>
                        </div>
                    )}
                </div>
            </div>

            {isAdmin && (
                <AdminControls
                    requirement={r}
                    attendableMembers={attendableMembers}
                    onAttendAs={onAttendAs}
                    onDelete={onDelete}
                    onViewSeenBy={onViewSeenBy}
                    busy={busy}
                />
            )}
        </div>
    );
}

export default function RequirementsBoard({ requirements, isAdmin = false, attendableMembers = [] }) {
    const [busyId, setBusyId] = useState(null);
    const [tab, setTab] = useState('open');
    const [seenById, setSeenById] = useState(null);
    const [contactFor, setContactFor] = useState(null);

    function run(routeName, id, data = {}) {
        setBusyId(id);
        router.post(route(routeName, id), data, { onFinish: () => setBusyId(null) });
    }

    const attend = id => run('requirements.attend', id);
    const unattend = id => run('requirements.unattend', id);
    const complete = id => run('requirements.complete', id);
    const attendAs = (id, memberId) => run('admin.requirements.attend-as', id, { member_id: memberId });

    function viewContact(requirement) {
        setContactFor(requirement);
        fetch(route('requirements.seen', requirement.id), {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
            },
        });
    }

    function destroy(id) {
        if (!confirm('Delete this requirement permanently? This cannot be undone.')) return;
        setBusyId(id);
        router.delete(route('admin.requirements.destroy', id), { onFinish: () => setBusyId(null) });
    }

    if (!requirements?.length) {
        return (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
                No customer requirements yet.
            </div>
        );
    }

    const open = requirements.filter(r => r.status !== 'completed');
    const completed = requirements.filter(r => r.status === 'completed');
    const displayed = tab === 'open' ? open : completed;

    return (
        <div>
            <div className="mb-4 flex gap-1 rounded-xl bg-gray-100 p-1 sm:w-fit">
                <button
                    onClick={() => setTab('open')}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${tab === 'open' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Open <span className="ml-1 text-xs text-gray-400">({open.length})</span>
                </button>
                <button
                    onClick={() => setTab('completed')}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${tab === 'completed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Completed <span className="ml-1 text-xs text-gray-400">({completed.length})</span>
                </button>
            </div>

            {displayed.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
                    {tab === 'open' ? 'No open requirements right now.' : 'No completed requirements yet.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {displayed.map(r => (
                        <RequirementCard
                            key={r.id}
                            requirement={r}
                            onAttend={attend}
                            onUnattend={unattend}
                            onComplete={complete}
                            busy={busyId === r.id}
                            isAdmin={isAdmin}
                            attendableMembers={attendableMembers}
                            onAttendAs={attendAs}
                            onDelete={destroy}
                            onViewSeenBy={setSeenById}
                            onViewContact={viewContact}
                        />
                    ))}
                </div>
            )}

            {seenById && <SeenByModal requirementId={seenById} onClose={() => setSeenById(null)} />}
            {contactFor && <ContactDetailsModal requirement={contactFor} onClose={() => setContactFor(null)} />}
        </div>
    );
}
