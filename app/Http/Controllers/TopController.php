<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TopController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())->get();
        $records = Record::where('study_date', now()->toDateString("Y-m-d"))
            ->where('user_id', Auth::id())
            ->get();
        $records->each(function ($record) {
            $record->study_time = $this->calcHourMin($record->study_time);
        });
        $today_study_time = Record::where('study_date', now()->toDateString("Y-m-d"))
            ->where('user_id', Auth::id())
            ->sum('study_time');
        $today_study_time_hour_min = $this->calcHourMin($today_study_time);
        return view(
            'top',
            [
                'categories' => $categories,
                'records' => $records,
                'today_study_time_hour_min' => $today_study_time_hour_min
            ]
        );
    }

    public function calcHourMin($today_study_time)
    {
        if ($today_study_time === 0) {
            return "0時間0分";
        }

        $hours = intdiv($today_study_time, 60);
        $mins = $today_study_time % 60;
        if ($hours === 0) return "{$mins}分";
        if ($mins === 0) return "{$hours}時間";

        return "{$hours}時間{$mins}分";
    }
}
