<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['questionnaire_id', 'type', 'label', 'is_required', 'order', 'options'];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'options'     => 'array',
        ];
    }

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class);
    }

    public function answers()
    {
        return $this->hasMany(QuestionAnswer::class);
    }
}
