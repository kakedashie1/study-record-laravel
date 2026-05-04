<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    protected $fillable = [
        'study_date',
        'study_time',
        'category_id',
        'user_id',
    ];

    public static $rules = [
        'study_date' => 'required|date',
        'study_time' => 'required|integer|min:30|multiple_of:30',
        'category_id' => 'required|integer|exists:categories,id',
    ];

    public static $messages = [
        'study_date.required' => '日付は必須です。',
        'study_date.date' => '日付は正しい形式で入力してください。',

        'study_time.required' => '勉強時間は必須です。',
        'study_time.integer' => '勉強時間は整数で入力してください。',
        'study_time.min' => '勉強時間は30分以上で入力してください。',
        'study_time.multiple_of' => '勉強時間は30分単位で入力してください。',
        
        'category_id.required' => 'カテゴリーは必須です。',
        'category_id.integer' => 'カテゴリーの形式が正しくありません。',
        'category_id.exists' => '存在しないカテゴリーです。',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
