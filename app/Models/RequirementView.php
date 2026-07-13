<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequirementView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'requirement_id',
        'user_id',
        'viewed_at',
    ];

    protected function casts(): array
    {
        return [
            'viewed_at' => 'datetime',
        ];
    }

    public function requirement()
    {
        return $this->belongsTo(Requirement::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
