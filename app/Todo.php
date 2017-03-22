<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model {
    protected $fillable = ['title', 'due_date', 'comp_date', 'priority', 'user_id'];

    public function user(){
        return $this->belongsTo('App\User');
    }
}
