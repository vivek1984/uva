import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AccountingLayout from '@/Layouts/AccountingLayout';

const PAYMENT_MODES = [
    { value: 'cash',          label: 'Cash' },
    { value: 'upi',           label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer / NEFT' },
    { value: 'cheque',        label: 'Cheque' },
];

function ExpenseForm({ fy, categories, initial = {}, onSuccess, onCancel, submitLabel = 'Add Expense' }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        financial_year: fy,
        category:       initial.category ?? '',
        custom_category:'',
        description:    initial.description ?? '',
        amount:         initial.amount ?? '',
        expense_date:   initial.expense_date ?? new Date().toISOString().slice(0, 10),
        payment_mode:   initial.payment_mode ?? 'cash',
        cheque_number:  initial.cheque_number ?? '',
        notes:          initial.notes ?? '',
    });

    const isCustom = data.category === '__custom__';
    const finalCategory = isCustom ? data.custom_category : data.category;

    function submit(e) {
        e.preventDefault();
        const payload = { ...data, category: finalCategory };

        const opts = { preserveScroll: true, onSuccess };

        if (initial.id) {
            router.patch(route('accounting.expenses.update', initial.id), payload, opts);
        } else {
            router.post(route('accounting.expenses.store'), payload, opts);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                    <select value={data.category} onChange={e => setData('category', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                        <option value="">— Select —</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="__custom__">Other / Custom…</option>
                    </select>
                    {isCustom && (
                        <input type="text" placeholder="Type category name" value={data.custom_category}
                            onChange={e => setData('custom_category', e.target.value)}
                            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                    )}
                    {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Amount (₹) <span className="text-red-500">*</span></label>
                    <input type="number" step="0.01" min="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                    {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
                </div>

                <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                    <input type="text" value={data.description} onChange={e => setData('description', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
                    <input type="date" value={data.expense_date} onChange={e => setData('expense_date', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Payment Mode <span className="text-red-500">*</span></label>
                    <select value={data.payment_mode} onChange={e => setData('payment_mode', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {PAYMENT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>

                {data.payment_mode === 'cheque' && (
                    <div className="col-span-2 sm:col-span-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Cheque Number</label>
                        <input type="text" value={data.cheque_number} onChange={e => setData('cheque_number', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                )}

                <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                    <textarea rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)}
                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-1">
                {onCancel && <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>}
                <button type="submit" disabled={processing} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                    {processing ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default function Expenses({ fy, current_fy, all_years, can_edit, categories, active_category, expenses, total }) {
    const { flash } = usePage().props;
    const [showAdd, setShowAdd]   = useState(false);
    const [editing, setEditing]   = useState(null);

    function changeFy(e) {
        router.get(route('accounting.expenses.index'), { fy: e.target.value }, { preserveScroll: true });
    }

    function filterCategory(cat) {
        router.get(route('accounting.expenses.index'), { fy, category: cat || undefined }, { preserveScroll: true });
    }

    function deleteExpense(id) {
        if (!confirm('Delete this expense?')) return;
        router.delete(route('accounting.expenses.destroy', id), { preserveScroll: true });
    }

    const modeLabel = v => PAYMENT_MODES.find(m => m.value === v)?.label ?? v;

    return (
        <AccountingLayout header={
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-800">Expenses</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">FY</label>
                    <select value={fy} onChange={changeFy} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {all_years.map(y => <option key={y} value={y}>{y}{y === current_fy ? ' (current)' : ''}</option>)}
                    </select>
                </div>
            </div>
        }>
            <Head title="Expenses" />

            <div className="mx-auto max-w-5xl px-4 py-6 space-y-4">

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Add expense form */}
                {can_edit && (
                    <div className="rounded-xl border bg-white shadow-sm">
                        <button onClick={() => setShowAdd(v => !v)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                            <span className="font-semibold text-gray-800">+ Add Expense</span>
                            <span className="text-gray-400">{showAdd ? '▲' : '▼'}</span>
                        </button>
                        {showAdd && (
                            <div className="border-t px-5 py-4">
                                <ExpenseForm fy={fy} categories={categories} onSuccess={() => setShowAdd(false)} submitLabel="Add Expense" />
                            </div>
                        )}
                    </div>
                )}

                {/* Category filters */}
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => filterCategory(null)}
                        className={`rounded-full px-3 py-1 text-xs font-medium border ${!active_category ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                        All
                    </button>
                    {categories.map(c => (
                        <button key={c} onClick={() => filterCategory(c)}
                            className={`rounded-full px-3 py-1 text-xs font-medium border ${active_category === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                            {c}
                        </button>
                    ))}
                </div>

                {/* Expenses table */}
                <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-left">Mode</th>
                                <th className="px-4 py-3 text-left">Recorded By</th>
                                {can_edit && <th className="px-4 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {expenses.length === 0 && (
                                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">No expenses recorded for this period.</td></tr>
                            )}
                            {expenses.map(e => (
                                <tr key={e.id} className={editing?.id === e.id ? 'bg-indigo-50' : ''}>
                                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{e.expense_date}</td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">{e.category}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">{e.description}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-red-600">
                                        ₹{Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{modeLabel(e.payment_mode)}</td>
                                    <td className="px-4 py-3 text-gray-400">{e.recorded_by}</td>
                                    {can_edit && (
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <button onClick={() => setEditing(editing?.id === e.id ? null : e)}
                                                className="mr-2 text-xs font-medium text-indigo-600 hover:underline">Edit</button>
                                            <button onClick={() => deleteExpense(e.id)}
                                                className="text-xs font-medium text-red-500 hover:underline">Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        {expenses.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td colSpan={3} className="px-5 py-3 text-sm font-semibold text-gray-700">Total</td>
                                    <td className="px-4 py-3 text-right font-bold text-red-700">
                                        ₹{Number(total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td colSpan={can_edit ? 3 : 2} />
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {/* Edit expense panel — rendered outside the scrollable table so the form stays full mobile width */}
                {editing && (
                    <div className="rounded-xl border bg-indigo-50 shadow-sm">
                        <div className="border-b border-indigo-100 px-5 py-3">
                            <h3 className="font-semibold text-gray-800">Editing: {editing.description}</h3>
                        </div>
                        <div className="px-5 py-4">
                            <ExpenseForm
                                fy={fy}
                                categories={categories}
                                initial={editing}
                                onSuccess={() => setEditing(null)}
                                onCancel={() => setEditing(null)}
                                submitLabel="Save Changes"
                            />
                        </div>
                    </div>
                )}
            </div>
        </AccountingLayout>
    );
}
