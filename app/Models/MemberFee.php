<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberFee extends Model
{
    protected $fillable = [
        'user_id',
        'financial_year',
        'fee_type',
        'amount',
        'payment_date',
        'payment_mode',
        'cheque_number',
        'notes',
        'recorded_by',
    ];

    protected function casts(): array
    {
        return [
            'amount'       => 'decimal:2',
            'payment_date' => 'date',
        ];
    }

    public function member()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
