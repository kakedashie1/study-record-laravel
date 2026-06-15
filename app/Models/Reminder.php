<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'memo',
        'step',
        'remind_at',
        'remind_date',
        'is_done',
    ];

    protected $casts = [
        'remind_at' => 'datetime',
        'remind_date' => 'date',
        'is_done' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
