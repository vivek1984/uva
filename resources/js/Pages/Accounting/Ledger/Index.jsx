import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AccountingLayout from '@/Layouts/AccountingLayout';

function SummaryCard({ title, href, opening, receipts, payments, closing }) {
    return (
        <Link href={href} className="block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="mb-3 font-semibold text-gray-800">{title}</h3>
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Opening Balance</span>
                    <span className="font-medium text-gray-700">₹{opening.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-green-600">
                    <span>+ Receipts</span>
                    <span className="font-medium">₹{receipts.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-red-500">
                    <span>− Payments</span>
                    <span className="font-medium">₹{payments.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2">
                    <span className="font-semibold text-gray-700">Closing Balance</span>
                    <span className={`font-bold text-lg ${closing >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>
                        ₹{closing.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function ExpenseCard({ href, total, byCategory }) {
    const topCats = Object.entries(byCategory).slice(0, 3);
    return (
        <Link href={href} className="block rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="mb-3 font-semibold text-gray-800">Expenses Ledger</h3>
            <div className="space-y-1.5 text-sm">
                {topCats.map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between text-gray-500">
                        <span className="truncate max-w-[140px]">{cat}</span>
                        <span className="font-medium text-red-600">₹{amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                ))}
                {topCats.length === 0 && (
                    <p className="text-gray-400 text-xs">No expenses recorded.</p>
                )}
                <div className="mt-2 flex justify-between border-t pt-2">
                    <span className="font-semibold text-gray-700">Total Expenses</span>
                    <span className="font-bold text-lg text-red-600">
                        ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function LedgerIndex({ fy, current_fy, all_years, can_edit, cash_summary, bank_summary, expense_summary, members }) {
    const { flash } = usePage().props;
    const [search, setSearch]                   = useState('');
    const [showOpeningForm, setShowOpeningForm]  = useState(false);
    const [obType, setObType]                   = useState('cash');
    const [obYear, setObYear]                   = useState(fy);
    const [obAmt, setObAmt]                     = useState('');
    const [saving, setSaving]                   = useState(false);
    const [exportFy, setExportFy]               = useState(fy);
    const [showImport, setShowImport]           = useState(false);
    const importForm                             = useForm({ file: null });
    const fileInputRef                           = useRef(null);

    function changeFy(e) {
        const val = e.target.value;
        setExportFy(val);
        router.get(route('accounting.ledger.index'), { fy: val }, { preserveScroll: true });
    }

    function submitOpeningBalance(e) {
        e.preventDefault();
        setSaving(true);
        router.post(route('accounting.ledger.opening-balance'), {
            type: obType, financial_year: obYear, opening_balance: obAmt,
        }, { preserveScroll: true, onFinish: () => { setSaving(false); setShowOpeningForm(false); setObAmt(''); } });
    }

    function submitImport(e) {
        e.preventDefault();
        importForm.post(route('accounting.ledger.import'), {
            preserveScroll: true,
            onSuccess: () => { importForm.reset(); setShowImport(false); if (fileInputRef.current) fileInputRef.current.value = ''; },
        });
    }

    const filteredMembers = search.trim()
        ? members.filter(m => {
            const q = search.toLowerCase();
            return m.name.toLowerCase().includes(q) || (m.firm_name ?? '').toLowerCase().includes(q);
          })
        : members;

    const outstanding = filteredMembers.filter(m => m.outstanding > 0);
    const settled     = filteredMembers.filter(m => m.outstanding <= 0);

    return (
        <AccountingLayout header={
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-800">Ledgers</h2>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="text-sm text-gray-500">FY</label>
                    <select value={fy} onChange={changeFy} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {all_years.map(y => <option key={y} value={y}>{y}{y === current_fy ? ' (current)' : ''}</option>)}
                    </select>
                    <a
                        href={route('accounting.ledger.export', { fy: exportFy })}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
                        </svg>
                        Export CSV
                    </a>
                    {can_edit && (
                        <button
                            onClick={() => setShowImport(v => !v)}
                            className="flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 8l5-5 5 5M12 3v11" />
                            </svg>
                            Import CSV
                        </button>
                    )}
                </div>
            </div>
        }>
            <Head title="Ledgers" />

            <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">{flash.success}</div>
                )}

                {flash?.import_results && (
                    <ImportResultsBanner results={flash.import_results} />
                )}

                {/* Import panel */}
                {can_edit && showImport && (
                    <div className="rounded-xl border bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b px-5 py-3">
                            <span className="text-sm font-semibold text-gray-700">Import CSV</span>
                            <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            <p className="text-xs text-gray-500">
                                Upload a <strong>.zip</strong> exported from this page. It restores members, fee structures, fee payments, expenses, and opening balances.
                                New members are created with a temporary password — they must use <em>Forgot Password</em> to log in.
                                Members and balances are matched by mobile number. Duplicate transactions are skipped automatically.
                            </p>
                            <form onSubmit={submitImport} className="flex flex-wrap items-end gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">ZIP file</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".zip,application/zip,application/x-zip-compressed"
                                        onChange={e => importForm.setData('file', e.target.files[0])}
                                        className="block text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                                        required
                                    />
                                    {importForm.errors.import_file && (
                                        <p className="mt-1 text-xs text-red-600">{importForm.errors.import_file}</p>
                                    )}
                                    {importForm.errors.file && (
                                        <p className="mt-1 text-xs text-red-600">{importForm.errors.file}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={importForm.processing || !importForm.data.file}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {importForm.processing ? 'Importing…' : 'Import'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Cash, Bank & Expenses cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <SummaryCard
                        title="Cash Book"
                        href={route('accounting.ledger.cash', { fy })}
                        opening={cash_summary.opening}
                        receipts={cash_summary.receipts}
                        payments={cash_summary.payments}
                        closing={cash_summary.closing}
                    />
                    <SummaryCard
                        title="Bank Book"
                        href={route('accounting.ledger.bank', { fy })}
                        opening={bank_summary.opening}
                        receipts={bank_summary.receipts}
                        payments={bank_summary.payments}
                        closing={bank_summary.closing}
                    />
                    <ExpenseCard
                        href={route('accounting.ledger.expenses', { fy })}
                        total={expense_summary.total}
                        byCategory={expense_summary.by_category}
                    />
                </div>

                {/* Opening balance form (edit users only) */}
                {can_edit && (
                    <div className="rounded-xl border bg-white shadow-sm">
                        <button onClick={() => setShowOpeningForm(v => !v)}
                            className="flex w-full items-center justify-between px-5 py-3 text-left">
                            <span className="text-sm font-semibold text-gray-700">Set Opening Balance</span>
                            <span className="text-gray-400 text-xs">{showOpeningForm ? '▲' : '▼'}</span>
                        </button>
                        {showOpeningForm && (
                            <form onSubmit={submitOpeningBalance} className="border-t px-5 py-4 flex flex-wrap items-end gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Ledger</label>
                                    <select value={obType} onChange={e => setObType(e.target.value)}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Financial Year</label>
                                    <select value={obYear} onChange={e => setObYear(e.target.value)}
                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                        {all_years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Opening Balance (₹)</label>
                                    <input type="number" step="0.01" min="0" value={obAmt} onChange={e => setObAmt(e.target.value)}
                                        className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                                </div>
                                <button type="submit" disabled={saving}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                                    {saving ? 'Saving…' : 'Save'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* Member outstanding balances */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-gray-800">Member Ledger</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">up to FY {fy}</span>
                            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search member or firm…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-48 bg-transparent text-sm outline-none placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {outstanding.length > 0 && (
                        <div>
                            <p className="px-5 py-2 text-xs font-semibold uppercase tracking-wide text-red-500 bg-red-50">
                                Outstanding ({outstanding.length})
                            </p>
                            <div className="divide-y">
                                {outstanding.map(m => (
                                    <MemberRow key={m.id} m={m} />
                                ))}
                            </div>
                        </div>
                    )}

                    {settled.length > 0 && (
                        <div>
                            <p className="px-5 py-2 text-xs font-semibold uppercase tracking-wide text-green-600 bg-green-50">
                                Settled / Credit ({settled.length})
                            </p>
                            <div className="divide-y">
                                {settled.map(m => (
                                    <MemberRow key={m.id} m={m} />
                                ))}
                            </div>
                        </div>
                    )}

                    {members.length === 0 && (
                        <p className="px-5 py-8 text-center text-sm text-gray-400">No members found.</p>
                    )}
                </div>
            </div>
        </AccountingLayout>
    );
}

function ImportResultsBanner({ results }) {
    const sections = Object.entries(results);
    const totalErrors = sections.reduce((s, [, r]) => s + (r.errors ?? 0), 0);
    const totalSaved  = sections.reduce((s, [, r]) =>
        s + (r.imported ?? 0) + (r.upserted ?? 0) + (r.created ?? 0) + (r.updated ?? 0), 0);

    return (
        <div className={`rounded-lg border px-4 py-3 text-sm ${totalErrors > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
            <p className={`font-semibold mb-2 ${totalErrors > 0 ? 'text-yellow-800' : 'text-green-800'}`}>
                Import complete — {totalSaved} record{totalSaved !== 1 ? 's' : ''} saved
                {totalErrors > 0 && `, ${totalErrors} row${totalErrors !== 1 ? 's' : ''} skipped due to errors`}
            </p>
            <div className="space-y-0.5">
                {sections.map(([section, r]) => (
                    <p key={section} className="text-xs text-gray-600">
                        <span className="font-medium">{section}:</span>{' '}
                        {r.created  != null && <>{r.created} created, {r.updated} updated</>}
                        {r.imported != null && <>{r.imported} imported, {r.skipped} skipped as duplicates</>}
                        {r.upserted != null && <>{r.upserted} upserted</>}
                        {(r.errors ?? 0) > 0 && <span className="text-yellow-700">, {r.errors} error{r.errors !== 1 ? 's' : ''}</span>}
                    </p>
                ))}
            </div>
        </div>
    );
}

function MemberRow({ m }) {
    const isOwed = m.outstanding > 0;
    return (
        <Link
            href={route('accounting.ledger.member', m.id)}
            className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
        >
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">{m.name}</p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    {m.firm_name && <span className="truncate text-xs text-gray-400">{m.firm_name}</span>}
                    <span className={`flex-none text-xs font-medium ${m.role === 'executive' ? 'text-purple-600' : 'text-blue-500'}`}>{m.role}</span>
                    {m.status === 'non-active' && <span className="flex-none text-xs text-gray-400">(inactive)</span>}
                </div>
            </div>
            <div className="flex-none text-right">
                <p className={`font-semibold ${isOwed ? 'text-red-600' : 'text-green-600'}`}>
                    {isOwed ? '−' : '+'}₹{Math.abs(m.outstanding).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-400">{isOwed ? 'outstanding' : 'credit / settled'}</p>
            </div>
        </Link>
    );
}
