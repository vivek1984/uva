<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Member/Dashboard', [
            'profile'      => $request->user()->profile?->load('children')->toFormData(),
            'requirements' => Requirement::forBoard($request->user()),
        ]);
    }
}
