import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { compressImage } from '@/utils/compressImage';

function FileTile({ file, preview, onRemove }) {
    return (
        <div className="relative flex h-20 w-20 flex-none flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
                <>
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="mt-1 px-1 text-[9px] leading-tight text-gray-500 line-clamp-2 text-center">{file.name}</span>
                </>
            )}
            <button
                type="button"
                onClick={onRemove}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow before:absolute before:-inset-2 before:content-['']"
            >
                ✕
            </button>
        </div>
    );
}

export default function SubmitRequirementModal({ onClose }) {
    const fileRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [compressing, setCompressing] = useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        name: '',
        address: '',
        phone_number: '',
        details: '',
        website: '', // honeypot — left empty by humans
    });
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) onClose();
    }, [flash?.success]);

    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    function handleBackdrop(e) {
        if (e.target === e.currentTarget) onClose();
    }

    async function handleFileChange(e) {
        const raw = Array.from(e.target.files);
        e.target.value = '';
        if (!raw.length) return;

        setCompressing(true);
        const processed = await Promise.all(raw.map(async f => {
            if (f.type.startsWith('image/')) {
                const { file } = await compressImage(f, 2 * 1024 * 1024);
                return file;
            }
            return f;
        }));
        setCompressing(false);

        setFiles(prev => [...prev, ...processed]);
        setPreviews(prev => [...prev, ...processed.map(f => f.type.startsWith('image/') ? URL.createObjectURL(f) : null)]);
    }

    function removeFile(index) {
        if (previews[index]) URL.revokeObjectURL(previews[index]);
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    }

    function submit(e) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', data.name);
        fd.append('address', data.address);
        fd.append('phone_number', data.phone_number);
        fd.append('details', data.details);
        fd.append('website', data.website);
        files.forEach(f => fd.append('attachments[]', f));

        router.post(route('requirements.store'), fd, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 sm:items-center"
            onClick={handleBackdrop}
        >
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 flex-none">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Submit Your Requirement</h2>
                        <p className="text-xs text-gray-500">Tell us what you need — a member will reach out to you.</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className="overflow-y-auto flex-1 space-y-4 px-6 py-5">
                    {/* Honeypot — hidden from real users */}
                    <input
                        type="text"
                        name="website"
                        value={data.website}
                        onChange={e => setData('website', e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        className="absolute -left-[9999px] h-0 w-0 opacity-0"
                        aria-hidden="true"
                    />

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Your Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="Full name"
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            autoFocus
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Address</label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            placeholder="Your address"
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            value={data.phone_number}
                            onChange={e => setData('phone_number', e.target.value)}
                            placeholder="Your phone number"
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Enter Your Requirements</label>
                        <textarea
                            value={data.details}
                            onChange={e => setData('details', e.target.value)}
                            placeholder="Describe what you're looking for…"
                            rows={5}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                        />
                        {errors.details && <p className="mt-1 text-xs text-red-500">{errors.details}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Attach Files (optional)</label>
                        <p className="mb-2 text-xs text-gray-400">Photos or documents — you can attach more than one.</p>
                        <div className="flex flex-wrap gap-2">
                            {files.map((f, i) => (
                                <FileTile key={i} file={f} preview={previews[i]} onRemove={() => removeFile(i)} />
                            ))}
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={compressing}
                                className="flex h-20 w-20 flex-none flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-indigo-400 hover:text-indigo-500 disabled:opacity-60"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-[10px] font-medium">{compressing ? 'Processing…' : 'Add'}</span>
                            </button>
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {errors['attachments'] && <p className="mt-1 text-xs text-red-500">{errors['attachments']}</p>}
                        {errors['attachments.0'] && <p className="mt-1 text-xs text-red-500">{errors['attachments.0']}</p>}
                    </div>

                    <div className="flex gap-3 pt-1 pb-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || compressing}
                            className="flex-1 h-12 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-60"
                        >
                            {processing ? 'Submitting…' : 'Submit Requirement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
