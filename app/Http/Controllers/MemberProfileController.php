<?php

namespace App\Http\Controllers;

use App\Models\MemberProfile;
use App\Models\User;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MemberProfileController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'photo'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'firm_photo'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'father_husband_name' => 'nullable|string|max:150',
            'firm_name' => 'nullable|string|max:150',
            'firm_address' => 'nullable|string|max:500',
            'phone_number' => 'nullable|string|max:20',
            'whatsapp_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'nature_of_business' => 'nullable|in:wholesale,retail,both',
            'business_services' => 'nullable|string|max:1000',
            'residential_address' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date',
            'is_married' => 'required|boolean',
            // Spouse fields only required when married
            'spouse_name' => 'nullable|string|max:100',
            'spouse_phone_number' => 'nullable|string|max:20',
            'spouse_date_of_birth' => 'nullable|date',
            'anniversary_date' => 'nullable|date',
            'number_of_children' => 'required|integer|min:0|max:20',
            'children' => 'nullable|array|max:20',
            'children.*.name' => 'required|string|max:100',
            'children.*.date_of_birth' => 'nullable|date',
            'children.*.gender' => 'nullable|in:male,female,other',
        ]);

        $user = $request->user();
        $isMarried = (bool) $validated['is_married'];

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $existing = MemberProfile::where('user_id', $user->id)->value('photo');
            if ($existing) Storage::disk('public')->delete($existing);
            // Square crop — this photo is displayed as a fixed-size avatar/thumbnail
            // (member card, executive avatar, business page), so a consistent
            // shape matters more than preserving whatever the phone camera shot.
            $photoPath = ImageService::storeAsWebpCropped($request->file('photo'), 'member-photos', 800, 800);
        }

        $firmPhotoPath = null;
        if ($request->hasFile('firm_photo')) {
            $existing = MemberProfile::where('user_id', $user->id)->value('firm_photo');
            if ($existing) Storage::disk('public')->delete($existing);
            // Landscape crop for the business page banner.
            $firmPhotoPath = ImageService::storeAsWebpCropped($request->file('firm_photo'), 'firm-photos', 1200, 675);
        }

        $profile = MemberProfile::updateOrCreate(
            ['user_id' => $user->id],
            array_filter([
                'photo'      => $photoPath,
                'firm_photo' => $firmPhotoPath,
            ], fn($v) => $v !== null) + [
                'father_husband_name' => $validated['father_husband_name'] ?? null,
                'firm_name' => $validated['firm_name'] ?? null,
                'firm_address' => $validated['firm_address'] ?? null,
                'phone_number' => $validated['phone_number'] ?? null,
                'whatsapp_number' => $validated['whatsapp_number'] ?? null,
                'email' => $validated['email'] ?? null,
                'nature_of_business' => $validated['nature_of_business'] ?? null,
                'business_services' => $validated['business_services'] ?? null,
                'residential_address' => $validated['residential_address'] ?? null,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'is_married' => $isMarried,
                // Clear spouse/children data when not married
                'spouse_name' => $isMarried ? ($validated['spouse_name'] ?? null) : null,
                'spouse_phone_number' => $isMarried ? ($validated['spouse_phone_number'] ?? null) : null,
                'spouse_date_of_birth' => $isMarried ? ($validated['spouse_date_of_birth'] ?? null) : null,
                'anniversary_date' => $isMarried ? ($validated['anniversary_date'] ?? null) : null,
                'number_of_children' => $isMarried ? $validated['number_of_children'] : 0,
            ]
        );

        $profile->children()->delete();

        if ($isMarried) {
            $children = $validated['children'] ?? [];
            foreach (array_slice($children, 0, $validated['number_of_children']) as $child) {
                $profile->children()->create($child);
            }
        }

        // Regenerate business slug whenever firm name changes
        $user->update([
            'business_slug' => User::generateBusinessSlug($user, $validated['firm_name'] ?? null),
        ]);

        return back()->with('success', 'Profile saved successfully!');
    }
}
