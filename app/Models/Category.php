<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'id',
        'category_name',
        'user_id',
    ];

    public static $rules = [
        'category_name' => 'required|string',
        'user_id' => 'integer'
    ];

    public static $messages = [
        'category_name.required' => 'カテゴリー名は必須です。',
        'user_id.integer' => 'ユーザーIDは整数で入力してください。',
    ];

     public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }
}
