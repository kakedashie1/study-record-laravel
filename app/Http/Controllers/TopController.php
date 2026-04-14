<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Category;
use Illuminate\Http\Request;

class TopController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $records = Record::all();
        $today_study_time = Record::where('study_date', now()->toDateString("Y-m-d"))->sum('study_time');
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

    public function store(Request $request)
    {
        $validated = $request->validate(Record::$rules, Record::$messages);
        $validated['study_date'] = now()->toDateString("Y-m-d");
        $result = Record::create($validated);

        return redirect()->action([TopController::class, 'index']);
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
