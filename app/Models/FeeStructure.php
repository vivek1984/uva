<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    protected $fillable = [
        'financial_year',
        'membership_fee',
        'joining_fee',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'membership_fee' => 'decimal:2',
            'joining_fee'    => 'decimal:2',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function forYear(string $year): ?self
    {
        return static::where('financial_year', $year)->first();
    }
}
