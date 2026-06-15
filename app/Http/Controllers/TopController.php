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
use App\Models\Reminder;
use App\Models\ReminderSetting;


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

        $todayDate = now()->toDateString();

        $reminders = Reminder::where('user_id', Auth::id())
            ->where('is_done', false)
            ->orderByRaw("
        CASE
            WHEN remind_date IS NOT NULL AND remind_date < ? THEN 0
            WHEN remind_at IS NOT NULL AND DATE(remind_at) < ? THEN 0
            ELSE 1
        END
    ", [$todayDate, $todayDate])
            ->orderByRaw("COALESCE(remind_date, DATE(remind_at)) ASC")
            ->orderByRaw("remind_at ASC")
            ->get();
        $reminderSetting = ReminderSetting::firstOrCreate(
            ['user_id' => Auth::id()],
            [
                'intervals' => [
                    ['type' => 'hours', 'value' => 6],
                    ['type' => 'days', 'value' => 1],
                    ['type' => 'days', 'value' => 3],
                    ['type' => 'days', 'value' => 7],
                    ['type' => 'months', 'value' => 1],
                ],
                'previous_day_notify_time' => '22:00',
                'same_day_notify_time' => '07:00',
            ]
        );

        $today = Carbon::today();

        $reminderNoticeCount = $reminders->filter(function ($reminder) use ($today) {
            if ($reminder->remind_date) {
                return Carbon::parse($reminder->remind_date)->lte($today);
            }

            if ($reminder->remind_at) {
                return Carbon::parse($reminder->remind_at)->lte(now());
            }

            return false;
        })->count();

        return Inertia::render('Top', [
            'categories' => $categories,
            'records' => $records,
            'todayStudyTime' => $today_study_time,
            'weeklyStudyTime' => $weekly_study_time,
            'monthlyStudyTime' => $monthly_study_time,
            'yearlyStudyTime' => $yearly_study_time,
            'totalStudyTime' => $total_study_time,
            'reminders' => $reminders,
            'reminderSetting' => $reminderSetting,
            'reminderNoticeCount' => $reminderNoticeCount,
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

        $startDate = $selectedDate
            ->copy()
            ->subDays(6)
            ->toDateString();

        $endDate = $selectedDate
            ->copy()
            ->toDateString();

        $categories = Category::where(
            'user_id',
            Auth::id()
        )->get([
            'id',
            'category_name',
            'color',
        ]);

        $records = Record::join(
            'categories',
            'records.category_id',
            '=',
            'categories.id'
        )
            ->where(
                'records.user_id',
                Auth::id()
            )
            ->whereBetween(
                'records.study_date',
                [$startDate, $endDate]
            )
            ->when(
                $categoryId,
                function ($query) use ($categoryId) {
                    $query->where(
                        'records.category_id',
                        $categoryId
                    );
                }
            )
            ->selectRaw(
                'records.study_date,
             categories.category_name,
             SUM(records.study_time) as total'
            )
            ->groupBy(
                'records.study_date',
                'categories.category_name'
            )
            ->get();

        $barChartData = [];

        for (
            $day = Carbon::parse($startDate);
            $day->lte(Carbon::parse($endDate));
            $day->addDay()
        ) {
            $dateString =
                $day->toDateString();

            $row = [
                'label' => $dateString,
            ];

            foreach (
                $categories as $category
            ) {
                $row[$category->category_name] = 0;
            }

            foreach (
                $records->where(
                    'study_date',
                    $dateString
                ) as $record
            ) {
                $row[$record->category_name] =
                    (int) $record->total;
            }

            $barChartData[] = $row;
        }

        return response()->json([
            'barChartData' =>
            $barChartData,
            'pieChartData' =>
            $this->pieChartData(
                $selectedDate,
                'daily'
            ),
            'categories' =>
            $categories,
        ]);
    }

    private function weeklyChart($date, $categoryId = null)
    {
        $selectedDate = Carbon::parse($date);

        $endWeek = $selectedDate->copy()->startOfWeek();
        $startWeek = $endWeek->copy()->subWeeks(3);

        $startDate = $startWeek->copy()->startOfWeek()->toDateString();
        $endDate = $endWeek->copy()->endOfWeek()->toDateString();

        $categories = Category::where('user_id', Auth::id())
            ->get(['id', 'category_name', 'color']);

        $records = Record::join('categories', 'records.category_id', '=', 'categories.id')
            ->where('records.user_id', Auth::id())
            ->whereBetween('records.study_date', [$startDate, $endDate])
            ->when($categoryId, function ($query) use ($categoryId) {
                $query->where('records.category_id', $categoryId);
            })
            ->selectRaw('records.study_date, categories.category_name, SUM(records.study_time) as total')
            ->groupBy('records.study_date', 'categories.category_name')
            ->get();

        $barChartData = [];

        for ($week = $startWeek->copy(); $week->lte($endWeek); $week->addWeek()) {
            $weekStart = $week->copy()->startOfWeek()->toDateString();
            $weekEnd = $week->copy()->endOfWeek()->toDateString();

            $row = [
                'label' => $weekStart,
            ];

            foreach ($categories as $category) {
                $row[$category->category_name] = 0;
            }

            foreach ($records as $record) {
                $recordDate = Carbon::parse($record->study_date)->toDateString();

                if ($recordDate >= $weekStart && $recordDate <= $weekEnd) {
                    $row[$record->category_name] += (int) $record->total;
                }
            }

            $barChartData[] = $row;
        }

        return response()->json([
            'barChartData' => $barChartData,
            'pieChartData' => $this->pieChartData($selectedDate, 'weekly'),
            'categories' => $categories,
        ]);
    }

    private function monthlyChart($date, $categoryId = null)
    {
        $selectedDate = Carbon::parse($date);

        $startMonth = $selectedDate->copy()->startOfYear();
        $endMonth = $selectedDate->copy()->endOfYear();

        $categories = Category::where('user_id', Auth::id())
            ->get(['id', 'category_name', 'color']);

        $records = Record::join('categories', 'records.category_id', '=', 'categories.id')
            ->where('records.user_id', Auth::id())
            ->whereBetween('records.study_date', [
                $startMonth->toDateString(),
                $endMonth->toDateString(),
            ])
            ->when($categoryId, function ($query) use ($categoryId) {
                $query->where('records.category_id', $categoryId);
            })
            ->selectRaw('records.study_date, categories.category_name, SUM(records.study_time) as total')
            ->groupBy('records.study_date', 'categories.category_name')
            ->get();

        $barChartData = [];

        for ($month = $startMonth->copy(); $month->lte($endMonth); $month->addMonth()) {
            $monthKey = $month->format('Y-m');

            $row = [
                'label' => $monthKey,
            ];

            foreach ($categories as $category) {
                $row[$category->category_name] = 0;
            }

            foreach ($records as $record) {
                $recordMonth = Carbon::parse($record->study_date)->format('Y-m');

                if ($recordMonth === $monthKey) {
                    $row[$record->category_name] += (int) $record->total;
                }
            }

            $barChartData[] = $row;
        }

        return response()->json([
            'barChartData' => $barChartData,
            'pieChartData' => $this->pieChartData($selectedDate, 'monthly'),
            'categories' => $categories,
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
            ->selectRaw('categories.category_name, categories.color, SUM(records.study_time) as total')
            ->groupBy('categories.category_name', 'categories.color')
            ->orderByDesc('total')
            ->get();
    }
}
