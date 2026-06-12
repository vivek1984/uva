<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExecutiveAssignment extends Model
{
    protected $fillable = ['executive_id', 'general_member_id'];

    public function executive()
    {
        return $this->belongsTo(User::class, 'executive_id');
    }

    public function generalMember()
    {
        return $this->belongsTo(User::class, 'general_member_id');
    }
}
