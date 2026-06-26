<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GymClass;
use App\Models\ClassSchedule;
use App\Models\Reservation;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ClassController extends Controller
{
    /**
     * ==========================================
     * ADMINISTRACIÓN DE CLASES (Para Admin/Staff)
     * ==========================================
     */

    // Obtener catálogo de tipos de clases
    public function indexClasses(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $classes = GymClass::where('tenant_id', $tenantId)->get();
        return response()->json(['classes' => $classes]);
    }

    // Crear un tipo de clase
    public function storeClass(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $request->validate(['name' => 'required|string', 'description' => 'nullable|string']);

        $class = GymClass::create([
            'tenant_id' => $tenantId,
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json(['message' => 'Clase creada', 'class' => $class], 201);
    }

    // Obtener horarios (Schedules) de una sucursal (Para Admin o Miembro)
    public function indexSchedules(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;
        $branchId = $user->role === 'member' ? $user->branch_id : ($request->query('branch_id') ?? clone $user->branch_id);

        $schedules = ClassSchedule::with(['gymClass', 'instructor:id,name'])
            ->whereHas('gymClass', function ($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId);
            });

        if ($branchId) {
            $schedules->where('branch_id', $branchId);
        }

        // Si es miembro, filtramos por hoy y futuro cercano, etc. Por ahora devolvemos todos.
        return response()->json(['schedules' => $schedules->get()]);
    }

    // Crear un horario de clase
    public function storeSchedule(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'member')
            return response()->json(['error' => 'No autorizado'], 403);

        $request->validate([
            'name' => 'nullable|string', // Si se envía, puede crear una nueva clase
            'gym_class_id' => 'nullable|exists:gym_classes,id',
            'instructor_id' => 'nullable|exists:users,id',
            'is_recurring' => 'required|boolean',
            'day_of_week' => 'nullable|integer|min:0|max:6',
            'specific_date' => 'nullable|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'capacity' => 'required|integer|min:1',
            'branch_id' => 'required|exists:branches,id'
        ]);

        $gymClassId = $request->gym_class_id;

        // Auto crear clase si se envía 'name' y no 'gym_class_id'
        if (!$gymClassId && $request->filled('name')) {
            $newClass = GymClass::create([
                'tenant_id' => $user->tenant_id,
                'name' => $request->name
            ]);
            $gymClassId = $newClass->id;
        }

        if (!$gymClassId) {
            return response()->json(['error' => 'Se requiere gym_class_id o name'], 400);
        }

        $schedule = ClassSchedule::create([
            'gym_class_id' => $gymClassId,
            'branch_id' => $user->role === 'manager' ? $user->branch_id : $request->branch_id,
            'instructor_id' => $request->instructor_id,
            'is_recurring' => $request->is_recurring,
            'day_of_week' => $request->is_recurring ? $request->day_of_week : null,
            'specific_date' => !$request->is_recurring ? $request->specific_date : null,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'capacity' => $request->capacity
        ]);

        return response()->json(['message' => 'Horario creado', 'schedule' => $schedule], 201);
    }

    /**
     * ==========================================
     * GESTIÓN DE RESERVAS (Members y Admin)
     * ==========================================
     */

    // Listar reservas de un horario específico para una fecha (Para Admin)
    public function getReservations(Request $request, $scheduleId)
    {
        $date = $request->query('date', today()->toDateString());
        $reservations = Reservation::with('user:id,name,ci_number')
            ->where('class_schedule_id', $scheduleId)
            ->whereDate('reservation_date', $date)
            ->where('status', 'active')
            ->get();

        return response()->json(['reservations' => $reservations]);
    }

    // Reservar un cupo (Puede hacerlo el Miembro o el Admin manualmente)
    public function reserve(Request $request)
    {
        $request->validate([
            'class_schedule_id' => 'required|exists:class_schedules,id',
            'date' => 'required|date' // La fecha de la clase a la que quiere asistir
        ]);

        $user = $request->user();

        // Si el admin está reservando manualmente para un miembro, enviará el user_id
        if ($user->role !== 'member') {
            $request->validate(['user_id' => 'required|exists:users,id']);
            $memberId = $request->user_id;
        } else {
            $memberId = $user->id;
        }

        $date = Carbon::parse($request->date);
        $scheduleId = $request->class_schedule_id;

        return DB::transaction(function () use ($memberId, $date, $scheduleId, $request) {
            // Validar capacidad
            $schedule = ClassSchedule::findOrFail($scheduleId);
            $currentReservations = Reservation::where('class_schedule_id', $scheduleId)
                ->whereDate('reservation_date', $date)
                ->where('status', 'active')
                ->count();

            if ($currentReservations >= $schedule->capacity) {
                return response()->json(['error' => 'La clase ya está llena'], 400);
            }

            // Validar que no tenga reserva ya para ese día y clase
            $alreadyReserved = Reservation::where('user_id', $memberId)
                ->where('class_schedule_id', $scheduleId)
                ->whereDate('reservation_date', $date)
                ->where('status', 'active')
                ->exists();

            if ($alreadyReserved) {
                return response()->json(['error' => 'El miembro ya tiene una reserva activa para esta clase'], 400);
            }

            // Descontar crédito
            // Buscar subscripción credit_based activa con creditos > 0
            $activeSub = Subscription::where('user_id', $memberId)
                ->where('status', 'active')
                ->whereHas('membership', function ($q) {
                    $q->where('type', 'credit_based');
                })
                ->where('remaining_credits', '>', 0)
                ->first();

            if (!$activeSub) {
                // Si no tiene subscripción de créditos, verificamos si tiene una normal (time_based)
                // Depende de las reglas de negocio, pero asumamos que las clases son SOLO por créditos o planes completos.
                // Si permitimos planes completos:
                $timeSub = Subscription::where('user_id', $memberId)
                    ->where('status', 'active')
                    ->whereHas('membership', function ($q) {
                        $q->where('type', 'time_based');
                    })
                    ->where(function ($q) {
                        $q->whereNull('end_date')
                            ->orWhereDate('end_date', '>=', today());
                    })->exists();

                if (!$timeSub) {
                    return response()->json(['error' => 'No tiene créditos suficientes ni un plan activo válido para reservar.'], 403);
                }
            } else {
                // Descontar el crédito
                $activeSub->decrement('remaining_credits');
            }

            // Crear reserva
            $reservation = Reservation::create([
                'user_id' => $memberId,
                'class_schedule_id' => $scheduleId,
                'reservation_date' => $date->toDateString(),
                'status' => 'active'
            ]);

            return response()->json([
                'message' => 'Reserva confirmada',
                'reservation' => $reservation
            ], 201);
        });
    }

    // Cancelar reserva (Refund del crédito si es 4 hrs antes)
    public function cancelReservation(Request $request, $id)
    {
        $user = $request->user();
        $reservation = Reservation::findOrFail($id);

        if ($user->role === 'member' && $reservation->user_id !== $user->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        if ($reservation->status === 'cancelled') {
            return response()->json(['error' => 'Ya está cancelada'], 400);
        }

        $schedule = ClassSchedule::findOrFail($reservation->class_schedule_id);

        // Calcular hora de la clase
        $classDateTime = Carbon::parse($reservation->reservation_date . ' ' . $schedule->start_time);

        return DB::transaction(function () use ($reservation, $classDateTime, $user) {
            $now = now();
            // Regla: 4 horas de anticipación
            $hoursDifference = $now->diffInHours($classDateTime, false); // false para que pueda ser negativo si ya pasó

            // Si el Admin cancela manualmente, siempre reembolsamos? Asumiremos que sí, para evitar quejas.
            // Si el miembro cancela, verificamos las 4 hrs.
            if ($user->role === 'member' && $hoursDifference < 4) {
                // Cancelamos pero NO reembolsamos (o no dejamos cancelar)
                // "tiene 4 horas antes minimo para marcar q no podra asistir y recuperar su credito"
                // Cancelamos pero con penalidad (sin refund).
                $reservation->update(['status' => 'cancelled']);
                return response()->json(['message' => 'Reserva cancelada (Sin reembolso por cancelación tardía, < 4 hrs)']);
            }

            // Reembolsar el crédito
            // Devolvemos el crédito a la suscripción de creditos activa
            $activeSub = Subscription::where('user_id', $reservation->user_id)
                ->where('status', 'active')
                ->whereHas('membership', function ($q) {
                    $q->where('type', 'credit_based');
                })->first();

            if ($activeSub) {
                $activeSub->increment('remaining_credits');
            }

            $reservation->update(['status' => 'cancelled']);

            return response()->json(['message' => 'Reserva cancelada y crédito reembolsado.']);
        });
    }
}
