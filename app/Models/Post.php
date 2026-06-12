<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['name', 'description'];

    public function userPost()
    {
        return $this->hasOne(UserPost::class);
    }

    public function holder()
    {
        return $this->hasOneThrough(User::class, UserPost::class, 'post_id', 'id', 'id', 'user_id');
    }
}
