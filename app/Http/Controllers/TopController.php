<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function chart(Request $request)
    {
        $date = $request->query('date');
        $period = $request->query('period', 'daily');
        $categoryId = $request->query('category_id');

        $selectedDate = Carbon::parse($date);

        $baseQuery = Record::where('records.user_id', Auth::id());

        if ($categoryId) {
            $baseQuery->where('category_id', $categoryId);
        }

        if ($period === 'daily') {
            $startDate = $selectedDate->copy()->subDays(6)->toDateString();
            $endDate = $selectedDate->copy()->toDateString();

            $barChartData = (clone $baseQuery)
                ->whereBetween('study_date', [$startDate, $endDate])
                ->selectRaw('study_date as label, SUM(study_time) as total')
                ->groupBy('study_date')
                ->orderBy('study_date')
                ->get();
        }

        if ($period === 'weekly') {
            $startDate = $selectedDate->copy()->subWeeks(4)->startOfWeek()->toDateString();
            $endDate = $selectedDate->copy()->endOfWeek()->toDateString();

            $barChartData = (clone $baseQuery)
                ->whereBetween('study_date', [$startDate, $endDate])
                ->selectRaw('strftime("%Y-W%W", study_date) as label, SUM(study_time) as total')
                ->groupBy('label')
                ->orderBy('label')
                ->get();
        }

        if ($period === 'monthly') {
            $startDate = $selectedDate->copy()->subMonths(5)->startOfMonth()->toDateString();
            $endDate = $selectedDate->copy()->endOfMonth()->toDateString();

            $barChartData = (clone $baseQuery)
                ->whereBetween('study_date', [$startDate, $endDate])
                ->selectRaw('strftime("%Y-%m", study_date) as label, SUM(study_time) as total')
                ->groupBy('label')
                ->orderBy('label')
                ->get();
        }

        $pieChartData = Record::join('categories', 'records.category_id', '=', 'categories.id')
            ->where('records.user_id', Auth::id())
            ->whereBetween('study_date', [
                $selectedDate->copy()->startOfMonth()->toDateString(),
                $selectedDate->copy()->endOfMonth()->toDateString(),
            ])
            ->selectRaw('categories.category_name, SUM(records.study_time) as total')
            ->groupBy('categories.category_name')
            ->orderByDesc('total')
            ->get();

        return response()->json([
            'barChartData' => $barChartData,
            'pieChartData' => $pieChartData,
        ]);
    }
}
