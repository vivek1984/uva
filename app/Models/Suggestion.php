<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suggestion extends Model
{
    protected $fillable = ['user_id', 'title', 'description'];

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
