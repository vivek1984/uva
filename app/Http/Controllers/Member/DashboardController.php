<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Member/Dashboard', [
            'profile' => $request->user()->profile?->load('children')->toFormData(),
        ]);
    }
}
