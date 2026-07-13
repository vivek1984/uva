<?php

namespace App\Http\Controllers\Executive;

use App\Http\Controllers\Controller;
use App\Models\ExecutiveAssignment;
use App\Models\MemberProfile;
use App\Models\Requirement;
use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $heldPost = $user->heldPost ? [
            'id' => $user->heldPost->post->id,
            'name' => $user->heldPost->post->name,
            'description' => $user->heldPost->post->description,
        ] : null;

        $myManagedIds = ExecutiveAssignment::where('executive_id', $user->id)
            ->pluck('general_member_id')
            ->toArray();

        $assignedIds = ExecutiveAssignment::pluck('general_member_id')->toArray();

        $allGeneralMembers = User::where('role', 'general')
            ->orderBy('name')
            ->get()
            ->map(function ($member) use ($myManagedIds, $assignedIds) {
                return [
                    'id'                  => $member->id,
                    'name'                => $member->name,
                    'email'               => $member->email,
                    'status'              => $member->status,
                    'is_managed_by_me'    => in_array($member->id, $myManagedIds),
                    'is_managed_by_other' => in_array($member->id, $assignedIds) && !in_array($member->id, $myManagedIds),
                ];
            });

        $profile = $user->profile?->load('children')->toFormData();

        $readIds = DB::table('suggestion_reads')
            ->where('executive_id', $user->id)
            ->pluck('suggestion_id')
            ->all();

        $suggestions = Suggestion::with('submittedBy.profile')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($s) => [
                'id'          => $s->id,
                'title'       => $s->title,
                'description' => $s->description,
                'member_name' => $s->submittedBy->name,
                'phone'       => $s->submittedBy->profile?->phone_number ?? $s->submittedBy->phone_number,
                'firm_name'   => $s->submittedBy->profile?->firm_name,
                'submitted_at'=> $s->created_at->format('d M Y, h:i A'),
                'is_read'     => in_array($s->id, $readIds),
            ]);

        return Inertia::render('Executive/Dashboard', [
            'heldPost'            => $heldPost,
            'allGeneralMembers'   => $allGeneralMembers,
            'profile'             => $profile,
            'todaysCelebrations'  => MemberProfile::todaysCelebrations(),
            'suggestions'         => $suggestions,
            'unreadSuggestions'   => $suggestions->where('is_read', false)->count(),
            'requirements'        => Requirement::forBoard($user),
        ]);
    }

    public function toggleStatus(Request $request, User $member)
    {
        if ($member->isAdmin()) {
            return back()->withErrors(['status' => 'Cannot change admin status.']);
        }

        if (!$request->user()->heldPost) {
            return back()->withErrors(['status' => 'Only executives holding a post can change member status.']);
        }

        $newStatus = $member->status === 'active' ? 'non-active' : 'active';
        $member->update(['status' => $newStatus]);

        return back()->with('success', "{$member->name} is now {$newStatus}.");
    }

    public function markSuggestionsRead(Request $request)
    {
        $userId = $request->user()->id;
        $allIds = Suggestion::pluck('id');

        foreach ($allIds as $id) {
            DB::table('suggestion_reads')->insertOrIgnore([
                'executive_id'  => $userId,
                'suggestion_id' => $id,
            ]);
        }

        return response()->json(['ok' => true]);
    }

    public function toggleMember(Request $request)
    {
        $validated = $request->validate([
            'general_member_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();
        $memberId = $validated['general_member_id'];

        $existing = ExecutiveAssignment::where('general_member_id', $memberId)->first();

        if ($existing) {
            if ($existing->executive_id === $user->id) {
                $existing->delete();
                return back()->with('success', 'Member removed from your list.');
            }
            return back()->withErrors(['member' => 'This member is already managed by another executive.']);
        }

        ExecutiveAssignment::create([
            'executive_id' => $user->id,
            'general_member_id' => $memberId,
        ]);

        return back()->with('success', 'Member added to your list.');
    }
}
