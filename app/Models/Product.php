<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'slug',
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

    public static function generateSlug(int $userId, string $name, ?int $ignoreProductId = null): string
    {
        $base = Str::slug($name) ?: 'product';
        $slug = $base;
        $i = 2;

        while (static::where('user_id', $userId)
            ->where('slug', $slug)
            ->when($ignoreProductId, fn ($q) => $q->where('id', '!=', $ignoreProductId))
            ->exists()) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    public function toCardData(): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'slug'         => $this->slug,
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
