<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\SubscriptionController;

// ─── Rutas Públicas ──────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ─── Rutas Protegidas (Requieren Token Sanctum) ─────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Admin Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'getStats']);

    // CRUD Miembros
    Route::get('/admin/members', [MemberController::class, 'index']);
    Route::post('/admin/members', [MemberController::class, 'store']);
    Route::get('/admin/members/{id}', [MemberController::class, 'show']);
    Route::put('/admin/members/{id}', [MemberController::class, 'update']);
    Route::delete('/admin/members/{id}', [MemberController::class, 'destroy']);

    // CRUD Planes / Membresías
    Route::get('/admin/memberships', [MembershipController::class, 'index']);
    Route::post('/admin/memberships', [MembershipController::class, 'store']);
    Route::get('/admin/memberships/{id}', [MembershipController::class, 'show']);
    Route::put('/admin/memberships/{id}', [MembershipController::class, 'update']);
    Route::delete('/admin/memberships/{id}', [MembershipController::class, 'destroy']);

    // Suscripciones (Asignar plan a miembro)
    Route::get('/admin/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/admin/subscriptions', [SubscriptionController::class, 'store']);
    Route::delete('/admin/subscriptions/{id}', [SubscriptionController::class, 'destroy']);

    // CRUD Staff (Managers) - Solo owners (validado en controlador)
    Route::get('/admin/staff', [App\Http\Controllers\StaffController::class, 'index']);
    Route::post('/admin/staff', [App\Http\Controllers\StaffController::class, 'store']);
    Route::put('/admin/staff/{id}', [App\Http\Controllers\StaffController::class, 'update']);
    Route::delete('/admin/staff/{id}', [App\Http\Controllers\StaffController::class, 'destroy']);

    // CRUD Sucursales (Branches) - Solo owners
    Route::get('/admin/branches', [App\Http\Controllers\BranchController::class, 'index']);
    Route::post('/admin/branches', [App\Http\Controllers\BranchController::class, 'store']);
    Route::put('/admin/branches/{id}', [App\Http\Controllers\BranchController::class, 'update']);
    Route::delete('/admin/branches/{id}', [App\Http\Controllers\BranchController::class, 'destroy']);

    // Member Portal (Exclusivo para clientes del gym)
    Route::get('/member/dashboard', [App\Http\Controllers\MemberPortalController::class, 'dashboard']);
    Route::put('/member/profile/password', [App\Http\Controllers\MemberPortalController::class, 'updatePassword']);

    // Control de Acceso / Asistencias
    Route::get('/admin/attendance', [App\Http\Controllers\AttendanceController::class, 'index']);
    Route::post('/admin/attendance', [App\Http\Controllers\AttendanceController::class, 'store']);
    Route::get('/admin/attendance/stats', [App\Http\Controllers\AttendanceController::class, 'stats']);
    // Clases y Reservas (Admin/Staff)
    Route::get('/admin/classes', [App\Http\Controllers\ClassController::class, 'indexClasses']);
    Route::post('/admin/classes', [App\Http\Controllers\ClassController::class, 'storeClass']);
    Route::get('/admin/schedules', [App\Http\Controllers\ClassController::class, 'indexSchedules']);
    Route::post('/admin/schedules', [App\Http\Controllers\ClassController::class, 'storeSchedule']);
    Route::get('/admin/schedules/{scheduleId}/reservations', [App\Http\Controllers\ClassController::class, 'getReservations']);
    Route::post('/admin/reservations', [App\Http\Controllers\ClassController::class, 'reserve']); // Reserva manual por staff
    Route::delete('/admin/reservations/{id}', [App\Http\Controllers\ClassController::class, 'cancelReservation']); // Cancelar manual por staff

    // Member Portal (Clases y Reservas)
    Route::get('/member/schedules', [App\Http\Controllers\ClassController::class, 'indexSchedules']);
    Route::post('/member/reservations', [App\Http\Controllers\ClassController::class, 'reserve']);
    Route::delete('/member/reservations/{id}', [App\Http\Controllers\ClassController::class, 'cancelReservation']);
});
