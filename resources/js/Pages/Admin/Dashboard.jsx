import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MemberProfileForm from '@/Components/MemberProfileForm';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

const CELEBRATION_STYLE = {
    birthday:       { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: '🎂' },
    spouse_birthday:{ bg: 'bg-pink-50',   border: 'border-pink-200',   icon: '🎂' },
    child_birthday: { bg: 'bg-sky-50',    border: 'border-sky-200',    icon: '🎂' },
    anniversary:    { bg: 'bg-rose-50',   border: 'border-rose-200',   icon: '💍' },
};

function CelebrationsPanel({ celebrations }) {
    if (!celebrations?.length) return null;
    return (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-800">
                <span className="text-lg">🎉</span> Today's Celebrations
            </p>
            <div className="space-y-2">
                {celebrations.map((c, i) => {
                    const s = CELEBRATION_STYLE[c.type] ?? CELEBRATION_STYLE.birthday;
                    return (
                        <div key={i} className={`flex items-start gap-3 rounded-xl border ${s.border} ${s.bg} px-4 py-3`}>
                            <span className="mt-0.5 text-xl leading-none">{s.icon}</span>
                            <p className="text-sm leading-snug text-gray-800">{c.message}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const StatCard = ({ label, value, icon, color }) => (
    <div className={`rounded-2xl p-6 text-white shadow-md ${color}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium opacity-80">{label}</p>
                <p className="mt-1 text-4xl font-bold">{value}</p>
            </div>
            <span className="text-4xl opacity-70">{icon}</span>
        </div>
    </div>
);

const Badge = ({ role }) => {
    const styles = {
        executive: 'bg-purple-100 text-purple-700',
        general: 'bg-blue-100 text-blue-700',
        admin: 'bg-red-100 text-red-700',
    };
    return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[role] ?? ''}`}>
            {role}
        </span>
    );
};

export default function AdminDashboard({ stats, posts, executives, generalMembers, allMembers, profile, auth, todaysCelebrations }) {
    const [activeTab, setActiveTab] = useState('overview');
    const { flash } = usePage().props;
    const csvInputRef = useRef(null);
    const [importing, setImporting] = useState(false);

    function handleCsvUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImporting(true);
        const fd = new FormData();
        fd.append('csv_file', file);
        router.post(route('admin.members.import-csv'), fd, {
            forceFormData: true,
            onFinish: () => { setImporting(false); e.target.value = ''; },
        });
    }

    const tabs = [
        { key: 'overview',  label: 'Overview',      icon: '📊' },
        { key: 'posts',     label: 'Posts',          icon: '🏷️' },
        { key: 'members',   label: 'Members',        icon: '👥' },
        { key: 'profile',   label: 'My Profile',     icon: '👤' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
                        <p className="text-sm text-gray-500">UVA Vyapari Welfare Association — Control Panel</p>
                    </div>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        Super Admin
                    </span>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <CelebrationsPanel celebrations={todaysCelebrations} />

                    {/* Tabs */}
                    <div className="mb-8 flex gap-1 rounded-xl bg-gray-100 p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    activeTab === tab.key
                                        ? 'bg-white text-indigo-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <StatCard label="Total Members" value={stats.total_members} icon="👥" color="bg-gradient-to-br from-indigo-500 to-indigo-700" />
                                <StatCard label="Executive Members" value={stats.executives} icon="⭐" color="bg-gradient-to-br from-purple-500 to-purple-700" />
                                <StatCard label="General Members" value={stats.generals} icon="👤" color="bg-gradient-to-br from-blue-500 to-blue-700" />
                            </div>

                            {/* Executives with their posts */}
                            <div className="rounded-2xl bg-white p-6 shadow-md">
                                <h3 className="mb-4 text-base font-semibold text-gray-800">Executive Committee</h3>
                                {executives.length === 0 ? (
                                    <p className="text-sm text-gray-400">No executive members yet.</p>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {executives.map((exec) => (
                                            <div key={exec.id} className="flex items-center justify-between py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{exec.name}</p>
                                                    <p className="text-xs text-gray-400">{exec.email}</p>
                                                </div>
                                                {exec.post ? (
                                                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                                                        {exec.post.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">No post assigned</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <div className="space-y-6">
                            <CreatePostForm />
                            <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                                <div className="border-b border-gray-100 px-6 py-4">
                                    <h3 className="font-semibold text-gray-800">All Posts</h3>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {posts.map((post) => (
                                        <PostRow key={post.id} post={post} executives={executives} />
                                    ))}
                                    {posts.length === 0 && (
                                        <p className="px-6 py-4 text-sm text-gray-400">No posts created yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800">All Members</h3>
                                    <p className="mt-0.5 text-xs text-gray-400">Manage member roles and post assignments</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Upload CSV */}
                                    <button
                                        onClick={() => csvInputRef.current?.click()}
                                        disabled={importing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 active:scale-95 disabled:opacity-60"
                                    >
                                        {importing ? (
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4 4l4-4m0 0l4 4m-4-4V4" />
                                            </svg>
                                        )}
                                        {importing ? 'Importing…' : 'Upload CSV'}
                                    </button>
                                    <input ref={csvInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvUpload} />

                                    {/* Download CSV */}
                                    <a
                                        href={route('admin.members.export-csv')}
                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 active:scale-95"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download CSV
                                    </a>
                                </div>
                            </div>

                            {/* Import results banner */}
                            {flash?.import_results && (
                                <div className="flex items-center gap-4 border-b border-green-100 bg-green-50 px-6 py-3 text-sm">
                                    <svg className="h-5 w-5 flex-none text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium text-green-800">
                                        Import complete —{' '}
                                        <span className="font-bold">{flash.import_results.created}</span> member{flash.import_results.created !== 1 ? 's' : ''} created,{' '}
                                        <span className="font-bold">{flash.import_results.skipped}</span> skipped (already exist or missing phone).
                                    </span>
                                </div>
                            )}

                            <div className="divide-y divide-gray-50">
                                {allMembers.map((member) => (
                                    <MemberRow key={member.id} member={member} posts={posts} executives={executives} />
                                ))}
                                {allMembers.length === 0 && (
                                    <p className="px-6 py-4 text-sm text-gray-400">No members registered yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <MemberProfileForm profile={profile} userName={auth.user.name} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


function CreatePostForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.posts.store'), { onSuccess: () => reset() });
    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 font-semibold text-gray-800">Create New Post</h3>
            <form onSubmit={submit} className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Post name (e.g. Chairman)"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                    Add Post
                </button>
            </form>
        </div>
    );
}

function PostRow({ post, executives }) {
    const [assigning, setAssigning] = useState(false);
    const { data, setData, post: submit, processing } = useForm({ post_id: post.id });

    const handleAssign = (e) => {
        e.preventDefault();
        const memberId = e.target.elements.executive_id.value;
        if (!memberId) return;
        router.post(route('admin.members.assign-post', memberId), { post_id: post.id }, {
            onSuccess: () => setAssigning(false),
        });
    };

    const handleDelete = () => {
        if (confirm(`Delete post "${post.name}"? This will unassign the current holder.`)) {
            router.delete(route('admin.posts.destroy', post.id));
        }
    };

    const handleRemoveHolder = () => {
        if (post.holder) {
            router.delete(route('admin.members.remove-post', post.holder.id));
        }
    };

    return (
        <div className="px-6 py-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-medium text-gray-800">{post.name}</p>
                    {post.description && <p className="text-xs text-gray-400">{post.description}</p>}
                    {post.holder ? (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                Held by: {post.holder.name}
                            </span>
                            <button
                                onClick={handleRemoveHolder}
                                className="text-xs text-red-400 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <span className="mt-1 inline-block text-xs text-gray-400">Vacant</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAssigning(!assigning)}
                        className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                    >
                        Assign
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                        Delete
                    </button>
                </div>
            </div>
            {assigning && (
                <form onSubmit={handleAssign} className="mt-3 flex gap-2">
                    <select
                        name="executive_id"
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                    >
                        <option value="">Select executive member…</option>
                        {executives.map((exec) => (
                            <option key={exec.id} value={exec.id}>
                                {exec.name} {exec.post ? `(currently: ${exec.post.name})` : ''}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                        Confirm
                    </button>
                </form>
            )}
        </div>
    );
}

function MemberRow({ member, posts }) {
    const handleRoleChange = (newRole) => {
        if (confirm(`Change ${member.name}'s role to ${newRole}?`)) {
            router.post(route('admin.members.role', member.id), { role: newRole });
        }
    };

    const handleToggleStatus = () => {
        const action = member.status === 'active' ? 'deactivate' : 'activate';
        if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${member.name}?`)) {
            router.post(route('admin.members.toggle-status', member.id));
        }
    };

    const handleDelete = () => {
        if (confirm(`Permanently delete "${member.name}"? This cannot be undone and will remove all their data.`)) {
            router.delete(route('admin.members.destroy', member.id));
        }
    };

    const isActive = member.status === 'active';

    return (
        <div className="px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: avatar + info */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{member.name}</p>
                        <p className="text-xs text-gray-400 truncate">{member.email || member.phone}</p>
                    </div>
                </div>

                {/* Right: badges + actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <Badge role={member.role} />

                    {member.role !== 'admin' && (
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {isActive ? 'Active' : 'Non-Active'}
                        </span>
                    )}

                    {/* Role change buttons */}
                    {member.role !== 'admin' && (
                        <>
                            {member.role !== 'executive' && (
                                <button
                                    onClick={() => handleRoleChange('executive')}
                                    className="rounded px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50"
                                >
                                    → Executive
                                </button>
                            )}
                            {member.role !== 'general' && (
                                <button
                                    onClick={() => handleRoleChange('general')}
                                    className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    → General
                                </button>
                            )}
                        </>
                    )}

                    {/* Activate / Deactivate */}
                    {member.role !== 'admin' && (
                        <button
                            onClick={handleToggleStatus}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                isActive
                                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                        >
                            {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                    )}

                    {/* Delete */}
                    {member.role !== 'admin' && (
                        <button
                            onClick={handleDelete}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
