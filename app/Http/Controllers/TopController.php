<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

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
        return Inertia::render('Top', [
            'categories' => $categories,
            'records' => $records,
            'todayStudyTime' => $today_study_time,
        ]);
    }

    public function byDate(Request $request)
    {
        $date = $request->query('date');

        $records = Record::with('category')
            ->where('user_id', Auth::id())
            ->where('study_date', $date)
            ->get();

        return response()->json([
            'records' => $records,
            'totalStudyTime' => $records->sum('study_time'),
        ]);
    }
}
