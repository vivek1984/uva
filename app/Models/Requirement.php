<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Requirement extends Model
{
    protected $fillable = [
        'name',
        'address',
        'phone_number',
        'details',
        'status',
        'attended_by',
        'attended_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'attended_at'  => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function attachments()
    {
        return $this->hasMany(RequirementAttachment::class)->orderBy('sort_order');
    }

    public function attendedBy()
    {
        return $this->belongsTo(User::class, 'attended_by');
    }

    public function views()
    {
        return $this->hasMany(RequirementView::class);
    }

    /**
     * Board listing for a given viewer.
     */
    public static function forBoard(User $viewer): array
    {
        return static::with(['attachments', 'attendedBy'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($r) => $r->toBoardData($viewer))
            ->values()
            ->all();
    }

    /**
     * Record that a viewer has explicitly opened this requirement's contact
     * details — this is the "seen" signal, not merely having it appear in
     * their board list. Skipped for admins, who always see everything.
     */
    public static function markSeen(int $requirementId, User $viewer): void
    {
        if ($viewer->isAdmin()) {
            return;
        }

        DB::table('requirement_views')->upsert(
            [['requirement_id' => $requirementId, 'user_id' => $viewer->id, 'viewed_at' => now()]],
            ['requirement_id', 'user_id'],
            ['viewed_at']
        );
    }

    /**
     * Users who have viewed this requirement, most recent first.
     */
    public static function viewersFor(int $requirementId): array
    {
        return RequirementView::where('requirement_id', $requirementId)
            ->with('user')
            ->orderByDesc('viewed_at')
            ->get()
            ->map(fn ($v) => [
                'name'      => $v->user->name,
                'viewed_at' => $v->viewed_at->format('d M Y, h:i A'),
            ])
            ->values()
            ->all();
    }

    public function toBoardData(User $viewer): array
    {
        $attendedByMe = $this->attended_by === $viewer->id;
        $isOpen = $this->status === 'open';

        // Contact details are visible to: admins, the member handling it,
        // and (while it's still open) any active member. Inactive members
        // never see contact details, even on open requirements.
        $canSeeContact = $viewer->isAdmin()
            || $attendedByMe
            || ($isOpen && $viewer->isActive());

        $canAttend = $isOpen && $viewer->isActive() && !$viewer->isAdmin();
        $blockedByInactive = $isOpen && !$viewer->isActive() && !$viewer->isAdmin();

        return [
            'id'           => $this->id,
            'name'         => $canSeeContact ? $this->name : null,
            'address'      => $canSeeContact ? $this->address : null,
            'phone_number' => $canSeeContact ? $this->phone_number : null,
            'details'      => $this->details,
            'attachments'  => $this->attachments->map(fn ($a) => [
                'id'       => $a->id,
                'url'      => asset('storage/' . $a->path),
                'name'     => $a->original_name,
                'is_image' => str_starts_with($a->mime_type ?? '', 'image/'),
            ])->values()->all(),
            'submitted_at'      => $this->created_at->format('d M Y, h:i A'),
            'status'            => $this->status,
            'is_attended'       => $this->status !== 'open',
            'attended_by_me'    => $attendedByMe,
            'can_attend'        => $canAttend,
            'blocked_by_inactive' => $blockedByInactive,
            'attended_by_name'  => $this->attended_by && ($attendedByMe || $viewer->isAdmin())
                ? $this->attendedBy?->name
                : null,
            'completed_at'      => $this->completed_at?->format('d M Y, h:i A'),
        ];
    }
}
