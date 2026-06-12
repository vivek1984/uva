<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class MemberOpeningBalance extends Model
{
    protected $fillable = ['user_id', 'opening_balance', 'updated_by'];

    protected function casts(): array
    {
        return ['opening_balance' => 'decimal:2'];
    }

    public static function forMember(int $userId): float
    {
        return (float) (static::where('user_id', $userId)->value('opening_balance') ?? 0.0);
    }

    public function member()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
