<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminder_settings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->json('intervals')->nullable();

            $table->time('previous_day_notify_time')->default('22:00');
            $table->time('same_day_notify_time')->default('07:00');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminder_settings');
    }
};
