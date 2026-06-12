import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MemberProfileForm from '@/Components/MemberProfileForm';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function StatusBadge({ status }) {
    return status === 'active'
        ? <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Active</span>
        : <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">Non-Active</span>;
}

function MemberRow({ member, onToggleManage, onToggleStatus, canToggleStatus }) {
    const isManaged = member.is_managed_by_me;
    return (
        <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-semibold ${isManaged ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                    {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{member.name}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                        <StatusBadge status={member.status} />
                        {member.email && <p className="text-xs text-gray-400 truncate">{member.email}</p>}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 ml-3 flex-none">
                {canToggleStatus && member.status !== 'active' && (
                    <button
                        onClick={() => onToggleStatus(member)}
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                    >
                        Make Active
                    </button>
                )}
                {canToggleStatus && member.status === 'active' && (
                    <button
                        onClick={() => onToggleStatus(member)}
                        className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                        Deactivate
                    </button>
                )}
                {onToggleManage && (
                    <button
                        onClick={() => onToggleManage(member.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isManaged ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                        {isManaged ? 'Remove' : 'Manage'}
                    </button>
                )}
            </div>
        </div>
    );
}

function SuggestionsTab({ suggestions, unreadCount, onViewed }) {
    return (
        <div className="space-y-4">
            {suggestions.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-200 py-14 text-center text-sm text-gray-400">
                    No suggestions submitted yet.
                </div>
            ) : suggestions.map(s => (
                <div
                    key={s.id}
                    className={`rounded-xl border bg-white p-5 shadow-sm transition ${!s.is_read ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-gray-200'}`}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                {!s.is_read && (
                                    <span className="inline-block h-2 w-2 flex-none rounded-full bg-indigo-500" />
                                )}
                                <p className="font-semibold text-gray-900">{s.title}</p>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-line">{s.description}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">{s.member_name}</span>
                        {s.phone && (
                            <>
                                <span className="text-gray-300">|</span>
                                <span>{s.phone}</span>
                            </>
                        )}
                        {s.firm_name && (
                            <>
                                <span className="text-gray-300">|</span>
                                <span className="text-indigo-600">M/s {s.firm_name}</span>
                            </>
                        )}
                        <span className="text-gray-300">|</span>
                        <span>{s.submitted_at}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

const CELEBRATION_STYLE = {
    birthday:       { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: '🎂', label: 'Birthday' },
    spouse_birthday:{ bg: 'bg-pink-50',   border: 'border-pink-200',   icon: '🎂', label: 'Birthday' },
    child_birthday: { bg: 'bg-sky-50',    border: 'border-sky-200',    icon: '🎂', label: 'Birthday' },
    anniversary:    { bg: 'bg-rose-50',   border: 'border-rose-200',   icon: '💍', label: 'Anniversary' },
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

export default function ExecutiveDashboard({ heldPost, allGeneralMembers, profile, auth, todaysCelebrations, suggestions, unreadSuggestions }) {
    const [activeTab, setActiveTab] = useState('members');
    const [localUnread, setLocalUnread] = useState(unreadSuggestions ?? 0);

    const tabs = [
        { key: 'members',     label: 'Manage Members', icon: '👥' },
        { key: 'suggestions', label: 'Suggestions',    icon: '💬' },
        { key: 'profile',     label: 'My Profile',     icon: '👤' },
    ];

    const myMembers = allGeneralMembers.filter((m) => m.is_managed_by_me);
    const available = allGeneralMembers.filter((m) => !m.is_managed_by_me && !m.is_managed_by_other);
    const takenByOthers = allGeneralMembers.filter((m) => !m.is_managed_by_me && m.is_managed_by_other);

    const toggle = (memberId) => {
        router.post(route('executive.members.toggle'), { general_member_id: memberId });
    };

    const toggleStatus = (member) => {
        const action = member.status === 'active' ? 'deactivate' : 'activate';
        if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${member.name}?`)) return;
        router.post(route('executive.members.toggle-status', member.id));
    };

    function openSuggestions() {
        setActiveTab('suggestions');
        if (localUnread > 0) {
            setLocalUnread(0);
            fetch(route('executive.suggestions.mark-read'), {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
                    'Content-Type': 'application/json',
                },
            });
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Executive Dashboard</h2>
                        <p className="text-sm text-gray-500">UVA Vyapari Welfare Association</p>
                    </div>
                    {heldPost ? (
                        <span className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow">
                            {heldPost.name}
                        </span>
                    ) : (
                        <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-500">
                            No post assigned
                        </span>
                    )}
                </div>
            }
        >
            <Head title="Executive Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <CelebrationsPanel celebrations={todaysCelebrations} />

                    {/* Tabs */}
                    <div className="mb-8 flex gap-1 rounded-xl bg-gray-100 p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={tab.key === 'suggestions' ? openSuggestions : () => setActiveTab(tab.key)}
                                className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    activeTab === tab.key
                                        ? 'bg-white text-indigo-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                                {tab.key === 'suggestions' && localUnread > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {localUnread > 99 ? '99+' : localUnread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className="space-y-6">
                            {/* My Managed Members */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                                <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
                                    <h3 className="font-semibold text-gray-800">
                                        My Members
                                        <span className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                                            {myMembers.length}
                                        </span>
                                    </h3>
                                    <p className="mt-0.5 text-xs text-gray-500">Members you are currently managing</p>
                                </div>
                                {myMembers.length === 0 ? (
                                    <p className="px-6 py-6 text-center text-sm text-gray-400">
                                        You haven't selected any members yet. Choose from the available list below.
                                    </p>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {myMembers.map((member) => (
                                            <MemberRow key={member.id} member={member} onToggleManage={toggle} onToggleStatus={toggleStatus} canToggleStatus={!!heldPost} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Available Members */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                                <div className="border-b border-gray-100 px-6 py-4">
                                    <h3 className="font-semibold text-gray-800">
                                        Available General Members
                                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                                            {available.length}
                                        </span>
                                    </h3>
                                    <p className="mt-0.5 text-xs text-gray-500">Click "Manage" to add a member to your list</p>
                                </div>
                                {available.length === 0 ? (
                                    <p className="px-6 py-6 text-center text-sm text-gray-400">
                                        No available members to add.
                                    </p>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {available.map((member) => (
                                            <MemberRow key={member.id} member={member} onToggleManage={toggle} onToggleStatus={toggleStatus} canToggleStatus={!!heldPost} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Members managed by others */}
                            {takenByOthers.length > 0 && (
                                <div className="overflow-hidden rounded-2xl bg-white shadow-md opacity-75">
                                    <div className="border-b border-gray-100 px-6 py-4">
                                        <h3 className="font-semibold text-gray-600">
                                            Managed by Other Executives
                                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
                                                {takenByOthers.length}
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {takenByOthers.map((member) => (
                                            <MemberRow key={member.id} member={member} onToggleManage={null} onToggleStatus={toggleStatus} canToggleStatus={!!heldPost} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Suggestions Tab */}
                    {activeTab === 'suggestions' && (
                        <SuggestionsTab suggestions={suggestions ?? []} />
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
