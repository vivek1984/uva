<?php

namespace App\Http\Controllers;

use App\Jobs\NotifyAdminsOfNewRequirement;
use App\Models\Requirement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RequirementController extends Controller
{
    public function store(Request $request)
    {
        // Honeypot: bots tend to fill hidden fields; silently drop without
        // tipping them off that anything went wrong.
        if ($request->filled('website')) {
            return back()->with('success', 'Thank you! Your requirement has been submitted.');
        }

        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'address'         => 'required|string|max:500',
            'phone_number'    => 'required|string|max:20',
            'details'         => 'required|string|max:5000',
            'attachments'     => 'nullable|array|max:10',
            'attachments.*'   => 'file|mimes:jpg,jpeg,png,webp,pdf,doc,docx|max:10240',
        ]);

        $requirement = Requirement::create([
            'name'         => $data['name'],
            'address'      => $data['address'],
            'phone_number' => $data['phone_number'],
            'details'      => $data['details'],
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $i => $file) {
                $filename = Str::uuid() . '.' . strtolower($file->getClientOriginalExtension());
                $path = $file->storeAs("requirements/{$requirement->id}", $filename, 'public');

                $requirement->attachments()->create([
                    'path'          => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type'     => $file->getMimeType(),
                    'sort_order'    => $i,
                ]);
            }
        }

        NotifyAdminsOfNewRequirement::dispatch($requirement);

        return back()->with('success', 'Thank you! Your requirement has been submitted. Our members will get in touch with you soon.');
    }
}
