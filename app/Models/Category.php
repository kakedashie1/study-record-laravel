<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'category_name',
        'user_id',
        'color',
    ];

    public static $rules = [
        'category_name' => 'required|string|max:50',
        'color' => 'required|string|max:7',
    ];

    public static $messages = [
        'category_name.required' => 'カテゴリー名は必須です。',
        'category_name.string' => 'カテゴリー名は文字で入力してください。',
        'category_name.max' => 'カテゴリー名は50文字以内で入力してください。',
        'color.required' => '色は必須です。',
        'color.string' => '色は文字で入力してください。',
        'color.max' => '色は7文字以内で入力してください。',
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
