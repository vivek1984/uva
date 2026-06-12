<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = ['type', 'title', 'subtitle', 'body', 'cover_image', 'order', 'is_published'];

    protected function casts(): array
    {
        return ['is_published' => 'boolean'];
    }

    public function images()
    {
        return $this->hasMany(SectionImage::class, 'section_id')->orderBy('order');
    }

    public function toPublic(): array
    {
        return [
            'id'          => $this->id,
            'type'        => $this->type,
            'title'       => $this->title,
            'subtitle'    => $this->subtitle,
            'body'        => $this->body,
            'cover_image' => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            'images'      => $this->images->map(fn($img) => [
                'id'      => $img->id,
                'url'     => asset('storage/' . $img->image),
                'caption' => $img->caption,
            ])->values()->all(),
        ];
    }
}
