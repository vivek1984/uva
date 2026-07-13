<?php

namespace App\Http\Controllers;

use App\Models\Requirement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RequirementActionController extends Controller
{
    public function attend(Request $request, Requirement $requirement)
    {
        $user = $request->user();

        if (!$user->isActive()) {
            return back()->withErrors(['requirement' => 'Please contact admin to activate this feature.']);
        }

        if ($requirement->status !== 'open') {
            return back()->withErrors(['requirement' => 'This requirement is already being handled by another member.']);
        }

        $requirement->update([
            'attended_by' => $user->id,
            'attended_at' => now(),
            'status'      => 'attended',
        ]);

        return back()->with('success', 'You are now handling this requirement.');
    }

    public function markSeen(Request $request, Requirement $requirement)
    {
        Requirement::markSeen($requirement->id, $request->user());

        return response()->noContent();
    }

    public function unattend(Request $request, Requirement $requirement)
    {
        $user = $request->user();

        if ($requirement->attended_by !== $user->id && !$user->isAdmin()) {
            abort(403);
        }

        $requirement->update([
            'attended_by'  => null,
            'attended_at'  => null,
            'completed_at' => null,
            'status'       => 'open',
        ]);

        return back()->with('success', 'Requirement released back to the pool.');
    }

    public function complete(Request $request, Requirement $requirement)
    {
        $user = $request->user();

        if ($requirement->attended_by !== $user->id && !$user->isAdmin()) {
            abort(403);
        }

        $requirement->update([
            'status'       => 'completed',
            'completed_at' => now(),
        ]);

        return back()->with('success', 'Requirement marked as complete.');
    }

    /**
     * Admin: attend on behalf of another member — behaves exactly as if
     * that member had pressed Attend themselves.
     */
    public function attendAs(Request $request, Requirement $requirement)
    {
        abort_unless($request->user()->isAdmin(), 403);

        $data = $request->validate([
            'member_id' => 'required|exists:users,id',
        ]);

        $member = User::whereIn('role', ['general', 'executive'])->findOrFail($data['member_id']);

        $requirement->update([
            'attended_by' => $member->id,
            'attended_at' => now(),
            'status'      => 'attended',
        ]);

        return back()->with('success', "Marked as attended by {$member->name}.");
    }

    public function destroy(Request $request, Requirement $requirement)
    {
        abort_unless($request->user()->isAdmin(), 403);

        foreach ($requirement->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->path);
        }

        $requirement->delete();

        return back()->with('success', 'Requirement deleted.');
    }

    public function viewers(Request $request, Requirement $requirement)
    {
        abort_unless($request->user()->isAdmin(), 403);

        return response()->json([
            'viewers' => Requirement::viewersFor($requirement->id),
        ]);
    }
}
