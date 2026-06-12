<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    protected $fillable = ['member_profile_id', 'name', 'date_of_birth', 'gender'];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function memberProfile()
    {
        return $this->belongsTo(MemberProfile::class);
    }
}
