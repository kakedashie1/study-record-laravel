<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Record;
use App\Models\Category;
use App\Http\Controllers\TopController;

class RecordController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate(Record::$rules, Record::$messages);
        $validated['study_date'] = now()->toDateString("Y-m-d");
        $result = Record::create($validated);

        return redirect()->action([TopController::class, 'index']);
    }

    public function destroy(Request $request)
    {
        $record = Record::find($request->id);
        if ($record) {
            $record->delete();
        }

        return redirect()->action([TopController::class, 'index']);
    }

    public function update(Request $request)
    {
        $record = Record::find($request->id);
        if ($record) {
            $validated = $request->validate(Record::$rules, Record::$messages);
            $record->update($validated);
        }

        return redirect()->action([TopController::class, 'index']);
    }
}
