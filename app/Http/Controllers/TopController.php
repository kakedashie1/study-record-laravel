<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Illuminate\Http\Request;

class TopController extends Controller
{
    public function index()
    {
        return view('top');
    }

    public function store(Request $request)
    {
        $validated = $request->validate(Record::$rules, Record::$messages);
        $validated['study_date'] = now()->toDateString("Y-m-d");
        $result = Record::create($validated);

        return view('top');
    }
}
