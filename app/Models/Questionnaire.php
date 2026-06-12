<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Questionnaire extends Model
{
    protected $fillable = ['created_by', 'title', 'description', 'image', 'slug', 'is_active', 'closes_at'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'closes_at' => 'datetime',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function responses()
    {
        return $this->hasMany(QuestionnaireResponse::class);
    }

    public function isAcceptingResponses(): bool
    {
        if (!$this->is_active) {
            return false;
        }
        if ($this->closes_at && $this->closes_at->isPast()) {
            return false;
        }
        return true;
    }
}
