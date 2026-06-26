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

    
    public function indexClasses(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $classes = GymClass::where('tenant_id', $tenantId)->get();
        return response()->json(['classes' => $classes]);
    }

    
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

        
        return response()->json(['schedules' => $schedules->get()]);
    }

    
    public function storeSchedule(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'member')
            return response()->json(['error' => 'No autorizado'], 403);

        $request->validate([
            'name' => 'nullable|string', 
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

    
    public function reserve(Request $request)
    {
        $request->validate([
            'class_schedule_id' => 'required|exists:class_schedules,id',
            'date' => 'required|date' 
        ]);

        $user = $request->user();

        
        if ($user->role !== 'member') {
            $request->validate(['user_id' => 'required|exists:users,id']);
            $memberId = $request->user_id;
        } else {
            $memberId = $user->id;
        }

        $date = Carbon::parse($request->date);
        $scheduleId = $request->class_schedule_id;

        return DB::transaction(function () use ($memberId, $date, $scheduleId, $request) {
            
            $schedule = ClassSchedule::findOrFail($scheduleId);
            $currentReservations = Reservation::where('class_schedule_id', $scheduleId)
                ->whereDate('reservation_date', $date)
                ->where('status', 'active')
                ->count();

            if ($currentReservations >= $schedule->capacity) {
                return response()->json(['error' => 'La clase ya está llena'], 400);
            }

            
            $alreadyReserved = Reservation::where('user_id', $memberId)
                ->where('class_schedule_id', $scheduleId)
                ->whereDate('reservation_date', $date)
                ->where('status', 'active')
                ->exists();

            if ($alreadyReserved) {
                return response()->json(['error' => 'El miembro ya tiene una reserva activa para esta clase'], 400);
            }

            
            
            $activeSub = Subscription::where('user_id', $memberId)
                ->where('status', 'active')
                ->whereHas('membership', function ($q) {
                    $q->where('type', 'credit_based');
                })
                ->where('remaining_credits', '>', 0)
                ->first();

            if (!$activeSub) {
                
                
                
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
                
                $activeSub->decrement('remaining_credits');
            }

            
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

        
        $classDateTime = Carbon::parse($reservation->reservation_date . ' ' . $schedule->start_time);

        return DB::transaction(function () use ($reservation, $classDateTime, $user) {
            $now = now();
            
            $hoursDifference = $now->diffInHours($classDateTime, false); 

            
            
            if ($user->role === 'member' && $hoursDifference < 4) {
                
                
                
                $reservation->update(['status' => 'cancelled']);
                return response()->json(['message' => 'Reserva cancelada (Sin reembolso por cancelación tardía, < 4 hrs)']);
            }

            
            
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
