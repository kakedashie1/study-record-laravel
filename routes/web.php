<?php

use App\Http\Controllers\TopController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Route;


// Route::get('/', [TopController::class, 'index']);

// Route::post('/store', [RecordController::class, 'store']);

// Route::delete('/destroy/{id}', [RecordController::class, 'destroy']);

// Route::put('/update/{id}', [RecordController::class, 'update']);

Route::get('/login', [LoginController::class, 'index']);

Route::post('/login', [LoginController::class, 'login']);



Route::middleware('auth')->group(function () {
    Route::get('/', [TopController::class, 'index']);
    Route::post('/store', [RecordController::class, 'store']);
    Route::delete('/destroy/{id}', [RecordController::class, 'destroy'])->name('destroy');
    Route::get('/edit/{id}', [RecordController::class, 'edit'])->name('edit');
    Route::put('/update/{id}', [RecordController::class, 'update']);
    Route::post('/logout', [LoginController::class, 'logout']);
});
