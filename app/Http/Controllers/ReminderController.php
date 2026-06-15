<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use App\Models\ReminderSetting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReminderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'memo' => ['nullable', 'string'],
        ]);

        Reminder::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'memo' => $validated['memo'] ?? null,
            'step' => 1,
            'remind_at' => now()->addHours(6),
            'remind_date' => null,
            'is_done' => false,
        ]);

        return back();
    }

    public function complete(Reminder $reminder)
    {
        if ($reminder->user_id !== Auth::id()) {
            abort(403);
        }

        $reminder->update([
            'is_done' => true,
        ]);

        $setting = ReminderSetting::firstOrCreate(
            ['user_id' => Auth::id()],
            [
                'intervals' => $this->defaultIntervals(),
                'previous_day_notify_time' => '22:00',
                'same_day_notify_time' => '07:00',
            ]
        );

        $intervals = $setting->intervals ?? $this->defaultIntervals();

        $nextStep = $reminder->step + 1;

        if (!isset($intervals[$nextStep - 1])) {
            return back();
        }

        $interval = $intervals[$nextStep - 1];

        if ($interval['type'] === 'hours') {
            Reminder::create([
                'user_id' => Auth::id(),
                'title' => $reminder->title,
                'memo' => $reminder->memo,
                'step' => $nextStep,
                'remind_at' => now()->addHours((int) $interval['value']),
                'remind_date' => null,
                'is_done' => false,
            ]);

            return back();
        }

        $nextDate = Carbon::today();

        if ($interval['type'] === 'days') {
            $nextDate->addDays((int) $interval['value']);
        }

        if ($interval['type'] === 'months') {
            $nextDate->addMonths((int) $interval['value']);
        }

        Reminder::create([
            'user_id' => Auth::id(),
            'title' => $reminder->title,
            'memo' => $reminder->memo,
            'step' => $nextStep,
            'remind_at' => null,
            'remind_date' => $nextDate->toDateString(),
            'is_done' => false,
        ]);

        return back();
    }

    public function destroy(Reminder $reminder)
    {
        if ($reminder->user_id !== Auth::id()) {
            abort(403);
        }

        $reminder->delete();

        return back();
    }

    private function defaultIntervals(): array
    {
        return [
            ['type' => 'hours', 'value' => 6],
            ['type' => 'days', 'value' => 1],
            ['type' => 'days', 'value' => 3],
            ['type' => 'days', 'value' => 7],
            ['type' => 'months', 'value' => 1],
        ];
    }
}
