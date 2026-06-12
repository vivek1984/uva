<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LedgerAccount extends Model
{
    protected $fillable = ['type', 'financial_year', 'opening_balance', 'updated_by'];

    protected function casts(): array
    {
        return ['opening_balance' => 'decimal:2'];
    }

    public static function openingBalance(string $type, string $fy): float
    {
        return (float) static::where('type', $type)->where('financial_year', $fy)->value('opening_balance') ?? 0.0;
    }
}
