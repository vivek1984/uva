import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { compressImage } from '@/utils/compressImage';

const QUESTION_TYPES = [
    { value: 'short_text',      label: 'Short Answer',     icon: '—' },
    { value: 'paragraph',       label: 'Paragraph',        icon: '¶' },
    { value: 'multiple_choice', label: 'Multiple Choice',  icon: '◉' },
    { value: 'checkboxes',      label: 'Checkboxes',       icon: '☑' },
    { value: 'dropdown',        label: 'Dropdown',         icon: '▾' },
    { value: 'date',            label: 'Date',             icon: '📅' },
    { value: 'number',          label: 'Number',           icon: '#' },
];

const NEEDS_OPTIONS = ['multiple_choice', 'checkboxes', 'dropdown'];

let uid = 0;
function nextId() { return ++uid; }

function newQuestion() {
    return { _key: nextId(), type: 'short_text', label: '', is_required: false, options: ['Option 1'] };
}

function QuestionCard({ q, index, total, onChange, onDelete, onMove }) {
    const hasOptions = NEEDS_OPTIONS.includes(q.type);

    function setField(field, val) {
        onChange({ ...q, [field]: val });
    }

    function setOption(i, val) {
        const opts = [...q.options];
        opts[i] = val;
        setField('options', opts);
    }

    function addOption() {
        setField('options', [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`]);
    }

    function removeOption(i) {
        setField('options', q.options.filter((_, idx) => idx !== i));
    }

    const typeLabel = QUESTION_TYPES.find(t => t.value === q.type)?.label ?? q.type;

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Q{index + 1} · {typeLabel}
                </span>
                <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMove(index, -1)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                    title="Move up"
                >
                    ▲
                </button>
                <button
                    type="button"
                    disabled={index === total - 1}
                    onClick={() => onMove(index, 1)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                    title="Move down"
                >
                    ▼
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="rounded p-1 text-red-400 hover:bg-red-50"
                    title="Delete question"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-4 p-4">
                {/* Question label */}
                <div>
                    <input
                        type="text"
                        placeholder="Question text *"
                        value={q.label}
                        onChange={(e) => setField('label', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {/* Type selector */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Question Type</label>
                    <select
                        value={q.type}
                        onChange={(e) => setField('type', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        {QUESTION_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                        ))}
                    </select>
                </div>

                {/* Answer preview */}
                {!hasOptions && (
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Answer Preview</label>
                        {q.type === 'paragraph' ? (
                            <textarea
                                disabled
                                placeholder="Long answer text..."
                                className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400"
                                rows={3}
                            />
                        ) : q.type === 'date' ? (
                            <input type="date" disabled className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400" />
                        ) : q.type === 'number' ? (
                            <input type="number" disabled placeholder="0" className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400" />
                        ) : (
                            <input type="text" disabled placeholder="Short answer..." className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400" />
                        )}
                    </div>
                )}

                {/* Options (MCQ / checkboxes / dropdown) */}
                {hasOptions && (
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-500">Options</label>
                        <div className="space-y-2">
                            {(q.options || []).map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    {q.type === 'checkboxes'      && <span className="text-gray-400">☐</span>}
                                    {q.type === 'multiple_choice' && <span className="text-gray-400">○</span>}
                                    {q.type === 'dropdown'        && <span className="text-xs text-gray-400">{i + 1}.</span>}
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => setOption(i, e.target.value)}
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder={`Option ${i + 1}`}
                                    />
                                    {q.options.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(i)}
                                            className="rounded p-1 text-red-400 hover:bg-red-50"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addOption}
                                className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                + Add option
                            </button>
                        </div>
                    </div>
                )}

                {/* Required toggle */}
                <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                        <div
                            onClick={() => setField('is_required', !q.is_required)}
                            className={`relative h-5 w-9 rounded-full transition-colors ${q.is_required ? 'bg-indigo-600' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${q.is_required ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </div>
                        Required
                    </label>
                </div>
            </div>
        </div>
    );
}

export default function Builder() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image: null,
        closes_at: '',
        questions: [newQuestion()],
    });

    const [imagePreview, setImagePreview]   = useState(null);
    const [imageCompressing, setImageCompressing] = useState(false);
    const imageRef = useRef(null);

    function addQuestion() {
        setData('questions', [...data.questions, newQuestion()]);
    }

    function updateQuestion(index, q) {
        const qs = [...data.questions];
        qs[index] = q;
        setData('questions', qs);
    }

    function deleteQuestion(index) {
        setData('questions', data.questions.filter((_, i) => i !== index));
    }

    function moveQuestion(index, dir) {
        const qs = [...data.questions];
        const target = index + dir;
        if (target < 0 || target >= qs.length) return;
        [qs[index], qs[target]] = [qs[target], qs[index]];
        setData('questions', qs);
    }

    async function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImageCompressing(true);
        const { file: ready } = await compressImage(file, 2 * 1024 * 1024);
        setImageCompressing(false);
        setData('image', ready);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(URL.createObjectURL(ready));
    }

    function removeImage() {
        setData('image', null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        if (imageRef.current) imageRef.current.value = '';
    }

    function submit(e) {
        e.preventDefault();
        post(route('questionnaires.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Create Questionnaire" />

            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Questionnaire</h1>

                <form onSubmit={submit} className="space-y-5">
                    {/* Questionnaire meta */}
                    <div className="rounded-xl border-l-4 border-indigo-500 bg-white p-5 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Questionnaire Title *"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full border-b border-gray-300 pb-1 text-xl font-semibold text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>
                            <div>
                                <textarea
                                    placeholder="Description (optional)"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={2}
                                    className="w-full resize-none border-b border-gray-200 pb-1 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500">Close responses after (optional)</label>
                                <input
                                    type="date"
                                    value={data.closes_at}
                                    onChange={(e) => setData('closes_at', e.target.value)}
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Image upload */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500">Image (optional — shown to respondents)</label>
                                {imageCompressing ? (
                                    <div className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-4 text-sm text-gray-400">
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500" />
                                        Compressing…
                                    </div>
                                ) : imagePreview ? (
                                    <div className="relative w-full overflow-hidden rounded-lg border border-gray-200">
                                        <img src={imagePreview} alt="Preview" className="max-h-48 w-full object-contain bg-gray-50" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                                        >
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => imageRef.current?.click()}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Upload image
                                    </button>
                                )}
                                <input
                                    ref={imageRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    {data.questions.map((q, i) => (
                        <QuestionCard
                            key={q._key}
                            q={q}
                            index={i}
                            total={data.questions.length}
                            onChange={(updated) => updateQuestion(i, updated)}
                            onDelete={() => deleteQuestion(i)}
                            onMove={(idx, dir) => moveQuestion(idx, dir)}
                        />
                    ))}

                    {errors.questions && (
                        <p className="text-sm text-red-500">{errors.questions}</p>
                    )}

                    {/* Add question */}
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 py-3 text-sm font-semibold text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Question
                    </button>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <a href={route('questionnaires.index')} className="text-sm text-gray-500 hover:text-gray-700">
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {processing ? 'Creating…' : 'Create Questionnaire'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
