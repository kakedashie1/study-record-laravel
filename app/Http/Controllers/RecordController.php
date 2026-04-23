<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Record;
use App\Models\Category;
use App\Http\Controllers\TopController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class RecordController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate(Record::$rules, Record::$messages);
        $validated['study_date'] = now()->toDateString("Y-m-d");
        $validated['user_id'] = $request->user()->id;
        $result = Record::create($validated);

        return redirect()->action([TopController::class, 'index']);
    }

    public function destroy($id)
{
    $record = Record::find($id);

    if ($record) {
        $record->delete();
    }

    return redirect()->action([TopController::class, 'index']);
}

    public function edit($id)
    {
        $record = Record::find($id);
        $categories = Category::where('user_id', Auth::id())->get();

        if (!$record) {
            return redirect()->action([TopController::class, 'index']);
        }

        return Inertia::render('CategoryEdit', [
            'record' => $record,
            'categories' => $categories,
        ]);
    }

    public function update($id, Request $request)
    {
        $record = Record::find($id);
        if ($record) {
            $validated = $request->validate(Record::$rules, Record::$messages);
            $record->update($validated);
        }

        return redirect()->action([TopController::class, 'index']);
    }
}
