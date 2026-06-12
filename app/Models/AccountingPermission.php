<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountingPermission extends Model
{
    protected $fillable = [
        'user_id',
        'permission',
        'granted_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function granter()
    {
        return $this->belongsTo(User::class, 'granted_by');
    }
}
