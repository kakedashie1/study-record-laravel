<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->text('memo')->nullable();

            $table->unsignedTinyInteger('step')->default(1);

            // 1回目だけ日時管理（6時間後）
            $table->dateTime('remind_at')->nullable();

            // 2回目以降は日付だけ管理
            $table->date('remind_date')->nullable();

            $table->boolean('is_done')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
