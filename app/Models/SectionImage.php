<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SectionImage extends Model
{
    protected $fillable = ['section_id', 'image', 'caption', 'order'];

    public function section()
    {
        return $this->belongsTo(PageSection::class, 'section_id');
    }
}
