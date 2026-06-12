<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\AccountingPermission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccessController extends Controller
{
    public function index()
    {
        $permitted = AccountingPermission::with(['user.profile', 'granter'])
            ->get()
            ->map(fn($p) => [
                'id'         => $p->id,
                'user_id'    => $p->user_id,
                'name'       => $p->user->name,
                'role'       => $p->user->role,
                'permission' => $p->permission,
                'granted_by' => $p->granter->name,
                'granted_at' => $p->created_at->format('d M Y'),
            ]);

        $members = User::where('role', 'executive')
            ->whereDoesntHave('accountingPermission')
            ->orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id'   => $u->id,
                'name' => $u->name,
                'role' => $u->role,
            ]);

        return Inertia::render('Accounting/Access', [
            'permitted' => $permitted,
            'members'   => $members,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'    => 'required|exists:users,id',
            'permission' => 'required|in:view,edit',
        ]);

        $target = User::findOrFail($request->user_id);
        if ($target->isAdmin()) {
            return back()->withErrors(['user_id' => 'Admins already have full access.']);
        }
        if (!$target->isExecutive()) {
            return back()->withErrors(['user_id' => 'Only executive members can be granted accounting access.']);
        }

        AccountingPermission::updateOrCreate(
            ['user_id' => $request->user_id],
            [
                'permission' => $request->permission,
                'granted_by' => auth()->id(),
            ]
        );

        return back()->with('success', "{$target->name} has been granted {$request->permission} access to accounting.");
    }

    public function destroy(User $user)
    {
        AccountingPermission::where('user_id', $user->id)->delete();

        return back()->with('success', "{$user->name}'s accounting access has been revoked.");
    }
}
