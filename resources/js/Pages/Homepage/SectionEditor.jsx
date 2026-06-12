import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { compressImage, compressImages } from '@/utils/compressImage';

const inputCls = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 pursuing focus:ring-indigo-500/20';

export default function SectionEditor({ section, type }) {
    const { flash } = usePage().props;
    const isNew = !section;

    const { data, setData, post, processing, errors } = useForm({
        type:         section?.type ?? type,
        title:        section?.title ?? '',
        subtitle:     section?.subtitle ?? '',
        body:         section?.body ?? '',
        cover_image:  null,
    });

    const [coverPreview, setCoverPreview] = useState(section?.cover_image ?? null);

    // Gallery image uploader
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState(section?.images ?? []);
    const galleryInputRef = useRef(null);

    async function handleCoverChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setCoverPreview(URL.createObjectURL(file));
        const result = await compressImage(file);
        setData('cover_image', result.file);
        setCoverPreview(URL.createObjectURL(result.file));
    }

    function submit(e) {
        e.preventDefault();
        const url = isNew
            ? route('homepage.sections.store')
            : route('homepage.sections.update', section.id);
        post(url, { forceFormData: true });
    }

    async function uploadGalleryImages(e) {
        const raw = Array.from(e.target.files);
        if (!raw.length) return;
        setUploading(true);

        // Compress all images before uploading
        const results = await compressImages(raw);
        const files   = results.map(r => r.file);

        const fd = new FormData();
        files.forEach(f => fd.append('images[]', f));
        fd.append('_method', 'POST');

        // We use fetch + Inertia X-Inertia header combo for a non-Inertia upload
        // then reload the page via router.reload()
        await fetch(route('homepage.sections.images.store', section.id), {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
            },
            body: fd,
        });

        setUploading(false);
        router.reload({ only: [] }); // full page reload to get fresh images
        e.target.value = '';
    }

    function deleteImage(imageId) {
        if (!confirm('Remove this photo?')) return;
        router.delete(route('homepage.sections.images.destroy', [section.id, imageId]), {
            onSuccess: () => setImages(prev => prev.filter(i => i.id !== imageId)),
        });
    }

    function updateCaption(imageId, caption) {
        router.patch(route('homepage.sections.images.update', [section.id, imageId]), { caption });
    }

    const isGallery = data.type === 'gallery';

    return (
        <AuthenticatedLayout>
            <Head title={isNew ? 'New Section' : 'Edit Section'} />

            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                    <Link href={route('homepage.index')} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">
                        {isNew ? `New ${isGallery ? 'Gallery' : 'Text'} Section` : `Edit Section`}
                    </h1>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Main form */}
                <form onSubmit={submit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Section Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="e.g. About Our Association"
                            className={inputCls}
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Subtitle <span className="font-normal text-gray-400">(optional)</span></label>
                        <input
                            type="text"
                            value={data.subtitle}
                            onChange={e => setData('subtitle', e.target.value)}
                            placeholder="A short line below the title"
                            className={inputCls}
                        />
                    </div>

                    {/* Body — text sections only */}
                    {!isGallery && (
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Body Text</label>
                            <textarea
                                value={data.body}
                                onChange={e => setData('body', e.target.value)}
                                rows={6}
                                placeholder="Write your content here…"
                                className={inputCls + ' resize-y'}
                            />
                            {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body}</p>}
                        </div>
                    )}

                    {/* Cover image — text sections only */}
                    {!isGallery && (
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Cover Photo <span className="font-normal text-gray-400">(optional)</span>
                            </label>
                            <div
                                onClick={() => document.getElementById('cover-input').click()}
                                className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-indigo-400 hover:bg-indigo-50"
                                style={{ minHeight: coverPreview ? 0 : 120 }}
                            >
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Cover preview" className="max-h-56 w-full object-cover" />
                                ) : (
                                    <div className="py-8 text-center">
                                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="mt-2 text-sm text-gray-500">Click to upload cover photo</p>
                                        <p className="text-xs text-gray-400">JPG, PNG up to 4 MB</p>
                                    </div>
                                )}
                                {coverPreview && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
                                        <span className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-gray-700">Change photo</span>
                                    </div>
                                )}
                            </div>
                            <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                        </div>
                    )}

                    {/* Save button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60"
                    >
                        {processing ? 'Saving…' : isNew ? 'Create Section' : 'Save Changes'}
                    </button>
                </form>

                {/* Gallery image manager — only shown after section is created */}
                {!isNew && isGallery && (
                    <div className="mt-8">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">Gallery Photos</h2>
                            <button
                                onClick={() => galleryInputRef.current?.click()}
                                disabled={uploading}
                                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 active:scale-95 disabled:opacity-60"
                            >
                                {uploading ? (
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                )}
                                Upload Photos
                            </button>
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={uploadGalleryImages}
                            />
                        </div>

                        {section.images.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
                                No photos yet. Click "Upload Photos" to add some.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {section.images.map(img => (
                                    <div key={img.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                        <img src={img.url} alt={img.caption || ''} className="aspect-square w-full object-cover" />
                                        <div className="p-2">
                                            <input
                                                type="text"
                                                defaultValue={img.caption || ''}
                                                placeholder="Caption…"
                                                onBlur={e => updateCaption(img.id, e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-indigo-400 focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => deleteImage(img.id)}
                                            className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Gallery hint when creating */}
                {isNew && isGallery && (
                    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                        Create the section first, then you'll be able to upload gallery photos.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
