import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AccountingLayout from '@/Layouts/AccountingLayout';

const PAYMENT_MODES = [
    { value: 'cash',          label: 'Cash' },
    { value: 'upi',           label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer / NEFT' },
    { value: 'cheque',        label: 'Cheque' },
];

function ModeLabel({ mode }) {
    return PAYMENT_MODES.find(m => m.value === mode)?.label ?? mode;
}

function RecordModal({ member, fy, structure, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id:        member.id,
        financial_year: fy,
        fee_type:       'membership',
        amount:         structure?.membership_fee ?? '',
        payment_date:   new Date().toISOString().slice(0, 10),
        payment_mode:   'cash',
        cheque_number:  '',
        notes:          '',
    });

    function handleFeeType(v) {
        setData(prev => ({
            ...prev,
            fee_type: v,
            amount:   v === 'membership' ? (structure?.membership_fee ?? '') : (structure?.joining_fee ?? ''),
        }));
    }

    const availableFeeTypes = member.is_new_member
        ? ['membership', 'joining']
        : ['membership'];

    function submit(e) {
        e.preventDefault();
        post(route('accounting.fees.store'), {
            preserveScroll: true,
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Record Payment — {member.name}</h3>
                <form onSubmit={submit} className="space-y-3">
                    <div className="flex gap-3">
                        {availableFeeTypes.map(t => (
                            <label key={t} className="flex cursor-pointer items-center gap-2">
                                <input type="radio" checked={data.fee_type === t} onChange={() => handleFeeType(t)} className="text-indigo-600" />
                                <span className="text-sm capitalize">{t} Fee</span>
                            </label>
                        ))}
                        {!member.is_new_member && (
                            <span className="text-xs text-gray-400 self-center">(Joining fee not applicable — existing member)</span>
                        )}
                    </div>
                    {errors.fee_type && <p className="text-xs text-red-600">{errors.fee_type}</p>}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Amount (₹) <span className="text-red-500">*</span></label>
                        <input type="number" step="0.01" min="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                        {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Payment Date <span className="text-red-500">*</span></label>
                        <input type="date" value={data.payment_date} onChange={e => setData('payment_date', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Payment Mode <span className="text-red-500">*</span></label>
                        <select value={data.payment_mode} onChange={e => setData('payment_mode', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                            {PAYMENT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                    {data.payment_mode === 'cheque' && (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Cheque Number</label>
                            <input type="text" value={data.cheque_number} onChange={e => setData('cheque_number', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                    )}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                        <textarea rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)}
                            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={processing} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                            {processing ? 'Saving…' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FeeStatus({ fees, label, can_edit, onDelete }) {
    if (fees.length === 0) {
        return <span className="text-sm text-gray-400">—</span>;
    }
    return (
        <div className="space-y-1">
            {fees.map(f => (
                <div key={f.id} className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        ₹{Number(f.amount).toLocaleString('en-IN')} · {f.payment_date}
                    </span>
                    {can_edit && (
                        <button onClick={() => onDelete(f.id)} className="text-xs text-red-400 hover:text-red-600" title="Delete">✕</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function Fees({ fy, current_fy, all_years, can_edit, structure, members }) {
    const { flash } = usePage().props;
    const [recordFor, setRecordFor] = useState(null);
    const [search, setSearch]       = useState('');

    function changeFy(e) {
        router.get(route('accounting.fees.index'), { fy: e.target.value }, { preserveScroll: true });
    }

    function deleteFee(id) {
        if (!confirm('Delete this fee record?')) return;
        router.delete(route('accounting.fees.destroy', id), { preserveScroll: true });
    }

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.firm_name ?? '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AccountingLayout header={
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-800">Member Fees</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">FY</label>
                    <select value={fy} onChange={changeFy} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {all_years.map(y => <option key={y} value={y}>{y}{y === current_fy ? ' (current)' : ''}</option>)}
                    </select>
                </div>
            </div>
        }>
            <Head title="Member Fees" />

            {recordFor && (
                <RecordModal
                    member={recordFor}
                    fy={fy}
                    structure={structure}
                    onClose={() => setRecordFor(null)}
                />
            )}

            <div className="mx-auto max-w-5xl px-4 py-6 space-y-4">

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">{flash.success}</div>
                )}

                {!structure && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                        No fee structure set for {fy}. <a href={route('accounting.settings')} className="font-semibold underline">Set it here</a>.
                    </div>
                )}

                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b px-5 py-3">
                        <input
                            type="text"
                            placeholder="Search member or firm…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-64 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {structure && (
                            <p className="text-xs text-gray-400">
                                Membership: ₹{Number(structure.membership_fee).toLocaleString('en-IN')} · Joining: ₹{Number(structure.joining_fee).toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-5 py-3 text-left">Member</th>
                                    <th className="px-4 py-3 text-left">Phone</th>
                                    <th className="px-4 py-3 text-left">Membership Fee</th>
                                    <th className="px-4 py-3 text-left">Joining Fee</th>
                                    {can_edit && <th className="px-4 py-3 text-right">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.length === 0 && (
                                    <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No members found.</td></tr>
                                )}
                                {filtered.map(m => (
                                    <tr key={m.id} className={m.status === 'non-active' ? 'opacity-50' : ''}>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-800">{m.name}</p>
                                                {m.is_new_member && (
                                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">New</span>
                                                )}
                                            </div>
                                            {m.firm_name && <p className="text-xs text-gray-400">{m.firm_name}</p>}
                                            <span className={`text-xs ${m.role === 'executive' ? 'text-purple-600' : 'text-gray-400'}`}>{m.role}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{m.phone}</td>
                                        <td className="px-4 py-3">
                                            <FeeStatus fees={m.membership_fees} label="Membership" can_edit={can_edit} onDelete={deleteFee} />
                                        </td>
                                        <td className="px-4 py-3">
                                            {m.is_new_member
                                                ? <FeeStatus fees={m.joining_fees} label="Joining" can_edit={can_edit} onDelete={deleteFee} />
                                                : <span className="text-xs text-gray-300">N/A</span>
                                            }
                                        </td>
                                        {can_edit && (
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => setRecordFor(m)}
                                                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                                                    + Record
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AccountingLayout>
    );
}
