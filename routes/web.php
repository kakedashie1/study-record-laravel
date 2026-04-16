<?php

use App\Http\Controllers\TopController;
use App\Http\Controllers\RecordController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TopController::class, 'index']);

Route::post('/store', [RecordController::class, 'store']);

Route::delete('/destroy/{id}', [RecordController::class, 'destroy']);
