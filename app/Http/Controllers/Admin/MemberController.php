<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MemberProfile;
use App\Models\User;
use App\Models\UserPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MemberController extends Controller
{
    public function exportCsv(): StreamedResponse
    {
        $members = User::where('role', '!=', 'admin')
            ->with(['profile.children', 'heldPost.post'])
            ->orderBy('role')
            ->orderBy('name')
            ->get();

        // Find max children count for dynamic columns
        $maxChildren = $members->max(fn($m) => $m->profile?->children->count() ?? 0);

        $childHeaders = [];
        for ($i = 1; $i <= $maxChildren; $i++) {
            $childHeaders[] = "Child {$i} Name";
            $childHeaders[] = "Child {$i} Date of Birth";
            $childHeaders[] = "Child {$i} Gender";
        }

        $headers = array_merge([
            'Name', 'Role', 'Login Phone',
            'Father / Husband Name',
            'Firm Name', 'Firm Address',
            'Profile Phone', 'WhatsApp', 'Email',
            'Nature of Business', 'Business Services',
            'Residential Address',
            'Date of Birth',
            'Married',
            'Spouse Name', 'Spouse Phone', 'Spouse Date of Birth',
            'Anniversary Date',
            'Number of Children',
        ], $childHeaders);

        $filename = 'uva-members-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($members, $headers, $maxChildren) {
            $out = fopen('php://output', 'w');

            // BOM for Excel UTF-8 compatibility
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, $headers);

            foreach ($members as $member) {
                $p = $member->profile;
                $children = $p?->children ?? collect();

                $row = [
                    $member->name,
                    $member->role,
                    $member->phone_number,
                    $p?->father_husband_name,
                    $p?->firm_name,
                    $p?->firm_address,
                    $p?->phone_number,
                    $p?->whatsapp_number,
                    $p?->email,
                    $p?->nature_of_business,
                    $p?->business_services,
                    $p?->residential_address,
                    $p?->date_of_birth?->format('d/m/Y'),
                    $p?->is_married ? 'Yes' : 'No',
                    $p?->spouse_name,
                    $p?->spouse_phone_number,
                    $p?->spouse_date_of_birth?->format('d/m/Y'),
                    $p?->anniversary_date?->format('d/m/Y'),
                    $p?->number_of_children ?? 0,
                ];

                for ($i = 0; $i < $maxChildren; $i++) {
                    $child = $children->get($i);
                    $row[] = $child?->name;
                    $row[] = $child?->date_of_birth?->format('d/m/Y');
                    $row[] = $child?->gender;
                }

                fputcsv($out, $row);
            }

            fclose($out);
        }, $filename, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    public function setRole(Request $request, User $member)
    {
        $validated = $request->validate([
            'role' => 'required|in:executive,general',
        ]);

        // If demoting from executive, remove their post assignment
        if ($validated['role'] === 'general' && $member->role === 'executive') {
            $member->heldPost()->delete();
            $member->managedMembers()->delete();
        }

        $member->update($validated);

        return back()->with('success', "Role updated to {$validated['role']}.");
    }

    public function assignPost(Request $request, User $member)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
        ]);

        if ($member->role !== 'executive') {
            return back()->withErrors(['role' => 'Only executive members can be assigned posts.']);
        }

        // Remove the post from whoever currently holds it
        UserPost::where('post_id', $validated['post_id'])->delete();

        // Remove any existing post for this executive
        $member->heldPost()->delete();

        UserPost::create([
            'user_id' => $member->id,
            'post_id' => $validated['post_id'],
        ]);

        return back()->with('success', 'Post assigned successfully.');
    }

    public function removePost(User $member)
    {
        $member->heldPost()->delete();

        return back()->with('success', 'Post removed successfully.');
    }

    public function toggleStatus(User $member)
    {
        if ($member->isAdmin()) {
            return back()->withErrors(['status' => 'Cannot change admin status.']);
        }

        $newStatus = $member->status === 'active' ? 'non-active' : 'active';
        $member->update(['status' => $newStatus]);

        return back()->with('success', "{$member->name} is now {$newStatus}.");
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $handle  = fopen($request->file('csv_file')->getRealPath(), 'r');
        $headers = fgetcsv($handle);

        // Strip UTF-8 BOM from first header
        if ($headers) {
            $headers[0] = ltrim($headers[0], "\xEF\xBB\xBF");
        }

        $created = 0;
        $skipped = 0;

        while (($row = fgetcsv($handle)) !== false) {
            if (empty(array_filter($row))) continue;

            $data  = array_combine($headers, array_pad($row, count($headers), null));
            $phone = trim($data['Login Phone'] ?? '');

            if (!$phone || User::where('phone_number', $phone)->exists()) {
                $skipped++;
                continue;
            }

            $roleRaw = strtolower(trim($data['Role'] ?? 'general'));
            $role    = in_array($roleRaw, ['executive', 'general']) ? $roleRaw : 'general';

            $user = User::create([
                'name'         => trim($data['Name'] ?? 'Unknown'),
                'phone_number' => $phone,
                'email'        => $this->val($data['Email'] ?? ''),
                'password'     => Hash::make($phone),
                'role'         => $role,
            ]);

            $firmName = $this->val($data['Firm Name'] ?? '');
            $user->update(['business_slug' => User::generateBusinessSlug($user, $firmName)]);

            $isMarried     = strtolower(trim($data['Married'] ?? 'no')) === 'yes';
            $numChildren   = $isMarried ? max(0, (int) ($data['Number of Children'] ?? 0)) : 0;
            $natureRaw     = strtolower(trim($data['Nature of Business'] ?? ''));
            $natureAllowed = ['wholesale', 'retail', 'both'];

            $profile = MemberProfile::create([
                'user_id'              => $user->id,
                'firm_name'            => $firmName,
                'father_husband_name'  => $this->val($data['Father / Husband Name'] ?? ''),
                'firm_address'         => $this->val($data['Firm Address'] ?? ''),
                'phone_number'         => $this->val($data['Profile Phone'] ?? ''),
                'whatsapp_number'      => $this->val($data['WhatsApp'] ?? ''),
                'email'                => $this->val($data['Email'] ?? ''),
                'nature_of_business'   => in_array($natureRaw, $natureAllowed) ? $natureRaw : null,
                'business_services'    => $this->val($data['Business Services'] ?? ''),
                'residential_address'  => $this->val($data['Residential Address'] ?? ''),
                'date_of_birth'        => $this->parseDate($data['Date of Birth'] ?? ''),
                'is_married'           => $isMarried,
                'spouse_name'          => $isMarried ? $this->val($data['Spouse Name'] ?? '') : null,
                'spouse_phone_number'  => $isMarried ? $this->val($data['Spouse Phone'] ?? '') : null,
                'spouse_date_of_birth' => $isMarried ? $this->parseDate($data['Spouse Date of Birth'] ?? '') : null,
                'anniversary_date'     => $isMarried ? $this->parseDate($data['Anniversary Date'] ?? '') : null,
                'number_of_children'   => $numChildren,
            ]);

            for ($i = 1; $i <= $numChildren; $i++) {
                $childName = $this->val($data["Child {$i} Name"] ?? '');
                if (!$childName) continue;
                $genderRaw = strtolower(trim($data["Child {$i} Gender"] ?? ''));
                $profile->children()->create([
                    'name'          => $childName,
                    'date_of_birth' => $this->parseDate($data["Child {$i} Date of Birth"] ?? ''),
                    'gender'        => in_array($genderRaw, ['male', 'female', 'other']) ? $genderRaw : null,
                ]);
            }

            $created++;
        }

        fclose($handle);

        return back()->with('import_results', [
            'created' => $created,
            'skipped' => $skipped,
        ]);
    }

    private function val(string $v): ?string
    {
        $v = trim($v);
        return $v !== '' ? $v : null;
    }

    private function parseDate(?string $val): ?string
    {
        if (!$val || !trim($val)) return null;
        try {
            return \Carbon\Carbon::createFromFormat('d/m/Y', trim($val))->format('Y-m-d');
        } catch (\Exception) {
            return null;
        }
    }

    public function destroy(User $member)
    {
        if ($member->isAdmin()) {
            return back()->withErrors(['delete' => 'Cannot delete an admin account.']);
        }

        // Delete profile photo from storage
        if ($member->profile?->photo) {
            Storage::disk('public')->delete($member->profile->photo);
        }

        // Delete product photos from storage
        foreach ($member->products()->with('photos')->get() as $product) {
            foreach ($product->photos as $photo) {
                Storage::disk('public')->delete($photo->path);
            }
        }

        $member->delete();

        return back()->with('success', "{$member->name} has been deleted.");
    }
}
