<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Record;
use App\Models\Category;
use App\Http\Controllers\TopController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class RecordController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate(Record::$rules, Record::$messages);
        try {
            Category::where('id', $validated['category_id'])
                ->where('user_id', Auth::id())
                ->firstOrFail();
            $validated['user_id'] = Auth::id();
            $result = Record::create($validated);

            return back();
        } catch (\Exception $e) {
            Log::error('記録保存失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return back()->withErrors([
                'error' => 'データの保存に失敗しました。'
            ]);
        }
    }

    public function destroy($id)
    {
        try {
            $record = Record::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            if ($record) {
                $record->delete();
            }

            return redirect()->action([TopController::class, 'index']);
        } catch (\Exception $e) {
            Log::error('記録保存失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->action([TopController::class, 'index'])
                ->withErrors(['error' => 'データの削除に失敗しました。']);
        }
    }

    // public function edit($id)
    // {
    //     $record = Record::where('id', $id)
    //         ->where('user_id', Auth::id())
    //         ->firstOrFail();
    //     $categories = Category::where('user_id', Auth::id())->get();

    //     return Inertia::render('RecordEdit', [
    //         'record' => $record,
    //         'categories' => $categories,
    //     ]);
    // }

    public function update($id, Request $request)
    {
        $validated = $request->validate(Record::$rules, Record::$messages);

        try {
            Category::where('id', $validated['category_id'])
                ->where('user_id', Auth::id())
                ->firstOrFail();
            $record = Record::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $record->update($validated);

            return back();
        } catch (\Exception $e) {
            Log::error('記録更新失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return back()->withErrors([
                'error' => 'データの更新に失敗しました。',
            ]);
        }
    }

    public function shareToday(Request $request)
    {
        $date = $request->input('date');
        $userId = Auth::id();

        $todayTotalTime = Record::where('user_id', $userId)
            ->whereDate('study_date', $date)
            ->sum('study_time');

        $categories = Category::where('categories.user_id', $userId)
            ->leftJoin('records', function ($join) use ($date, $userId) {
                $join->on('categories.id', '=', 'records.category_id')
                    ->whereDate('records.study_date', $date)
                    ->where('records.user_id', $userId);
            })
            ->select(
                'categories.category_name',
                DB::raw('COALESCE(SUM(records.study_time), 0) as total_time')
            )
            ->groupBy('categories.id', 'categories.category_name')
            ->havingRaw('SUM(records.study_time) > 0')
            ->get();

        return response()->json([
            'today_total_time' => $todayTotalTime,
            'categories' => $categories,
        ]);
    }
}
