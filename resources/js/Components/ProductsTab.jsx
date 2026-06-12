import { useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { compressImages } from '@/utils/compressImage';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price) {
    if (price === null || price === undefined || price === '') return null;
    // Numeric-only value → format with currency symbol; range string → prefix ₹
    if (/^\d+(\.\d+)?$/.test(String(price).trim())) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
    }
    return '₹' + price;
}

// ─── Photo strip in product card ──────────────────────────────────────────────

function PhotoStrip({ photos }) {
    const [current, setCurrent] = useState(0);
    if (!photos.length) {
        return (
            <div className="flex h-48 items-center justify-center bg-gray-100 rounded-t-2xl">
                <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }
    return (
        <div className="relative h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
            <img src={photos[current].url} alt="product" className="h-full w-full object-cover" />
            {photos.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrent(c => (c - 1 + photos.length) % photos.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={() => setCurrent(c => (c + 1) % photos.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {photos.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ product, onEdit, onDelete, businessSlug }) {
    return (
        <div className={`overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg ${!product.is_published ? 'opacity-60' : ''}`}>
            <PhotoStrip photos={product.photos} />
            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                        {product.category && (
                            <span className="text-xs text-indigo-600 font-medium">{product.category}</span>
                        )}
                    </div>
                    {product.price && (
                        <span className="flex-none text-sm font-bold text-green-700">{formatPrice(product.price)}</span>
                    )}
                </div>
                {product.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{product.description}</p>
                )}
                {!product.is_published && (
                    <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Draft</span>
                )}
                <div className="mt-4 flex items-center gap-2">
                    <a
                        href={route('business.show', businessSlug)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-center text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                        View Page
                    </a>
                    <button
                        onClick={() => onEdit(product)}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(product)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Photo preview tile (inside form) ─────────────────────────────────────────

function ExistingPhotoTile({ photo, markedForDelete, onToggle }) {
    return (
        <div className="relative h-20 w-20 flex-none overflow-hidden rounded-lg">
            <img src={photo.url} alt="" className={`h-full w-full object-cover ${markedForDelete ? 'opacity-30' : ''}`} />
            <button
                type="button"
                onClick={() => onToggle(photo.id)}
                className={`absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow ${markedForDelete ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
            >
                {markedForDelete ? '↩' : '✕'}
            </button>
        </div>
    );
}

// ─── Add / Edit modal ─────────────────────────────────────────────────────────

function ProductModal({ product, onClose }) {
    const isEdit = !!product;
    const fileRef = useRef(null);
    const [newPhotoFiles, setNewPhotoFiles]       = useState([]);
    const [newPhotoPreviews, setNewPhotoPreviews] = useState([]);
    const [deletePhotoIds, setDeletePhotoIds]     = useState([]);
    const [compressing, setCompressing]           = useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        name:         product?.name ?? '',
        description:  product?.description ?? '',
        price:        product?.price ?? '',
        category:     product?.category ?? '',
        is_published: product?.is_published ?? true,
    });

    async function handleFileChange(e) {
        const raw = Array.from(e.target.files);
        e.target.value = '';
        if (!raw.length) return;
        setCompressing(true);
        const results = await compressImages(raw);
        setCompressing(false);
        const compressed = results.map(r => r.file);
        setNewPhotoFiles(prev => [...prev, ...compressed]);
        setNewPhotoPreviews(prev => [...prev, ...compressed.map(f => URL.createObjectURL(f))]);
    }

    function removeNewPhoto(index) {
        URL.revokeObjectURL(newPhotoPreviews[index]);
        setNewPhotoFiles(prev => prev.filter((_, i) => i !== index));
        setNewPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    }

    function toggleDeletePhoto(id) {
        setDeletePhotoIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    function buildFormData() {
        const fd = new FormData();
        fd.append('name', data.name);
        fd.append('description', data.description ?? '');
        fd.append('price', data.price ?? '');
        fd.append('category', data.category ?? '');
        fd.append('is_published', data.is_published ? '1' : '0');
        newPhotoFiles.forEach(f => fd.append('photos[]', f));
        if (isEdit) {
            deletePhotoIds.forEach(id => fd.append('delete_photo_ids[]', id));
        }
        return fd;
    }

    function submit(e) {
        e.preventDefault();
        const fd = buildFormData();
        const url = isEdit ? route('my.products.update', product.id) : route('my.products.store');
        router.post(url, fd, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    function handleBackdrop(e) {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center"
            onClick={handleBackdrop}
        >
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 flex-none">
                    <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <form onSubmit={submit} className="overflow-y-auto flex-1 space-y-4 px-6 py-5">
                    {/* Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Product Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g. Premium Cotton Saree"
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Price + Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Price (₹)</label>
                            <input
                                type="text"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                placeholder="e.g. 500 or 1000-1500"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Category</label>
                            <input
                                type="text"
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                placeholder="e.g. Clothing"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Describe the product…"
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                        />
                    </div>

                    {/* Existing photos (edit mode) */}
                    {isEdit && product.photos.length > 0 && (
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Existing Photos</label>
                            <div className="flex flex-wrap gap-2">
                                {product.photos.map(photo => (
                                    <ExistingPhotoTile
                                        key={photo.id}
                                        photo={photo}
                                        markedForDelete={deletePhotoIds.includes(photo.id)}
                                        onToggle={toggleDeletePhoto}
                                    />
                                ))}
                            </div>
                            {deletePhotoIds.length > 0 && (
                                <p className="mt-1.5 text-xs text-red-500">{deletePhotoIds.length} photo(s) will be removed on save</p>
                            )}
                        </div>
                    )}

                    {/* New photos */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            {isEdit ? 'Add More Photos' : 'Product Photos'}
                        </label>
                        {newPhotoPreviews.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-2">
                                {newPhotoPreviews.map((src, i) => (
                                    <div key={i} className="relative h-20 w-20 flex-none overflow-hidden rounded-lg">
                                        <img src={src} alt="" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewPhoto(i)}
                                            className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={compressing}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-60"
                        >
                            {compressing ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                                    Compressing…
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Choose photos
                                </>
                            )}
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                        <p className="mt-1 text-xs text-gray-400">Up to 10 images — auto-compressed before upload</p>
                    </div>

                    {/* Visibility toggle */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Visible on business page</p>
                            <p className="text-xs text-gray-400">Unpublished products are hidden from visitors</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setData('is_published', !data.is_published)}
                            className={`relative h-6 w-11 flex-none rounded-full transition-colors ${data.is_published ? 'bg-indigo-600' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data.is_published ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1 pb-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || compressing}
                            className="flex-1 h-12 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60"
                        >
                            {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Delete confirmation modal ─────────────────────────────────────────────────

function DeleteModal({ product, onClose }) {
    const [deleting, setDeleting] = useState(false);

    function confirm() {
        setDeleting(true);
        router.delete(route('my.products.destroy', product.id), {
            onFinish: () => { setDeleting(false); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-gray-900">Delete product?</h3>
                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">"{product.name}"</span> and all its photos will be permanently removed.
                </p>
                <div className="mt-5 flex gap-3">
                    <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={confirm}
                        disabled={deleting}
                        className="flex-1 h-11 rounded-xl bg-red-600 text-sm font-bold text-white shadow disabled:opacity-60 hover:bg-red-700"
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ProductsTab({ products, businessSlug }) {
    const [editProduct, setEditProduct] = useState(null);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const { flash } = usePage().props;

    return (
        <div>
            {/* Flash */}
            {flash?.success && (
                <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-200">
                    {flash.success}
                </div>
            )}

            {/* Header row */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-gray-900">My Products</h3>
                    <p className="text-xs text-gray-500 mt-0.5">These appear on your public business page</p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={route('business.show', businessSlug)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Page
                    </a>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition active:scale-95"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </button>
                </div>
            </div>

            {/* Grid */}
            {products.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                        <svg className="h-7 w-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No products yet</p>
                    <p className="mt-1 text-xs text-gray-400">Add your first product to showcase on your business page</p>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-600/30"
                    >
                        Add Product
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            businessSlug={businessSlug}
                            onEdit={p => setEditProduct(p)}
                            onDelete={p => setDeleteProduct(p)}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {showAdd && <ProductModal onClose={() => setShowAdd(false)} />}
            {editProduct && <ProductModal product={editProduct} onClose={() => setEditProduct(null)} />}
            {deleteProduct && <DeleteModal product={deleteProduct} onClose={() => setDeleteProduct(null)} />}
        </div>
    );
}
