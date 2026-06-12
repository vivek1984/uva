<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'price',
        'category',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function photos()
    {
        return $this->hasMany(ProductPhoto::class)->orderBy('sort_order');
    }

    public function toCardData(): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'description'  => $this->description,
            'price'        => $this->price,
            'category'     => $this->category,
            'is_published' => $this->is_published,
            'photos'       => $this->photos->map(fn ($p) => [
                'id'  => $p->id,
                'url' => asset('storage/' . $p->path),
            ])->values()->all(),
        ];
    }
}
