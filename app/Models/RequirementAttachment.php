<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequirementAttachment extends Model
{
    protected $fillable = [
        'requirement_id',
        'path',
        'original_name',
        'mime_type',
        'sort_order',
    ];

    public function requirement()
    {
        return $this->belongsTo(Requirement::class);
    }
}
