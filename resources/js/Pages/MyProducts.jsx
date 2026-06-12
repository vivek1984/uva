import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductsTab from '@/Components/ProductsTab';
import { Head } from '@inertiajs/react';

export default function MyProducts({ products, businessSlug }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-800">My Products</h2>
                    <p className="text-sm text-gray-500">Manage your business products and showcase</p>
                </div>
            }
        >
            <Head title="My Products" />
            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <ProductsTab products={products} businessSlug={businessSlug} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
