import { Head, Link, router } from '@inertiajs/react';
import AccountingLayout from '@/Layouts/AccountingLayout';

const MODE_LABELS = {
    cash: 'Cash', upi: 'UPI', bank_transfer: 'Bank Transfer', cheque: 'Cheque',
};

export default function CashBank({ type, fy, current_fy, all_years, opening, entries, total_receipts, total_payments, closing }) {
    const title = type === 'cash' ? 'Cash Book' : 'Bank Book';

    function changeFy(e) {
        const dest = type === 'cash' ? 'accounting.ledger.cash' : 'accounting.ledger.bank';
        router.get(route(dest), { fy: e.target.value }, { preserveScroll: true });
    }

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
                    <h2 className="text-lg font-semibold text-gray-800">{title} — {fy}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">FY</label>
                    <select value={fy} onChange={changeFy} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {all_years.map(y => <option key={y} value={y}>{y}{y === current_fy ? ' (current)' : ''}</option>)}
                    </select>
                </div>
            </div>
        }>
            <Head title={title} />

            <div className="mx-auto max-w-5xl px-4 py-6">
                <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-3 text-left w-28">Date</th>
                                <th className="px-4 py-3 text-left">Particulars</th>
                                <th className="px-4 py-3 text-left w-28">Mode</th>
                                <th className="px-4 py-3 text-right w-32">Receipt (Dr)</th>
                                <th className="px-4 py-3 text-right w-32">Payment (Cr)</th>
                                <th className="px-4 py-3 text-right w-36">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">

                            {/* Opening balance row */}
                            <tr className="bg-indigo-50 font-medium">
                                <td className="px-5 py-3 text-gray-500">—</td>
                                <td className="px-4 py-3 text-indigo-800">Opening Balance (brought forward)</td>
                                <td className="px-4 py-3" />
                                <td className="px-4 py-3 text-right text-indigo-700">
                                    {opening > 0 ? `₹${opening.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                                </td>
                                <td className="px-4 py-3" />
                                <td className="px-4 py-3 text-right font-bold text-indigo-700">
                                    ₹{opening.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>

                            {entries.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                                        No {type} transactions for this year.
                                    </td>
                                </tr>
                            )}

                            {entries.map((e, i) => (
                                <tr key={i} className={e.receipt > 0 ? 'hover:bg-green-50' : 'hover:bg-red-50'}>
                                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{e.date}</td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {e.particulars}
                                        {e.cheque && <span className="ml-2 text-xs text-gray-400">Ch#{e.cheque}</span>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{MODE_LABELS[e.mode] ?? e.mode}</td>
                                    <td className="px-4 py-3 text-right font-medium text-green-700">
                                        {e.receipt > 0 ? `₹${e.receipt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-red-600">
                                        {e.payment > 0 ? `₹${e.payment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-semibold ${e.balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                                        ₹{e.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {/* Totals footer */}
                        <tfoot>
                            <tr className="bg-gray-100 font-semibold text-sm">
                                <td className="px-5 py-3" colSpan={2} />
                                <td className="px-4 py-3 text-gray-600">Totals</td>
                                <td className="px-4 py-3 text-right text-green-700">
                                    ₹{total_receipts.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-3 text-right text-red-600">
                                    ₹{total_payments.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-3" />
                            </tr>
                            <tr className="bg-indigo-50 font-bold">
                                <td className="px-5 py-3" colSpan={2} />
                                <td className="px-4 py-3 text-indigo-800">Closing Balance</td>
                                <td className="px-4 py-3" colSpan={2} />
                                <td className={`px-4 py-3 text-right text-lg ${closing >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>
                                    ₹{closing.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AccountingLayout>
    );
}
