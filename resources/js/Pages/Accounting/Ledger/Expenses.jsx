import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AccountingLayout from '@/Layouts/AccountingLayout';

const MODE_LABELS = {
    cash: 'Cash', upi: 'UPI', bank_transfer: 'Bank Transfer', cheque: 'Cheque',
};

export default function ExpenseLedger({ fy, current_fy, all_years, entries, total, by_category }) {
    const [search, setSearch]         = useState('');
    const [activeCategory, setActive] = useState(null);

    function changeFy(e) {
        router.get(route('accounting.ledger.expenses'), { fy: e.target.value }, { preserveScroll: true });
    }

    const filtered = entries.filter(e => {
        const matchCat = !activeCategory || e.category === activeCategory;
        const q = search.toLowerCase();
        const matchSearch = !q
            || e.description.toLowerCase().includes(q)
            || e.category.toLowerCase().includes(q)
            || (e.notes ?? '').toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);

    return (
        <AccountingLayout header={
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('accounting.ledger.index', { fy })}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Ledgers
                    </Link>
                    <span className="text-gray-300">/</span>
                    <h2 className="text-lg font-semibold text-gray-800">Expenses Ledger — {fy}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">FY</label>
                    <select value={fy} onChange={changeFy} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {all_years.map(y => <option key={y} value={y}>{y}{y === current_fy ? ' (current)' : ''}</option>)}
                    </select>
                </div>
            </div>
        }>
            <Head title={`Expenses Ledger — ${fy}`} />

            <div className="mx-auto max-w-5xl px-4 py-6 space-y-4">

                {/* Category breakdown cards */}
                {Object.keys(by_category).length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {Object.entries(by_category).map(([cat, amt]) => (
                            <button
                                key={cat}
                                onClick={() => setActive(activeCategory === cat ? null : cat)}
                                className={`rounded-xl border p-3 text-left transition-colors ${
                                    activeCategory === cat
                                        ? 'border-orange-400 bg-orange-50'
                                        : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`}
                            >
                                <p className="text-xs font-medium text-gray-500 truncate">{cat}</p>
                                <p className="mt-1 text-base font-bold text-red-600">
                                    ₹{amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </p>
                            </button>
                        ))}
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
                            <p className="text-xs font-medium text-indigo-500">Total</p>
                            <p className="mt-1 text-base font-bold text-indigo-700">
                                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Search + active filter */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search description, category…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-56 bg-transparent text-sm outline-none placeholder-gray-400"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500">✕</button>
                        )}
                    </div>
                    {activeCategory && (
                        <div className="flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                            {activeCategory}
                            <button onClick={() => setActive(null)} className="text-orange-400 hover:text-orange-600">✕</button>
                        </div>
                    )}
                </div>

                {/* Ledger table */}
                <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-3 text-left w-28">Date</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-left w-32">Mode</th>
                                <th className="px-4 py-3 text-right w-36">Amount</th>
                                <th className="px-4 py-3 text-right w-36">Running Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                                        No expenses found{activeCategory ? ` in "${activeCategory}"` : ''}.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((e, i) => (
                                <tr key={e.id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{e.date}</td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                                            {e.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {e.description}
                                        {e.notes && <p className="text-xs text-gray-400 italic">{e.notes}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {MODE_LABELS[e.payment_mode] ?? e.payment_mode}
                                        {e.cheque && <span className="ml-1 text-xs text-gray-400">#{e.cheque}</span>}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-red-600">
                                        ₹{e.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-400 tabular-nums">
                                        ₹{e.running_total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {filtered.length > 0 && (
                            <tfoot className="bg-orange-50">
                                <tr className="font-bold">
                                    <td colSpan={4} className="px-5 py-3 text-orange-800">
                                        Total{activeCategory ? ` — ${activeCategory}` : ''}
                                    </td>
                                    <td className="px-4 py-3 text-right text-red-700">
                                        ₹{filteredTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3" />
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </AccountingLayout>
    );
}
