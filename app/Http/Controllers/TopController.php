<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TopController extends Controller
{
    public function index(): Response
    {
        $categories = Category::where('user_id', Auth::id())->get();
        $records = Record::with('category')
            ->where('study_date', now()->toDateString("Y-m-d"))
            ->where('user_id', Auth::id())
            ->get();
        $today_study_time = Record::where('study_date', now()->toDateString("Y-m-d"))
            ->where('user_id', Auth::id())
            ->sum('study_time');
        $weekly_study_time = Record::where('user_id', Auth::id())
            ->whereBetween('study_date', [
                now()->startOfWeek()->toDateString(),
                now()->endOfWeek()->toDateString(),
            ])
            ->sum('study_time');
        $monthly_study_time = Record::where('user_id', Auth::id())
            ->whereYear('study_date', now()->year)
            ->whereMonth('study_date', now()->month)
            ->sum('study_time');
        $yearly_study_time = Record::where('user_id', Auth::id())
            ->whereYear('study_date', now()->year)
            ->sum('study_time');
        $total_study_time = Record::where('user_id', Auth::id())->sum('study_time');
        return Inertia::render('Top', [
            'categories' => $categories,
            'records' => $records,
            'todayStudyTime' => $today_study_time,
            'weeklyStudyTime' => $weekly_study_time,
            'monthlyStudyTime' => $monthly_study_time,
            'yearlyStudyTime' => $yearly_study_time,
            'totalStudyTime' => $total_study_time,
        ]);
    }

    public function byDate(Request $request)
    {
        $date = $request->query('date');
        $selectedDate = Carbon::parse($date);

        $records = Record::with('category')
            ->where('user_id', Auth::id())
            ->where('study_date', $date)
            ->get();
        $todayStudyTime = Record::where('user_id', Auth::id())
            ->where('study_date', $date)
            ->sum('study_time');
        $weeklyStudyTime = Record::where('user_id', Auth::id())
            ->whereBetween('study_date', [
                $selectedDate->copy()->startOfWeek()->toDateString(),
                $selectedDate->copy()->endOfWeek()->toDateString(),
            ])
            ->sum('study_time');

        $monthlyStudyTime = Record::where('user_id', Auth::id())
            ->whereYear('study_date', date('Y', strtotime($date)))
            ->whereMonth('study_date', date('m', strtotime($date)))
            ->sum('study_time');

        $yearlyStudyTime = Record::where('user_id', Auth::id())
            ->whereYear('study_date', date('Y', strtotime($date)))
            ->sum('study_time');

        $totalStudyTime = Record::where('user_id', Auth::id())
            ->sum('study_time');

        return response()->json([
            'records' => $records,
            'todayStudyTime' => $todayStudyTime,
            'weeklyStudyTime' => $weeklyStudyTime,
            'monthlyStudyTime' => $monthlyStudyTime,
            'yearlyStudyTime' => $yearlyStudyTime,
            'totalStudyTime' => $totalStudyTime,
        ]);
    }
}
