<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;

Route::controller(AuthController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('login', 'login');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
    Route::get('me', 'me');
});

Route::middleware('auth:api')->get('/users', function (Request $request) {
    // Sécurité : Seul un admin peut voir la liste
    if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    return User::all();
});
Route::controller(UserController::class)->group(function () {
    Route::get('users', 'index');              // Liste
    Route::get('users/{id}', 'show');          // Voir un
    Route::put('users/{id}/role', 'updateRole'); // Changer rôle
    Route::delete('users/{id}', 'destroy');    // Supprimer
});
Route::controller(UserController::class)->middleware('auth:api')->group(function () {
    Route::get('users', 'index');
    Route::get('users/{id}', 'show');
    Route::put('users/{id}/role', 'updateRole');
    Route::delete('users/{id}', 'destroy');
});