<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string|max:5000',
        ]);

        Suggestion::create([
            'user_id'     => $request->user()->id,
            'title'       => $request->title,
            'description' => $request->description,
        ]);

        return back()->with('success', 'Your suggestion has been submitted. Thank you!');
    }
}
