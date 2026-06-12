import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <h2 className="mb-1 text-2xl font-bold text-gray-900">Reset password</h2>
            <p className="mb-6 text-sm text-gray-500">
                पासवर्ड रीसेट करें · Enter your registered email address
            </p>

            {/* Warning */}
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                <p className="font-semibold">Note / नोट</p>
                <p className="mt-0.5">If you registered without an email, password reset is unavailable — contact the administrator.</p>
                <p className="mt-0.5 text-amber-600">यदि आपने ईमेल के बिना पंजीकरण किया है, तो व्यवस्थापक से संपर्क करें।</p>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                        Email Address
                        <span className="ml-1 text-xs font-normal text-indigo-400">ईमेल पता</span>
                    </label>
                    <input
                        type="email"
                        autoFocus
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="your@email.com"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-12 w-full select-none items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60"
                >
                    {processing ? 'Sending…' : 'Send Reset Link · रीसेट लिंक भेजें'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                <Link href={route('login')} className="font-semibold text-indigo-600 hover:text-indigo-800">
                    ← Back to login
                </Link>
            </p>
        </GuestLayout>
    );
}
