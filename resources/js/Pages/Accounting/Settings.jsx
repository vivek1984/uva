import { Head, useForm, usePage } from '@inertiajs/react';
import AccountingLayout from '@/Layouts/AccountingLayout';

export default function Settings({ structures, current_fy }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        financial_year: current_fy,
        membership_fee: '',
        joining_fee:    '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('accounting.settings.save'), {
            preserveScroll: true,
            onSuccess: reset,
        });
    }

    return (
        <AccountingLayout header={<h2 className="text-lg font-semibold text-gray-800">Fee Structure Settings</h2>}>
            <Head title="Fee Settings" />

            <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Add / Update fee structure */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-5 py-4">
                        <h3 className="font-semibold text-gray-800">Set Fee Amounts for a Financial Year</h3>
                        <p className="mt-1 text-sm text-gray-500">Financial year runs April–March (e.g. 2025-26). Saving overwrites existing amounts for that year.</p>
                    </div>
                    <form onSubmit={submit} className="px-5 py-4 space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Financial Year <span className="text-red-500">*</span></label>
                            <input type="text" value={data.financial_year} onChange={e => setData('financial_year', e.target.value)}
                                placeholder="e.g. 2025-26"
                                className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                            {errors.financial_year && <p className="mt-1 text-xs text-red-600">{errors.financial_year}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Membership Fee (₹/year) <span className="text-red-500">*</span></label>
                                <input type="number" step="0.01" min="0" value={data.membership_fee} onChange={e => setData('membership_fee', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                                {errors.membership_fee && <p className="mt-1 text-xs text-red-600">{errors.membership_fee}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Joining Fee (one-time, ₹) <span className="text-red-500">*</span></label>
                                <input type="number" step="0.01" min="0" value={data.joining_fee} onChange={e => setData('joining_fee', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                                {errors.joining_fee && <p className="mt-1 text-xs text-red-600">{errors.joining_fee}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={processing}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                                {processing ? 'Saving…' : 'Save Fee Structure'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing structures */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-5 py-4">
                        <h3 className="font-semibold text-gray-800">Saved Fee Structures</h3>
                    </div>
                    {structures.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-gray-400">No fee structures saved yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3 text-left">Financial Year</th>
                                        <th className="px-4 py-3 text-right">Membership Fee</th>
                                        <th className="px-4 py-3 text-right">Joining Fee</th>
                                        <th className="px-4 py-3 text-left">Set By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {structures.map(s => (
                                        <tr key={s.id} className={s.financial_year === current_fy ? 'bg-indigo-50' : ''}>
                                            <td className="px-5 py-3 font-semibold text-gray-800">
                                                {s.financial_year}
                                                {s.financial_year === current_fy && (
                                                    <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">Current</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-700">
                                                ₹{Number(s.membership_fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-700">
                                                ₹{Number(s.joining_fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">{s.created_by}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AccountingLayout>
    );
}
