<?php

use App\Http\Controllers\TopController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Route;


Route::get('/login', [LoginController::class, 'index']);

Route::post('/login', [LoginController::class, 'login']);



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
});
