<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReminderSetting extends Model
{
    protected $fillable = [
        'user_id',
        'intervals',
        'previous_day_notify_time',
        'same_day_notify_time',
    ];

    protected $casts = [
        'intervals' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
