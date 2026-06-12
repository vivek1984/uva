import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AccountingLayout from '@/Layouts/AccountingLayout';

const MODE_LABELS = {
    cash: 'Cash', upi: 'UPI', bank_transfer: 'Bank Transfer', cheque: 'Cheque',
};

function BalancePill({ amount }) {
    if (amount === 0) return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Settled</span>;
    if (amount > 0)  return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Due ₹{amount.toLocaleString('en-IN')}</span>;
    return <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Credit ₹{Math.abs(amount).toLocaleString('en-IN')}</span>;
}

function MemberSearch({ members, currentId }) {
    const [query, setQuery]   = useState('');
    const [open, setOpen]     = useState(false);
    const ref                 = useRef(null);

    const current = members.find(m => m.id === currentId);

    const filtered = query.trim() === ''
        ? members
        : members.filter(m => {
            const q = query.toLowerCase();
            return m.name.toLowerCase().includes(q) ||
                   (m.firm_name ?? '').toLowerCase().includes(q);
        });

    useEffect(() => {
        function onClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    function select(id) {
        setOpen(false);
        setQuery('');
        router.get(route('accounting.ledger.member', id));
    }

    return (
        <div ref={ref} className="relative w-72">
            <div
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 cursor-text focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400"
                onClick={() => setOpen(true)}
            >
                <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                    type="text"
                    value={open ? query : (current ? current.name + (current.firm_name ? ` — ${current.firm_name}` : '') : '')}
                    onChange={e => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search member or firm…"
                    className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                />
            </div>

            {open && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                    {filtered.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-400">No members found.</p>
                    ) : (
                        filtered.map(m => (
                            <button
                                key={m.id}
                                onMouseDown={() => select(m.id)}
                                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-indigo-50 transition-colors ${m.id === currentId ? 'bg-indigo-50 font-semibold' : ''}`}
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{m.name}</p>
                                    {m.firm_name && <p className="text-xs text-gray-400">{m.firm_name}</p>}
                                </div>
                                <span className={`ml-3 shrink-0 text-xs ${m.role === 'executive' ? 'text-purple-500' : 'text-blue-400'}`}>{m.role}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default function MemberLedger({ member, ledger, members, current_fy, can_edit, member_opening_balance }) {
    const { flash } = usePage().props;
    const [expanded, setExpanded]       = useState(null);
    const [showObForm, setShowObForm]   = useState(false);
    const [obAmt, setObAmt]             = useState(String(member_opening_balance ?? 0));
    const [saving, setSaving]           = useState(false);

    function submitOpeningBalance(e) {
        e.preventDefault();
        setSaving(true);
        router.post(route('accounting.ledger.member.opening-balance', member.id), {
            opening_balance: obAmt,
        }, {
            preserveScroll: true,
            onFinish: () => { setSaving(false); setShowObForm(false); },
        });
    }

    const totalDue     = ledger.reduce((s, r) => s + r.membership_due, 0);
    const totalPaid    = ledger.reduce((s, r) => s + r.membership_paid + r.joining_paid, 0);
    const finalBalance = ledger.length > 0 ? ledger[ledger.length - 1].closing_balance : 0;

    return (
        <AccountingLayout header={
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('accounting.ledger.index')}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Ledgers
                    </Link>
                    <span className="text-gray-300">/</span>
                    <h2 className="text-lg font-semibold text-gray-800">Member Ledger</h2>
                </div>
                <MemberSearch members={members} currentId={member.id} />
            </div>
        }>
            <Head title={`Ledger — ${member.name}`} />

            <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Member info card */}
                <div className="rounded-xl border bg-white p-5 shadow-sm flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
                        {member.firm_name && <p className="text-sm text-gray-500">{member.firm_name}</p>}
                        {member.phone && <p className="text-sm text-gray-400">{member.phone}</p>}
                        <div className="mt-1 flex gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${member.role === 'executive' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-600'}`}>
                                {member.role}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {member.status}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Total Outstanding</p>
                        <p className={`text-2xl font-bold ${finalBalance > 0 ? 'text-red-600' : finalBalance < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                            {finalBalance > 0 ? '−' : finalBalance < 0 ? '+' : ''}
                            ₹{Math.abs(finalBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-400">{finalBalance > 0 ? 'dues pending' : finalBalance < 0 ? 'credit balance' : 'fully settled'}</p>
                    </div>
                </div>

                {/* Opening balance form */}
                {can_edit && (
                    <div className="rounded-xl border bg-white shadow-sm">
                        <button
                            onClick={() => { setShowObForm(v => !v); setObAmt(String(member_opening_balance ?? 0)); }}
                            className="flex w-full items-center justify-between px-5 py-3 text-left"
                        >
                            <div>
                                <span className="text-sm font-semibold text-gray-700">Set Opening Balance</span>
                                {member_opening_balance !== 0 && (
                                    <span className="ml-2 text-xs text-indigo-600">
                                        Current: ₹{Math.abs(member_opening_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        {member_opening_balance > 0 ? ' (due)' : ' (credit)'}
                                    </span>
                                )}
                            </div>
                            <span className="text-gray-400 text-xs">{showObForm ? '▲' : '▼'}</span>
                        </button>
                        {showObForm && (
                            <form onSubmit={submitOpeningBalance} className="border-t px-5 py-4 flex flex-wrap items-end gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                        Opening Balance (₹) — positive = dues owed, negative = credit
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={obAmt}
                                        onChange={e => setObAmt(e.target.value)}
                                        className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {saving ? 'Saving…' : 'Save'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {ledger.length === 0 ? (
                    <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
                        No fee records found for this member.
                    </div>
                ) : (
                    <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-5 py-3 text-left">Financial Year</th>
                                    <th className="px-4 py-3 text-right">Opening Balance</th>
                                    <th className="px-4 py-3 text-right">Membership Due</th>
                                    <th className="px-4 py-3 text-right">Amount Paid</th>
                                    <th className="px-4 py-3 text-right">Closing Balance</th>
                                    <th className="px-4 py-3 text-center w-20">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {ledger.map((row) => {
                                    const isOpen = expanded === row.financial_year;
                                    const totalRowPaid = row.membership_paid + row.joining_paid;
                                    return (
                                        <>
                                            <tr
                                                key={row.financial_year}
                                                className={`${row.financial_year === current_fy ? 'bg-indigo-50' : ''} hover:bg-gray-50 cursor-pointer`}
                                                onClick={() => setExpanded(isOpen ? null : row.financial_year)}
                                            >
                                                <td className="px-5 py-3 font-semibold text-gray-800">
                                                    {row.financial_year}
                                                    {row.financial_year === current_fy && (
                                                        <span className="ml-2 rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700">Current</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-500">
                                                    {row.opening_balance !== 0
                                                        ? <span className={row.opening_balance > 0 ? 'text-red-500' : 'text-blue-500'}>
                                                            ₹{Math.abs(row.opening_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                          </span>
                                                        : <span className="text-gray-300">—</span>
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-gray-700">
                                                    {row.membership_due > 0
                                                        ? `₹${row.membership_due.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                                                        : <span className="text-gray-300">—</span>
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {totalRowPaid > 0 ? (
                                                        <span className="font-medium text-green-700">
                                                            ₹{totalRowPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            {row.joining_paid > 0 && (
                                                                <span className="ml-1 text-xs text-purple-500">+joining</span>
                                                            )}
                                                        </span>
                                                    ) : <span className="text-red-400 text-xs">Unpaid</span>}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <BalancePill amount={row.closing_balance} />
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-400 text-xs">
                                                    {row.payments.length > 0
                                                        ? <span className="text-indigo-500 underline">{isOpen ? 'Hide' : `${row.payments.length} payment${row.payments.length > 1 ? 's' : ''}`}</span>
                                                        : '—'
                                                    }
                                                </td>
                                            </tr>

                                            {isOpen && row.payments.map((p, pi) => (
                                                <tr key={pi} className="bg-gray-50 text-xs text-gray-500">
                                                    <td className="pl-10 pr-4 py-2 text-gray-400">{p.payment_date}</td>
                                                    <td className="px-4 py-2" colSpan={2}>
                                                        <span className={`rounded-full px-1.5 py-0.5 font-medium ${p.fee_type === 'joining' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                            {p.fee_type === 'joining' ? 'Joining fee' : 'Membership fee'}
                                                        </span>
                                                        <span className="ml-2">{MODE_LABELS[p.payment_mode] ?? p.payment_mode}</span>
                                                        {p.notes && <span className="ml-2 italic text-gray-400">{p.notes}</span>}
                                                    </td>
                                                    <td className="px-4 py-2 text-right font-semibold text-green-700">
                                                        ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-2" colSpan={2}>
                                                        <span className="text-gray-400">by {p.recorded_by}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    );
                                })}
                            </tbody>

                            <tfoot className="bg-gray-100 text-sm font-semibold">
                                <tr>
                                    <td className="px-5 py-3 text-gray-700">Total</td>
                                    <td className="px-4 py-3" />
                                    <td className="px-4 py-3 text-right text-gray-700">
                                        ₹{totalDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-right text-green-700">
                                        ₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <BalancePill amount={finalBalance} />
                                    </td>
                                    <td className="px-4 py-3" />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </AccountingLayout>
    );
}
