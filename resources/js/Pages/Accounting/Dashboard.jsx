import { Head, Link, router, usePage } from '@inertiajs/react';
import AccountingLayout from '@/Layouts/AccountingLayout';

function StatCard({ label, value, color = 'indigo', sub }) {
    const colors = {
        indigo:  'bg-indigo-50 text-indigo-700 border-indigo-200',
        purple:  'bg-purple-50 text-purple-700 border-purple-200',
        green:   'bg-green-50 text-green-700 border-green-200',
        red:     'bg-red-50 text-red-700 border-red-200',
        amber:   'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
        <div className={`rounded-xl border p-5 ${colors[color]}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
            <p className="mt-1 text-2xl font-bold">₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            {sub && <p className="mt-1 text-xs opacity-60">{sub}</p>}
        </div>
    );
}

function FeeTypeBadge({ type }) {
    if (type === 'membership') return <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">Membership</span>;
    if (type === 'joining')    return <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">Joining</span>;
    return <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">Expense</span>;
}

export default function Dashboard({ fy, current_fy, all_years, can_edit, stats, recent, unpaid_members }) {
    function changeFy(e) {
        router.get(route('accounting.dashboard'), { fy: e.target.value }, { preserveScroll: true });
    }

    return (
        <AccountingLayout header={
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-800">Accounting</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">Financial Year</label>
                    <select value={fy} onChange={changeFy} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {all_years.map(y => (
                            <option key={y} value={y}>{y}{y === current_fy ? ' (current)' : ''}</option>
                        ))}
                    </select>
                </div>
            </div>
        }>
            <Head title="Accounting" />

            <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard label="Membership Fees" value={stats.membership_total} color="indigo" />
                    <StatCard label="Joining Fees"     value={stats.joining_total}    color="purple" />
                    <StatCard label="Total Expenses"   value={stats.expenses_total}   color="red" />
                    <StatCard label="Net Balance"      value={stats.net_balance}      color={stats.net_balance >= 0 ? 'green' : 'red'} sub="Income − Expenses" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent transactions */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border bg-white shadow-sm">
                            <div className="border-b px-5 py-3">
                                <h3 className="font-semibold text-gray-800">Recent Transactions — {fy}</h3>
                            </div>
                            {recent.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-gray-400">No transactions yet for this year.</p>
                            ) : (
                                <div className="divide-y">
                                    {recent.map((t, i) => (
                                        <div key={i} className="flex items-center justify-between px-5 py-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <FeeTypeBadge type={t.type === 'expense' ? 'expense' : t.fee_type} />
                                                    <span className="truncate text-sm font-medium text-gray-800">{t.label}</span>
                                                </div>
                                                <p className="mt-0.5 text-xs text-gray-400">{t.date} · {t.mode} · by {t.recorded_by}</p>
                                            </div>
                                            <span className={`ml-4 shrink-0 font-semibold ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                                                {t.type === 'expense' ? '−' : '+'}₹{Number(t.amount).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Unpaid members */}
                    <div>
                        <div className="rounded-xl border bg-white shadow-sm">
                            <div className="border-b px-5 py-3">
                                <h3 className="font-semibold text-gray-800">
                                    Membership Fee Pending
                                    {unpaid_members.length > 0 && (
                                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">{unpaid_members.length}</span>
                                    )}
                                </h3>
                            </div>
                            {unpaid_members.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-gray-400">All active members have paid. ✓</p>
                            ) : (
                                <div className="max-h-80 divide-y overflow-y-auto">
                                    {unpaid_members.map(m => (
                                        <div key={m.id} className="flex items-center justify-between px-5 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{m.name}</p>
                                                {m.firm_name && <p className="text-xs text-gray-400">{m.firm_name}</p>}
                                            </div>
                                            {can_edit && (
                                                <Link
                                                    href={route('accounting.fees.index', { fy, member: m.id })}
                                                    className="text-xs font-medium text-indigo-600 hover:underline"
                                                >
                                                    Record
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AccountingLayout>
    );
}
