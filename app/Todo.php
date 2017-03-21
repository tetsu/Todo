<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = ['title', 'content', 'starts_at', 'ends_at', 'user_id'];
}
