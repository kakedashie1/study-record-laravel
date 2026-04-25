<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    protected $fillable = [
        'study_date',
        'study_date',
        'study_time',
        'category_id',
        'user_id',
    ];

    public static $rules = [
        'study_time' => 'required|integer',
        'category_id' => 'required|integer',
        'user_id' => 'integer',
        'study_date' => 'required|date',
    ];

    public static $messages = [
        'study_time.required' => '勉強時間は必須です。',
        'study_time.integer' => '勉強時間は整数で入力してください。',
        'category_id.required' => 'カテゴリーは必須です。',
        'category_id.integer' => 'カテゴリーは整数で入力してください。',
        'user_id.integer' => 'ユーザーIDは整数で入力してください。',
        'study_date.date' => '勉強日は日付形式で入力してください。',
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
