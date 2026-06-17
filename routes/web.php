<?php

use App\Http\Controllers\TopController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ReminderSettingController;



Route::get('/login', [LoginController::class, 'index']);

Route::post('/login', [LoginController::class, 'login']);

Route::get('/register', [RegisterController::class, 'create'])
    ->name('register');

Route::post('/register', [RegisterController::class, 'store'])
    ->name('register.store');


Route::middleware('auth')->group(function () {
    Route::get('/', [TopController::class, 'index']);
    Route::post('/store', [RecordController::class, 'store']);
    Route::delete('/destroy/{id}', [RecordController::class, 'destroy'])->name('destroy');
    Route::get('/edit/{id}', [RecordController::class, 'edit'])->name('edit');
    Route::put('/update/{id}', [RecordController::class, 'update']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/records/by-date', [TopController::class, 'byDate'])->name('records.byDate');
    Route::get('/categories', [App\Http\Controllers\CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories/store', [App\Http\Controllers\CategoryController::class, 'store'])->name('categories.store');
    Route::delete('/categories/destroy/{id}', [App\Http\Controllers\CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('/categories/edit/{id}', [App\Http\Controllers\CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/update/{id}', [App\Http\Controllers\CategoryController::class, 'update'])->name('categories.update');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('/records/chart', [TopController::class, 'chart']);
    Route::get('/records/dashboard', [TopController::class, 'dashboard']);
    Route::post('/reminders', [ReminderController::class, 'store'])
        ->name('reminders.store');

    Route::patch('/reminders/{reminder}/complete', [ReminderController::class, 'complete'])
        ->name('reminders.complete');

    Route::delete('/reminders/{reminder}', [ReminderController::class, 'destroy'])
        ->name('reminders.destroy');

    Route::patch('/reminder-settings', [ReminderSettingController::class, 'update'])
        ->name('reminder-settings.update');

    Route::get('/records/share-today', [RecordController::class, 'shareToday']);

});
