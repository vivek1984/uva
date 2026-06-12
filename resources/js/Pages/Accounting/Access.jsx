import { Head, router, useForm, usePage } from '@inertiajs/react';
import AccountingLayout from '@/Layouts/AccountingLayout';

export default function Access({ permitted, members }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id:    '',
        permission: 'view',
    });

    function submit(e) {
        e.preventDefault();
        post(route('accounting.access.store'), {
            preserveScroll: true,
            onSuccess: reset,
        });
    }

    function revoke(userId) {
        if (!confirm('Revoke this member\'s accounting access?')) return;
        router.delete(route('accounting.access.destroy', userId), { preserveScroll: true });
    }

    return (
        <AccountingLayout header={<h2 className="text-lg font-semibold text-gray-800">Accounting Access Management</h2>}>
            <Head title="Accounting Access" />

            <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Grant form */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-5 py-4">
                        <h3 className="font-semibold text-gray-800">Grant Access</h3>
                        <p className="mt-1 text-sm text-gray-500">Only executive members can be granted access to the accounting module.</p>
                    </div>
                    <form onSubmit={submit} className="px-5 py-4 space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Member <span className="text-red-500">*</span></label>
                            <select value={data.user_id} onChange={e => setData('user_id', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                                <option value="">— Select member —</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                            {members.length === 0 && (
                                <p className="mt-1 text-xs text-gray-400">All executive members already have accounting access.</p>
                            )}
                            {errors.user_id && <p className="mt-1 text-xs text-red-600">{errors.user_id}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Permission Level <span className="text-red-500">*</span></label>
                            <div className="flex gap-6">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input type="radio" value="view" checked={data.permission === 'view'} onChange={() => setData('permission', 'view')} className="text-indigo-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">View Only</p>
                                        <p className="text-xs text-gray-400">Can see all accounting data but cannot add or edit.</p>
                                    </div>
                                </label>
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input type="radio" value="edit" checked={data.permission === 'edit'} onChange={() => setData('permission', 'edit')} className="text-indigo-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Edit</p>
                                        <p className="text-xs text-gray-400">Can record fees, add expenses, and delete records.</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={processing || members.length === 0}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                                {processing ? 'Granting…' : 'Grant Access'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Current access list */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-5 py-4">
                        <h3 className="font-semibold text-gray-800">Current Access
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{permitted.length}</span>
                        </h3>
                    </div>
                    {permitted.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-gray-400">No members have been granted accounting access yet.</p>
                    ) : (
                        <div className="divide-y">
                            {permitted.map(p => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-800">{p.name}</p>
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.role === 'executive' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {p.role}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.permission === 'edit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {p.permission === 'edit' ? 'Edit' : 'View Only'}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-400">Granted by {p.granted_by} on {p.granted_at}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => { setData({ user_id: String(p.user_id), permission: p.permission === 'edit' ? 'view' : 'edit' }); }}
                                            className="text-xs font-medium text-indigo-600 hover:underline">
                                            Change to {p.permission === 'edit' ? 'View' : 'Edit'}
                                        </button>
                                        <button onClick={() => revoke(p.user_id)} className="text-xs font-medium text-red-500 hover:underline">
                                            Revoke
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AccountingLayout>
    );
}
