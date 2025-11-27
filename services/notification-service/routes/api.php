<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

Route::post('/send-email', [NotificationController::class, 'send']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
