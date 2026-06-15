<?php

namespace App\Http\Controllers;

use App\Models\ReminderSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReminderSettingController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'previous_day_notify_time' => ['required', 'date_format:H:i'],
            'same_day_notify_time' => ['required', 'date_format:H:i'],

            'intervals' => ['required', 'array', 'min:1'],
            'intervals.*.type' => ['required', 'in:hours,days,months'],
            'intervals.*.value' => ['required', 'integer', 'min:1'],
        ]);

        ReminderSetting::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'previous_day_notify_time' => $validated['previous_day_notify_time'],
                'same_day_notify_time' => $validated['same_day_notify_time'],
                'intervals' => $validated['intervals'],
            ]
        );

        return back();
    }
}
