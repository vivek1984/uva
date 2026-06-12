import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AccountingLayout({ header, children }) {
    const { auth } = usePage().props;
    const isAdmin  = auth.user?.role === 'admin';

    const navItems = [
        { href: route('accounting.dashboard'),      label: 'Overview' },
        { href: route('accounting.fees.index'),     label: 'Member Fees' },
        { href: route('accounting.expenses.index'), label: 'Expenses' },
        { href: route('accounting.ledger.index'),   label: 'Ledgers' },
        ...(isAdmin ? [
            { href: route('accounting.settings'),      label: 'Fee Settings' },
            { href: route('accounting.access.index'),  label: 'Access Management' },
        ] : []),
    ];

    // Match current URL prefix to highlight active tab
    const current = window.location.pathname;
    function isActive(href) {
        const path = new URL(href, window.location.origin).pathname;
        // Dashboard is active only on exact match
        if (path === '/accounting') return current === '/accounting';
        return current.startsWith(path);
    }

    return (
        <AuthenticatedLayout header={header ?? <h2 className="text-lg font-semibold text-gray-800">Accounting</h2>}>
            {/* Persistent sub-nav */}
            <div className="border-b bg-white shadow-sm">
                <div className="mx-auto max-w-5xl px-4">
                    <nav className="-mb-px flex gap-1 overflow-x-auto">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                                    isActive(item.href)
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {children}
        </AuthenticatedLayout>
    );
}
