<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExecutiveAssignment;
use App\Models\MemberProfile;
use App\Models\Post;
use App\Models\Requirement;
use App\Models\User;
use App\Models\UserPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_members' => User::where('role', '!=', 'admin')->count(),
            'executives' => User::where('role', 'executive')->count(),
            'generals' => User::where('role', 'general')->count(),
        ];

        $posts = Post::with(['userPost.user'])->orderBy('name')->get()->map(function ($post) {
            return [
                'id' => $post->id,
                'name' => $post->name,
                'description' => $post->description,
                'holder' => $post->userPost ? [
                    'id' => $post->userPost->user->id,
                    'name' => $post->userPost->user->name,
                ] : null,
            ];
        });

        $executives = User::where('role', 'executive')
            ->with(['heldPost.post'])
            ->orderBy('name')
            ->get()
            ->map(function ($exec) {
                return [
                    'id' => $exec->id,
                    'name' => $exec->name,
                    'email' => $exec->email,
                    'post' => $exec->heldPost ? [
                        'id' => $exec->heldPost->post->id,
                        'name' => $exec->heldPost->post->name,
                    ] : null,
                ];
            });

        $generalMembers = User::where('role', 'general')
            ->orderBy('name')
            ->get()
            ->map(fn($m) => ['id' => $m->id, 'name' => $m->name, 'email' => $m->email]);

        $allMembers = User::where('role', '!=', 'admin')
            ->orderBy('role')
            ->orderBy('name')
            ->get()
            ->map(fn($m) => ['id' => $m->id, 'name' => $m->name, 'email' => $m->email, 'role' => $m->role, 'status' => $m->status]);

        $profile = $user->profile?->load('children')->toFormData();

        return Inertia::render('Admin/Dashboard', [
            'stats'              => $stats,
            'posts'              => $posts,
            'executives'         => $executives,
            'generalMembers'     => $generalMembers,
            'allMembers'         => $allMembers,
            'profile'            => $profile,
            'todaysCelebrations' => MemberProfile::todaysCelebrations(),
            'requirements'       => Requirement::forBoard($user),
        ]);
    }
}
