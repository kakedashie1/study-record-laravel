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

    public function dashboard()
    {
        $todayStudyTime = Record::where('user_id', Auth::id())
            ->where('study_date', now()->toDateString())
            ->sum('study_time');

        $weeklyStudyTime = Record::where('user_id', Auth::id())
            ->whereBetween('study_date', [
                now()->startOfWeek()->toDateString(),
                now()->endOfWeek()->toDateString(),
            ])
            ->sum('study_time');

        $monthlyStudyTime = Record::where('user_id', Auth::id())
            ->whereYear('study_date', now()->year)
            ->whereMonth('study_date', now()->month)
            ->sum('study_time');

        $yearlyStudyTime = Record::where('user_id', Auth::id())
            ->whereYear('study_date', now()->year)
            ->sum('study_time');

        $totalStudyTime = Record::where('user_id', Auth::id())
            ->sum('study_time');

        return response()->json([
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

        return match ($period) {
            'daily' => $this->dailyChart($date, $categoryId),
            'weekly' => $this->weeklyChart($date, $categoryId),
            'monthly' => $this->monthlyChart($date, $categoryId),
            default => $this->dailyChart($date, $categoryId),
        };
    }

    private function baseChartQuery($categoryId = null)
    {
        $query = Record::where('records.user_id', Auth::id());

        if ($categoryId) {
            $query->where('records.category_id', $categoryId);
        }

        return $query;
    }

    private function dailyChart($date, $categoryId = null)
    {
        $selectedDate = Carbon::parse($date);

        $startDate = $selectedDate->copy()->subDays(6)->toDateString();
        $endDate = $selectedDate->copy()->toDateString();

        $records = $this->baseChartQuery($categoryId)
            ->whereBetween('study_date', [$startDate, $endDate])
            ->selectRaw('study_date as label, SUM(study_time) as total')
            ->groupBy('study_date')
            ->orderBy('study_date')
            ->get()
            ->keyBy('label');

        $barChartData = [];

        for (
            $date = Carbon::parse($startDate);
            $date->lte(Carbon::parse($endDate));
            $date->addDay()
        ) {
            $dateString = $date->toDateString();

            $barChartData[] = [
                'label' => $dateString,
                'total' => $records[$dateString]->total ?? 0,
            ];
        }

        return response()->json([
            'barChartData' => $barChartData,
            'pieChartData' => $this->pieChartData($selectedDate, 'daily'),
        ]);
    }

    private function weeklyChart($date, $categoryId = null)
    {
        $selectedDate = Carbon::parse($date);

        $endWeek = $selectedDate->copy()->startOfWeek();
        $startWeek = $endWeek->copy()->subWeeks(3);

        $startDate = $startWeek->copy()->startOfWeek()->toDateString();
        $endDate = $endWeek->copy()->endOfWeek()->toDateString();

        $records = $this->baseChartQuery($categoryId)
            ->whereBetween('study_date', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($record) {
                return Carbon::parse($record->study_date)->startOfWeek()->toDateString();
            });

        $barChartData = [];

        for ($week = $startWeek->copy(); $week->lte($endWeek); $week->addWeek()) {
            $weekStart = $week->copy()->startOfWeek()->toDateString();
            $weekEnd = $week->copy()->endOfWeek()->toDateString();

            $total = isset($records[$weekStart])
                ? $records[$weekStart]->sum('study_time')
                : 0;

            $barChartData[] = [
                'label' => $weekStart,
                'displayLabel' => Carbon::parse($weekStart)->format('n/j') . '週',
                'total' => $total,
            ];
        }

        return response()->json([
            'barChartData' => $barChartData,
            'pieChartData' => $this->pieChartData($selectedDate, 'weekly'),
        ]);
    }

    private function monthlyChart($date, $categoryId = null)
    {
        $selectedDate = Carbon::parse($date);

        $startMonth = $selectedDate->copy()->startOfYear();
        $endMonth = $selectedDate->copy()->endOfYear();

        $records = $this->baseChartQuery($categoryId)
            ->whereBetween('study_date', [
                $startMonth->toDateString(),
                $endMonth->toDateString(),
            ])
            ->get()
            ->groupBy(function ($record) {
                return Carbon::parse($record->study_date)->format('Y-m');
            });

        $barChartData = [];

        for ($month = $startMonth->copy(); $month->lte($endMonth); $month->addMonth()) {
            $monthKey = $month->format('Y-m');

            $total = isset($records[$monthKey])
                ? $records[$monthKey]->sum('study_time')
                : 0;

            $barChartData[] = [
                'label' => $monthKey,
                'displayLabel' => $month->format('n月'),
                'total' => $total,
            ];
        }

        return response()->json([
            'barChartData' => $barChartData,
            'pieChartData' => $this->pieChartData($selectedDate, 'monthly'),
        ]);
    }

    private function pieChartData(Carbon $selectedDate, string $period)
    {
        if ($period === 'daily') {
            $startDate = $selectedDate->copy()->toDateString();
            $endDate = $selectedDate->copy()->toDateString();
        } elseif ($period === 'weekly') {
            $startDate = $selectedDate->copy()->startOfWeek()->toDateString();
            $endDate = $selectedDate->copy()->endOfWeek()->toDateString();
        } elseif ($period === 'monthly') {
            $startDate = $selectedDate->copy()->startOfMonth()->toDateString();
            $endDate = $selectedDate->copy()->endOfMonth()->toDateString();
        } else {
            $startDate = $selectedDate->copy()->toDateString();
            $endDate = $selectedDate->copy()->toDateString();
        }

        return Record::join('categories', 'records.category_id', '=', 'categories.id')
            ->where('records.user_id', Auth::id())
            ->whereBetween('study_date', [$startDate, $endDate])
            ->selectRaw('categories.category_name, SUM(records.study_time) as total')
            ->groupBy('categories.category_name')
            ->orderByDesc('total')
            ->get();
    }
}
