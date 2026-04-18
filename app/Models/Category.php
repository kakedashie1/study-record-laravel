<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'id',
        'name'
    ];

    // public static $rules = [
    //     'category_id' => 'required|integer',
    //     'name' => 'required|string',
    //     // 'user_id' => 'integer'
    // ];

    // public static $messages = [
    //     'category_id.required' => 'カテゴリーIDは必須です。',
    //     'category_id.integer' => 'カテゴリーIDは整数で入力してください。'
    //     // 'user_id.integer' => 'ユーザーIDは整数で入力してください。',
    // ];

     public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }
}
